import React, { useState } from "react";
import InputField from "../organisms/InputField";
import Toast from "../organisms/Toast";
import { useApi } from "../../hooks/useApi";

const StudentRegistrationForm = () => {
  const [showToast, setShowToast] = useState(false);
  const { loading, callApi } = useApi();

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [studentReference, setStudentReference] = useState("");
  const [studentJob, setStudentJob] = useState("");

  const resetForm = () => {
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentCollege("");
    setStudentReference("");
    setStudentJob("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("sheetName", "Student Registration");

    try {
      await callApi(formData);
      resetForm();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
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
          <div className="col-md-6">
            <h5 className="">Student Registration</h5>
            <div className="underline"></div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <InputField
                name="name"
                label="Name"
                placeholder="Full Name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
              <InputField
                name="phone"
                label="Phone"
                placeholder="Phone"
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
              />
              <InputField
                name="college"
                label="College"
                placeholder="College"
                type="text"
                value={studentCollege}
                onChange={(e) => setStudentCollege(e.target.value)}
              />
              <InputField
                name="reference"
                label=" Referred by"
                placeholder="Referrer Name"
                type="text"
                value={studentReference}
                onChange={(e) => setStudentReference(e.target.value)}
              />
              <div className="d-md-flex my-3 gap-5">
                <label className="">Job Type</label>
                <div className="d-flex gap-2">
                  <input
                    type="radio"
                    name="job"
                    value="Internship"
                    checked={studentJob === "Internship"}
                    onChange={() => setStudentJob("Internship")}
                  />
                  Internship
                  <input
                    type="radio"
                    name="job"
                    value="Full Time"
                    checked={studentJob === "Full Time"}
                    onChange={() => setStudentJob("Full Time")}
                  />
                  Full Time
                </div>
              </div>
              <div className="form-group py-3">
                <button type="submit" className="btn btn-warning shadow w-100">
                  {loading ? "loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default StudentRegistrationForm;
