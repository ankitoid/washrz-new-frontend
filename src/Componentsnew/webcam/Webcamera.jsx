import React, { useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { MdCameraswitch } from "react-icons/md";
import { IoMdReverseCamera } from "react-icons/io";
// import { BsFillLightbulbFill } from "react-icons/bs";
import { FaFileUpload } from "react-icons/fa";
import { IoFlashSharp } from "react-icons/io5";

const Webcamera = ({ onCapture }) => {
  const [uri, setUri] = useState(null); // Captured photo URI
  const [error, setError] = useState(null); // Camera error
  const [isCameraVisible, setCameraVisible] = useState(true); // Camera visibility
  const [cameraMode, setCameraMode] = useState("environment"); // "environment" for back, "user" for front
  const [flashOn, setFlashOn] = useState(false); // Flashlight state

  const fileInputRef = useRef(null);

  const handleTakePhoto = (dataUri) => {
    setUri(dataUri); // Set the captured image
    setCameraVisible(false); // Hide the camera after photo capture

    // Convert base64 data URI to Blob
    fetch(dataUri)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured-image.jpg", {
          type: "image/jpeg",
        });
        onCapture(file); // Pass the Blob file to the parent component
      });
  };

  const handleCameraError = (error) => {
    setError("Unable to access camera. Please check permissions.");
    console.error("Camera error:", error);
  };

  const handleRetake = () => {
    setUri(null); // Clear the captured image
    setCameraVisible(true); // Show the camera again
  };

  const toggleCameraMode = () => {
    setCameraMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setUri(e.target.result); // Set the image URI for preview
  //       onCapture(file); // Pass the uploaded file to the parent component
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUri(e.target.result); // Set the image preview URI
        setCameraVisible(false); // Hide the camera after file upload
      };
      reader.readAsDataURL(file); // Read file as data URL
      onCapture(file); // Pass the uploaded file to the parent component
    }
  };

  const toggleFlashlight = () => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraMode } }) // Request camera access
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities(); // Get device capabilities

          if (capabilities.torch) {
            // If torch capability is available
            track.applyConstraints({
              advanced: [{ torch: !flashOn }], // Toggle torch
            });
            setFlashOn(!flashOn);
          } else {
            alert("Torch/flashlight is not supported on this device.");
          }
        })
        .catch((error) => {
          console.error("Flashlight error:", error);
          alert("Failed to toggle flashlight: " + error.message);
        });
    } else {
      alert("Flashlight functionality is not supported in this browser.");
    }
  };

  const handleIconClick = () => {
    // Trigger the file input click programmatically
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Show camera or captured image based on state */}
      {isCameraVisible ? (
        <div>
          <Camera
            idealFacingMode={
              cameraMode === "environment" ? "environment" : "user"
            } // Toggle camera mode
            height={200}
            onTakePhoto={handleTakePhoto}
            onCameraError={handleCameraError}
          />
          <div>
            <MdCameraswitch
              onClick={toggleCameraMode}
              style={{ marginTop: "10px", fontSize: "40px", cursor: "pointer" }}
            />
            <IoFlashSharp
              onClick={toggleFlashlight}
              style={{
                marginTop: "10px",
                fontSize: "40px",
                cursor: "pointer",
                color: flashOn ? "yellow" : "black",
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef} // Reference to the input
              style={{ display: "none" }} // Hide the input field
            />
            <FaFileUpload
              onClick={handleIconClick} // Trigger file input click
              style={{ marginTop: "10px", fontSize: "40px", cursor: "pointer" }}
            />
          </div>
        </div>
      ) : (
        <div>
          <img height={200} src={uri} alt="Captured" />
          <br />
          <IoMdReverseCamera
            onClick={handleRetake}
            style={{ marginTop: "10px", fontSize: "40px", cursor: "pointer" }}
          />
        </div>
      )}
    </div>
  );
};

export default Webcamera;
