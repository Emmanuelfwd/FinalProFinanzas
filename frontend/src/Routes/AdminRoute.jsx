import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!token) return <Navigate to="/login" replace />;
  if (!user || user.is_admin !== true)
    return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminRoute;
