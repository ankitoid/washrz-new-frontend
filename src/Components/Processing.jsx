import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Loader from "./Loader";
import "../style/responsive.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "./../hooks/useAuth";
import "./custom/TableStyle.css";

const Processing = () => {
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
  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">Processing</h1>
        <div className="row">
          <div className="col-md-12">
            <div className=" mx-16">
              {/* Desktop View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>Processing Time</th>
                      <th>Total Bill</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.length > 0 ? (
                      customer.map((user) => (
                        <tr key={user._id}>
                          <td>{user.order_id}</td>
                          <td>{user.customerName}</td>
                          <td>{user.contactNo}</td>
                          <td>{user.address}</td>
                          <td>
                            {moment(user.statusHistory?.processing).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </td>
                          <td>₹{user.price}</td>
                          <td className="text-capitalize">{user.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Mobile View - Card Format */}
              <div className="mobile-only">
                {customer.length > 0 ? (
                  customer.map((user) => (
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
                        <strong>Processing Time:</strong>{" "}
                        {moment(user.statusHistory?.processing).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                      <p>
                        <strong>Total Bill:</strong> ₹{user.price}
                      </p>
                      <p className="text-capitalize">
                        <strong>Status:</strong> {user.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted">No data found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Processing;
