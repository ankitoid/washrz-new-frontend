import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LiveDelivery from "./LiveDelivery";
import Cancelled from "./Cancelled";
import SheduledDelivery from "./SheduledDelivery";
import { useState } from "react";
import MannualPickup from "./MannualPickup";
import useAuth from "../hooks/useAuth";
import Completeorder from "./Riderpages/Completeorder";
import Rescheduled from "./Riderpages/Rescheduled";
import PickupAllocation from "./PickupAllocation";

const Pickups = () => {
  const { auth } = useAuth(); // Fetch the user's authentication details
  const [activeTab, setActiveTab] = useState("Live");
  const userRole = auth?.role; // Fetch the user role from auth
  const userPlant = auth?.plant;

  console.log(userPlant);
  console.log(userRole);
  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  // Define allowed tabs based on roles
  const allowedTabs = {
    rider: [""],
    admin: [
      "Live",
      "Scheduled",
      "Cancelled",
      "Manual",
      "PickupAllocation",
      "Rescheduled",
    ],
    plantManager: [], // No tabs for plant manager
  };

  // Get the allowed tabs for the current user role
  const userAllowedTabs = allowedTabs[userRole] || [];

  return (
    <div>
      <Tabs
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleTabSelect}
        className="mb-3 justify-content-center mt-2"
      >
        {userAllowedTabs.includes("PickupAllocation") && (
          <Tab eventKey="PickupAllocation" title="Pickup Allocation"></Tab>
        )}
        {userAllowedTabs.includes("Live") && (
          <Tab eventKey="Live" title="Live"></Tab>
        )}
        {userAllowedTabs.includes("Scheduled") && (
          <Tab eventKey="Scheduled" title="Scheduled"></Tab>
        )}
        {userAllowedTabs.includes("Completed") && (
          <Tab eventKey="Completed" title="Completed"></Tab>
        )}
        {userAllowedTabs.includes("Cancelled") && (
          <Tab eventKey="Cancelled" title="Cancelled"></Tab>
        )}
        {userAllowedTabs.includes("Manual") && (
          <Tab eventKey="Manual" title="Manual Pickup"></Tab>
        )}
        {userAllowedTabs.includes("Rescheduled") && (
          <Tab eventKey="Rescheduled" title="Rescheduled"></Tab>
        )}
      </Tabs>

      {activeTab === "PickupAllocation" &&
        userAllowedTabs.includes("PickupAllocation") && (
          <PickupAllocation setActiveTab={setActiveTab} />
        )}
      {activeTab === "Live" && userAllowedTabs.includes("Live") && (
        <LiveDelivery setActiveTab={setActiveTab} />
      )}
      {activeTab === "Scheduled" && userAllowedTabs.includes("Scheduled") && (
        <SheduledDelivery setActiveTab={setActiveTab} />
      )}
      {activeTab === "Cancelled" && userAllowedTabs.includes("Cancelled") && (
        <Cancelled />
      )}
      {activeTab === "Manual" && userAllowedTabs.includes("Manual") && (
        <MannualPickup />
      )}
      {activeTab === "Completed" && userAllowedTabs.includes("Completed") && (
        <Completeorder />
      )}
      {activeTab === "Rescheduled" &&
        userAllowedTabs.includes("Rescheduled") && <Rescheduled />}
    </div>
  );
};

export default Pickups;
