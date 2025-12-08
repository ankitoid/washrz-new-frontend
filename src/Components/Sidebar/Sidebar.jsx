import React, { useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GiCardPickup } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa6";
import { IoDocumentsSharp } from "react-icons/io5";

import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ALLOWED_ROLES = {
  ADMIN: "admin",
  RIDER: "rider",
  PLANT_MANAGER: "plant-manager",
};

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { auth } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };
  const userRole = auth?.role;

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="nav-item">
          <button className="sidebar-brand">
            <FaArrowCircleLeft onClick={goBack} style={{ color: "teal" }} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">
              <MdDashboard style={{ fontSize: "25px" }} />
            </span>
            <span className="nav-text" onClick={toggleSidebar}>
              Dashboard
            </span>
          </Link>
          {userRole === ALLOWED_ROLES.ADMIN && (
            <>
              <div
                className={`nav-group ${
                  activeDropdown === "Pickup" ? "nav-group-open" : ""
                }`}
              >
                <div
                  className={`nav-toggler ${
                    activeDropdown === "Pickup" ? "nav-toggler-open" : ""
                  }`}
                  onClick={() => toggleDropdown("Pickup")}
                >
                  <span className="nav-icon">
                    <GiCardPickup style={{ fontSize: "25px" }} />
                  </span>
                  <span className="nav-text">Pickup</span>
                  <span className="badge">
                    {activeDropdown === "Pickup" ? (
                      <IoIosArrowUp style={{ color: "teal" }} />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                </div>
                <div
                  className={`nav-dropdown ${
                    activeDropdown === "Pickup" ? "open" : "close"
                  }`}
                >
                  <Link to="/live" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Live
                    </span>
                  </Link>
                  <Link to="/SheduledDelivery" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Scheduled
                    </span>
                  </Link>
                  <Link to="/Rescheduled" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Rescheduled
                    </span>
                  </Link>
                  <Link to="/Cancelled" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Cancelled
                    </span>
                  </Link>
                </div>
              </div>
              <div
                className={`nav-group ${
                  activeDropdown === "Orders" ? "nav-group-open" : ""
                }`}
              >
                <div
                  className={`nav-toggler ${
                    activeDropdown === "Orders" ? "nav-toggler-open" : ""
                  }`}
                  onClick={() => toggleDropdown("Orders")}
                >
                  <span className="nav-icon">
                    <FaCartArrowDown style={{ fontSize: "25px" }} />
                  </span>
                  <span className="nav-text">Orders</span>
                  <span className="badge">
                    {activeDropdown === "Orders" ? (
                      <IoIosArrowUp style={{ color: "teal" }} />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                </div>
                <div
                  className={`nav-dropdown ${
                    activeDropdown === "Orders" ? "open" : "close"
                  }`}
                >
                  <Link to="/Order" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      All Orders
                    </span>
                  </Link>
                  <Link to="/Processing" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Processing
                    </span>
                  </Link>
                  <Link to="/ReadyForDelivery" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Ready For Delivery
                    </span>
                  </Link>
                  <Link to="/OrderReschedule" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Rescheduled
                    </span>
                  </Link>
                  <Link to="/Deliverd" className="nav-item">
                    <span className="nav-icon-bullet"></span>
                    <span className="nav-text" onClick={toggleSidebar}>
                      Deliveries
                    </span>
                  </Link>
                </div>
              </div>
              <Link to="/customerdetails" className="nav-item">
                <span className="nav-icon">
                  <FaUsers style={{ fontSize: "25px" }} />
                </span>
                <span className="nav-text" onClick={toggleSidebar}>
                  Customers
                </span>
              </Link>
              <Link to="/Documents" className="nav-item">
                <span className="nav-icon">
                  <IoDocumentsSharp style={{ fontSize: "25px" }} />
                </span>
                <span className="nav-text" onClick={toggleSidebar}>
                  Documentation
                </span>
              </Link>
            </>
          )}
          {userRole === ALLOWED_ROLES.RIDER && (
            <>
              <Link to="/rider/live" className="nav-item">
                <span className="nav-icon">
                  <GiCardPickup style={{ fontSize: "25px" }} />
                </span>
                <span className="nav-text" onClick={toggleSidebar}>
                  Pickups
                </span>
              </Link>
              <Link to="/rider/Deliveries" className="nav-item">
                <span className="nav-icon">
                  <FaCartArrowDown style={{ fontSize: "25px" }} />
                </span>
                <span className="nav-text" onClick={toggleSidebar}>
                  Deliveries
                </span>
              </Link>
              <Link to="/rider/Documents" className="nav-item">
                <span className="nav-icon">
                  <IoDocumentsSharp style={{ fontSize: "25px" }} />
                </span>
                <span className="nav-text" onClick={toggleSidebar}>
                  Documentation
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
