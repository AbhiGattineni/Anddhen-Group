import React from 'react'
import {useNavigate, useLocation, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ children, ...rest }) => {
  let isTestStarted = sessionStorage.getItem('isTestStarted');
  let navigate = useNavigate();
  let location = useLocation();

  if (isTestStarted !== 'true') {
    navigate('/test', { state: { from: location } });
    return null;
  }

  return <Outlet />;
}
