import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Loader from "./Loader";
import "../style/responsive.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Select } from "antd";
import io from "socket.io-client";
import axios, { instance } from "../config";
import { toast } from "react-toastify";
import "../style/order.css";
import Recorder from "../Componentsnew/Recorder/Recorder";
import Webcamera from "../Componentsnew/webcam/Webcamera";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import constant from "../constant";
import { IoClose, IoLocationSharp } from "react-icons/io5";
import { Carousel } from "react-bootstrap";
import WebCamMulti from "../Componentsnew/webcam/WebCamMulti";
import { useNavigate } from "react-router-dom";
import { VscEye } from "react-icons/vsc";
import { IoMdAddCircle, IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { BsFilterSquareFill } from "react-icons/bs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useClickOutside from "./custom/useClickOutside";

import "../style/responsive.css";
import "./custom/CalenderCustom.css";
import "./custom/TableStyle.css";
import { FcDeleteDatabase } from "react-icons/fc";
import Example from "./SucessModal";
import BillModal from "./BillModal";
import { MdOutlineEdit } from "react-icons/md";

const { washrzserver } = constant;

const ALLOWED_ROLES = {
  ADMIN: "admin",
  RIDER: "rider",
  PLANT_MANAGER: "plant_manager",
};

const { Option } = Select;
// const socket = io(washrzserver); // Update with your backend URL

const CustomerDetails = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  useClickOutside(calendarRef, () => setIsCalendarOpen(false));

  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [voiceFile, setVoiceFile] = useState(null);
  const [CapturedImages, setCapturedImages] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showMultiMedia, setShowMultiMedia] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [showFilterShowCalendar, setFilterShowCalendar] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuc, setShowSuc] = useState(false);
  const [billShow, setBillShow] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customerName: "",
    contactNo: "",
    address: "",
    items: [],
    price: "",
  });
  const { currObj, setCurrObj } = useAuth();
  const { auth } = useAuth();
  const pageSize = 15;
  const axiosPrivate = useAxiosPrivate();

  const handleOpen = () => setShowOrderModal(true);
  const handleOrderClose = () => {
    setShowOrderModal(false);
    setOrderFormData({
      customerName: "",
      contactNo: "",
      address: "",
      items: [],
      price: "",
    });
  };

  const handleOrderChange = (e) => {
    setOrderFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const userRole = auth?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCurrObj({
        contactNo: orderFormData.contactNo,
        customerName: orderFormData.customerName,
        address: orderFormData.address,
        plantName: "Delhi",
        items: [],
        price: 0,
      });
      if (userRole === ALLOWED_ROLES.ADMIN) {
        navigate("/Product-Bill");
      } else if (userRole === ALLOWED_ROLES.RIDER) {
        navigate("/rider/Product-Bill");
      }
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Something went wrong!");
    }
  };

  const getOrders = async (date = selectedDate, page = pageNumber) => {
    setIsLoading(true);
    // const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const formattedDate = moment(date).format("YYYY-MM-DD");
    try {
      const userEmail = auth?.email;
      const response = await axiosPrivate.get(
        `/getOrders?limit=${pageSize}&page=${page}&email=${userEmail}&date=${formattedDate}`
      );
      setPageCount(Math.ceil(response?.data?.total / pageSize));
      setCustomer(response.data.orders);
      setIsLoading(false);
      setFilterShowCalendar(false); // Close calendar after fetching data
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders(selectedDate, pageNumber); // Fetch data on initial load
  }, [selectedDate, pageNumber]); // Update when page number changes

  // const handleDateChange = (date) => {
  //   setSelectedDate(date); // Update selected date state
  //   setPageNumber(1);
  //   // getOrders(date); // Fetch data for selected date
  // };

  const handleDateChange = (date) => {
    setSelectedDate(date); // Store the selected date
    setIsCalendarOpen(false); // Close the calendar
    // getPickups(date);
  };

  // useEffect(() => {
  //   socket.on("orderStatusUpdated", (updatedOrder) => {
  //     setCustomer((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order._id === updatedOrder._id ? updatedOrder : order
  //       )
  //     );
  //   });

  //   return () => {
  //     socket.off("orderStatusUpdated");
  //   };
  // }, []);

  const handleChange = async (id, value) => {
    setCurrentOrderId(id);
    setNewStatus(value);
    setShow(true); // Open confirmation modal
  };

  const handleClose = async () => {
    setShow(false); // Close confirmation modal
    setIsLoadings(true);

    try {
      if (newStatus === "processing") {
        setShowModal(true); // Open file upload modal
      } else {
        await axios.patch(`/auth/updateOrderStatus/${currentOrderId}`, {
          status: newStatus,
        });
        // socket.emit("updateOrderStatus", {
        //   id: currentOrderId,
        //   status: newStatus,
        // });

        // Trigger the WhatsApp template if status is 'ready for delivery'
        if (newStatus === "ready for delivery") {
          sendWhatsAppTemplate(currentOrderId);
          getOrders();
        }
        if (newStatus === "delivered") {
          sendWhatsAppTemplateDelivered(currentOrderId);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating order status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingComplete = (audioBlob) => {
    setVoiceFile(audioBlob); // Save the recorded audio as a file
  };
  ///////////////////////////////////
  const handleUpload = async () => {
    if (!CapturedImages || CapturedImages.length === 0) {
      toast.error("Please capture or upload at least one image.");
      navigateBasedOnRole();
      return;
    }

    const formData = new FormData();
    // Append all images with the field name `image`
    CapturedImages.forEach((image) => formData.append("image", image));
    if (voiceFile) {
      formData.append("voice", voiceFile);
    }

    try {
      const uploadResponse = await axios.post(
        `/auth/uploadFiles/${currentOrderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        toast.success("Files uploaded successfully");
        resetCaptureStates();
        setShowModal(false);
      } else {
        toast.error("Error uploading files");
      }
    } catch (error) {
      toast.error("Error uploading files");
    }
  };
  const navigateBasedOnRole = () => {
    if (auth?.role === "admin") {
      navigate("/order");
    } else if (auth?.role === "rider") {
      navigate("/rider/order");
    }
  };

  const resetCaptureStates = () => {
    setCapturedImages([]);
    setVoiceFile(null);
    setShowModal(false);
  };

  const sendWhatsAppTemplate = async (orderId) => {
    try {
      const { data: order } = await axiosPrivate.get(
        `auth/getOrderById/${orderId}`
      );

      const templatePayload = {
        template_name: "delivery_update_no_gst",
        broadcast_name: `delivery_update_no_gst_${orderId}`,
        parameters: [
          {
            name: "name",
            value: order.customerName,
          },
          {
            name: "total_bill",
            value: order.price,
          },
          {
            name: "service",
            value: order.service || "na",
          },
          {
            name: "invoice__payment_link",
            value: "na",
          },
        ],
      };

      const response = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${order.contactNo}`,
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

  const sendWhatsAppTemplateDelivered = async (orderId) => {
    try {
      const { data: order } = await axiosPrivate.get(
        `auth/getOrderById/${orderId}`
      );

      const templatePayload = {
        template_name: "delivery_success",
        broadcast_name: `delivery_success_1725377117469`,
        parameters: [
          {
            name: "name",
            value: order.customerName,
          },
        ],
      };

      const response = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${order.contactNo}`,
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

  // const handlePageClick = (selectedPage) => {
  //   setPageNumber(selectedPage.selected + 1);
  // };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected + 1); // ReactPaginate uses zero-based index
  };

  // Modified to filter status options based on current status
  const getAvailableStatuses = (currentStatus) => {
    const statusFlow = {
      intransit: ["processing"],
      processing: ["ready for delivery"],
      "ready for delivery": ["delivered"],
    };
    return statusFlow[currentStatus] || [];
  };

  // show image and voice
  const handleOrderView = async (orderId) => {
    setSelectedOrder(orderId);
    setShowMultiMedia(true);

    try {
      const { data } = await axios.get(`/auth/getMedia/${orderId}`);
      const validPhotoUrls = (data.imageUrl || []).filter((url) => url);
      setPhotoUrls(validPhotoUrls);
      setVoiceUrl(data.voiceUrl || null);
    } catch (error) {
      console.error("Error fetching media:", error);
      setPhotoUrls([]);
      setVoiceUrl(null);
    }
  };

  // show deliver image
  const handleDeliveriesView = async (orderId) => {
    setSelectedOrder(orderId);
    setShowMedia(true);

    try {
      const { data } = await axios.get(`/auth/getMedia/${orderId}`);
      setPhotoUrl(data.deliverImage);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  // const handleView = async (orderId) => {
  //   setSelectedOrder(orderId);
  //   setShowMedia(true);

  //   try {
  //     const { data } = await axios.get(`/auth/getMedia/${orderId}`);
  //     setPhotoUrl(data.intransitimg);
  //     setVoiceUrl(data.intransitvoi);
  //   } catch (error) {
  //     console.error("Error fetching media:", error);
  //   }
  // };

  const handleView = async (orderId) => {
    setSelectedOrder(orderId);
    setShowMultiMedia(true);

    try {
      const { data } = await axios.get(`/auth/getMedia/${orderId}`);
      // console.log("API Response:", data); // Log the full response

      // Validate and update photoUrls
      const validPhotoUrls = (data.intransitimg || []).filter((url) => url);
      // console.log("Valid Photo URLs:", validPhotoUrls);
      setPhotoUrls(validPhotoUrls);

      // Update voiceUrl
      setVoiceUrl(data.intransitvoi || null);
    } catch (error) {
      // console.error("Error fetching media:", error);
      setPhotoUrls([]);
      setVoiceUrl(null);
    }
  };

  const handleNull = () => {
    setShowMedia(false);
    setShowMultiMedia(false);
    setPhotoUrl(null);
    setVoiceUrl(null);
    setSelectedOrder(null);
    setPhotoUrls(null);
  };

  const modalRef = useRef(null);

  // Close calendar when clicking outside
  useClickOutside(modalRef, () => setIsCalendarOpen(false));

  return (
    <>
      <Container>
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
        <h1 className="text-center mb-4">Orders</h1>
        <div className="row">
          <div className="col-md-12">
            <div className=" mx-16">
              {/* Desktop Table View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>Pickup Time</th>
                      <th>plant</th>
                      <th>Total Bill</th>
                      <th>Update Status</th>
                      <th>Location</th>
                      <th>Pickup view</th>
                      <th>Delivery view</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.length > 0 || isLoading ? (
                      customer.map((user) => (
                        <tr key={user._id}>
                          <td>{user.order_id}</td>
                          <td>{user.customerName}</td>
                          <td>{user.contactNo}</td>
                          <td>{user.address}</td>
                          <td>
                            {moment(user.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </td>
                          <td>{user.plantName}</td>
                          <td>₹{user.price}</td>
                          <td className="text-capitalize">
                            {/* Status Dropdown */}
                            {user.isRescheduled ? (
                              <span>Scheduled</span>
                            ) : (
                              <Select
                                bordered={false}
                                className={`custom-select ${
                                  user.status === "delivered" ? "delivered" : ""
                                }`}
                                popupClassName="custom-select-dropdown"
                                onChange={(value) =>
                                  handleChange(user._id, value)
                                }
                                defaultValue={user?.status}
                                disabled={user.status === "delivered"}
                              >
                                {getAvailableStatuses(user.status).map(
                                  (status) => (
                                    <Option key={status} value={status}>
                                      {status}
                                    </Option>
                                  )
                                )}
                              </Select>
                            )}
                          </td>
                          <td>
                            {user.orderLocation?.latitude &&
                            user.orderLocation?.longitude ? (
                              <a
                                href={`https://www.google.com/maps?q=${user.orderLocation.latitude},${user.orderLocation.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <IoLocationSharp
                                  className="mx-auto d-block"
                                  style={{
                                    fontSize: "40px",
                                    cursor: "pointer",
                                  }}
                                />
                              </a>
                            ) : (
                              "Location not available"
                            )}
                          </td>
                          <td>
                            <IoMdEye
                              onClick={() => handleView(user._id)}
                              className="mx-auto d-block"
                              style={{
                                fontSize: "25px",
                                color: "teal",
                                cursor: "pointer",
                              }}
                            />
                          </td>
                          <td>
                            {user.status === "delivered" ? (
                              <IoMdEye
                                onClick={() => handleDeliveriesView(user._id)}
                                className="mx-auto d-block"
                                style={{
                                  fontSize: "25px",
                                  color: "teal",
                                  cursor: "pointer",
                                }}
                              />
                            ) : (
                              <IoMdEyeOff
                                onClick={() => handleDeliveriesView(user._id)}
                                className="mx-auto d-block"
                                style={{
                                  fontSize: "25px",
                                  color: "gray",
                                  cursor: "pointer",
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <MdOutlineEdit
                              style={{
                                fontSize: "25px",
                                color: "rgba(76, 121, 114, 0.8)",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                navigate(`/EditOrder/${user?._id}`);
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="12"
                          className="text-center text-muted py-3"
                        >
                          <FcDeleteDatabase style={{ fontSize: "30px" }} />{" "}
                          <br />
                          <p>Data is not available.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-only">
                {customer.length > 0 || isLoading ? (
                  customer.map((user) => (
                    <div key={user._id} className="mobile-card">
                      <p>
                        <strong>Order No:</strong> {user.order_id}
                      </p>
                      <p>
                        <strong>Name:</strong> {user.customerName}
                      </p>
                      <p>
                        <strong>Contact:</strong> {user.contactNo}
                      </p>
                      <p>
                        <strong>Address:</strong> {user.address}
                      </p>
                      <p>
                        <strong>Pickup:</strong>{" "}
                        {moment(user.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                      <p>
                        <strong>Plant:</strong> {user.plantName}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{user.price}
                      </p>

                      <p>
                        <strong>Location: </strong>
                        {user.orderLocation?.latitude &&
                        user.orderLocation?.longitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${user.orderLocation.latitude},${user.orderLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IoLocationSharp className="icon" />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                      <div className="d-flex justify-content-start mt-2">
                        <IoMdEye
                          onClick={() => handleView(user._id)}
                          className="icon teal mx-2"
                        />
                        {user.status === "delivered" ? (
                          <IoMdEye
                            onClick={() => handleDeliveriesView(user._id)}
                            className="icon teal mx-2"
                          />
                        ) : (
                          <IoMdEyeOff
                            onClick={() => handleDeliveriesView(user._id)}
                            className="icon red mx-2"
                          />
                        )}
                        <MdOutlineEdit
                          onClick={() => navigate(`/EditOrder/${user?._id}`)}
                          className="icon yellow mx-2"
                        />
                      </div>
                      <p>
                        <strong>Status:</strong>
                      </p>
                      {user.isRescheduled ? (
                        <span>Scheduled</span>
                      ) : (
                        <Select
                          bordered={false}
                          className={`custom-select w-50 mt-1 ${
                            user.status === "delivered" ? "delivered" : ""
                          }`}
                          popupClassName="custom-select-dropdown"
                          onChange={(value) => handleChange(user._id, value)}
                          defaultValue={user?.status}
                          disabled={user.status === "delivered"}
                        >
                          {getAvailableStatuses(user.status).map((status) => (
                            <Option key={status} value={status}>
                              {status}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    <FcDeleteDatabase style={{ fontSize: "30px" }} />
                    <p>Data is not available.</p>
                  </div>
                )}
              </div>
            </div>
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
            onClick={handleOpen}
          />
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
      </Container>
      {isLoading ? (
        <Loader loading={isLoading} />
      ) : (
        <Container fluid>
          <Row className="justify-content-center">
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

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status of this order to "
          {newStatus}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Webcamera onCapture={(image) => setCapturedImage(image)} />
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
      </Modal> */}
      {/* Modal for Uploading Files */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Webcamera to capture image */}
            <WebCamMulti onCapture={(image) => setCapturedImages(image)} />

            {/* Recorder to record voice */}
            <Recorder
              onRecordingComplete={(audioFile) => setVoiceFile(audioFile)}
            />
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

      {isLoading && <Loader />}

      {/* Modal to show photo and voice */}
      <Modal show={showMedia} onHide={handleNull}>
        <Modal.Header closeButton>
          <Modal.Title>Photo and Voice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {photoUrl ? (
            <div>
              <h3>Photo</h3>
              <img src={photoUrl} alt="Order" className="img-fluid" />
            </div>
          ) : (
            <p>No photo available.</p>
          )}
          {voiceUrl ? (
            <div>
              <h3>Voice Note</h3>
              <audio controls>
                <source src={voiceUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p>No voice note available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNull}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal to show photo and voice */}
      <Modal show={showMultiMedia} onHide={handleNull}>
        <Modal.Header closeButton>
          <Modal.Title>Photo and Voice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {photoUrls && photoUrls.length > 0 ? (
            <div>
              <h3>Photos</h3>
              <Carousel>
                {photoUrls.map((url, index) => {
                  // console.log("Rendering photo URL:", url); // Debugging log
                  return (
                    <Carousel.Item key={index}>
                      <img
                        src={url}
                        alt={`Order Photo ${index + 1}`}
                        className="d-block w-100 img-fluid"
                        style={{ maxHeight: "500px", objectFit: "contain" }}
                      />
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>
          ) : (
            <p>No photos available.</p>
          )}
          {voiceUrl ? (
            <div>
              <h3>Voice Note</h3>
              <audio controls>
                <source src={voiceUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p>No voice note available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNull}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* create order */}
      <Modal show={showOrderModal} onHide={handleOrderClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={orderFormData.customerName}
                onChange={handleOrderChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact No</Form.Label>
              <Form.Control
                type="text"
                name="contactNo"
                value={orderFormData.contactNo}
                onChange={handleOrderChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={orderFormData.address}
                onChange={handleOrderChange}
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleOrderClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Order
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomerDetails;
