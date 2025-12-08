import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Example from "./SucessModal";
import BillModal from "./BillModal";
import Loader from "./Loader";
import "../style/responsive.css";
// import socket from "../utills/socket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../config";
import logo from "../assets/washrzlogohd-removebg-preview.png";
import { io } from "socket.io-client";
import "./custom/TableStyle.css";
import constant from "../constant";
const { washrzserver } = constant;

const socket = io(washrzserver);

const SheduledDelivery = ({ type, setActiveTab }) => {
  const { currObj, setCurrObj } = useAuth();
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 8;
  const [pageNumber, setPageNumber] = useState(1);
  const [showSuc, setShowSuc] = useState(false);
  const [billShow, setBillShow] = useState(false);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New state for loading indicator
  const [priceConfig, setPriceConfig] = useState({});
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [note, setNote] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const { auth } = useAuth();

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handledelete = async (id) => {
    try {
      setIsLoading(true);
      setData([]);
      const res = await axiosPrivate.put(`/deletePickup/${id}`);
      console.log("console", res);
      if (res.status === 200) {
        getPickups();
        setActiveTab("Cancelled");
        toast.success("Pickup is successfully cancelled");
      }
    } catch (error) {
      console.log("this is error", error);
    }
  };

  const getPickups = () => {
    const userEmail = auth?.email; // Assuming auth.email contains the logged-in user's email
    const url = type === "cancel" ? "/getCancelPickups" : "/getSchedulePickups";

    axiosPrivate
      .get(`${url}?limit=${pageSize}&page=${pageNumber}&email=${userEmail}`)
      .then((response) => {
        setData([...response?.data?.Pickups]);
        setPageCount(Math.ceil(response?.data?.total / pageSize));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  // useEffect(() => {
  //   if (
  //     Notification.permission === "default" ||
  //     Notification.permission === "denied"
  //   ) {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === "granted") {
  //         setupSocket();
  //       }
  //     });
  //   } else {
  //     setupSocket();
  //   }

  //   function setupSocket() {
  //     socket.on("addSchedulePickup", (data) => {
  //       console.log("Schedule Pickup Notification:", data);
  //       new Notification("New Schedule Pickup!", {
  //         body: `${data?.Name || "Customer"} has requested a pickup.`,
  //         icon: `${logo}`,
  //       });
  //       getPickups(pageNumber);
  //     });
  //   }

  //   getPickups(pageNumber);
  //   return () => {
  //     socket.off("addSchedulePickup");
  //   };
  // }, [pageNumber]);

  useEffect(() => {
    getPickups(pageNumber);
  }, [pageNumber]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  const handleView = async (pickupId) => {
    setSelectedPickup(pickupId);
    setShowMedia(true);
    try {
      const { data } = await axios.get(`/rider/getCancelMedia/${pickupId}`);
      setVoiceUrl(data.voiceUrl);
      setNote(data.cancelNote);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  return (
    <div className="container">
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          // marginBottom: "20px",
          fontSize: "24px", // Adjust font size for smaller screens
          textAlign: "center", // Center align for smaller screens
        }}
      >
        Pickup/{type === "cancel" ? "CancelPickups" : "SchedulePickups"}
      </h1>
      <div className="row">
        <div className="col-md-12">
          <div className="mx-16">
            {" "}
            {/* Reduced padding for smaller screens */}
            <div className="table-responsive d-none d-md-block">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact Number</th>
                    <th>Booking Time</th>
                    <th>Address</th>
                    <th>Slot Timings</th>
                    {type === "cancel" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) &&
                    data.length > 0 &&
                    data.map((user) => (
                      <tr key={user._id}>
                        <td>{user.Name}</td>
                        <td>{user.Contact}</td>
                        <td>
                          {moment(user.pickup_date).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                        <td>{user.Address}</td>
                        <td>{user.slot}</td>
                        {type === "cancel" && (
                          <td className="d-grid gap-2">
                            <button
                              onClick={() => handleView(user._id)}
                              type="button"
                              className="btn btn-outline-success"
                            >
                              Pickup View
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            {/* Mobile Card View */}
            <div className="d-md-none">
              {Array.isArray(data) &&
                data.length > 0 &&
                data.map((user) => (
                  <div key={user._id} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{user.Name}</h5>
                      <p className="card-text">
                        <strong>Contact:</strong> {user.Contact}
                      </p>
                      <p className="card-text">
                        <strong>Booking Time:</strong>{" "}
                        {moment(user.pickup_date).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                      <p className="card-text">
                        <strong>Address:</strong> {user.Address}
                      </p>
                      <p className="card-text">
                        <strong>Slot:</strong> {user.slot}
                      </p>
                      {type === "cancel" && (
                        <div className="d-grid gap-2">
                          <button
                            onClick={() => handleView(user._id)}
                            type="button"
                            className="btn btn-outline-success"
                          >
                            Pickup View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {showSuc && (
              <Example
                showSuc={showSuc}
                setShowSuc={setShowSuc}
                setBillShow={setBillShow}
                setTotal={setTotal}
                setCurrObj={setCurrObj}
                setPriceConfig={setPriceConfig}
              />
            )}
            {billShow && (
              <BillModal
                billShow={billShow}
                setBillShow={setBillShow}
                total={total}
                currObj={currObj}
                handledelete={handledelete}
                priceConfig={priceConfig}
              />
            )}
          </div>
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

          {/* Modal to show note and voice */}
          <Modal show={showMedia} onHide={() => setShowMedia(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Voice and Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {note ? (
                <div>
                  <h3>Note</h3>
                  <p>{note}</p>
                </div>
              ) : (
                <p>No Note available.</p>
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
        </div>
      </div>
    </div>
  );
};

export default SheduledDelivery;
