import React from "react";
import "./NewSpinner.css"; // Import the CSS for spinner

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p>Updating Status...</p>
    </div>
  );
};

export default Spinner;
