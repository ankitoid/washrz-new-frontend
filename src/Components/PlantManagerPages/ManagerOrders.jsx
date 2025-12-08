import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import Intransit from "./Intransit";
import Processing from "./Processing";
import RiderAllocation from "./RiderAllocation";
const ManagerOrders = () => {
  const [activeTab, setActiveTab] = useState("intransit");

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
        <Tab eventKey="intransit" title="Intransit"></Tab>
        <Tab eventKey="Processing" title="Processing"></Tab>
        <Tab eventKey="RiderAllocation" title="Rider Allocation"></Tab>
      </Tabs>

      {activeTab === "intransit" && <Intransit setActiveTab={setActiveTab} />}
      {activeTab === "Processing" && <Processing setActiveTab={setActiveTab} />}
      {activeTab === "RiderAllocation" && (
        <RiderAllocation setActiveTab={setActiveTab} />
      )}
    </div>
  );
};

export default ManagerOrders;
