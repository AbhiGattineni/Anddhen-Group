import React, { useState } from "react";
import InputField from "../../organisms/InputField";
import Toast from "../../organisms/Toast";

const AssInternUpdates = () => {
  const [showToast, setShowToast] = useState(false);
  const [loader1, setLoader1] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [studentReference, setStudentReference] = useState("");
  const [studentJob, setStudentJob] = useState("");

  const resetStudentForm = () => {
    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
    setStudentCollege("");
    setStudentReference("");
    setStudentJob("");
  };

  const handleSubmit = async (e, resetFunction) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("sheetName", "Intern Status");

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwv3MHO5wkqLkq7We5ZgI803SbtI1l7lLxVZsxj6YE_DEPVXRWRI5oxjL1H0VWy1LaDfw/exec`,

        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      resetStudentForm();

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      resetFunction();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
    setLoader1(false);
  };
  return (
    <div className="py-3">
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">ACS Interns Daily Updates</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-6">
            <h5 className="">Daily Updates</h5>
            <div className="underline"></div>
            <form onSubmit={(e) => handleSubmit(e, resetStudentForm)}>
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
                  {loader1 ? "loading..." : "Submit"}
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

export default AssInternUpdates;
