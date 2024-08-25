import React from 'react';
import Navbar from 'src/components/organisms/Navbar';
import Footer from 'src/components/organisms/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
