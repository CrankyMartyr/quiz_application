import { Navigate } from "react-router-dom";

const PrivateRoute = ({
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
