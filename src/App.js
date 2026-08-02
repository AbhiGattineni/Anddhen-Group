import React from 'react';
import PropTypes from 'prop-types'; // Add this line
import './App.css';
import Navbar from './components/organisms/Navbar';
import Footer from './components/organisms/Footer';

export function MainLayout({ children }) {
  return (
    <div>
      {/* Navbar + content fill AT LEAST the full viewport, so the footer always
          starts at or below the 100vh fold (content-based when there's more). */}
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
