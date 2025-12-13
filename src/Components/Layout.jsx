import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import "./Layout.css";
import { useEffect, useState } from "react";

import logo from "../assets/washrzlogohd-removebg-preview.png";
import { io } from "socket.io-client";
import constant from "../constant";
import useAuth from "../hooks/useAuth";
const { washrzserver } = constant;

const socket = io(washrzserver);

const ALLOWED_ROLES = {
  ADMIN: "admin",
  RIDER: "rider",
  PLANT_MANAGER: "plant_manager",
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auth } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    socket.on("assignedPickup", (data) => {
      if (data?.riderName === auth?.name) {
        // 🔔 Notification
        if (Notification.permission === "granted") {
          new Notification("Pickup Assigned!", {
            body: `A new pickup has been assigned to you.`,
            icon: `${logo}`,
          });
        } else {
          Notification.requestPermission();
        }
      }
    });

    return () => {
      socket.off("assignedPickup");
    };
  }, [auth?.name]);

  useEffect(() => {
    if (auth?.role !== ALLOWED_ROLES.ADMIN) return;

    socket.on("addPickup", (data) => {
      if (Notification.permission === "granted") {
        new Notification("New Pickup!", {
          body: `${data?.Name || "Customer"} has requested a pickup.`,
          icon: logo,
        });
      }

      // Run only if current route is pickup page
      if (location.pathname === "/live") {
        // getPickups();
      }
    });

    return () => {
      socket.off("addPickup");
    };
  }, [location.pathname]);

  useEffect(() => {
    if (auth?.role !== ALLOWED_ROLES.ADMIN) return;

    socket.on("addSchedulePickup", (data) => {
      if (Notification.permission === "granted") {
        new Notification("New Schedule Pickup!", {
          body: `${data?.Name || "Customer"} has requested a Schedule pickup.`,
          icon: `${logo}`,
        });
      }

      // Run only if current route is pickup page
      if (location.pathname === "/SheduledDelivery") {
        getPickups();
      }
    });

    return () => {
      socket.off("addSchedulePickup");
    };
  }, [location.pathname]);

  return (
    <>
      <div className="layout">
        <div className="navbar_2">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="main-content">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
