import React, { useState } from "react";
import { FiEye, FiEdit } from "react-icons/fi";
import { FaEyeSlash } from "react-icons/fa";
import adhaarcard from "../assets/washrzimages/dummy_adhaarcard.png";
import drivingLicence from "../assets/washrzimages/dummy_driving_licence.jpg";
import profile from "../assets/washrzimages/dummy_profile_image.jpg";
import "../style/AboutUser.css";
import { Button } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

const initialUser = {
  id: 1,
  name: "John Doe",
  role: "Admin",
  mobileNumber: "123-456-7890",
  userId: "johndoe123",
  password: "johndoe@123",
  aadhaarCard: adhaarcard,
  drivingLicence: drivingLicence,
  photo: profile,
};

const AboutUser = () => {
  const {
    auth: { name, email, role },
  } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...initialUser });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Save the changes to the user's details
    // You can make an API call or save the changes to a database.
    // For this example, we'll just update the user's details in state.
    setEditedUser({ ...editedUser });
    toggleEditMode();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  return (
    <div className="Container">
      <div className="user-profile">
        <div className="profile-photo">
          <img src={editedUser?.photo} alt="User Photo" />
        </div>
        <div className="profile-details">
          <h2>{name}</h2>
          <p>
            <strong>Role:</strong> {role}
          </p>
          <p>
            <strong>Mobile Number:</strong> {editedUser?.mobileNumber}
          </p>
          <p>
            <strong>User ID:</strong> {email}
          </p>
          {isEditing ? (
            <div>
              <label htmlFor="editedPassword">
                <strong>Password:</strong>
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={editedUser?.password}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <p>
              <strong>Password:</strong>{" "}
              {passwordVisible ? editedUser?.password : "*******"}
            </p>
          )}
          <span onClick={togglePasswordVisibility}>
            {passwordVisible ? (
              <FiEye size={20} color="teal" />
            ) : (
              <FaEyeSlash size={20} color="red" />
            )}
          </span>
        </div>
        <div className="edit-button">
          {isEditing ? (
            <Button
              style={{ backgroundColor: "teal" }}
              variant="success"
              onClick={handleSaveChanges}
            >
              Save
            </Button>
          ) : (
            <Button
              style={{ backgroundColor: "teal" }}
              variant="primary"
              onClick={toggleEditMode}
            >
              Edit <FiEdit />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUser;
