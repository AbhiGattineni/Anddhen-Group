import React from 'react';
import Navbar from 'src/components/organisms/Navbar';
import Footer from 'src/components/organisms/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      {/* Navbar + content fill AT LEAST the full viewport, so the footer always
          starts at or below the 100vh fold (content-based when there's more). */}
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
