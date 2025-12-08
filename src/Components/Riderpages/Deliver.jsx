import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Spinner,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import "../../style/responsive.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // Calendar for date picking
import { toast } from "react-toastify";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "./../../hooks/useAuth";
// import io from "socket.io-client";
import Loader from "./../Loader";
import axios, { instance } from "./../../config";
import "../../style/order.css";
import Webcamera from "../../Componentsnew/webcam/Webcamera";
import constant from "../../constant";
import cashPayment from "../../assets/washrzimages/cashPayment.avif";
import "../custom/TableStyle.css";
import { FcDeleteDatabase } from "react-icons/fc";

const { washrzserver } = constant;

// const socket = io(washrzserver);

const Deliver = () => {
  const [customer, setCustomer] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 8;
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [rescheduleDate, setRescheduleDate] = useState(null); // New state for selected date
  const [showCalendar, setShowCalendar] = useState(false); // Show/Hide calendar
  const [newStatus, setNewStatus] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false); // New modal for confirmation
  const [selectedRescheduleId, setSelectedRescheduleId] = useState(null); // Track which pickup is being rescheduled
  const [spinner, setSpinner] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { auth } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [CapturedImage, setCapturedImage] = useState(" ");
  const [show, setShow] = useState(false);

  const today = new Date();
  const maxDate = new Date(today.setDate(today.getDate() + 7));

  const handleReschedule = async (id) => {
    setSelectedRescheduleId(id); // Store the id of the order being rescheduled
    setShowRescheduleModal(true); // Open confirmation modal
  };

  const getCustomer = async () => {
    try {
      const userEmail = auth?.email;
      // Add status to query string to fetch "processing" orders
      const customer = await axiosPrivate.get(
        `/getOrdersByFilter?limit=${pageSize}&page=${pageNumber}&email=${userEmail}&status=ready for delivery`
      );

      setPageCount(Math.ceil(customer?.data?.total / pageSize));
      setCustomer(customer.data.orders);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
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
          // console.log(auth?.role);
          // navigate("/rider/pickups");
          getCustomer();
        }
        return;
      }

      // Automatically reschedule for the next day
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      try {
        const res = await axiosPrivate.put(
          `/rider/rescheduleorder/${selectedRescheduleId}`,
          {
            newDate: nextDay,
          }
        );
        // Send WhatsApp message after order reschedule consumer not pickup call
        await sendWhatsAppTemplateRescheduleNoCall(selectedRescheduleId); // Pass the `id` directly
        if (res.status === 200) {
          toast.success("Pickup successfully rescheduled for the next day");
          setData((prevData) =>
            prevData.filter((item) => item._id !== selectedRescheduleId)
          );
          getCustomer();
        }
      } catch (error) {
        console.log("Error:", error);
        // toast.error("Failed to reschedule pickup.");
      }
    } else {
      setShowCalendar(true); // Show calendar for date selection
    }
  };

  const sendWhatsAppTemplateRescheduleNoCall = async (orderId) => {
    try {
      const { data: order } = await axiosPrivate.get(
        `auth/getOrderById/${orderId}`
      );

      const templatePayload = {
        template_name: "delivery_rescheduled__unable_to_reach_customer_",
        broadcast_name: `delivery_rescheduled__unable_to_reach_customer__1727433016430`,
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
        getCustomer();
      }
    } catch (error) {
      console.log("Error sending WhatsApp message:", error);
      // toast.error("Error sending WhatsApp message.");
    }
  };

  // Function to handle calendar reschedule
  const confirmReschedule = async () => {
    if (!rescheduleDate) {
      return toast.error("Please select a reschedule date.");
    }

    try {
      const res = await axiosPrivate.put(
        `/rider/rescheduleorder/${selectedRescheduleId}`,
        {
          newDate: rescheduleDate,
        }
      );

      if (res.status === 200) {
        toast.success("Pickup successfully rescheduled");
        getCustomer();
        // Send WhatsApp message after order reschedule consumer pickup call
        await sendWhatsAppTemplateRescheduleWithCall(selectedRescheduleId);
        setData((prevData) =>
          prevData.filter((item) => item._id !== selectedRescheduleId)
        );
        setShowCalendar(false); // Hide the calendar
      }
    } catch (error) {
      console.log("Error:", error);
      // toast.error("Failed to reschedule pickup.");
    }
  };

  const sendWhatsAppTemplateRescheduleWithCall = async (orderId) => {
    try {
      const { data: order } = await axiosPrivate.get(
        `auth/getOrderById/${orderId}`
      );

      const ReschedulDate = moment(order.rescheduledDate).format(
        "MMMM Do YYYY"
      );
      const templatePayload = {
        template_name: "delivery__rescheduling_notification",
        broadcast_name: `delivery__rescheduling_notification_1727433234938`,
        parameters: [
          {
            name: "name",
            value: order.customerName,
          },
          {
            name: "delivery_rescheduled_date",
            value: ReschedulDate,
          },
        ],
      };

      const response = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${order.contactNo}`,
        templatePayload
      );

      if (response.status === 200) {
        toast.success("WhatsApp message sent successfully!");
        getCustomer();
      }
    } catch (error) {
      console.log("Error sending WhatsApp message:", error);
      // toast.error("Error sending WhatsApp message.");
    }
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

  const fetchImageBlob = async (imagePath) => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return blob;
  };

  const handleComplete = async (id, value) => {
    setCurrentOrderId(id);
    setNewStatus(value);
    setShow(true);
  };

  const handlePaymentSelection = async (paymentType) => {
    setShowPaymentModal(false); // Hide payment modal
    if (paymentType === "online") {
      setShowModal(true); // Show camera modal
    } else if (paymentType === "cash") {
      try {
        const cashPaymentBlob = await fetchImageBlob(cashPayment); // Fetch the static file as a Blob
        setCapturedImage(cashPaymentBlob); // Set it as the CapturedImage
        await handleUpload(cashPaymentBlob); // Proceed with upload logic
      } catch (error) {
        console.error("Error fetching cash payment image:", error);
        toast.error("Failed to process cash payment image.");
      }
    }
  };

  const handleUpload = async (imageBlob) => {
    const imageToUpload = imageBlob || CapturedImage;
    if (!imageToUpload) {
      toast.error("Please capture an image.");
      return;
    }

    setShowModal(false);
    setSpinner(true);

    const formData = new FormData();

    // Check if the CapturedImage is a Blob or a data URL
    if (imageToUpload instanceof Blob) {
      formData.append("image", imageToUpload, "cashPayment.jpg");
    } else {
      const blob = await fetch(imageToUpload).then((res) => res.blob());
      formData.append("image", blob, "capturedImage.jpg");
    }

    try {
      const uploadResponse = await axios.post(
        `/rider/uploadDeliverImage/${currentOrderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await axios.patch(`/auth/updateOrderStatus/${currentOrderId}`, {
        status: "delivered",
      });

      await sendWhatsAppTemplateDelivered(currentOrderId);

      if (uploadResponse.status === 200) {
        toast.success("Delivered Successfully.");
        setCapturedImage(null);
        setSpinner(false);
        // setActiveTab("Completed");
        getCustomer();
      }
    } catch (error) {
      setSpinner(false);
      toast.error("Error uploading files 2");
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
        console.log("WhatsApp message sent successfully!");
      } else {
        toast.error("Failed to send WhatsApp message.");
      }
    } catch (error) {
      console.log("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  useEffect(() => {
    getCustomer();
  }, [pageNumber]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };
  return (
    <>
      <Container className="p-3">
        <h1 className="text-center mb-4">Today's Delivery</h1>
        <div className="row">
          <div className="col-md-12">
            <div className="mx-16">
              {/* Desktop View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th className="nowrap-text">Name</th>
                      <th className="nowrap-text">Contact Number</th>
                      <th className="nowrap-text">Address</th>
                      <th>Total Bill</th>
                      <th className="nowrap-text">User Location</th>
                      <th>Complete</th>
                      <th>Reschedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.length > 0 || isLoading ? (
                      customer.map((user) => (
                        <tr key={user._id}>
                          <td className="nowrap-text">{user.order_id}</td>
                          <td className="nowrap-text">{user.customerName}</td>
                          <td className="nowrap-text">{user.contactNo}</td>
                          <td className="nowrap-text">{user.address}</td>
                          <td>₹{user.price}</td>
                          <td className="nowrap-text">
                            {user.orderLocation?.latitude &&
                            user.orderLocation?.longitude ? (
                              <a
                                href={`https://www.google.com/maps?q=${user.orderLocation.latitude},${user.orderLocation.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                tap here
                              </a>
                            ) : (
                              "Location not available"
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-success"
                              onClick={() =>
                                handleComplete(user._id, "delivered")
                              }
                            >
                              Complete
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleReschedule(user._id)}
                            >
                              Reschedule
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-3">
                          <FcDeleteDatabase style={{ fontSize: "30px" }} />{" "}
                          <br />
                          <p>Data is not available.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="mobile-only">
                {customer.length > 0 || isLoading ? (
                  customer.map((user) => (
                    <div className="mobile-card" key={user._id}>
                      <p>
                        <strong>Order No.:</strong> {user.order_id}
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
                        <strong>Total Bill:</strong> ₹{user.price}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {user.orderLocation?.latitude &&
                        user.orderLocation?.longitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${user.orderLocation.latitude},${user.orderLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            tap here
                          </a>
                        ) : (
                          "Location not available"
                        )}
                      </p>
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleComplete(user._id, "delivered")}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleReschedule(user._id)}
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    <FcDeleteDatabase style={{ fontSize: "50px" }} /> <br />
                    <span className="h3">Oops!</span>
                    <p>Data is not available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

      {/* Modal for calendar */}
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

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Completed Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to complete this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShow(false);
              // setShowModal(true);
              setShowPaymentModal(true);
            }}
          >
            Complete Order
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please confirm the payment method:</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => handlePaymentSelection("online")}
          >
            Online Payment
          </Button>
          <Button
            variant="warning"
            onClick={() => handlePaymentSelection("cash")}
          >
            Cash Payment
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Webcamera onCapture={(image) => setCapturedImage(image)} />
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

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={spinner}
      >
        <Modal.Header>
          <Modal.Title>Uploading Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Spinner animation="border" variant="primary" />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Deliver;
