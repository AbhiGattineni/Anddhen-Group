import React, { useRef, useState } from "react";

const InputField = (props) => {
  const [error, setError] = useState(null);
  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const phonePattern = /^\d{10}$/;
  const ref = useRef(null);

  const validateInput = () => {
    const today = new Date();
    const inputValue = new Date(props.value);

    if (["name", "reference", "managerName","newStudent"].includes(props.name) && props.value.length <= 3) {
      return "Name should be valid";
    }

    if (props.name === "email" && !emailPattern.test(props.value)) {
      return "Enter a valid email address";
    }

    if (props.name === "phone" && !phonePattern.test(props.value)) {
      return "Enter valid phone number";
    }

    if (props.name === "college" && props.value.length <= 3) {
      return "College name should contain more than 3 characters";
    }

    if (props.name === "studyYear" && props.value.length !== 4) {
      return "Enter valid year";
    }

    if (["otherStatus", "needToUpdate", "notUpdatedFrom3Days", "applicationsBelow20From2Days","leave","needWeekendTime","holdByStudent","studentGroup","reason"].includes(props.name) && props.value.length < 2) {
      return `Enter valid ${props.label}`;
    }

    if (["activeParttimers", "activeStudents","applications","easyApply","connectMessages","directMessages"].includes(props.name) && props.value.length <= 0) {
      return "Enter valid number";
    }

    if (props.type === "date" && inputValue > today) {
      return "Date cannot be in the future";
    }

    return null;
  };

  const handleBlur = () => {
    const currentError = validateInput();
    setError(currentError);
    props.setError(currentError);
  };

  return (
    <div className={`form-group ${props.className}`}>
      <label className="mb-1">{props.label}</label>
      <input
        ref={ref}
        type={props.type}
        className="form-control"
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={handleBlur}
        required
      />
      {error ? <span className="text-danger">{error}</span> : null}
    </div>
  );
};

export default InputField;
