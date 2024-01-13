import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          {" "}
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">The page you’re looking for doesn’t exist.</p>
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

export default ErrorPage;
