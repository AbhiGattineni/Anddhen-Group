import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="container">
      {/* Loading spinner container */}
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        {/* Bootstrap loading spinner */}
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
