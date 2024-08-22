import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmptyFields = localStorage.getItem('empty_fields');
  const userRoles = useMemo(
    () => localStorage.getItem('roles')?.split(',') || [],
    []
  );

  useEffect(() => {
    if (storedEmptyFields && location.pathname !== '/profile') {
      localStorage.setItem('preLoginPath', location.pathname);
      navigate('/profile', { replace: true });
    }
  }, [storedEmptyFields, navigate, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    if (location.pathname !== '/profile') {
      localStorage.setItem('preLoginPath', location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = requiredRoles.every((role) =>
    userRoles.includes(role)
  );

  if (!hasRequiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  requiredRoles: [],
};

export default ProtectedRoute;
