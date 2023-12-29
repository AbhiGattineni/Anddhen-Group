import React, { useState, useEffect } from "react";

function ConsultantDetailsModal({ show, onHide, consultant, onSave }) {
  const [isEditable, setIsEditable] = useState(false);
  const [editedConsultant, setEditedConsultant] = useState({ ...consultant });

  useEffect(() => {
    setEditedConsultant({ ...consultant });
  }, [consultant]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEditedConsultant((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setEditedConsultant((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSaveEdits = () => {
    onSave(editedConsultant);
    setIsEditable(false);
  };

  if (!consultant) return null;

  return (
    <div
      className={`modal ${show ? "d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Consultant Details</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* Input fields for consultant attributes */}
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                className="form-control"
                name="full_name"
                value={editedConsultant.full_name}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                className="form-control"
                name="phone_number"
                value={editedConsultant.phone_number}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Email ID:</label>
              <input
                type="email"
                className="form-control"
                name="email_id"
                value={editedConsultant.email_id}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={editedConsultant.dob}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Visa Status:</label>
              <input
                type="text"
                className="form-control"
                name="visa_status"
                value={editedConsultant.visa_status}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Visa Validity:</label>
              <input
                type="date"
                className="form-control"
                name="visa_validity"
                value={editedConsultant.visa_validity}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>BTech College:</label>
              <input
                type="text"
                className="form-control"
                name="btech_college"
                value={editedConsultant.btech_college}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>BTech Percentage:</label>
              <input
                type="number"
                className="form-control"
                name="btech_percentage"
                value={editedConsultant.btech_percentage}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>BTech Graduation Date:</label>
              <input
                type="date"
                className="form-control"
                name="btech_graduation_date"
                value={editedConsultant.btech_graduation_date}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Masters College:</label>
              <input
                type="text"
                className="form-control"
                name="masters_college"
                value={editedConsultant.masters_college}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Masters CGPA:</label>
              <input
                type="number"
                className="form-control"
                name="masters_cgpa"
                value={editedConsultant.masters_cgpa}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Masters Graduation Date:</label>
              <input
                type="date"
                className="form-control"
                name="masters_graduation_date"
                value={editedConsultant.masters_graduation_date}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Technologies:</label>
              <input
                type="text"
                className="form-control"
                name="technologies"
                value={editedConsultant.technologies}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Current Location:</label>
              <input
                type="text"
                className="form-control"
                name="current_location"
                value={editedConsultant.current_location}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Relocation:</label>
              <input
                type="checkbox"
                className="form-control"
                name="relocation"
                checked={editedConsultant.relocation}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Experience in US:</label>
              <input
                type="text"
                className="form-control"
                name="experience_in_us"
                value={editedConsultant.experience_in_us}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Experience in India:</label>
              <input
                type="text"
                className="form-control"
                name="experience_in_india"
                value={editedConsultant.experience_in_india}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Relocation Preference:</label>
              <input
                type="text"
                className="form-control"
                name="relocation_preference"
                value={editedConsultant.relocation_preference}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Passport Number:</label>
              <input
                type="text"
                className="form-control"
                name="passport_number"
                value={editedConsultant.passport_number}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Driving Licence:</label>
              <input
                type="text"
                className="form-control"
                name="driving_licence"
                value={editedConsultant.driving_licence}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Rate Expectations:</label>
              <input
                type="text"
                className="form-control"
                name="rate_expectations"
                value={editedConsultant.rate_expectations}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Last 4 SSN:</label>
              <input
                type="text"
                className="form-control"
                name="last_4_ssn"
                value={editedConsultant.last_4_ssn}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL:</label>
              <input
                type="url"
                className="form-control"
                name="linkedin_url"
                value={editedConsultant.linkedin_url}
                onChange={handleEditChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Full Name Verified:</label>
              <div>
                <input
                  type="radio"
                  name="full_name_verified"
                  value={1}
                  checked={editedConsultant.full_name_verified === true}
                  onChange={handleEditChange}
                />{" "}
                Yes
                <input
                  type="radio"
                  name="full_name_verified"
                  value={0}
                  checked={editedConsultant.full_name_verified === false}
                  onChange={handleEditChange}
                />{" "}
                No
              </div>
            </div>
            <div className="form-group">
              <label>Visa Status Verified:</label>
              <div>
                <input
                  type="radio"
                  name="visa_status_verified"
                  value={1}
                  checked={editedConsultant.visa_status_verified === true}
                  onChange={handleEditChange}
                />{" "}
                Yes
                <input
                  type="radio"
                  name="visa_status_verified"
                  value={0}
                  checked={editedConsultant.visa_status_verified === false}
                  onChange={handleEditChange}
                />{" "}
                No
              </div>
            </div>
            <div className="form-group">
              <label>Visa Validity Verified:</label>
              <div>
                <input
                  type="radio"
                  name="visa_validity_verified"
                  value={1}
                  checked={editedConsultant.visa_validity_verified === true}
                  onChange={handleEditChange}
                />{" "}
                Yes
                <input
                  type="radio"
                  name="visa_validity_verified"
                  value={0}
                  checked={editedConsultant.visa_validity_verified === false}
                  onChange={handleEditChange}
                />{" "}
                No
              </div>
            </div>
            <div className="form-group">
              <label>Relocation:</label>
              <div>
                <input
                  type="radio"
                  name="relocation"
                  value={1}
                  checked={editedConsultant.relocation === true}
                  onChange={handleEditChange}
                />{" "}
                Yes
                <input
                  type="radio"
                  name="relocation"
                  value={0}
                  checked={editedConsultant.relocation === false}
                  onChange={handleEditChange}
                />{" "}
                No
              </div>
            </div>
            <div className="form-group">
              <label>Experience in US Verified:</label>
              <div>
                <input
                  type="radio"
                  name="experience_in_us_verified"
                  value={1}
                  checked={editedConsultant.experience_in_us_verified === true}
                  onChange={handleEditChange}
                />{" "}
                Yes
                <input
                  type="radio"
                  name="experience_in_us_verified"
                  value={0}
                  checked={editedConsultant.experience_in_us_verified === false}
                  onChange={handleEditChange}
                />{" "}
                No
              </div>
            </div>
            <div className="form-group">
              <label>Passport Number Verified:</label>
              <div>
                <input
                  type="radio"
                  name="passport_number_verified"
                  value={1}
                  checked={editedConsultant.passport_number_verified === true}
                  onChange={handleEditChange}
                />{" "}
                Yes
                <input
                  type="radio"
                  name="passport_number_verified"
                  value={0}
                  checked={editedConsultant.passport_number_verified === false}
                  onChange={handleEditChange}
                />{" "}
                No
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {/* Edit and Save buttons */}
            {!isEditable && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsEditable(true)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={onHide}
            >
              Close
            </button>
            {isEditable && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSaveEdits}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantDetailsModal;
