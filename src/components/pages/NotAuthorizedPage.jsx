import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorizedPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">403</h1>
        <p className="fs-3">
          <span className="text-danger">Access Denied</span> You do not have
          permission to view this page.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
