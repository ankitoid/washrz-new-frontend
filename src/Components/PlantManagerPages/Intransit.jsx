import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Row, Col, Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import "../../style/responsive.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "./../../hooks/useAuth";
import io from "socket.io-client";
import Loader from "./../Loader";
import axios from "./../../config";
import Webcamera from "../../Componentsnew/webcam/Webcamera";
import Recorder from "../../Componentsnew/Recorder/Recorder";
import constant from "../../constant";
const { washrzserver } = constant;

// const socket = io(washrzserver);

const Intransit = ({ setActiveTab }) => {
  const [customer, setCustomer] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const [CapturedImage, setCapturedImage] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);

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
    setIsLoadings(true);
    if (newStatus === "processing") {
      setShowModal(true); // Open file upload modal
    }
  };

  const handleRecordingComplete = (audioBlob) => {
    setVoiceFile(audioBlob); // Save the recorded audio as a file
  };

  const handleUpload = async () => {
    if (!CapturedImage) {
      toast.error("Please capture an image.");
      return;
    }

    if (!voiceFile) {
      toast.error("Please record an audio file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", CapturedImage); // Ensure this matches 'image'
    formData.append("voice", voiceFile); // Ensure this matches 'voice'

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
        setCapturedImage(null);
        setVoiceFile(null);
        setShowModal(false);
        setActiveTab("Processing");
      } else {
        toast.error("Error uploading files");
      }
    } catch (error) {
      toast.error("Error uploading files");
    }
  };

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const userEmail = auth?.email;
        // Add status to query string to fetch "processing" orders
        const customer = await axiosPrivate.get(
          `/getOrdersByFilter?limit=${pageSize}&page=${pageNumber}&email=${userEmail}&status=intransit`
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

  const handleView = async (orderId) => {
    setSelectedOrder(orderId);
    setShowMedia(true);

    try {
      const { data } = await axios.get(`/auth/getMedia/${orderId}`);
      setPhotoUrl(data.intransitimg);
      setVoiceUrl(data.intransitvoi);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  return (
    <>
      <Container className="p-3">
        <h1 className="text-center mb-4">Today's Order</h1>
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
                  <th>Note/voice</th>
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
                        onClick={() => handleSubmit(user._id, "processing")} // Pass "completed" or the appropriate status directly
                      >
                        Forward
                      </button>
                    </td>
                    <td className="d-grid gap-2">
                      <button
                        onClick={() => handleView(user._id)}
                        type="button"
                        class="btn btn-outline-success mx-auto d-block m-1"
                      >
                        Pickup Veiw
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
      </Modal>
    </>
  );
};

export default Intransit;
