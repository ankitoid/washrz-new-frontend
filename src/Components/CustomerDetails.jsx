import React, { useState } from "react";
import { useEffect } from "react";
import { instance } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import Loader from "./Loader";
import "../style/responsive.css";
import useRefreshToken from "../hooks/useRefreshToken";
import "./custom/TableStyle.css";

const CustomerDetails = () => {
  const [customer, setCustomer] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 15;
  const refresh = useRefreshToken();

  const getCustomer = async () => {
    setIsLoading(true);
    const newAccessToken = await refresh();
    console.log("=============================>>> at", newAccessToken);
    try {
      const customerData = await instance.get(
        `/getContacts?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );
      setPageCount(Math.ceil(customerData?.data?.link.total / pageSize));
      setCustomer([
        ...customerData.data.contact_list.sort(
          (a, b) =>
            b.lastUpdated.localeCompare(a.lastUpdated) ||
            a.lastUpdated.localeCompare(b.lastUpdated)
        ),
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [pageNumber]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">Customers</h1>
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
                      <th>Added on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.map((user) => (
                      <tr key={user.id}>
                        <td className="nowrap-text">{user.fullName}</td>
                        <td className="nowrap-text">{user.phone}</td>
                        <td className="nowrap-text">
                          {user.customParams.find((el) => el.name === "address")
                            ?.value ?? "-"}
                        </td>
                        <td className="nowrap-text">
                          {moment(user.lastUpdated).format(
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
                {customer.map((user) => (
                  <div key={user.id} className="mobile-card">
                    <p>
                      <strong>Name:</strong> {user.fullName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {user.phone}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {user.customParams.find((el) => el.name === "address")
                        ?.value ?? "-"}
                    </p>
                    <p>
                      <strong>Added on:</strong>{" "}
                      {moment(user.lastUpdated).format(
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
    </>
  );
};

export default CustomerDetails;
