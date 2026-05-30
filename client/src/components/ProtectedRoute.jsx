import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const userRole = user.user?.role || user.role;
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
