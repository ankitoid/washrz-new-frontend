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
import "../../style/responsive.css";
import { BsFilterSquareFill } from "react-icons/bs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "../../config";
import { HiEye } from "react-icons/hi";
import Loader from "./../CustomLoader";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "./../../hooks/useAuth";
import { IoMdEyeOff } from "react-icons/io";
import { FcDeleteDatabase } from "react-icons/fc";

const RiderDocuments = () => {
  const [customer, setCustomer] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterShowCalendar, setFilterShowCalendar] = useState(false);
  const [showMultiMedia, setShowMultiMedia] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { auth } = useAuth();
  const pageSize = 15;
  const axiosPrivate = useAxiosPrivate();

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

  useEffect(() => {
    getCustomer();
  }, [pageNumber]);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected + 1); // ReactPaginate uses zero-based index
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
      <Container className="p-3">
        <h1 className="text-center mb-4">Documents</h1>
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
                      <th className="nowrap-text">Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.length || isLoading > 0 ? (
                      customer.map((user) => (
                        <tr key={user._id}>
                          <td className="nowrap-text">{user.order_id}</td>
                          <td className="nowrap-text">{user.customerName}</td>
                          <td className="nowrap-text">{user.contactNo}</td>
                          <td className="nowrap-text">{user.address}</td>
                          <td>₹{user.price}</td>
                          <td className="text-capitalize nowrap-text">
                            {user.status}
                          </td>
                          <td>
                            {user.image && user.image.length > 0 ? (
                              <HiEye
                                className="icon mx-auto d-block teal"
                                onClick={() => handleOrderView(user._id)}
                              />
                            ) : (
                              <IoMdEyeOff className="icon mx-auto d-block teal" />
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-3">
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
                        <strong>Status:</strong>{" "}
                        <span className="text-capitalize">{user.status}</span>
                      </p>
                      <div className="d-flex justify-content-start align-items-center mt-2">
                        {user.image && user.image.length > 0 ? (
                          <HiEye
                            className="icon teal"
                            onClick={() => handleOrderView(user._id)}
                          />
                        ) : (
                          <IoMdEyeOff className="icon teal" />
                        )}
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
          </div>
        </div>
      </Container>
    </>
  );
};

export default RiderDocuments;
