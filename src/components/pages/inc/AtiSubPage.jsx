import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function AtiSubPage({ children }) {
  return (
    <div className="section">
      <div className="container">
        <Link to="/ati" className="btn btn-link px-0 mb-3">
          ← Back to ATI
        </Link>
        {children}
      </div>
    </div>
  );
}

AtiSubPage.propTypes = {
  children: PropTypes.node.isRequired,
};
