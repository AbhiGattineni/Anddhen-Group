import React, { useRef, useState } from "react";

const InputField = (props) => {
  const [error, setError] = useState(null);
  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const phonePattern =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const linkRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  const scoreRegex = /^\d*\.?\d*$/;
  // const yearPattren = /^(19|20)[\d]{2,2}$/;
  const ref = useRef(null);
  const linkFields = [
    "websiteLink",
    "international_UG_link",
    "international_graduation_link",
    "application_UG_link",
    "application_graduation_link",
  ];
  const scoreFields = [
    "score",
    "toefl_UG_score",
    "toefl_graduation_score",
    "ielts_ug_score",
    "ielts_graduation_score",
    "gre_score",
  ];
  const inputFields = [
    "score",
    "toefl_UG_score",
    "toefl_graduation_score",
    "ielts_ug_score",
    "ielts_graduation_score",
    "gre_score",
    "websiteLink",
    "international_UG_link",
    "international_graduation_link",
    "application_UG_link",
    "application_graduation_link",
    "application_UG_fee",
    "application_graduation_fee",
    "fall_deadline_UG",
    "fall_deadline_graduation",
    "spring_deadline_UG",
    "spring_deadline_graduation",
    "public_private",
    "UG_courses",
    "graduation_courses",
    "otherStatus",
    "needToUpdate",
    "notUpdatedFrom3Days",
    "applicationsBelow20From2Days",
    "leave",
    "needWeekendTime",
    "holdByStudent",
    "studentGroup",
    "reason",
    "activeParttimers",
    "activeStudents",
    "applications",
    "easyApply",
    "connectMessages",
    "directMessages",
    "name",
    "reference",
    "managerName",
    "newStudent",
    "email",
    "international_person_email",
    "college_email",
  ];

  const validateInput = () => {
    const today = new Date();
    const inputValue = new Date(props.value);
    today.setHours(0, 0, 0, 0);
    inputValue.setHours(0, 0, 0, 0);

    if (inputFields.includes(props.name) && props.value.length <= 0) {
      return "This field should not be empty";
    }

    if (
      ["name", "reference", "managerName", "newStudent"].includes(props.name) &&
      props.value.length <= 3
    ) {
      return `${props.label} should be more than 3 characters`;
    }

    if (
      ["email", "international_person_email", "college_email"].includes(
        props.name
      ) &&
      !emailPattern.test(props.value)
    ) {
      return "Enter a valid email address";
    }

    if (props.name === "password" && props.value.length <= 0) {
      return "Password should not be empty";
    }

    if (props.name === "confirmpassword" && props.value !== props.data) {
      return "Password is not matching";
    }

    if (
      ["phone", "college_phone"].includes(props.name) &&
      !phonePattern.test(props.value)
    ) {
      return "Enter valid phone number";
    }

    if (["college"].includes(props.name) && props.value.length <= 3) {
      return "College name should contain more than 3 characters";
    }

    if (
      props.name === "studyYear" &&
      (props.value.length !== 4 ||
        Number(props.value) > new Date().getFullYear() + 50)
    ) {
      return "Enter valid year";
    }

    if (linkFields.includes(props.name) && !linkRegex.test(props.value)) {
      return "Link should include with http/https";
    }
    if (scoreFields.includes(props.name) && !scoreRegex.test(props.value)) {
      return "Score should be valid";
    }
    if (
      ["application_UG_fee", "application_graduation_fee"].includes(
        props.name
      ) &&
      !scoreRegex.test(props.value)
    ) {
      return "Fee should be valid";
    }

    if (props.name === "date" && inputValue > today) {
      return "Date cannot be in the future";
    }
    if (props.name === "year" && props.value.length != 4) {
      return "Enter valid year";
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
      <label className="mb-1">
        {props.label} <span className="text-danger">*</span>
      </label>
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
