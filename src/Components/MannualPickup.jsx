import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

function MannualPickup({}) {
  const [activeTab, setActiveTab] = useState("Live");

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };
  return (
    <div>
      <Tabs
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleTabSelect}
        className="mb-3 justify-content-center mt-2"
      >
        <Tab eventKey="Live" title="Add Live Pickup"></Tab>
        <Tab eventKey="Scheduled" title="Add Scheduled Pickup"></Tab>
      </Tabs>
      {activeTab === "Live" && <LivePickupForm />}
      {activeTab === "Scheduled" && <SchedulePickupForm />}
    </div>
  );
}

function LivePickupForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state as false
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading to true when the form is submitted
    try {
      const res = await axiosPrivate.post(`/addPickup`, data);
      reset({
        name: "",
        contact: "",
        address: "",
      });
      toast.success("Your Live Pickup is successfully added.");
      setIsLoading(false);
      console.log(res);
      // Handle success if needed
    } catch (error) {
      setIsLoading(false);
      // Handle error if needed
    }
  };

  const formStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
  };

  return (
    <Container style={formStyle}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <Form.Group controlId="name">
              <Form.Label style={{ fontWeight: "bold" }}>Name</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter name"
                isInvalid={!!errors.name}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
        />

        <Controller
          name="contact"
          control={control}
          rules={{
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid contact number",
            },
          }}
          render={({ field }) => (
            <Form.Group controlId="contact">
              <Form.Label style={{ fontWeight: "bold" }}>Contact No</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter contact number"
                isInvalid={!!errors.contact}
              />
              {errors.contactNo && (
                <Form.Control.Feedback type="invalid">
                  {errors.contact.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
        />

        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Form.Group controlId="address">
              <Form.Label style={{ fontWeight: "bold" }}>Address</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                placeholder="Enter address"
                isInvalid={!!errors.address}
                rows={4} // Adjust the number of rows as needed
              />
              {errors.address && (
                <Form.Control.Feedback type="invalid">
                  {errors.address.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
        />

        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "20px", backgroundColor: "teal" }}
          disabled={isLoading} // Disable the button when isLoading is true
        >
          Submit
          {/* {isLoading ? <Loader /> : 'Submit'} */}
        </Button>
      </Form>
    </Container>
  );
}

function SchedulePickupForm() {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading to true when the form is submitted
    try {
      const res = await axiosPrivate.post(`/addSchedulePickup`, data);
      reset({
        name: "",
        contact: "",
        address: "",
        slot: "Select a time slot",
      });
      setIsLoading(false);
      toast.success("Your Pickup is successfully Scheduled.");
      console.log(res);
      // Handle success if needed
    } catch (error) {
      setIsLoading(false);
      // Handle error if needed
    }
  };

  const formStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
  };

  return (
    <Container style={formStyle}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <Form.Group controlId="name">
              <Form.Label style={{ fontWeight: "bold" }}>Name</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter name"
                isInvalid={!!errors.name}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
        />

        <Controller
          name="contact"
          control={control}
          rules={{
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid contact number",
            },
          }}
          render={({ field }) => (
            <Form.Group controlId="contact">
              <Form.Label style={{ fontWeight: "bold" }}>Contact No</Form.Label>
              <Form.Control
                {...field}
                type="text"
                placeholder="Enter contact number"
                isInvalid={!!errors.contact}
              />
              {errors.contactNo && (
                <Form.Control.Feedback type="invalid">
                  {errors.contact.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
        />

        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Form.Group controlId="address">
              <Form.Label style={{ fontWeight: "bold" }}>Address</Form.Label>
              <Form.Control
                {...field}
                as="textarea"
                placeholder="Enter address"
                isInvalid={!!errors.address}
                rows={4} // Adjust the number of rows as needed
              />
              {errors.address && (
                <Form.Control.Feedback type="invalid">
                  {errors.address.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}
        />

        <Form.Group controlId="slot">
          <Form.Label style={{ fontWeight: "bold" }}>Time Slot</Form.Label>
          <Form.Select
            {...register("slot", { required: "Time slot is required" })}
            isInvalid={!!errors.slot}
          >
            <option value="">Select a time slot</option>
            <option value="9AM to 12PM">9AM to 12PM</option>
            <option value="1PM to 4PM">1PM to 4PM</option>
            <option value="5PM to 9PM">5PM to 9PM</option>
          </Form.Select>
          {errors.slot && (
            <Form.Control.Feedback type="invalid">
              {errors.slot.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "20px", backgroundColor: "teal" }}
          disabled={isLoading}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default MannualPickup;
