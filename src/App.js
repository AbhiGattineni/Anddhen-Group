import React from 'react';
import PropTypes from 'prop-types'; // Add this line
import './App.css';
import Navbar from './components/organisms/Navbar';
import Footer from './components/organisms/Footer';

export function MainLayout({ children, logout }) {
  return (
    <div>
      <Navbar logout={logout ? true : false} />
      {children}
      <Footer />
    </div>
  );
}
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  logout: PropTypes.bool,
};
