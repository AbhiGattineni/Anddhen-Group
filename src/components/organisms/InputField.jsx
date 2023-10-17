import React from "react";

const InputField = (props) => {
  return (
    <div className={`form-group ${props.className}`}>
      <label className="mb-1">{props.label}</label>
      <input
        type={props.type}
        className="form-control"
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default InputField;
