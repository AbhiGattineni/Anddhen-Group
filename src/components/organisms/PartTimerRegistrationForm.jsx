import React, { useState } from "react";
import InputField from "./InputField";
import Toast from "./Toast";
import { useApi } from "../../hooks/useApi";

export const PartTimerRegistrationForm = () => {
  const [showToast, setShowToast] = useState(false);
  const { loading, callApi } = useApi();

  const [partTimerName, setPartTimerName] = useState("");
  const [partTimerEmail, setPartTimerEmail] = useState("");
  const [partTimerPhone, setPartTimerPhone] = useState("");
  const [partTimerCollege, setPartTimerCollege] = useState("");
  const [partTimerReference, setPartTimerReference] = useState("");
  const [partTimerStatus, setPartTimerStatus] = useState("");

  const resetForm = () => {
    setPartTimerName("");
    setPartTimerEmail("");
    setPartTimerPhone("");
    setPartTimerCollege("");
    setPartTimerReference("");
    setPartTimerStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("sheetName", "Part Timers Registrations");

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
          <div className="col-md-5">
            <h5 className=""> Part Timer Registration</h5>
            <div className="underline"></div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <InputField
                name="name"
                label="Name"
                placeholder="Full Name"
                type="text"
                value={partTimerName}
                onChange={(e) => setPartTimerName(e.target.value)}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                value={partTimerEmail}
                onChange={(e) => setPartTimerEmail(e.target.value)}
              />
              <InputField
                name="phone"
                label="Phone"
                placeholder="Phone"
                type="tel"
                value={partTimerPhone}
                onChange={(e) => setPartTimerPhone(e.target.value)}
              />
              <InputField
                name="college"
                label="College"
                placeholder="College"
                type="text"
                value={partTimerCollege}
                onChange={(e) => setPartTimerCollege(e.target.value)}
              />
              <InputField
                name="reference"
                label="Referred by"
                placeholder="Referrer Name"
                type="text"
                value={partTimerReference}
                onChange={(e) => setPartTimerReference(e.target.value)}
              />
              <InputField
                name="status"
                label="Current Status"
                placeholder="Current Status"
                type="text"
                value={partTimerStatus}
                onChange={(e) => setPartTimerStatus(e.target.value)}
              />
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
