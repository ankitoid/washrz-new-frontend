import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Loader from "./Loader";
import "../style/responsive.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import "./custom/TableStyle.css";

const Deliverd = () => {
  const [customer, setCustomer] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const pageSize = 15;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const userEmail = auth?.email;
        // Add status to query string to fetch "processing" orders
        const customer = await axiosPrivate.get(
          `/getOrdersByFilter?limit=${pageSize}&page=${pageNumber}&email=${userEmail}&status=delivered`
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
  return (
    <>
      <Container fluid className="p-3">
        <h1 className="text-center mb-4">Deliveries</h1>
        <Row>
          <Col>
            <>
              {/* Desktop Table */}
              <Table striped bordered hover responsive className="desktop-only">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Name</th>
                    <th>Contact Number</th>
                    <th>Address</th>
                    <th>Pickup Time</th>
                    <th>Ready For Delivery Time</th>
                    <th>Delivery Time</th>
                    <th>Total Bill</th>
                    <th>Status</th>
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
                        {moment(user.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td className="nowrap-text">
                        {moment(user.statusHistory.ReadyForDelivery).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td className="nowrap-text">
                        {moment(user.statusHistory.delivered).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td className="nowrap-text">₹{user.price}</td>
                      <td className="text-capitalize nowrap-text">
                        {user.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Mobile Card View */}
              <div className="mobile-only">
                {customer.map((user) => (
                  <div className="mobile-card" key={user._id}>
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
                      {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </p>
                    <p>
                      <strong>Ready For Delivery:</strong>{" "}
                      {moment(user.statusHistory.ReadyForDelivery).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                    <p>
                      <strong>Delivered:</strong>{" "}
                      {moment(user.statusHistory.delivered).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                    <p>
                      <strong>Total Bill:</strong> ₹{user.price}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-capitalize">{user.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
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
    </>
  );
};

export default Deliverd;
