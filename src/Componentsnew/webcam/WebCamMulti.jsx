import React, { useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { MdCameraswitch } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { IoFlashSharp } from "react-icons/io5";

const WebCamMulti = ({ onCapture }) => {
  const [capturedImages, setCapturedImages] = useState([]); // Array for captured photos
  const [error, setError] = useState(null); // Camera error
  const [cameraMode, setCameraMode] = useState("environment"); // "environment" for back, "user" for front
  const [flashOn, setFlashOn] = useState(false); // Flashlight state

  const fileInputRef = useRef(null);

  const handleTakePhoto = (dataUri) => {
    // Convert base64 data URI to Blob
    fetch(dataUri)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `captured-image-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const updatedImages = [...capturedImages, file];
        setCapturedImages(updatedImages);
        onCapture(updatedImages); // Pass updated images to parent
      });
  };

  const toggleCameraMode = () => {
    setCameraMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedImages = [...capturedImages, ...files];
    setCapturedImages(updatedImages);
    onCapture(updatedImages); // Pass updated images to parent
  };

  const toggleFlashlight = () => {
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraMode } })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities();

          if (capabilities.torch) {
            track.applyConstraints({
              advanced: [{ torch: !flashOn }],
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <Camera
          idealFacingMode={
            cameraMode === "environment" ? "environment" : "user"
          }
          height={200}
          onTakePhoto={handleTakePhoto}
          onCameraError={(error) => setError("Camera error: " + error.message)}
        />
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <MdCameraswitch
            onClick={toggleCameraMode}
            style={{ fontSize: "30px", cursor: "pointer", marginRight: "10px" }}
          />
          <IoFlashSharp
            onClick={toggleFlashlight}
            style={{
              fontSize: "30px",
              cursor: "pointer",
              marginRight: "10px",
              color: flashOn ? "yellow" : "black",
            }}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <FaFileUpload
            onClick={handleIconClick}
            style={{ fontSize: "30px", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Display thumbnails */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        {capturedImages.map((image, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              height={100}
              width={100}
              src={URL.createObjectURL(image)}
              alt={`Captured ${index + 1}`}
              style={{
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebCamMulti;
