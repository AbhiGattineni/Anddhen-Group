import React from 'react';
import PropTypes from 'prop-types';

const TextAreaField = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} <span className="text-danger">*</span>
        </label>
      )}
      <textarea
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
      />
    </div>
  );
};

TextAreaField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

TextAreaField.defaultProps = {
  label: '',
  placeholder: '',
};

export default TextAreaField;
