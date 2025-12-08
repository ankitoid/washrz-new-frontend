import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Loader from "../Loader";
import "../../style/responsive.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import "../custom/TableStyle.css";

const OrderReschedule = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [rescheduledOrders, setrescheduledOrders] = useState([]); // State to store the rescheduled Orderss
  const { auth } = useAuth();
  const pageSize = 8;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getRescheduledOrders = async () => {
      try {
        setIsLoading(true);
        const userEmail = auth?.email;
        // Fetch rescheduled Orderss from backend
        const response = await axiosPrivate.get(
          `/rider/rescheduled-Orders?page=${pageNumber}&pageSize=${pageSize}&email=${userEmail}`
        );

        setrescheduledOrders(response.data.data); // Store the rescheduled Orderss in state
        setPageCount(Math.ceil(response.data.total / pageSize));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching rescheduled Orderss:", error);
      }
    };

    getRescheduledOrders();
  }, [pageNumber, axiosPrivate]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">Rescheduled Deliveries</h1>
        <div className="row">
          <div className="col-md-12">
            <div className=" mx-16">
              {/* Desktop Table View */}
              <div className="table-responsive desktop-only-customer">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>Rescheduled Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rescheduledOrders.map((Orders) => (
                      <tr key={Orders._id}>
                        <td className="nowrap-text">{Orders.customerName}</td>
                        <td className="nowrap-text">{Orders.contactNo}</td>
                        <td className="nowrap-text">{Orders.address}</td>
                        <td className="nowrap-text">
                          {moment(Orders.rescheduledDate).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-only">
                {rescheduledOrders.map((Orders) => (
                  <div key={Orders._id} className="mobile-card">
                    <p>
                      <strong>Name:</strong> {Orders.customerName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {Orders.contactNo}
                    </p>
                    <p>
                      <strong>Address:</strong> {Orders.address}
                    </p>
                    <p>
                      <strong>Rescheduled Date:</strong>{" "}
                      {moment(Orders.rescheduledDate).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                  </div>
                ))}
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

export default OrderReschedule;
