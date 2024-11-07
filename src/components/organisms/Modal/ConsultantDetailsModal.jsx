import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';

function ConsultantDetailsModal({
  show,
  onHide,
  consultant,
  isUpdating,
  isEditable,
  setIsEditable,
  onSave,
}) {
  // const [isEditable, setIsEditable] = useState(false);
  const queryClient = useQueryClient();
  const [editedConsultant, setEditedConsultant] = useState({ ...consultant });
  const [filteredDescriptions, setFilteredDescriptions] = useState({});
  const [newNote, setNewNote] = useState('');
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };

  useEffect(() => {
    setEditedConsultant({ ...consultant });
  }, [consultant]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = 'unset'; // Enable scroll
    }

    // Cleanup to reset the overflow style when the component unmounts or modal is closed
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setEditedConsultant((prevState) => ({
        ...prevState,
        [name]: value === 'true' ? true : false, // Ensure the value is converted back to a boolean
      }));
      //   setEditedConsultant((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setEditedConsultant((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const { data: employers = [] } = useFetchData('employer', `/employers/`);
  const { data: recruiters = [] } = useFetchData('recruiter', `/recruiters/`);
  const { data: notesData = [] } = useFetchData(
    'status-consultant',
    `/status-consultants/`
  );
  const { mutate: addNote, isLoading } = useAddData(
    'status-consultant',
    `/status-consultants/`
  );
  useEffect(() => {
    if (editedConsultant?.id && notesData?.length) {
      const matchingDescriptions = notesData
        .filter((note) => note.consultant_id === editedConsultant.id)
        .reduce((acc, note) => {
          acc[note.id] = {
            description: note.description,
            date: note.date,
          };
          return acc;
        }, {});
      setFilteredDescriptions(matchingDescriptions);
    }
  }, [notesData, editedConsultant]);

  function handleNote(e) {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('consultant_id', editedConsultant.id);
      submitData.append('recruiter_id', editedConsultant.recruiter_id);
      submitData.append('employer_id', editedConsultant.employer_id);
      submitData.append('date', getCurrentDate());
      submitData.append('description', newNote);
      addNote(submitData, {
        onSuccess: () => {
          queryClient.invalidateQueries('status-consultant');
          setNewNote('');
        },
        onError: (error) => {
          console.error('An error occurred:', error);
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  const handleSaveEdits = () => {
    onSave(editedConsultant);
  };

  if (!consultant) return null;

  return (
    <div
      className={`modal ${show ? 'd-block' : ''}`}
      role="dialog"
      style={{
        display: show ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflowY: 'auto',
        zIndex: 1050,
      }}
    >
      <div
        className="modal-dialog modal-fullscreen"
        role="document"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          margin: 0,
        }}
      >
        <div className="modal-content" style={{ height: '100%' }}>
          <div className="modal-header">
            <h5 className="modal-title">Consultant Details</h5>
            <button
              type="button"
              className="close p-0 m-0 border border-0 bg-transparent"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            >
              <i className="bi bi-x fs-3"></i>
            </button>
          </div>
          <div className="modal-body">
            {/* Input fields for consultant attributes */}
            <form>
              <div className="row w-100">
                <div className="col-md-6 form-group">
                  <label htmlFor="employer_id">Employer</label>
                  <select
                    className="form-control"
                    id="employer_id"
                    name="employer_id"
                    value={editedConsultant.employer_id}
                    onChange={handleEditChange}
                    disabled={!isEditable}
                  >
                    <option value="">Select Employer</option>
                    {employers.map((employer) => (
                      <option key={employer.id} value={employer.id}>
                        {employer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="recruiter_id">Recruiter</label>
                  <select
                    className="form-control"
                    id="recruiter_id"
                    name="recruiter_id"
                    value={editedConsultant.recruiter_id}
                    onChange={handleEditChange}
                    disabled={!isEditable}
                  >
                    <option value="">Select Recruiter</option>
                    {recruiters.map((recruiter) => (
                      <option key={recruiter.id} value={recruiter.id}>
                        {recruiter.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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

                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
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
              </div>
              <div className="row w-100">
                <div className="col-md-6 form-group">
                  <label>Full Name Verified:</label>
                  <div>
                    <input
                      type="radio"
                      name="full_name_verified"
                      value={true}
                      checked={editedConsultant.full_name_verified === true}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name="full_name_verified"
                      value={false}
                      checked={editedConsultant.full_name_verified === false}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    No
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label>Visa Status Verified:</label>
                  <div>
                    <input
                      type="radio"
                      name="visa_status_verified"
                      value={true}
                      checked={editedConsultant.visa_status_verified === true}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name="visa_status_verified"
                      value={false}
                      checked={editedConsultant.visa_status_verified === false}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    No
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label>Visa Validity Verified:</label>
                  <div>
                    <input
                      type="radio"
                      name="visa_validity_verified"
                      value={true}
                      checked={editedConsultant.visa_validity_verified === true}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name="visa_validity_verified"
                      value={false}
                      checked={
                        editedConsultant.visa_validity_verified === false
                      }
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    No
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label>Relocation:</label>
                  <div>
                    <input
                      type="radio"
                      name="relocation"
                      value={true}
                      checked={editedConsultant.relocation === true}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name="relocation"
                      value={false}
                      checked={editedConsultant.relocation === false}
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    No
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label>Experience in US Verified:</label>
                  <div>
                    <input
                      type="radio"
                      name="experience_in_us_verified"
                      value={true}
                      checked={
                        editedConsultant.experience_in_us_verified === true
                      }
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name="experience_in_us_verified"
                      value={false}
                      checked={
                        editedConsultant.experience_in_us_verified === false
                      }
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    No
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label>Passport Number Verified:</label>
                  <div>
                    <input
                      type="radio"
                      name="passport_number_verified"
                      value={true}
                      checked={
                        editedConsultant.passport_number_verified === true
                      }
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name="passport_number_verified"
                      value={false}
                      checked={
                        editedConsultant.passport_number_verified === false
                      }
                      disabled={!isEditable}
                      onChange={handleEditChange}
                    />{' '}
                    No
                  </div>
                </div>
              </div>
              {filteredDescriptions &&
                Object.keys(filteredDescriptions).length > 0 && (
                  <div className="mt-2">
                    <h5>Notes :</h5>
                    <ul>
                      {Object.keys(filteredDescriptions).map(
                        (noteId, index) => (
                          <li key={index}>
                            <p>
                              <strong>
                                {filteredDescriptions[noteId].date}
                              </strong>{' '}
                              <br />
                              {filteredDescriptions[noteId].description}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                    <textarea
                      name="description"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add your notes here ..."
                      rows="3"
                      cols="50"
                      className="form-control shadow-sm rounded border-primary"
                      style={{ resize: 'none', padding: '10px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={handleNote}
                    >
                      {isLoading ? 'loading...' : 'Add Note'}
                    </button>
                  </div>
                )}
            </form>
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
                {isUpdating ? (
                  <>
                    <span
                      className="spinner-grow spinner-grow-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ConsultantDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  consultant: PropTypes.object.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
  setIsEditable: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ConsultantDetailsModal;
