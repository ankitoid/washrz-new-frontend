import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Carousel,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Loader from "./Loader";
import "../style/responsive.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "./../hooks/useAuth";
import { BsFilterSquareFill } from "react-icons/bs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IoDocumentAttach } from "react-icons/io5";
import { toast } from "react-toastify";
import WebCamMulti from "../Componentsnew/webcam/WebCamMulti";
import Recorder from "../Componentsnew/Recorder/Recorder";
import axios from "../config";
import { HiEye } from "react-icons/hi";
import { FaFileCircleXmark } from "react-icons/fa6";
import "./custom/TableStyle.css";

const Documents = () => {
  const [customer, setCustomer] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterShowCalendar, setFilterShowCalendar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [voiceFile, setVoiceFile] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showMultiMedia, setShowMultiMedia] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { auth } = useAuth();
  const pageSize = 15;
  const axiosPrivate = useAxiosPrivate();

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

  const handleDateChange = (date) => {
    setSelectedDate(date); // Update selected date state
    setPageNumber(1);
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected + 1); // ReactPaginate uses zero-based index
  };

  const handleIconClick = (orderId) => {
    setCurrentOrderId(orderId);
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!capturedImages || capturedImages.length === 0) {
      toast.error("Please capture or upload at least one image.");
      return;
    }

    const formData = new FormData();
    capturedImages.forEach((image) => formData.append("image", image));
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
        getOrders();
      } else {
        toast.error("Error uploading files");
      }
    } catch (error) {
      toast.error("Error uploading files");
    }
  };

  const resetCaptureStates = () => {
    setCapturedImages([]);
    setVoiceFile(null);
    setShowModal(false);
  };

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

  const handleNull = () => {
    setShowMultiMedia(false);
    setPhotoUrls([]);
    setVoiceUrl(null);
  };
  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">Documents</h1>
        <div className="row">
          <div className="col-md-12">
            <div className=" mx-16">
              {/* Desktop View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>Total Bill</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.map((user) => (
                      <tr key={user._id}>
                        <td className="nowrap-text">{user.order_id}</td>
                        <td className="nowrap-text">{user.customerName}</td>
                        <td className="nowrap-text">{user.contactNo}</td>
                        <td className="nowrap-text">{user.address}</td>
                        <td className="nowrap-text">₹{user.price}</td>
                        <td className="nowrap-text text-capitalize">
                          {user.status}
                        </td>
                        <td>
                          {user.image && user.image.length > 0 ? (
                            <HiEye
                              className="icon teal mx-auto d-block"
                              onClick={() => handleOrderView(user._id)}
                            />
                          ) : user.status === "delivered" ? (
                            <FaFileCircleXmark className="icon red mx-auto d-block" />
                          ) : (
                            <IoDocumentAttach
                              className="icon teal mx-auto d-block"
                              onClick={() => handleIconClick(user._id)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="mobile-only">
                {customer.map((user) => (
                  <div key={user._id} className="mobile-card">
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
                      <strong>Status:</strong> {user.status}
                    </p>
                    <p>
                      <strong>Action:</strong>{" "}
                      {user.image && user.image.length > 0 ? (
                        <HiEye
                          className="icon teal"
                          onClick={() => handleOrderView(user._id)}
                        />
                      ) : user.status === "delivered" ? (
                        <FaFileCircleXmark className="icon red" />
                      ) : (
                        <IoDocumentAttach
                          className="icon teal"
                          onClick={() => handleIconClick(user._id)}
                        />
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="fixed-top right-100 p-3"
          style={{ zIndex: "6", left: "initial" }}
        >
          <BsFilterSquareFill
            style={{
              fontSize: "30px",
              cursor: "pointer",
              color: "teal",
              position: "fixed",
              top: "56px",
              right: "20px",
              zIndex: 10,
            }}
            onClick={() => setFilterShowCalendar(true)}
          />
        </div>
        {showFilterShowCalendar && (
          <div
            style={{
              position: "absolute",
              top: "100px",
              right: "20px",
              zIndex: 20,
            }}
          >
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WebCamMulti onCapture={(images) => setCapturedImages(images)} />
          <Recorder onRecordingComplete={(audio) => setVoiceFile(audio)} />
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

      <Modal show={showMultiMedia} onHide={handleNull}>
        <Modal.Header closeButton>
          <Modal.Title>Photo and Voice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {photoUrls && photoUrls.length > 0 ? (
            <div>
              <h3>Photos</h3>
              <Carousel>
                {photoUrls.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={url}
                      alt={`Order Photo ${index + 1}`}
                      className="d-block w-100 img-fluid"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                ))}
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
    </>
  );
};

export default Documents;
