// DynamicForm.js
import React from "react";

const BasicForm = ({ formData, onChange, onSubmit, errors }) => {
  return (
    <form onSubmit={onSubmit}>
      {Object.entries(formData).map(([key, value]) => (
        <div className="form-group" key={key}>
          <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
          <input
            type={key === "email" ? "email" : "text"}
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

export default BasicForm;
