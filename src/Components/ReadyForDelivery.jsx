import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Table, Container, Row, Col } from "react-bootstrap";
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
import useAuth from "../hooks/useAuth";
import { MdDirectionsBike } from "react-icons/md";
import { TbBikeOff } from "react-icons/tb";
import { toast } from "react-toastify";
import "./custom/TableStyle.css";

const ReadyForDelivery = () => {
  const [customer, setCustomer] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [riders, setRiders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [tooltipText, setTooltipText] = useState("");

  const { auth } = useAuth();
  const pageSize = 15;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
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
    getCustomer();
  }, [pageNumber]);
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
    setShowModal(true);
  };
  const handleRiderSelection = async () => {
    try {
      await axiosPrivate.patch(`plant/assignRider`, {
        orderId: selectedOrder._id,
        riderName: selectedRider,
      });

      // Update local state
      setCustomer((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, riderName: selectedRider }
            : order
        )
      );
      setShowModal(false);
      toast.success(`Order assinged to ${selectedRider}`);
    } catch (error) {
      console.error("Failed to assign rider:", error);
    }
  };

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">Ready For Delivery</h1>
        <div className="row">
          <div className="col-md-12">
            <div className=" mx-16">
              {/* Desktop Table View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>Ready For Delivery Time</th>
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
                        <td className="nowrap-text">
                          {moment(user.statusHistory.readyForDelivery).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                        <td className="nowrap-text">₹{user.price}</td>
                        <td className="nowrap-text text-capitalize">
                          {user.status}
                        </td>
                        <td>
                          {user.riderName ? (
                            <div
                              className="mx-auto d-block"
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                              onMouseEnter={() => {
                                setHoveredButton(`${user._id}-rider`);
                                setTooltipText(user.riderName);
                              }}
                              onMouseLeave={() => {
                                setHoveredButton(null);
                                setTooltipText("");
                              }}
                            >
                              <MdDirectionsBike
                                style={{
                                  fontSize: "25px",
                                  color:
                                    hoveredButton === `${user._id}-rider`
                                      ? "#043a3a"
                                      : "teal",
                                  cursor: "pointer",
                                  transform:
                                    hoveredButton === `${user._id}-rider`
                                      ? "scale(1.2)"
                                      : "scale(1)",
                                  transition: "all 0.2s ease-in-out",
                                }}
                                onClick={() => handleSelectRiderClick(user)}
                              />
                              {hoveredButton === `${user._id}-rider` && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-25px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(14, 177, 150, 0.8)",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    zIndex: 10,
                                  }}
                                >
                                  {tooltipText}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className="mx-auto d-block"
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                              onMouseEnter={() => {
                                setHoveredButton(`${user._id}-pendingRider`);
                                setTooltipText("No Rider Assigned");
                              }}
                              onMouseLeave={() => {
                                setHoveredButton(null);
                                setTooltipText("");
                              }}
                            >
                              <TbBikeOff
                                style={{
                                  fontSize: "30px",
                                  color:
                                    hoveredButton === `${user._id}-pendingRider`
                                      ? "rgb(82 82 14)"
                                      : "rgb(134 134 0)",
                                  cursor: "pointer",
                                  transform:
                                    hoveredButton === `${user._id}-pendingRider`
                                      ? "scale(1.2)"
                                      : "scale(1)",
                                  transition: "all 0.2s ease-in-out",
                                }}
                                onClick={() => handleSelectRiderClick(user)}
                              />
                              {hoveredButton === `${user._id}-pendingRider` && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-25px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(177, 166, 14, 0.8)",
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    zIndex: 10,
                                  }}
                                >
                                  {tooltipText}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
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
                      <strong>Ready Time:</strong>{" "}
                      {moment(user.statusHistory.readyForDelivery).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                    <p>
                      <strong>Bill:</strong> ₹{user.price}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-capitalize">{user.status}</span>
                    </p>
                    <p>
                      <strong>Action:</strong>{" "}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rider Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRiderSelection}>
            Assign Rider
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

export default ReadyForDelivery;
