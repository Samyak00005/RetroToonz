import { Navigate, useLocation } from "react-router-dom";

import { getCurrentUser } from "../../services/authService.js";

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const user = getCurrentUser();

  if (user?.role === "admin") {
    return children;
  }

  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
