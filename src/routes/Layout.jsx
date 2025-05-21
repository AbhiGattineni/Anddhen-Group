import React from 'react';
import Navbar from 'src/components/organisms/Navbar';
import Footer from 'src/components/organisms/Footer';
import { Outlet } from 'react-router-dom';

const Layout = logout => {
  return (
    <div>
      <Navbar logout={logout.logout == false ? false : true} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
