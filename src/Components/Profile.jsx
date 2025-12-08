import React from "react";
import { PopupMenu } from "react-simple-widgets";
import "../style/profile.scss";
import "../style/responsive.css";
import { HashLink } from "react-router-hash-link";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../config";
import { toast } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";

const ALLOWED_ROLES = {
  ADMIN: "admin",
  RIDER: "rider",
  PLANT_MANAGER: "plant-manager",
};

// const Profile = () => {
//   const {
//     auth: { name, email, role },
//     setAuth,
//   } = useAuth(); // assuming setAuth is available to clear auth data
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await axiosPrivate.post("/auth/logout"); // API call to backend logout route
//       setAuth(null); // Clear auth data on logout
//       navigate("/login"); // Redirect to login page after logout
//       toast.success("successfully logout");
//       localStorage.removeItem("token");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <div id="app">
//       <PopupMenu>
//         <div style={{ fontFamily: "cursive", cursor: "pointer" }}>
//           Hello, {name}
//         </div>
//         <div className="card-body px-4 py-4 my-4 mx-0 bodytag">
//           <div id="circle-avatar" className="text-center mx-auto mb-4">
//             <span>{name[0]}</span>
//           </div>

//           <h5 className="text-center mb-0" style={{ color: "white" }}>
//             {name}
//           </h5>
//           <p className="text-center mb-2" style={{ color: "white" }}>
//             {email}
//           </p>

//           <hr />

//           <p
//             className="mb-0"
//             style={{ color: "#ffff", fontWeight: "bold", fontSize: 12 }}
//           >
//             ROLES
//           </p>
//           <p style={{ fontSize: 12, color: "#ffff" }}>{[role].join(", ")}</p>

//           <hr className="mb-0" style={{ margin: "0 -24px 0" }} />

//           <div
//             className="list-group list-group-flush"
//             style={{ margin: "0px 0px" }}
//           >
//             {role === ALLOWED_ROLES.ADMIN && (
//               <>
//                 <HashLink
//                   to="/userlisting"
//                   className="list-group-item list-group-item-action px-4"
//                   style={{
//                     backgroundColor: "teal",
//                     color: "#ffff",
//                     width: "190px",
//                   }}
//                 >
//                   <small>User List</small>
//                 </HashLink>

//                 <HashLink
//                   to="/aboutuser"
//                   className="list-group-item list-group-item-action px-4"
//                   style={{
//                     backgroundColor: "teal",
//                     color: "#ffff",
//                     width: "190px",
//                   }}
//                 >
//                   <small>Profile</small>
//                 </HashLink>
//               </>
//             )}
//             {role === ALLOWED_ROLES.RIDER && (
//               <>
//                 <HashLink
//                   to="/rider/aboutuser"
//                   className="list-group-item list-group-item-action px-4"
//                   style={{
//                     backgroundColor: "teal",
//                     color: "#ffff",
//                     width: "190px",
//                   }}
//                 >
//                   <small>Profile</small>
//                 </HashLink>
//               </>
//             )}
//             {role === ALLOWED_ROLES.PLANT_MANAGER && (
//               <>
//                 <HashLink
//                   to="/plantmanager/aboutuser"
//                   className="list-group-item list-group-item-action px-4"
//                   style={{
//                     backgroundColor: "teal",
//                     color: "#ffff",
//                     width: "190px",
//                   }}
//                 >
//                   <small>Profile</small>
//                 </HashLink>
//               </>
//             )}
//           </div>

//           <hr style={{ margin: "0 -24px 24px" }} />

//           <div className="d-grid">
//             <button className="btn btn-secondary" onClick={handleLogout}>
//               <small>Logout</small>
//             </button>
//           </div>
//         </div>
//       </PopupMenu>
//     </div>
//   );
// };

const Profile = () => {
  const { auth, setAuth } = useAuth(); // Use `auth` directly
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosPrivate.post("/auth/logout"); // API call to backend logout route
      setAuth(null); // Clear auth data on logout
      navigate("/login"); // Redirect to login page after logout
      toast.success("Successfully logged out");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Guard against null `auth`
  if (!auth) {
    return null;
  }

  const { name, email, role } = auth;

  return (
    <div id="app">
      <PopupMenu>
        <div
          style={{
            fontFamily: "cursive",
            cursor: "pointer",
            backgroundColor: "white",
            color: "teal",
            borderRadius: "7px",
            padding: "5px 10px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            textTransform: "capitalize",
          }}
        >
          Hello, {name}
          <FaUserEdit style={{ fontSize: "20px" }} />
        </div>
        <div
          className="card px-4 py-4 mt-5 mx-0 bodytag"
          style={{ backgroundColor: "teal" }}
        >
          <div id="circle-avatar" className="text-center mx-auto mb-4">
            <span>{name[0]}</span>
          </div>

          <h5 className="text-center mb-0" style={{ color: "white" }}>
            {name}
          </h5>
          <p className="text-center mb-2" style={{ color: "white" }}>
            {email}
          </p>

          <hr />

          <p
            className="mb-0"
            style={{ color: "#ffff", fontWeight: "bold", fontSize: 12 }}
          >
            ROLES
          </p>
          <p style={{ fontSize: 12, color: "#ffff" }}>{[role].join(", ")}</p>

          <hr className="mb-0" style={{ margin: "0 -24px 0" }} />

          <div
            className="list-group list-group-flush"
            style={{ margin: "0px 0px" }}
          >
            {role === ALLOWED_ROLES.ADMIN && (
              <>
                <HashLink
                  to="/userlisting"
                  className="list-group-item list-group-item-action px-4"
                  style={{
                    backgroundColor: "teal",
                    color: "#ffff",
                    width: "190px",
                  }}
                >
                  <small>User List</small>
                </HashLink>

                <HashLink
                  to="/aboutuser"
                  className="list-group-item list-group-item-action px-4"
                  style={{
                    backgroundColor: "teal",
                    color: "#ffff",
                    width: "190px",
                  }}
                >
                  <small>Profile</small>
                </HashLink>
              </>
            )}
            {role === ALLOWED_ROLES.RIDER && (
              <>
                <HashLink
                  to="/rider/aboutuser"
                  className="list-group-item list-group-item-action px-4"
                  style={{
                    backgroundColor: "teal",
                    color: "#ffff",
                    width: "190px",
                  }}
                >
                  <small>Profile</small>
                </HashLink>
              </>
            )}
            {role === ALLOWED_ROLES.PLANT_MANAGER && (
              <>
                <HashLink
                  to="/plantmanager/aboutuser"
                  className="list-group-item list-group-item-action px-4"
                  style={{
                    backgroundColor: "teal",
                    color: "#ffff",
                    width: "190px",
                  }}
                >
                  <small>Profile</small>
                </HashLink>
              </>
            )}
          </div>

          <hr style={{ margin: "0 -24px 24px" }} />

          <div className="d-grid">
            <button className="btn btn-secondary" onClick={handleLogout}>
              <small>Logout</small>
            </button>
          </div>
        </div>
      </PopupMenu>
    </div>
  );
};

export default Profile;
