import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { HashLink } from "react-router-hash-link";
import { axiosPrivate } from "../config";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const PlantUsers = () => {
  const [showAddUser, SetShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for controlling the modal
  const [selectedUserId, setSelectedUserId] = useState(null); // ID of the user to be deleted
  const location = useLocation();
  const { plantName } = location.state || {};

  // Fetch all users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPrivate.get(
          `/auth/getplantusers?plant=${plantName}`
        );
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Open the confirmation modal
  const handleShowDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  // Close the confirmation modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  // Delete a user by ID
  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/auth/deleteuser/${selectedUserId}`); // API call to delete user
      setUsers(users.filter((user) => user._id !== selectedUserId)); // Update state to remove the user
      toast.success("User deleted successfully");
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const ToggleAddUser = () => {
    SetShowAddUser(showAddUser);
  };
  console.log("Location State:", location.state);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="p-3 mx-0">
              <div className="table-responsive">
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
                  {plantName} Plant User Listing
                </h1>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Role</th>
                      <th>Plant</th>
                      <th>UserName</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>{user.plant}</td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger d-block mx-auto"
                            onClick={() => handleShowDeleteModal(user._id)} // Trigger modal on click
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HashLink to="/adduser">
            <Button style={{ backgroundColor: "teal" }} onClick={ToggleAddUser}>
              Adduser
            </Button>
          </HashLink>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlantUsers;
