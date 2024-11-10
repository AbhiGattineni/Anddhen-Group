import React from 'react';
import PropTypes from 'prop-types';

function ConsultantCard({ consultant, onViewDetails, isDeleting, onDelete }) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // Function to render verification badge
  const renderVerifiedBadge = (verified) => {
    const badgeStyle = {
      display: 'inline-block',
      fontSize: '75%',
      fontWeight: '700',
      lineHeight: '1',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      verticalAlign: 'baseline',
      borderRadius: '.25rem',
      marginLeft: '5px',
      color: '#fff',
    };

    return (
      <span style={badgeStyle}>
        {verified ? (
          <i className="bi bi-check-circle-fill text-success"> verified</i>
        ) : (
          <i className="bi bi-x-circle-fill text-danger"> unverified</i>
        )}
      </span>
    );
  };
  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this consultant?'
    );
    if (confirmed) {
      onDelete(consultant.id);
    }
  };

  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100 position-relative">
        <div className="position-absolute top-0 end-0 m-2">
          <button className="btn btn-danger btn-sm" onClick={handleDeleteClick}>
            {isDeleting ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-trash-fill"></i>
            )}
          </button>
        </div>
        <div className="card-body">
          <h5 className="card-title">
            {consultant.full_name}
            {renderVerifiedBadge(consultant.full_name_verified)}
          </h5>
          <p className="card-text">
            <strong>Phone:</strong> {consultant.phone_number}
            <br />
            <strong>Email:</strong> {consultant.email_id}
            <br />
            <strong>DOB:</strong> {consultant.dob}
            <br />
            <strong>Visa Status:</strong> {consultant.visa_status}
            {renderVerifiedBadge(consultant.visa_status_verified)}
            <br />
            <strong>Current Location:</strong> {consultant.current_location}
            <br />
            <strong>Experience in US:</strong> {consultant.experience_in_us}
            {renderVerifiedBadge(consultant.experience_in_us_verified)}
            <br />
            <strong>LinkedIn:</strong>{' '}
            <a
              href={consultant.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Profile
            </a>
            <br />
            <div className="d-inline-flex flex-wrap gap-2 mt-2">
              <div className="border border-2 border-danger bg-danger bg-opacity-10 rounded px-2 w-0 text-center">
                <a
                  className="fs-1 text-danger text-decoration-none"
                  href={`${API_BASE_URL}${consultant.original_resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-filetype-pdf"></i>
                  <p
                    className="m-0"
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                  >
                    original_resume
                  </p>
                </a>
              </div>
              <div className="border border-2 border-danger bg-danger bg-opacity-10 rounded px-2 w-0 text-center">
                <a
                  className="fs-1 text-danger text-decoration-none"
                  href={`${API_BASE_URL}${consultant.consulting_resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-filetype-pdf"></i>
                  <p
                    className="m-0"
                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                  >
                    consulting_resume
                  </p>
                </a>
              </div>
            </div>
          </p>
        </div>
        <div className="card-footer">
          <button
            className="btn btn-primary"
            onClick={() => onViewDetails(consultant)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
ConsultantCard.propTypes = {
  consultant: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ConsultantCard;
