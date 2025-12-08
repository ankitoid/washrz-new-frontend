import React, { useState, useEffect, useRef } from "react";

// ✅ React Bootstrap Imports
import {
  Modal,
  Button,
  Container,
  Form,
  Row,
  Col,
  Table,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

// ✅ Third-Party Libraries
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// ✅ Custom Hooks & Config
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useClickOutside from "./custom/useClickOutside";
import { instance } from "../config";

// ✅ Components
import Example from "./SucessModal";
import BillModal from "./BillModal";
import Loader from "./CustomLoader";
import Recorder from "./../Componentsnew/Recorder/Recorder";

// ✅ Icons
import { IoMdAddCircle } from "react-icons/io";
import { MdPendingActions, MdDirectionsBike } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { BsFilterSquareFill } from "react-icons/bs";
import { TbBikeOff } from "react-icons/tb";
import { GrCompliance } from "react-icons/gr";
import { IoClose } from "react-icons/io5"; // Close icon
// ✅ Styles
import "../style/responsive.css";
import "./custom/CalenderCustom.css";
import "./custom/TableStyle.css";
// ✅ Notification
import logo from "../assets/washrzlogohd-removebg-preview.png";
import { io } from "socket.io-client";
import constant from "../constant";
const { washrzserver } = constant;

const socket = io(washrzserver);

const ALLOWED_ROLES = {
  ADMIN: "admin",
  RIDER: "rider",
  PLANT_MANAGER: "plant_manager",
};

const LiveDelivery = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  useClickOutside(calendarRef, () => setIsCalendarOpen(false));

  const navigate = useNavigate();
  const { currObj, setCurrObj } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 15;
  const [pageNumber, setPageNumber] = useState(1);
  const [showSuc, setShowSuc] = useState(false);
  const [billShow, setBillShow] = useState(false);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceConfig, setPriceConfig] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const [rescheduleDate, setRescheduleDate] = useState(null); // New state for selected date
  const [showCalendar, setShowCalendar] = useState(false); // Show/Hide calendar
  const [showModal, setShowModal] = useState(false); // Modal state
  const [cancelPickupId, setCancelPickupId] = useState(null); // Track which pickup is being canceled
  const [note, setNote] = useState(""); // Short note
  const [recordedVoice, setRecordedVoice] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false); // New modal for confirmation
  const [selectedRescheduleId, setSelectedRescheduleId] = useState(null); // Track which pickup is being rescheduled
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("Live");
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [tooltipText, setTooltipText] = useState("");
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [showFilterShowCalendar, setFilterShowCalendar] = useState(false);
  const { auth } = useAuth();

  const today = new Date();
  const maxDate = new Date(today.setDate(today.getDate() + 7));

  // Handle voice recording complete
  const handleRecordingComplete = (voiceData) => {
    if (voiceData) {
      setRecordedVoice(voiceData);
    } else {
      toast.error("Voice recording must not exceed 15 seconds.");
    }
  };

  const handleUpload = async () => {
    if (!note.trim()) {
      return toast.error("Short note is required.");
    }
    // Check if the note has at least 15 characters
    if (!note.trim() || note.trim().length < 10) {
      return toast.error("Short note must contain at least 15 characters.");
    }

    try {
      // Upload to AWS S3 logic here
      const formData = new FormData();
      formData.append("note", note);
      if (recordedVoice) {
        formData.append("voice", recordedVoice); // If there's a voice recording, upload it as well
      }

      // Upload to S3 and cancel the pickup
      const response = await axiosPrivate.post(
        `/rider/uploadCancelInfo/${cancelPickupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Files uploaded and pickup successfully cancelled");
        setShowModal(false);
        setData((prevData) =>
          prevData.filter((item) => item._id !== cancelPickupId)
        );
        // setActiveTab("Cancelled");
      }
    } catch (error) {
      console.log("Error uploading files:", error);
      toast.error("Failed to cancel pickup.");
    }
  };

  const handledelete = async (id) => {
    // Show a confirmation dialog before proceeding
    const confirmSubmit = window.confirm(
      "Are you sure you want to delete this pickup?"
    );

    // If the user cancels, stop the function execution
    if (!confirmSubmit) return;

    // Open the modal for note and voice upload
    setCancelPickupId(id);
    setShowModal(true);
  };

  const handleReschedule = async (id) => {
    setSelectedRescheduleId(id); // Store the id of the pickup being rescheduled
    setShowRescheduleModal(true); // Open confirmation modal
  };

  // Function to handle the Yes/No confirmation response
  const handleRescheduleConfirmation = async (response) => {
    setShowRescheduleModal(false); // Hide confirmation modal
    if (response === "no") {
      // Show a confirmation dialog before proceeding
      const confirmSubmit = window.confirm(
        "Are you sure consumer didn't answer the call?"
      );

      // If the user cancels, stop the function execution
      if (!confirmSubmit) {
        if (auth?.role === "admin") {
          navigate("/order");
        }
        if (auth?.role === "rider") {
          console.log(auth?.role);
          navigate("/rider/pickups");
        }
        return;
      }

      // Automatically reschedule for the next day
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      try {
        const res = await axiosPrivate.put(
          `/rider/reschedulePickup/${selectedRescheduleId}`,
          {
            newDate: nextDay,
          }
        );
        // Send WhatsApp message after pickup reschedule consumer not pickup call
        await sendWhatsAppTemplateRescheduleNoCall(selectedRescheduleId); // Pass the `id` directly
        if (res.status === 200) {
          toast.success("Pickup successfully rescheduled for the next day");
          setData((prevData) =>
            prevData.filter((item) => item._id !== selectedRescheduleId)
          );
          // setActiveTab("Rescheduled");
        }
      } catch (error) {
        console.log("Error:", error);
        toast.error("Failed to reschedule pickup.");
      }
    } else {
      setShowCalendar(true); // Show calendar for date selection
    }
  };

  const sendWhatsAppTemplateRescheduleNoCall = async (pickupId) => {
    try {
      const { data: pickup } = await axiosPrivate.get(
        `auth/getPickupById/${pickupId}`
      );

      const templatePayload = {
        template_name: "pickup_rescheduled__unable_to_reach_customer",
        broadcast_name: `pickup_rescheduled__unable_to_reach_customer_1727358771391`,
        parameters: [
          {
            name: "name",
            value: pickup.Name,
          },
        ],
      };

      const response = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${pickup.Contact}`,
        templatePayload
      );

      if (response.status === 200) {
        toast.success("WhatsApp message sent successfully!");
      } else {
        toast.error("Failed to send WhatsApp message.");
      }
    } catch (error) {
      console.log("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  // Function to handle calendar reschedule
  const confirmReschedule = async () => {
    if (!rescheduleDate) {
      return toast.error("Please select a reschedule date.");
    }

    try {
      const res = await axiosPrivate.put(
        `/rider/reschedulePickup/${selectedRescheduleId}`,
        {
          newDate: rescheduleDate,
        }
      );

      // Send WhatsApp message after pickup reschedule consumer pickup call
      await sendWhatsAppTemplateRescheduleWithCall(selectedRescheduleId);
      if (res.status === 200) {
        toast.success("Pickup successfully rescheduled");
        setData((prevData) =>
          prevData.filter((item) => item._id !== selectedRescheduleId)
        );
        setShowCalendar(false); // Hide the calendar
        // setActiveTab("Rescheduled");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to reschedule pickup.");
    }
  };

  const sendWhatsAppTemplateRescheduleWithCall = async (pickupId) => {
    try {
      const { data: pickup } = await axiosPrivate.get(
        `auth/getPickupById/${pickupId}`
      );

      const ReschedulDate = moment(pickup.rescheduledDate).format(
        "MMMM Do YYYY"
      );
      const templatePayload = {
        template_name: "pickup_rescheduling_notification",
        broadcast_name: `pickup_rescheduling_notification_1727356193348`,
        parameters: [
          {
            name: "name",
            value: pickup.Name,
          },
          {
            name: "pickup_rescheduled_date",
            value: ReschedulDate,
          },
        ],
      };

      const response = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${pickup.Contact}`,
        templatePayload
      );

      if (response.status === 200) {
        console.log("WhatsApp message sent successfully!");
      } else {
        toast.error("Failed to send WhatsApp message.");
      }
    } catch (error) {
      console.log("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  const getPickups = (date = selectedDate, page = pageNumber) => {
    setIsLoading(true);
    const formattedDate = moment(date).format("YYYY-MM-DD"); // Format date as YYYY-MM-DD
    axiosPrivate
      .get(`/getPickups?limit=${pageSize}&page=${page}&date=${formattedDate}`)
      .then((response) => {
        setData([...response?.data?.Pickups]);
        setPageCount(Math.ceil(response?.data?.total / pageSize));
        setIsLoading(false);
        setFilterShowCalendar(false); // Close calendar after fetching data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getPickups(selectedDate, pageNumber); // Fetch data on initial load
  }, [selectedDate, pageNumber]); // Update when page number changes

  //notification
  // useEffect(() => {
  //   if (
  //     Notification.permission === "default" ||
  //     Notification.permission === "denied"
  //   ) {
  //     Notification.requestPermission();
  //   }

  //   socket.on("addPickup", (data) => {
  //     console.log("Pickup Notification:", data?.Name);
  //     if (Notification.permission === "granted") {
  //       new Notification("New Pickup!", {
  //         body: `${data?.Name || "Customer"} has requested a pickup.`,
  //         icon: `${logo}`,
  //       });
  //     }
  //     getPickups(selectedDate, pageNumber); // Fetch data on initial load
  //   });
  //   getPickups(selectedDate, pageNumber);
  //   return () => {
  //     socket.off("addPickup");
  //   };
  // }, [selectedDate, pageNumber]);

  const handleDateChange = (date) => {
    setSelectedDate(date); // Store the selected date
    setIsCalendarOpen(false); // Close the calendar
    // getPickups(date);
  };

  // Handle page click
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected + 1); // ReactPaginate uses zero-based index
  };

  const handlePopupClick = () => {
    setShowPopup(!showPopup);
  };

  const handleModalOpen = (tab) => {
    setActiveTab(tab);
    setShowPopup(false);
    setShowPickupModal(true);
  };

  const handleModalClose = () => {
    setShowPickupModal(false);
  };

  useEffect(() => {
    const getRiders = async () => {
      try {
        const ridersData = await axiosPrivate.get("plant/getRiders");
        setRiders(ridersData.data);
      } catch (error) {
        console.error("Failed to fetch riders:", error);
      }
    };

    getRiders();
  }, []);

  const handleSelectRiderClick = (order) => {
    setSelectedOrder(order);
    setShowRiderModal(true);
  };

  const handleRiderSelection = async () => {
    try {
      await axiosPrivate.patch(`plant/assignPickupRider`, {
        orderId: selectedOrder._id,
        riderName: selectedRider,
      });

      // Update the data state instead of customer
      setData((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, riderName: selectedRider }
            : order
        )
      );

      setShowRiderModal(false);
      toast.success(`Pickup assigned to ${selectedRider}`);
    } catch (error) {
      setShowRiderModal(false);
      console.error("Failed to assign rider:", error);
      toast.error("Failed to assign rider.");
    }
  };

  const userRole = auth?.role;
  const modalRef = useRef(null);

  // Close calendar when clicking outside
  useClickOutside(modalRef, () => setIsCalendarOpen(false));
  return (
    <>
      <div className="container">
        <div className="calendar-container">
          {/* Filter Button */}
          <div className="filter-button">
            <BsFilterSquareFill onClick={() => setIsCalendarOpen(true)} />
          </div>

          {/* Calendar Modal */}
          {isCalendarOpen && (
            <div className="calendar-modal">
              <div ref={modalRef} className="calendar-popup">
                {/* Close Button */}
                <div className="close-button">
                  <IoClose onClick={() => setIsCalendarOpen(false)} />
                </div>

                {/* Calendar */}
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  maxDate={new Date()}
                />
              </div>
            </div>
          )}

          {/* Display Selected Date */}
          <h2 className="selected-date">Date: {selectedDate.toDateString()}</h2>
        </div>

        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            // marginBottom: "20px",
            fontSize: "24px", // Adjust font size for smaller screens
            textAlign: "center", // Center align for smaller screens
          }}
        >
          Pickup/Live
        </h1>
        <div className="row">
          <div className="col-md-12">
            <div className=" mx-16">
              {/* Desktop Table View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="nowrap-text">Contact Number</th>
                      <th>Time</th>
                      <th>Address</th>
                      <th className="nowrap-text">Assign Rider</th>
                      <th className="desktop-only">Complete</th>
                      <th className="desktop-only">Reschedule</th>
                      <th className="desktop-only">Cancel</th>
                      <th className="mobile-only">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(data) &&
                      data.length > 0 &&
                      data.map((user) => (
                        <tr key={user._id}>
                          <td className="nowrap-text">{user.Name}</td>
                          <td>{user.Contact}</td>
                          <td className="nowrap-text">
                            {moment(user.createdAt).format("h:mm a")}
                          </td>
                          <td className="nowrap-text">{user.Address}</td>
                          <td>
                            {user.riderName ? (
                              <MdDirectionsBike
                                className="icon teal mx-auto d-block"
                                onClick={() => handleSelectRiderClick(user)}
                              />
                            ) : (
                              <TbBikeOff
                                className="icon yellow mx-auto d-block"
                                onClick={() => handleSelectRiderClick(user)}
                              />
                            )}
                          </td>

                          {/* Desktop View */}
                          <td className="desktop-only">
                            <GrCompliance
                              className="icon teal mx-auto d-block"
                              onClick={() => {
                                setCurrObj({
                                  contactNo: user.Contact,
                                  customerName: user.Name,
                                  address: user.Address,
                                  plantName: user.plantName,
                                  items: [],
                                  price: 0,
                                  id: user._id,
                                });
                                if (userRole === ALLOWED_ROLES.ADMIN) {
                                  navigate("/Product-Bill");
                                } else if (userRole === ALLOWED_ROLES.RIDER) {
                                  navigate("/rider/Product-Bill");
                                }
                              }}
                            />
                          </td>
                          <td className="desktop-only">
                            <MdPendingActions
                              className="icon yellow mx-auto d-block"
                              onClick={() => handleReschedule(user._id)}
                            />
                          </td>
                          <td className="desktop-only">
                            <FiTrash2
                              className="icon red"
                              onClick={() => handledelete(user._id)}
                            />
                          </td>

                          {/* Mobile Dropdown */}
                          <td className="mobile-only">
                            <DropdownButton
                              // id="dropdown-basic-button"
                              title="Actions"
                              variant="secondary"
                              size="sm"
                              className="custom-dropdown"
                            >
                              <Dropdown.Item
                                onClick={() => {
                                  setCurrObj({
                                    contactNo: user.Contact,
                                    customerName: user.Name,
                                    address: user.Address,
                                    plantName: user.plantName,
                                    items: [],
                                    price: 0,
                                    id: user._id,
                                  });
                                  if (userRole === ALLOWED_ROLES.ADMIN) {
                                    navigate("/Product-Bill");
                                  } else if (userRole === ALLOWED_ROLES.RIDER) {
                                    navigate("/rider/Product-Bill");
                                  }
                                }}
                              >
                                Complete{" "}
                                <GrCompliance size={14} color="green" />
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleReschedule(user._id)}
                              >
                                Reschedule{" "}
                                <MdPendingActions size={14} color="orange" />
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handledelete(user._id)}
                              >
                                Cancel <FiTrash2 size={14} color="red" />
                              </Dropdown.Item>
                            </DropdownButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-only">
                {Array.isArray(data) &&
                  data.length > 0 &&
                  data.map((user) => (
                    <div key={user._id} className="mobile-card">
                      <p>
                        <strong>Name:</strong> {user.Name}
                      </p>
                      <p>
                        <strong>Contact:</strong> {user.Contact}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {moment(user.createdAt).format("h:mm a")}
                      </p>
                      <p>
                        <strong>Address:</strong> {user.Address}
                      </p>
                      <p>
                        <strong>Assign Rider:</strong>{" "}
                        {user.riderName ? (
                          <MdDirectionsBike
                            className="icon teal"
                            onClick={() => handleSelectRiderClick(user)}
                          />
                        ) : (
                          <TbBikeOff
                            className="icon yellow"
                            onClick={() => handleSelectRiderClick(user)}
                          />
                        )}
                      </p>

                      <DropdownButton
                        title="Actions"
                        variant="secondary"
                        size="sm"
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setCurrObj({
                              contactNo: user.Contact,
                              customerName: user.Name,
                              address: user.Address,
                              plantName: user.plantName,
                              items: [],
                              price: 0,
                              id: user._id,
                            });
                            if (userRole === ALLOWED_ROLES.ADMIN) {
                              navigate("/Product-Bill");
                            } else {
                              navigate("/rider/Product-Bill");
                            }
                          }}
                        >
                          Complete <GrCompliance size={14} color="green" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleReschedule(user._id)}
                        >
                          Reschedule{" "}
                          <MdPendingActions size={14} color="orange" />
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handledelete(user._id)}>
                          Cancel <FiTrash2 size={14} color="red" />
                        </Dropdown.Item>
                      </DropdownButton>
                    </div>
                  ))}
              </div>

              {showSuc && (
                <Example
                  showSuc={showSuc}
                  setShowSuc={setShowSuc}
                  setBillShow={setBillShow}
                  setTotal={setTotal}
                  setCurrObj={setCurrObj}
                  setPriceConfig={setPriceConfig}
                />
              )}
              {billShow && (
                <BillModal
                  billShow={billShow}
                  setBillShow={setBillShow}
                  total={total}
                  currObj={currObj}
                  handledelete={handledelete}
                  priceConfig={priceConfig}
                />
              )}
            </div>

            {/* Rider Selection Modal */}
            <Modal
              show={showRiderModal}
              onHide={() => setShowRiderModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Select Rider</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="riderSelect">
                  <Form.Label>Select a Rider</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedRider}
                    onChange={(e) => setSelectedRider(e.target.value)}
                  >
                    <option value="">Choose Rider</option>
                    {riders.map((rider) => (
                      <option key={rider._id} value={rider.name}>
                        {rider.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowRiderModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleRiderSelection}>
                  Assign Rider
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for Cancel Confirmation */}
            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={showModal}
              onHide={() => setShowModal(false)}
            >
              <Modal.Header closeButton>
                {/* <Modal.Title></Modal.Title> */}
              </Modal.Header>
              <Modal.Body>
                <div>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter a short note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                  <Recorder onRecordingComplete={handleRecordingComplete} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleUpload}>
                  Upload
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for Reschedule Confirmation */}
            <Modal
              show={showRescheduleModal}
              onHide={() => setShowRescheduleModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Call Answered</Modal.Title>
              </Modal.Header>
              <Modal.Body>Did the consumer answer the call?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => handleRescheduleConfirmation("no")}
                >
                  No
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleRescheduleConfirmation("yes")}
                >
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for calendar for res */}
            <Modal show={showCalendar} onHide={() => setShowCalendar(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Select any other date for delivery</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="calendar-popup">
                  <DatePicker
                    selected={rescheduleDate}
                    onChange={(date) => setRescheduleDate(date)}
                    minDate={new Date()}
                    maxDate={maxDate} // next 7 days
                    placeholderText="Select a new date"
                    className="form-control my-2"
                  />
                  <Button onClick={confirmReschedule} variant="success">
                    Confirm Reschedule
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>

        <div
          className="fixed-bottom right-100 p-3"
          style={{ zIndex: "6", left: "initial" }}
        >
          <IoMdAddCircle
            style={{
              fontSize: "50px",
              cursor: "pointer",
              color: "teal",
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 10,
            }}
            onClick={handlePopupClick}
          />
        </div>
        {showPopup && (
          <div
            style={{
              position: "fixed",
              bottom: "80px",
              right: "20px",
              background: "white",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
              zIndex: 20,
              padding: "10px",
              backgroundColor: "teal",
            }}
          >
            <Button
              // variant="outline-primary"
              style={{
                display: "block",
                marginBottom: "10px",
                backgroundColor: "#013f3f",
              }}
              onClick={() => handleModalOpen("Live")}
            >
              Add Live Pickup
            </Button>
            <Button
              // variant="outline-primary"
              style={{ display: "block", backgroundColor: "#013f3f" }}
              onClick={() => handleModalOpen("Scheduled")}
            >
              Add Scheduled Pickup
            </Button>
          </div>
        )}
        <Modal show={showPickupModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {activeTab === "Live" ? "Live Pickup" : "Scheduled Pickup"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {activeTab === "Live" && (
              <LivePickupForm
                onSuccess={() => {
                  handleModalClose(); // Modal ko close kare
                  getPickups(); // Pickup API ko call kare
                }}
              />
            )}
            {activeTab === "Scheduled" && (
              <SchedulePickupForm
                onSuccess={() => {
                  handleModalClose(); // Modal ko close kare
                  getPickups(); // Pickup API ko call kare
                }}
              />
            )}
          </Modal.Body>
        </Modal>
      </div>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <Container fluid>
          <Row className="justify-content-center mt-3">
            <Col xs={12} sm={6}>
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

function LivePickupForm({ onSuccess }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.post(`/addPickup`, data);
      reset({
        name: "",
        contact: "",
        address: "",
      });
      toast.success("Your Live Pickup is successfully added.");
      setIsLoading(false);
      onSuccess();
      console.log(res);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter name"
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
        <Controller
          name="contact"
          control={control}
          rules={{
            required: "Contact number is required",
            pattern: {
              value: /^(?:\d{10}|\d{11}|\d{12}|\d{13})$/,
              message: "Invalid contact number",
            },
          }}
          render={({ field }) => (
            <Form.Group controlId="contact">
              <Form.Label>Contact No</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter contact number"
                isInvalid={!!errors.contact}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contact?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                placeholder="Enter address"
                rows={4}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "20px" }}
          disabled={isLoading}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}

function SchedulePickupForm({ onSuccess }) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.post(`/addSchedulePickup`, data);
      reset({
        name: "",
        contact: "",
        address: "",
        slot: "Select a time slot",
      });
      toast.success("Your Pickup is successfully Scheduled.");
      setIsLoading(false);
      onSuccess();
      console.log(res);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter name"
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
        <Controller
          name="contact"
          control={control}
          rules={{
            required: "Contact number is required",
            pattern: {
              value: /^(?:\d{10}|\d{11}|\d{12}|\d{13})$/,
              message: "Invalid contact number",
            },
          }}
          render={({ field }) => (
            <Form.Group controlId="contact">
              <Form.Label>Contact No</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter contact number"
                isInvalid={!!errors.contact}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contact?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                placeholder="Enter address"
                rows={4}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        />
        <Form.Group controlId="slot">
          <Form.Label>Time Slot</Form.Label>
          <Form.Select
            {...register("slot", { required: "Time slot is required" })}
            isInvalid={!!errors.slot}
          >
            <option value="">Select a time slot</option>
            <option value="9AM to 12PM">9AM to 12PM</option>
            <option value="1PM to 4PM">1PM to 4PM</option>
            <option value="5PM to 9PM">5PM to 9PM</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.slot?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "20px" }}
          disabled={isLoading}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default LiveDelivery;
