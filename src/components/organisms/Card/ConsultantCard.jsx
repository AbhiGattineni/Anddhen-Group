import React from "react";

function ConsultantCard({ consultant, onViewDetails, onDelete }) {
  // Function to render verification badge
  const renderVerifiedBadge = (verified) => {
    const badgeStyle = {
      display: "inline-block",
      fontSize: "75%",
      fontWeight: "700",
      lineHeight: "1",
      textAlign: "center",
      whiteSpace: "nowrap",
      verticalAlign: "baseline",
      borderRadius: ".25rem",
      marginLeft: "5px",
      color: "#fff",
    };

    return (
      <span style={badgeStyle}>
        {verified ? (
          <i className="bi bi-check-circle-fill text-success">verified</i>
        ) : (
          <i className="bi bi-x-circle-fill text-danger">unverified</i>
        )}
      </span>
    );
  };
  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this consultant?"
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
            <i className="bi bi-trash-fill"></i>
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
            <strong>LinkedIn:</strong>{" "}
            <a
              href={consultant.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Profile
            </a>
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

export default ConsultantCard;
