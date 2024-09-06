import React from 'react';
import PropTypes from 'prop-types';

const BasicForm = ({ formData, onChange, onSubmit, errors }) => {
  return (
    <form onSubmit={onSubmit}>
      {Object.entries(formData).map(([key, value]) => (
        <div className="form-group" key={key}>
          <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
          <input
            type={key === 'email' ? 'email' : 'text'}
            className="form-control"
            name={key}
            value={value}
            onChange={onChange}
            required
          />
          {errors[key] && <div className="text-danger">{errors[key]}</div>}
        </div>
      ))}
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

BasicForm.propTypes = {
  formData: PropTypes.objectOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(PropTypes.string),
};

BasicForm.defaultProps = {
  errors: {},
};

export default BasicForm;
