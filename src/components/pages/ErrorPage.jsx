import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = ({
  errorCode = '404',
  title = 'Oops! Page not found.',
  message = 'The page you’re looking for doesn’t exist.',
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">{errorCode}</h1>
        <p className="fs-3">
          <span className="text-danger"></span> {title}
        </p>
        <p className="lead">{message}</p>
        <Link to="/" className="btn btn-primary me-3">
          Go Home
        </Link>
        <button onClick={goBack} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  errorCode: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ErrorPage;
