import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Toast from "./Toast";
import { useApi } from "../../hooks/useApi";
import { sendEmail } from "../templates/emailService";

export const PartTimerRegistrationForm = () => {
  const [showToast, setShowToast] = useState(false);
  const { loading, callApi } = useApi();

  const [partTimerName, setPartTimerName] = useState("");
  const [partTimerEmail, setPartTimerEmail] = useState("");
  const [partTimerPhone, setPartTimerPhone] = useState("");
  const [partTimerStatus, setPartTimerStatus] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [partTimerReference, setPartTimerReference] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toastMsg,setToastMsg] = useState(null);

  const fields = {
    partTimerName,
    partTimerEmail,
    partTimerPhone,
    partTimerStatus,
    studyYear,
    otherStatus,
    partTimerReference
  };
  useEffect(() => {
    if (partTimerStatus === "student") {
      setOtherStatus("N/A")
    } else if (partTimerStatus === "other") {
      setStudyYear("N/A")
    }
    else {
      setOtherStatus("N/A")
      setStudyYear("N/A")
    }
  }, [partTimerStatus]);
  const allFieldsFilled = Object.values(fields).every(Boolean);
  const hasErrors = Object.values(fieldErrors).some(error => error);
  const disableButton = !allFieldsFilled || hasErrors || loading;

  const resetForm = () => {
    setPartTimerName("");
    setPartTimerEmail("");
    setPartTimerPhone("");
    setPartTimerStatus("");
    setStudyYear("");
    setOtherStatus("");
    setPartTimerReference("");
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allFieldsFilled || hasErrors) {
      return;
    }

    const formData = new FormData();
    formData.append("name", partTimerName);
    formData.append("email", partTimerEmail);
    formData.append("phone", partTimerPhone);
    formData.append("status", partTimerStatus);
    if (partTimerStatus === "student") {
      formData.append("studyYear", studyYear);
      formData.append("otherStatus", "N/A");
    } else if (partTimerStatus === "other") {
      formData.append("otherStatus", otherStatus);
      formData.append("studyYear", "N/A");
    } else {
      formData.append("studyYear", "N/A");
      formData.append("otherStatus", "N/A");
    }
    formData.append("reference", partTimerReference);
    formData.append("sheetName", "Part Timers Registrations");

    try {
      await callApi(formData);
      sendEmail("parttimer");
      resetForm();
      setToastMsg("Data successfully submitted!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMsg("Something went wrong!")
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error("Error:", error);
    }
  };

  return (
    <div className="py-3">
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">Registration</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-5">
            <h5 className="">Part Timer Registration</h5>
            <div className="underline"></div>
            <form onSubmit={handleSubmit}>
              <InputField
                name="name"
                label="Name"
                placeholder="Full Name"
                type="text"
                value={partTimerName}
                onChange={(e) => setPartTimerName(e.target.value)}
                setError={(error) => handleFieldError('name', error)}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                value={partTimerEmail}
                onChange={(e) => setPartTimerEmail(e.target.value)}
                setError={(error) => handleFieldError('email', error)}
              />
              <InputField
                name="phone"
                label="Phone"
                placeholder="Phone"
                type="tel"
                value={partTimerPhone}
                onChange={(e) => setPartTimerPhone(e.target.value)}
                setError={(error) => handleFieldError('phone', error)}
              />
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={partTimerStatus}
                  onChange={(e) => setPartTimerStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="student">Student</option>
                  <option value="housewife">Housewife</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {partTimerStatus === "student" && (
                <InputField
                  name="studyYear"
                  label="Year of Study"
                  placeholder="Year of Study"
                  type="text"
                  value={studyYear}
                  onChange={(e) => setStudyYear(e.target.value)}
                  setError={(error) => handleFieldError('studyYear', error)}
                />
              )}
              {partTimerStatus === "other" && (
                <InputField
                  name="otherStatus"
                  label="Please specify"
                  placeholder="Please specify"
                  type="text"
                  value={otherStatus}
                  onChange={(e) => setOtherStatus(e.target.value)}
                  setError={(error) => handleFieldError('otherStatus', error)}
                />
              )}
              <InputField
                name="reference"
                label="Referred by"
                placeholder="Referrer Name"
                type="text"
                value={partTimerReference}
                onChange={(e) => setPartTimerReference(e.target.value)}
                setError={(error) => handleFieldError('reference', error)}
              />
              <div className="form-group py-3">
                <button type="submit" className="btn btn-warning shadow w-100" disabled={disableButton}>
                  {loading ? "loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast show={showToast} message={toastMsg} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default PartTimerRegistrationForm;