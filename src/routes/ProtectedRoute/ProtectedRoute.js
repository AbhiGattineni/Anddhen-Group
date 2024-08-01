import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "src/components/atoms/LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const storedEmptyFields = localStorage.getItem("empty_fields");
  const navigate = useNavigate();

  useEffect(() => {
    if (storedEmptyFields?.length) {
      navigate("/profile");
    }
  }, [storedEmptyFields, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    if (location.pathname !== '/profile') {
      localStorage.setItem("preLoginPath", location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
