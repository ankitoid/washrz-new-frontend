import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
// import Header from "./Components/Header";
import Pickups from "./Components/Pickups";
import CustomerDetails from "./Components/CustomerDetails";
import Plant from "./Components/Plant";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import BillCart from "./Components/BillCart";
import Protected from "./Components/Protected";
import AddUser from "./Components/AddUser";
import UserListing from "./Components/UserListing";
import AboutUser from "./Components/AboutUser";
import Login from "./Components/Login";
import useAuth from "./hooks/useAuth";
import RequireAuth from "./Components/RequireAuth";
import Unauthorized from "./Components/Unauthorized";
import { useEffect } from "react";
import useRefreshToken from "./hooks/useRefreshToken";
import { getProfile } from "./utills/Api";
import CustomLoader from "./Components/CustomLoader";
import OrderMain from "./Components/OrderMain";
import Deliveries from "./Components/Riderpages/Deliveries";
import ManagerOrders from "./Components/PlantManagerPages/ManagerOrders";
import PlantUsers from "./Components/PlantUsers";
import PickupRiderAllocation from "./Components/PlantManagerPages/PickupRiderAllocation";
import Layout from "./Components/Layout";
import LiveDelivery from "./Components/LiveDelivery";
import SheduledDelivery from "./Components/SheduledDelivery";
import Cancelled from "./Components/Cancelled";
import Rescheduled from "./Components/Riderpages/Rescheduled";
import Order from "./Components/Order";
import Processing from "./Components/Processing";
import ReadyForDelivery from "./Components/ReadyForDelivery";
import OrderReschedule from "./Components/Riderpages/OrderReschedule";
import Deliverd from "./Components/Deliverd";
import Deliver from "./Components/Riderpages/Deliver";
import Pickup from "./Components/Riderpages/Pickup";
import Documents from "./Components/Documents";
import RiderDocuments from "./Components/Riderpages/RiderDocuments";
import EditOrder from "./Componentsnew/Order/EditOrder";

const App = () => {
  const { setAuth, auth, isLoader, setisLoader } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    getProfile(setAuth, setisLoader, navigate);
  }, []);

  const refresh = useRefreshToken();
  const { currObj } = useAuth();
  if (isLoader) {
    return <CustomLoader />;
  }

  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Unauthorized />} />
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            {/* <Route path="/pickups" element={<Pickups />} /> */}
            {/* <Route path="/order" element={<OrderMain />} /> */}
            <Route path="/customerdetails" element={<CustomerDetails />} />
            {/* <Route path="/plant" element={<Plant />} /> */}
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/userlisting" element={<UserListing />} />
            <Route path="/plantuser" element={<PlantUsers />} />
            <Route path="/aboutuser" element={<AboutUser />} />
            <Route path="/live" element={<LiveDelivery />} />
            <Route path="/SheduledDelivery" element={<SheduledDelivery />} />
            <Route path="/Cancelled" element={<Cancelled />} />
            <Route path="/Rescheduled" element={<Rescheduled />} />
            <Route path="/Order" element={<Order />} />
            <Route path="/EditOrder/:id" element={<EditOrder />} />
            <Route path="/Processing" element={<Processing />} />
            <Route path="/ReadyForDelivery" element={<ReadyForDelivery />} />
            <Route path="/OrderReschedule" element={<OrderReschedule />} />
            <Route path="/Deliverd" element={<Deliverd />} />
            <Route path="/Documents" element={<Documents />} />
            <Route
              path="/Product-Bill"
              element={
                <Protected currObj={currObj}>
                  <BillCart />
                </Protected>
              }
            />
          </Route>
          <Route element={<RequireAuth allowedRoles={["rider"]} />}>
            <Route path="/rider/live" element={<Pickup />} />
            {/* <Route path="/rider/pickups" element={<Pickups />} /> */}
            <Route path="/rider/order" element={<OrderMain />} />
            <Route path="/rider/aboutuser" element={<AboutUser />} />
            <Route path="/rider/Deliveries" element={<Deliver />} />
            <Route path="/rider/aboutuser" element={<AboutUser />} />
            <Route path="/rider/Documents" element={<RiderDocuments />} />
            <Route
              path="/rider/Product-Bill"
              element={
                <Protected currObj={currObj}>
                  <BillCart />
                </Protected>
              }
            />
          </Route>
          <Route element={<RequireAuth allowedRoles={["plant-manager"]} />}>
            <Route path="/plantmanager/order" element={<ManagerOrders />} />
            <Route path="/plantmanager/aboutuser" element={<AboutUser />} />
            <Route
              path="/plantmanager/pickupAllocation"
              element={<PickupRiderAllocation />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};
export default App;
