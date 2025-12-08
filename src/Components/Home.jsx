// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import { GiCardPickup } from "react-icons/gi";
// import { FaCartArrowDown } from "react-icons/fa6";
// import "./Home.css";
// import { axiosPrivate } from "../config";

// const Home = () => {
//   const { auth } = useAuth();
//   const [message, setMessage] = useState("We are on Washrz.com!");

//   useEffect(() => {
//     if (auth.name) {
//       // After 2 seconds, change the message to the role-specific message
//       const timer = setTimeout(() => {
//         setMessage(
//           `Welcome to ${
//             auth?.role.charAt(0).toUpperCase() + auth?.role.slice(1)
//           } Portal`
//         );
//       }, 2000);

//       // Cleanup the timer when component unmounts
//       return () => clearTimeout(timer);
//     }
//   }, [auth]);

// const fetchDashboardData = async () => {
//   try {
//     const response = await axiosPrivate.get("/rider/rider-dashboard", {
//       params: {
//         riderName: auth.name, // Auth se rider ka naam
//         riderDate: new Date().toISOString().split('T')[0], // Aaj ki date
//       },
//     });

//     const { totalPickups, completedPickups } = response.data;
//     setTotalPickups(totalPickups);
//     setCompletedPickups(completedPickups);
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//   }
// };

//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           // height: "80vh",
//           marginTop: "30px",
//         }}
//       >
//         <h1 color="black">
//           {auth.name ? message : "You are not Logged in :("}
//           <br />
//           {!auth.name && <Link to="/login">Click to login</Link>}
//         </h1>
//       </div>
//       {auth.role === "rider" ? (
//         <div className="container-dashboard ml-3 mt-4">
//           <div className="card-dashboard">
//             <div className="card-body-dashboard">
//               <GiCardPickup style={{ fontSize: "25px" }} />
//               <h3>Today's Pickups</h3>
//               <div className="card-text-dashboard">
//                 <span>Total Pickup : 3</span>
//                 <span>Completed Pickup : 1</span>
//               </div>
//             </div>
//           </div>
//           <div className="card-dashboard">
//             <div className="card-body-dashboard">
//               <FaCartArrowDown style={{ fontSize: "25px" }} />
//               <h3>Today's Orders</h3>
//               <div className="card-text-dashboard">
//                 <span>Total Orders : 3</span>
//                 <span>Completed Orders : 1</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         ""
//       )}
//     </>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { GiCardPickup } from "react-icons/gi";
import { FaCartArrowDown } from "react-icons/fa6";
import "./Home.css";
import { axiosPrivate } from "../config";
import io from "socket.io-client";
import constant from "../constant";

const { washrzserver } = constant;

const socket = io(washrzserver);

const Home = () => {
  const { auth } = useAuth();
  const [message, setMessage] = useState("We are on Washrz.com!");
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [completedPickups, setCompletedPickups] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (auth.name) {
      // After 2 seconds, change the message to the role-specific message
      const timer = setTimeout(() => {
        setMessage(
          `Welcome to ${
            auth?.role.charAt(0).toUpperCase() + auth?.role.slice(1)
          } Portal`
        );
      }, 2000);

      // Cleanup the timer when component unmounts
      return () => clearTimeout(timer);
    }
  }, [auth]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosPrivate.get("/rider/rider-dashboard", {
        params: {
          riderName: auth.name, // Auth se rider ka naam
          riderDate: new Date().toISOString().split("T")[0], // Aaj ki date
        },
      });

      const { deliveredOrders, completedPickups } = response.data;
      setTotalDelivered(deliveredOrders);
      setCompletedPickups(completedPickups);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (auth.role === "rider") {
      fetchDashboardData();
    }
  }, [auth]);

  //notification check
  useEffect(() => {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }

    socket.on("pushNotification", (data) => {
      console.log("Received notification:", data);

      if (Notification.permission === "granted") {
        new Notification("New Notification", {
          body: data.message,
          icon: "https://via.placeholder.com/50",
        });
      }

      setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socket.off("pushNotification");
    };
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // height: "80vh",
          marginTop: "30px",
        }}
      >
        <h1 color="black">
          {auth.name ? message : "You are not Logged in :("}
          {/* <h1>Push Notification</h1>
          <ul>
            {notifications.map((notifi, index) => (
              <li key={index}>{notifi.message}</li>
            ))}
          </ul> */}
          <br />
          {!auth.name && <Link to="/login">Click to login</Link>}
        </h1>
      </div>
      {auth.role === "rider" ? (
        <div className="container-dashboard ml-3 mt-4">
          <div className="card-dashboard">
            <div className="card-body-dashboard">
              <GiCardPickup style={{ fontSize: "25px" }} />
              <h3>Today's Pickups</h3>
              <div className="card-text-dashboard">
                {/* <span>Total Pickup : {totalPickups}</span> */}
                <span>Completed Pickup : {completedPickups}</span>
              </div>
            </div>
          </div>
          <div className="card-dashboard">
            <div className="card-body-dashboard">
              <FaCartArrowDown style={{ fontSize: "25px" }} />
              <h3>Today's Orders</h3>
              <div className="card-text-dashboard">
                {/* <span>Total Orders : 3</span> */}
                <span>Completed Orders : {totalDelivered}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Home;
