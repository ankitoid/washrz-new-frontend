import { Navigate } from "react-router-dom";
const Protected = ({ currObj, children }) => {
  if (!currObj.customerName) {
    return <Navigate to="/pickups" replace />;
  }
  return children;
};
export default Protected;