import React, { useRef, useState } from "react";

const InputField = (props) => {
  const [error, setError] = useState(null);
  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  // const yearPattren = /^(19|20)[\d]{2,2}$/;
  const ref = useRef(null);

  const validateInput = () => {
    const today = new Date();
    const inputValue = new Date(props.value);
    today.setHours(0, 0, 0, 0);
    inputValue.setHours(0, 0, 0, 0);

    if (["name", "reference", "managerName", "newStudent"].includes(props.name) && props.value.length <= 3) {
      return `${props.label} should be more than 3 characters`;
    }

    if (props.name === "email" && !emailPattern.test(props.value)) {
      return "Enter a valid email address";
    }

    if (props.name === "password" && props.value.length <= 0) {
      return "Password should not be empty";
    }

    if (props.name === "confirmpassword" && props.value !== props.data) {
      return "Password is not matching";
    }

    if (props.name === "phone" && !phonePattern.test(props.value)) {
      return "Enter valid phone number";
    }

    if (props.name === "college" && props.value.length <= 3) {
      return "College name should contain more than 3 characters";
    }

    if (props.name === "studyYear" && (props.value.length !== 4 || Number(props.value) > new Date().getFullYear() + 50)) {
      return "Enter valid year";
    }

    if (["otherStatus", "needToUpdate", "notUpdatedFrom3Days", "applicationsBelow20From2Days", "leave", "needWeekendTime", "holdByStudent", "studentGroup", "reason"].includes(props.name) && props.value.length <= 0) {
      return "This field should not be empty";
    }

    if (["activeParttimers", "activeStudents", "applications", "easyApply", "connectMessages", "directMessages"].includes(props.name) && props.value.length <= 0) {
      return "This field should not be empty";
    }

    if (props.name === "date" && inputValue > today) {
      return "Date cannot be in the future";
    }
    if (props.name === "year" && props.value.length != 4) {
      return "Enter valid year";
    }
    if (props.name === "score" && props.value.length <=0) {
      return "This field should not be empty";
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
      <label className="mb-1">{props.label} <span className="text-danger">*</span></label>
      <input
        ref={ref}
        type={props.type}
        className="form-control"
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={handleBlur}
        onFocus={props.onFocus}
        required
      />
      {error ? <span className="text-danger">{error}</span> : null}
    </div>
  );
};

export default InputField;
