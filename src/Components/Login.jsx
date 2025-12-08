import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import img1 from "../assets/washrzlogohd-removebg-preview.png";
import img2 from "../assets/loginTemplate.png";
import "../style/login.css";
import { useNavigate } from "react-router-dom";
import axios from "../config.jsx";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { HashLink } from "react-router-hash-link";
import { Button } from "react-bootstrap";
import Header from "./Header.jsx";

function Login() {
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/");
    }
  });
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";

  const handleUserTypeChange = (e) => {
    setValue((prev) => {
      return { ...prev, [e.target.type]: e.target.value };
    });
  };

  const getProfile = async (accessToken) => {
    if (accessToken) {
      const response = await axios.get("/auth/profile", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const profile = response.data.profile;
      const { name, email, role, avatar } = profile;
      console.log("thid is theprofle-->> ", profile);
      setAuth({ name, email, role, avatar, accessToken });
      navigate("/");
    }
  };

  const handleSubmit = async () => {
    const { email, password } = value;
    try {
      const response = await axios.post(
        "/auth/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getProfile(response?.data?.tokens.accessToken);
      toast.success("Sucessfully Logedin :)");
      const accessToken = response?.data?.tokens.accessToken;
      localStorage.setItem("token", response?.data?.tokens.refreshToken);
    } catch (err) {
      if (!err?.response) {
        toast.error(err?.response?.data?.message);
      } else if (err.response?.status === 400) {
        toast.error(err?.response?.data?.message);
      } else if (err.response?.status === 401) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("Login Failed");
      }
    }
  };

  return (
    <>
      <Header />
      <MDBContainer className=" my-5 d-flex justify-content-center align-items-center">
        <MDBCard
          style={{ backgroundColor: "white" }}
          className="max-height-card shadow p-3 "
        >
          <MDBRow className="g-0">
            <MDBCol md="6">
              <MDBCardImage
                src={img2}
                alt="login form"
                className="rounded-start w-100"
              />
            </MDBCol>

            <MDBCol md="6">
              <MDBCardBody className="d-flex flex-column">
                <div className="d-flex flex-row mt-2">
                  <img src={img1} alt="Logo" height={"70px"} width={"70px"} />
                </div>
                <h5
                  className="fw-normal my-4 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Sign into your account
                </h5>

                {/* Radio buttons for user type */}
                {/* <h7
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Select User type
              </h7>
              <div className="mb-4 d-flex align-items-center">
                <div className="form-check me-4 pb-3">
                  <input
                    type="radio"
                    id="admin"
                    name="userType"
                    value="admin"
                    checked={value.role === "admin"}
                    onChange={handleUserTypeChange}
                    className="form-check-input"
                  />
                  <label htmlFor="admin" className="form-check-label">
                    Admin
                  </label>
                </div>

                <div className="form-check me-4 pb-3">
                  <input
                    type="radio"
                    id="rider"
                    name="userType"
                    value="rider"
                    checked={value.role === "rider"}
                    onChange={handleUserTypeChange}
                    className="form-check-input"
                  />
                  <label htmlFor="rider" className="form-check-label">
                    Rider
                  </label>
                </div>

                <div className="form-check pb-3">
                  <input
                    type="radio"
                    id="plantManager"
                    name="userType"
                    value="plantManager"
                    checked={value.role === "plantManager"}
                    onChange={handleUserTypeChange}
                    className="form-check-input"
                  />
                  <label htmlFor="plantManager" className="form-check-label">
                    Plant Manager
                  </label>
                </div>
              </div> */}

                <MDBInput
                  wrapperClass="mb-4"
                  placeholder="Email address"
                  id="formControlLg"
                  type="email"
                  size="lg"
                  onChange={handleUserTypeChange}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  placeholder="Password"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  onChange={handleUserTypeChange}
                />

                <Button
                  style={{ backgroundColor: "#008080" }}
                  className="mb-4 px-5"
                  size="lg"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
                <HashLink
                  to="/forgetpassword"
                  className="small text-muted"
                  href="#!"
                >
                  Forgot password?
                </HashLink>

                <div className="d-flex flex-row justify-content-start">
                  <a href="#!" className="small text-muted me-1">
                    Terms of use.
                  </a>
                  <a href="#!" className="small text-muted">
                    Privacy policy
                  </a>
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default Login;
