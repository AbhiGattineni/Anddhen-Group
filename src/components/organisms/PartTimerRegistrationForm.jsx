import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Toast from "./Toast";
import { useApi } from "../../hooks/useApi";
import { sendEmail } from "../templates/emailService";

export const PartTimerRegistrationForm = () => {
  const { loading, callApi } = useApi();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    studyYear: "",
    otherStatus: "",
    reference: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      studyYear: formData.status === "student" ? prevFormData.studyYear : "N/A",
      otherStatus:
        formData.status === "other" ? prevFormData.otherStatus : "N/A",
    }));
  }, [formData.status]);

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every(Boolean) &&
      !Object.values(fieldErrors).some(Boolean) &&
      !loading
    );
  };

  const constructFormData = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("sheetName", "Part Timers Registrations");
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      await callApi(constructFormData());
      sendEmail("parttimer",formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "",
        studyYear: "",
        otherStatus: "",
        reference: "",
      });
      setToast({ show: true, message: "Data successfully submitted!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      setToast({ show: true, message: "Something went wrong!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
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
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                setError={(error) => handleFieldError("name", error)}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                setError={(error) => handleFieldError("email", error)}
              />
              <InputField
                name="phone"
                label="Phone"
                placeholder="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                setError={(error) => handleFieldError("phone", error)}
              />
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="student">Student</option>
                  <option value="housewife">Housewife</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {formData.status === "student" && (
                <InputField
                  name="studyYear"
                  label="Year of Study"
                  placeholder="Year of Study"
                  type="text"
                  value={formData.studyYear}
                  onChange={(e) => handleChange("studyYear", e.target.value)}
                  setError={(error) => handleFieldError("studyYear", error)}
                />
              )}
              {formData.status === "other" && (
                <InputField
                  name="otherStatus"
                  label="Please specify"
                  placeholder="Please specify"
                  type="text"
                  value={formData.otherStatus}
                  onChange={(e) => handleChange("otherStatus", e.target.value)}
                  setError={(error) => handleFieldError("otherStatus", error)}
                />
              )}
              <InputField
                name="reference"
                label="Referred by"
                placeholder="Referrer Name"
                type="text"
                value={formData.reference}
                onChange={(e) => handleChange("reference", e.target.value)}
                setError={(error) => handleFieldError("reference", error)}
              />
              <div className="form-group py-3">
                <button
                  type="submit"
                  className="btn btn-warning shadow w-100"
                  disabled={!isFormValid()}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default PartTimerRegistrationForm;
