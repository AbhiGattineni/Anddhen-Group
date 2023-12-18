import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    sessionStorage.setItem("preLoginPath", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};
