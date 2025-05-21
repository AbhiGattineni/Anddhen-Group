import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';
import PropTypes from 'prop-types';
import { getSharedRoutes } from '../getSharedRoutes';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmptyFields = localStorage.getItem('empty_fields');

  // Extract roles from local storage
  const userRoles = useMemo(() => localStorage.getItem('roles')?.split(',') || [], []);

  useEffect(() => {
    if (storedEmptyFields && location.pathname !== '/profile') {
      localStorage.setItem('preLoginPath', location.pathname);
      navigate('/profile', { replace: true });
    }
  }, [storedEmptyFields, navigate, location.pathname]);

  if (!user && loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    if (location.pathname !== '/profile') {
      localStorage.setItem('preLoginPath', location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the superadmin role
  const isSuperAdmin = userRoles.includes('superadmin');

  // If the user is a superadmin, allow access to any route
  if (isSuperAdmin) {
    return children;
  }

  // Check if the user has the required role for the route (like "superadmin")
  if (requiredRoles.length && !requiredRoles.every(role => userRoles.includes(role))) {
    return <Navigate to="/not-authorized" replace />;
  }

  // For shared routes, check if the current path is allowed for the user
  const sharedRoutesPaths = getSharedRoutes().map(route => route.path);
  const currentPath = location.pathname.split('/').pop();

  if (sharedRoutesPaths.includes(currentPath) && !userRoles.includes(currentPath)) {
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
