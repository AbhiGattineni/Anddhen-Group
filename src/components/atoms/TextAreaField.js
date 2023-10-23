import React from "react";

const TextAreaField = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
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

export default TextAreaField;
