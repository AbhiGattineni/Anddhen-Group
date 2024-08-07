import React, { useState } from 'react';

function AddConsultantForm() {
  const initialFormData = {
    full_name: '',
    phone_number: '',
    email_id: '',
    dob: '',
    visa_status: '',
    visa_validity: '',
    btech_college: '',
    btech_percentage: '',
    btech_graduation_date: '',
    masters_college: '',
    masters_cgpa: '',
    masters_graduation_date: '',
    technologies: '',
    current_location: '',
    relocation: false,
    experience_in_us: '',
    experience_in_india: '',
    relocation_preference: '',
    passport_number: '',
    driving_licence: '',
    rate_expectations: '',
    last_4_ssn: '',
    linkedin_url: '',
    full_name_verified: '',
    visa_status_verified: '',
    visa_validity_verified: '',
    experience_in_us_verified: '',
    experience_in_india_verified: '',
    passport_number_verified: '',
    // original_resume: null,
    // consulting_resume: null,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const formatErrorMessages = (errors) => {
    return Object.entries(errors).map(
      ([field, messages]) => `${field}: ${messages.join(', ')}`
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'file') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e.target.files[0],
      }));
    } else if (name === 'technologies') {
      // Convert the comma-separated values into a JSON array
      const technologiesArray = value.split(",").map((item) => item.trim());
      setFormData((prevState) => ({
        ...prevState,
        [name]: JSON.stringify(technologiesArray),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessages([]);
    setIsSubmitted(false);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'technologies') {
        // Ensure the technologies data remains a JSON string
        submitData.append(key, formData[key]);
      } else {
        // Convert other data to string as required
        submitData.append(key, String(formData[key]));
      }
    });

    const jsonPayload = JSON.stringify({
      ...formData,
      original_resume: formData.original_resume
        ? formData.original_resume.name
        : null,
      consulting_resume: formData.consulting_resume
        ? formData.consulting_resume.name
        : null,
    });
    fetch(`${API_BASE_URL}/api/consultant/`, {
      method: 'POST',
      body: jsonPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(formatErrorMessages(err));
          });
        }
        return response.json();
      })
      .then((data) => {
        setIsSubmitted(true);
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessages(error.message.split(','));
      });
  };

  const renderVerificationRadioButtons = (fieldName) => (
    <>
      <div>
        <input
          type="radio"
          className="form-check-input"
          id={`${fieldName}Yes`}
          name={fieldName}
          value="yes"
          onChange={handleChange}
          checked={formData[fieldName] === 'yes'}
        />
        <label htmlFor={`${fieldName}Yes`}>Yes</label>
      </div>
      <div>
        <input
          type="radio"
          className="form-check-input"
          id={`${fieldName}No`}
          name={fieldName}
          value="no"
          onChange={handleChange}
          checked={formData[fieldName] === 'no'}
        />
        <label htmlFor={`${fieldName}No`}>No</label>
      </div>
    </>
  );

  return (
    <>
      {isSubmitted && (
        <div className="alert alert-success" role="alert">
          Data posted successfully!
        </div>
      )}
      {errorMessages.length > 0 && (
        <div className="alert alert-danger">
          {errorMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              name="full_name"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              name="phone_number"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="email_id">Email ID</label>
            <input
              type="email"
              className="form-control"
              id="email_id"
              name="email_id"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dob"
              name="dob"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="visa_status">Visa Status</label>
            <select
              className="form-control"
              id="visa_status"
              name="visa_status"
              onChange={handleChange}
            >
              <option value="">Select Visa Status</option>
              <option value="OPT">OPT</option>
              <option value="CPT">CPT</option>
              <option value="H1B">H1B</option>
              <option value="H4 EAD">H4 EAD</option>
            </select>
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="visa_validity">Visa Validity</label>
            <input
              type="date"
              className="form-control"
              id="visa_validity"
              name="visa_validity"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Education Details Section */}
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="btech_college">BTech College</label>
            <input
              type="text"
              className="form-control"
              id="btech_college"
              name="btech_college"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="btech_percentage">BTech Percentage</label>
            <input
              type="number"
              className="form-control"
              id="btech_percentage"
              name="btech_percentage"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="btech_graduation_date">BTech Graduation Date</label>
            <input
              type="date"
              className="form-control"
              id="btech_graduation_date"
              name="btech_graduation_date"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="masters_college">Masters College</label>
            <input
              type="text"
              className="form-control"
              id="masters_college"
              name="masters_college"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="masters_cgpa">Masters CGPA</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="masters_cgpa"
              name="masters_cgpa"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="masters_graduation_date">
              Masters Graduation Date
            </label>
            <input
              type="date"
              className="form-control"
              id="masters_graduation_date"
              name="masters_graduation_date"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="form-group">
          <label htmlFor="technologies">Technologies (comma-separated)</label>
          <textarea
            className="form-control"
            id="technologies"
            name="technologies"
            onChange={handleChange}
          />
        </div>

        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="current_location">Current Location</label>
            <input
              type="text"
              className="form-control"
              id="current_location"
              name="current_location"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="relocation">Willing to Relocate?</label>
            <div>
              <input
                type="radio"
                className="form-check-input"
                id="relocationYes"
                name="relocation"
                value="yes"
                onChange={handleChange}
              />
              <label htmlFor="relocationYes">Yes</label>
            </div>
            <div>
              <input
                type="radio"
                className="form-check-input"
                id="relocationNo"
                name="relocation"
                value="no"
                onChange={handleChange}
              />
              <label htmlFor="relocationNo">No</label>
            </div>
          </div>
        </div>
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="experience_in_us">Experience in US</label>
            <input
              type="text"
              className="form-control"
              id="experience_in_us"
              name="experience_in_us"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 form-group mb-3">
            <label htmlFor="experience_in_india">Experience in India</label>
            <input
              type="text"
              className="form-control"
              id="experience_in_india"
              name="experience_in_india"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="relocation_preference">
            Relocation Preference (Cities and States)
          </label>
          <textarea
            className="form-control"
            id="relocation_preference"
            name="relocation_preference"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Personal Details Section */}
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="passport_number">Passport Number</label>
            <input
              type="text"
              className="form-control"
              id="passport_number"
              name="passport_number"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="driving_licence">Driving Licence</label>
            <input
              type="text"
              className="form-control"
              id="driving_licence"
              name="driving_licence"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="rate_expectations">Rate Expectations</label>
            <input
              type="text"
              className="form-control"
              id="rate_expectations"
              name="rate_expectations"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="last_4_ssn">Last 4 Digits of SSN</label>
            <input
              type="text"
              className="form-control"
              id="last_4_ssn"
              name="last_4_ssn"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="linkedin_url">LinkedIn URL</label>
            <input
              type="url"
              className="form-control"
              id="linkedin_url"
              name="linkedin_url"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Resume Fields Section */}
        <div className="form-group" style={{ margin: '10px 0' }}>
          <label
            htmlFor="original_resume"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Original Resume
          </label>
          <input
            type="file"
            className="form-control-file"
            id="original_resume"
            name="original_resume"
            onChange={handleChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              transition:
                'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            }}
          />
        </div>
        <div className="form-group" style={{ margin: '10px 0' }}>
          <label
            htmlFor="consulting_resume"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Consulting Resume
          </label>
          <input
            type="file"
            className="form-control-file"
            id="consulting_resume"
            name="consulting_resume"
            onChange={handleChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              transition:
                'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            }}
          />
        </div>
        <div className="row my-5">
          {/* Verification fields */}
          <div className="col-md-6 form-group mb-3">
            <label>Full Name Verified</label>
            {renderVerificationRadioButtons('full_name_verified')}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Visa Status Verified</label>
            {renderVerificationRadioButtons('visa_status_verified')}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Visa Validity Verified</label>
            {renderVerificationRadioButtons('visa_validity_verified')}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Experience in US Verified</label>
            {renderVerificationRadioButtons('experience_in_us_verified')}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Experience in India Verified</label>
            {renderVerificationRadioButtons('experience_in_india_verified')}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Passport Number Verified</label>
            {renderVerificationRadioButtons('passport_number_verified')}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}

export default AddConsultantForm;
