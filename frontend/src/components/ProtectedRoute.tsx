import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// component die checkt of user ingelogd is
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // wacht tot auth geladen is
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl">Laden...</p>
      </div>
    );
  }

  // niet ingelogd? redirect naar login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
