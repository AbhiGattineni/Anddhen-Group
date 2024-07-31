import React from "react";
import Navbar from "src/components/organisms/Navbar";
import Footer from "src/components/organisms/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isProtectedRoute =
    location.pathname.includes("/acs/educationconsulting") ||
    location.pathname.includes("/acs/jobapplication/parttimerportal") ||
    location.pathname.includes("/acs/jobapplication/studentportal") ||
    location.pathname.includes("/superadmin") ||
    location.pathname.includes("/superadmin/acs_consultants") ||
    location.pathname.includes("/superadmin/roleaccess") ||
    location.pathname.includes("/admin") ||
    location.pathname.includes("/profile") ||
    location.pathname.includes("/employeedashboard");

  return (
    <div>
      <Navbar logout={isProtectedRoute} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
