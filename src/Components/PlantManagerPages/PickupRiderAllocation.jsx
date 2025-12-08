import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import "../../style/responsive.css";
import socket from "../../utills/socket";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Loader";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const PickupRiderAllocation = () => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 8;
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [riders, setRiders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { auth } = useAuth();

  const getPickups = () => {
    const userEmail = auth?.email; // Assuming auth.email contains the user's email
    axiosPrivate
      .get(
        `/getAssignedPickups?limit=${pageSize}&page=${pageNumber}&email=${userEmail}`
      )
      .then((response) => {
        setData([...response?.data?.Pickups]);
        setPageCount(Math.ceil(response?.data?.total / pageSize));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // socket.on("addPickup", (data) => {
    //   setData((prev) => [data, ...prev]);
    // });

    getPickups();
  }, [pageNumber]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };
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
      await axiosPrivate.patch(`plant/assignPickupRider`, {
        orderId: selectedOrder._id,
        riderName: selectedRider,
      });

      // Update the data state instead of customer
      setData((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, riderName: selectedRider }
            : order
        )
      );

      setShowModal(false);
      toast.success(`Pickup assigned to ${selectedRider}`);
    } catch (error) {
      setShowModal(false);
      console.error("Failed to assign rider:", error);
      toast.error("Failed to assign rider.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="p-3 mx-0">
            <h2 className="text-center my-3">Rider Allocation for Pickup</h2>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact Number</th>
                    <th>Booking Time</th>
                    <th>Address</th>
                    <th>plant</th>
                    <th>Rider Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) &&
                    data.length > 0 &&
                    data.map((user) => {
                      return (
                        <tr key={user._id}>
                          <td>{user.Name}</td>
                          <td>{user.Contact}</td>
                          <td>
                            {moment(user.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </td>
                          <td>{user.Address}</td>
                          <td>{user.plantName}</td>
                          <td>{user.riderName}</td>
                          <td>
                            {user.riderName ? (
                              // Show the Reallocate Rider button if riderName exists
                              <button
                                className="btn btn-outline-primary d-block mx-auto"
                                style={{ width: "100%" }}
                                onClick={() => handleSelectRiderClick(user)}
                              >
                                Reassign Rider
                              </button>
                            ) : (
                              // Show the Allocate Rider button if riderName doesn't exist
                              <button
                                className="btn btn-outline-primary d-block mx-auto"
                                style={{ width: "100%" }}
                                onClick={() => handleSelectRiderClick(user)}
                              >
                                Assign Rider
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
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
            <div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupRiderAllocation;
