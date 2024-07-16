import React, { useRef, useState } from "react";

const InputField = (props) => {
  const [error, setError] = useState(null);
  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const phonePattern =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const linkRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  const scoreRegex = /^\d{1,3}(?:\.\d*)?$/;
  // const yearPattren = /^(19|20)[\d]{2,2}$/;
  const ref = useRef(null);
  const linkFields = [
    "website_link",
    "international_UG_link",
    "international_graduation_link",
    "application_UG_link",
    "application_graduation_link",
    "application_UG_fee_link",
    "application_graduation_fee_link",
    "toefl_UG_score_link",
    "toefl_graduation_score_link",
    "gre_score_link",
    "ielts_ug_score_link",
    "ielts_graduation_score_link",
    "fall_deadline_UG_link",
    "fall_deadline_graduation_link",
    "spring_deadline_UG_link",
    "spring_deadline_graduation_link",
    "college_email_link",
    "college_phone_link",
    "international_person_email_link",
    "UG_courses_link",
    "graduation_courses_link",
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
    "website_link",
    "college_name",
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
    "current_occupation",
    "course_name",
    "amount",
    "description",
  ];

  const validateInput = () => {
    const today = new Date();
    const value = props.value || "";
    const inputValue = new Date(value);
    today.setHours(0, 0, 0, 0);
    inputValue.setHours(0, 0, 0, 0);

    if (inputFields.includes(props.name) && value.length <= 0) {
      return "This field should not be empty";
    }

    if (
      [
        "name",
        "reference",
        "managerName",
        "newStudent",
        "first_name",
        "last_name",
        "receiver_name",
        "sender_name",
      ].includes(props.name) &&
      value.length <= 3
    ) {
      return `${props.label} should be more than 3 characters`;
    }

    if (
      ["email", "international_person_email", "college_email"].includes(
        props.name
      ) &&
      !emailPattern.test(value)
    ) {
      return "Enter a valid email address";
    }

    if (props.name === "password" && value.length <= 0) {
      return "Password should not be empty";
    }

    if (props.name === "confirmpassword" && value !== props.data) {
      return "Password is not matching";
    }

    if (
      ["phone", "college_phone"].includes(props.name) &&
      !phonePattern.test(value)
    ) {
      return "Enter valid phone number";
    }

    if (["college_name"].includes(props.name) && value.length <= 3) {
      return "College name should contain more than 3 characters";
    }

    if (
      props.name === "studyYear" &&
      (value.length !== 4 || Number(value) > new Date().getFullYear() + 50)
    ) {
      return "Enter valid year";
    }

    if (linkFields.includes(props.name) && !linkRegex.test(value)) {
      return "Link should include with http/https";
    }
    if (scoreFields.includes(props.name) && !scoreRegex.test(value)) {
      return "Score should not be greater that 3 digits";
    }
    if (
      ["application_UG_fee", "application_graduation_fee"].includes(
        props.name
      ) &&
      value.length <= 0
    ) {
      return "Fee should be valid";
    }

    if (
      (props.name === "date" || props.name === "transaction_datetime") &&
      inputValue > today
    ) {
      return "Date cannot be in the future";
    }
    if (props.name === "year" && value.length !== 4) {
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
        {props.label}
        {props.notRequired ? null : (
          <span className="text-danger" style={{ userSelect: "none" }}>
            {" "}
            *
          </span>
        )}
      </label>
      <input
        ref={ref}
        type={props.type}
        className="form-control"
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={
          props.notRequired && !props.value ? null : handleBlur
        }
        onFocus={props.onFocus}
        disabled={props.disabled}
        required={props.notRequired ? false : true}
      />
      {error ? <span className="text-danger">{error}</span> : null}
    </div>
  );
};

export default InputField;
