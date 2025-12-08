import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../style/formstyle.css";
import "../style/AboutUser.css";
import profile from "../assets/washrzimages/dummy_profile_image.jpg";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { axiosPrivate } from "../config";

const roles = ["admin", "rider", "plant-manager"];

function App() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [drivingLicencePreview, setDrivingLicencePreview] = useState(null);
  const [aadhaarCardPreview, setAadhaarCardPreview] = useState(null);
  const [plants, setPlants] = useState([]);
  const { setisLoader } = useAuth();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password must match.");
      return;
    }
    if (!photoPreview) {
      toast.error("Please select your image");
    }

    try {
      setisLoader(true);

      // Use axios.post without the method, headers, and body manually
      const response = await axiosPrivate.post("/auth/register", data);

      // Log the full response for debugging
      console.log("Full response:", response);

      // Handle success based on the Axios response
      if (response.status === 201) {
        toast.success("User added successfully!");
        reset();
        setPhotoPreview(null);
        setDrivingLicencePreview(null);
        setAadhaarCardPreview(null);
      } else {
        throw new Error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setisLoader(false);
    }

    reset();
    setPhotoPreview(null);
    setDrivingLicencePreview(null);
    setAadhaarCardPreview(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleImageFileChange = (fieldName, event, setPreview) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axiosPrivate.get("plant/getAllPlants");
        setPlants(response.data); // Set the list of plants in state
      } catch (error) {
        toast.error("Failed to fetch plants. Please try again.");
      }
    };
    fetchPlants();
  }, []);

  return (
    <div className="container1">
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: "20px",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Add User
      </h1>
      <div className="profile-photo">
        <img src={photoPreview || profile} alt="User Photo" />
        <label className="edit-icon-label">
          <input
            type="file"
            {...register("photo", { required: true })}
            onChange={(event) =>
              handleImageFileChange("photo", event, setPhotoPreview)
            }
            style={{ display: "none" }}
          />
          <span
            className="edit-icon"
            role="img"
            aria-label="Edit"
            title="Edit Image"
          >
            change✏️
          </span>
        </label>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="form-group">
          <label>Full Name</label>
          <input
            {...register("fullName", { required: true })}
            className="form-control"
          />
          {errors.fullName && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            {...register("mobileNumber", { required: true })}
            className="form-control"
          />
          {errors.mobileNumber && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            id="1212"
            {...register("email", { required: true })}
            type="email"
            className="form-control"
          />
          {errors.email && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            {...register("role", { required: true })}
            className="form-control"
          >
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label>Plant</label>
          <select
            {...register("plant", { required: true })}
            className="form-control"
          >
            {plants.map((plant, index) => (
              <option key={index} value={plant.name}>
                {plant.name}
              </option>
            ))}
          </select>
          {errors.plant && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label>Aadhaar Card</label>
          <input
            type="number"
            {...register("aadhaarCard", { required: true })}
            className="form-control"
            // onChange={(event) => handleImageFileChange('aadhaarCard', event, setAadhaarCardPreview)}
          />
          {errors.aadhaarCard && (
            <span className="input-error">This field is required</span>
          )}
          {aadhaarCardPreview && (
            <img
              src={aadhaarCardPreview}
              alt="Aadhaar Card Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
          )}
        </div>

        <div className="form-group">
          <label>Driving Licence</label>
          <input
            type="text"
            {...register("drivingLicence", { required: true })}
            className="form-control"
            // onChange={(event) => handleImageFileChange('drivingLicence', event, setDrivingLicencePreview)}
          />
          {errors.drivingLicence && (
            <span className="input-error">This field is required</span>
          )}
          {drivingLicencePreview && (
            <img
              src={drivingLicencePreview}
              alt="Driving Licence Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <input
              type={passwordVisible ? "text" : "password"}
              id="1213"
              {...register("password", { required: true })}
              className="form-control"
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {errors.password && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-group">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              {...register("confirmPassword", { required: true })}
              className="form-control"
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {errors.confirmPassword && (
            <span className="input-error">This field is required</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
