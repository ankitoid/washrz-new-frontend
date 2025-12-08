import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import "../style/plant.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosPrivate } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Plant = () => {
  // State for modal visibility and form data
  const [showModal, setShowModal] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [plantAdded, setPlantAdded] = useState(false);
  const [loader, setLoader] = useState(false);

  const [plants, setPlants] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      // const response = await fetch(
      //   `https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`
      // );
      // const data = await response.json();
      // setResults(data);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`
        );

        // Check for HTTP error responses
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    }
  };

  // Handle modal open and close
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Fetch all plants from the backend when the component mounts
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoader(true);
        const response = await axiosPrivate.get("plant/getAllPlants");
        setPlants(response.data); // Set the list of plants in state
        setLoader(false);
      } catch (error) {
        toast.error("Failed to fetch plants. Please try again.");
      }
    };
    fetchPlants();
  }, [plantAdded]);

  // Handle form submission to add a new plant
  const handleAddPlant = async () => {
    try {
      const formattedPlantName =
        plantName.charAt(0).toUpperCase() + plantName.slice(1);

      // Check if both plant name and location are provided
      if (!formattedPlantName || !selectedLocation) {
        toast.error("Please provide both plant name and location.");
        return;
      }

      // Make an API request to add a new plant with the selected location
      const response = await axiosPrivate.post("plant/addPlant", {
        name: formattedPlantName,
        location: selectedLocation, // Send location as well
      });

      if (response.status === 201) {
        toast.success("Plant added successfully!");
        handleClose();
        setPlantName(""); // Clear inputs after submission
        setSelectedLocation(""); // Clear the selected location
        setPlantAdded((prev) => !prev);
      }
    } catch (error) {
      toast.error("Failed to add plant. Please try again.");
    }
  };

  // Handle plant deletion
  const handleDeletePlant = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plant?"
    );

    if (!confirmDelete) {
      return; // Exit function if user does not confirm
    }

    try {
      const response = await axiosPrivate.delete(`plant/deletePlant/${id}`);
      if (response.status === 200) {
        toast.success("Plant deleted successfully!");
        setPlantAdded((prev) => !prev); // Toggle plantAdded state to update list
      }
    } catch (error) {
      toast.error("Failed to delete plant. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-12">
            <h1 className="text-center">All Plants</h1>
          </div>
        </div>
        {/* Display the list of plants dynamically */}
        {plants.length > 0 ? (
          plants.map((plant) => (
            <div className="row my-2" key={plant._id}>
              <div className="col-12">
                <div className="card shadow bg-white position-relative">
                  {/* Top-right delete icon */}
                  <div className="delete-icon-container">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDeletePlant(plant._id)}
                      style={{ cursor: "pointer" }} // Additional styling
                    />
                  </div>
                  <div className="card-body">
                    <Link
                      to={{
                        pathname: "/plantuser",
                      }}
                      state={{ plantName: plant.name }}
                    >
                      <div
                        className="card-title h3 fw-bold"
                        style={{ color: "teal" }}
                      >
                        {plant.name}
                      </div>
                    </Link>
                    <div className="card-text mt-3">
                      <div className="row">
                        <div className="col-md-4">
                          <h5>Plant Location:</h5> {plant.location}
                        </div>
                        <div className="col-md-4">
                          <h5>Plant Manager:</h5> 1
                        </div>
                        <div className="col-md-4">
                          <h5>Rider:</h5> 3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center h1 mt-5">No plants available</div>
        )}

        <div
          className="mt-5"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button style={{ backgroundColor: "teal" }} onClick={handleShow}>
            Add Plant
          </Button>
        </div>

        <Modal show={loader}>
          <Modal.Header>Loading Plants</Modal.Header>
          <Modal.Body>
            <Spinner animation="border" variant="info" />
          </Modal.Body>
        </Modal>

        {/* Modal for adding a new plant */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Plant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formPlantName">
                <Form.Label>Plant Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter plant name"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                />
              </Form.Group>
            </Form>

            {/* Location search section */}
            <div>
              <h2>Search Location for plant</h2>
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search a location..."
                style={{ width: "300px", padding: "10px" }}
              />
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {results.map((result, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedLocation(result.display_name); // Update selected location
                      setQuery(result.display_name); // Also update query to show in input
                      setResults([]); // Clear the results after selection
                    }}
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Display selected location */}
            {selectedLocation && (
              <div style={{ marginTop: "10px" }}>
                <strong>Selected Location: </strong> {selectedLocation}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddPlant}>
              Save Plant
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Plant;
