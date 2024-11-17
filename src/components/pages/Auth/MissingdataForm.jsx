import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MissingDataForm = ({ missingData, onCompleted }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors for a field when it's changed
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation: Check for empty fields
    let newErrors = {};
    Object.keys(missingData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    if (formData.phone_number && formData.phone_number.length !== 10) {
      newErrors.phone_number = 'Phone number must be 10 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the form submission if there are errors
    }

    onCompleted(formData);
  };

  return (
    <div className="missing-data-form container mt-4">
      <form onSubmit={handleSubmit}>
        {Object.keys(missingData).map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.replace(/_/g, ' ')}
            </label>
            {field === 'phone_country_code' ? (
              <select
                className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                id={field}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Country Code</option>
                <option value="+1">+1 (USA)</option>
                <option value="+91">+91 (India)</option>
              </select>
            ) : (
              <input
                type="text"
                className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                id={field}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                required
              />
            )}
            {errors[field] && (
              <div className="invalid-feedback">{errors[field]}</div>
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
MissingDataForm.propTypes = {
  missingData: PropTypes.object.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

export default MissingDataForm;
