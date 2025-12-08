import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import Deliver from "./Deliver";
import Completed from "./Completed";
import OrderReschedule from "./OrderReschedule";

const Deliveries = () => {
  const [activeTab, setActiveTab] = useState("Deliveries");

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
        <Tab eventKey="Deliveries" title="Ready For Delivery"></Tab>
        {/* <Tab eventKey="Completed" title="Completed"></Tab> */}
        {/* <Tab eventKey="Rescheduled" title="Rescheduled"></Tab> */}
      </Tabs>
      {activeTab === "Deliveries" && <Deliver setActiveTab={setActiveTab} />}
      {/* {activeTab === "Completed" && <Completed />} */}
      {/* {activeTab === "Rescheduled" && <OrderReschedule />} */}
    </div>
  );
};

export default Deliveries;
