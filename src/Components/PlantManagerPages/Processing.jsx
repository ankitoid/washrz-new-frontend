import React, { useState, useEffect } from "react";
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
import "../../style/responsive.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "./../../hooks/useAuth";
import io from "socket.io-client";
import Loader from "./../Loader";
import axios, { instance } from "./../../config";
import constant from "../../constant";


const { washrzserver } = constant;

// const socket = io(washrzserver);

const Processing = ({ setActiveTab }) => {
  const [customer, setCustomer] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [show, setShow] = useState(false);
  const [showRiderModal, setShowRiderModal] = useState(false); // Modal for selecting rider
  const [isLoadings, setIsLoadings] = useState(false);
  const [riders, setRiders] = useState([]); // Riders list
  const [selectedRider, setSelectedRider] = useState(null); // Selected rider

  const pageSize = 8;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [newStatus, setNewStatus] = useState("");

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

  const handleSubmit = async (id, value) => {
    setCurrentOrderId(id);
    setNewStatus(value);
    setShow(true); // Open confirmation modal
  };

  const handleClose = async () => {
    setShow(false); // Close confirmation modal
    setShowRiderModal(true); // Open the rider selection modal
    setIsLoadings(true);

    // Fetch the list of riders when the confirmation modal closes
    try {
      const { data } = await axios.get(`plant/getRiders`);
      setRiders(data);
    } catch (error) {
      console.log("Error fetching riders:", error);
    }
  };

  // Handle assigning the rider after selection
  const handleAssignRider = async () => {
    if (!selectedRider) {
      toast.error("Please select a rider.");
      return;
    }

    try {
      await axios.patch("plant/assignRider", {
        orderId: currentOrderId,
        riderName: selectedRider,
      });
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
      }

      toast.success("Order status and rider assignment successful!");

      setShowRiderModal(false); // Close the rider selection modal
    } catch (error) {
      console.log(error);
      toast.error("Error updating order status or assigning rider.");
    } finally {
      setIsLoading(false);
    }
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
        console.log("WhatsApp message sent successfully!");
        setActiveTab("RiderAllocation");
      } else {
        toast.error("Failed to send WhatsApp message.");
      }
    } catch (error) {
      console.log("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const userEmail = auth?.email;
        // Add status to query string to fetch "processing" orders
        const customer = await axiosPrivate.get(
          `/getOrdersByFilter?limit=${pageSize}&page=${pageNumber}&email=${userEmail}&status=processing`
        );

        setPageCount(Math.ceil(customer?.data?.total / pageSize));
        setCustomer(customer.data.orders);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getCustomer();
  }, [pageNumber]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  // show image and voice
  const handleOrderView = async (orderId) => {
    setSelectedOrder(orderId);
    setShowMedia(true);

    try {
      const { data } = await axios.get(`/auth/getMedia/${orderId}`);
      setPhotoUrl(data.imageUrl);
      setVoiceUrl(data.voiceUrl);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  return (
    <>
      <Container className="p-3">
        <h1 className="text-center mb-4">Processing Order</h1>
        <Row>
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Address</th>
                  <th>Intransit Time</th>
                  <th>Action</th>
                  <th>Image/Voice</th>
                </tr>
              </thead>
              <tbody>
                {customer.map((user) => (
                  <tr key={user._id}>
                    <td>{user.order_id}</td>
                    <td>{user.customerName}</td>
                    <td>{user.contactNo}</td>
                    <td>{user.address}</td>
                    <td>
                      {moment(user.statusHistory.Intransit).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary mx-auto d-block m-1"
                        style={{ width: "100%" }}
                        onClick={() =>
                          handleSubmit(user._id, "ready for delivery")
                        }
                      >
                        Complete
                      </button>
                    </td>
                    <td className="d-grid gap-2">
                      <button
                        onClick={() => handleOrderView(user._id)}
                        type="button"
                        className="btn btn-outline-success mx-auto d-block m-1"
                      >
                        Order View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
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
      {/* Modal to show photo and voice */}
      <Modal show={showMedia} onHide={() => setShowMedia(false)}>
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
          <Button variant="secondary" onClick={() => setShowMedia(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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

      {/* Modal to select rider */}
      <Modal show={showRiderModal} onHide={() => setShowRiderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a Rider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            aria-label="Select Rider"
            onChange={(e) => setSelectedRider(e.target.value)}
          >
            <option>Select a rider</option>
            {riders.map((rider) => (
              <option key={rider._id} value={rider.name}>
                {rider.name}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRiderModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignRider}>
            Assign Rider
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Processing;
