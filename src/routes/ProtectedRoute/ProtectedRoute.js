import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "src/components/atoms/LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    if(location.pathname !== '/profile'){
      localStorage.setItem("preLoginPath", location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
