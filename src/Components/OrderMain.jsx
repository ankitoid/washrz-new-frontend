import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import ReadyForDelivery from "./ReadyForDelivery";
import Order from "./Order";
import Deliverd from "./Deliverd";
import Processing from "./Processing";
import OrderReschedule from "./Riderpages/OrderReschedule";

const OrderMain = () => {
  const [activeTab, setActiveTab] = useState("Orders");

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
        <Tab eventKey="Orders" title="Orders"></Tab>
        <Tab eventKey="Processing" title="Processing"></Tab>
        <Tab eventKey="Ready For Delivery" title="Ready For Delivery"></Tab>
        <Tab eventKey="Rescheduled" title="Rescheduled"></Tab>
        <Tab eventKey="Deliveries" title="Deliveries"></Tab>
      </Tabs>
      {activeTab === "Orders" && <Order setActiveTab={setActiveTab} />}
      {activeTab === "Processing" && <Processing />}
      {activeTab === "Ready For Delivery" && <ReadyForDelivery />}
      {activeTab === "Rescheduled" && <OrderReschedule />}
      {activeTab === "Deliveries" && <Deliverd />}
    </div>
  );
};

export default OrderMain;
