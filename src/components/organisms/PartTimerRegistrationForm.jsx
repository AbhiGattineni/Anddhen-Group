import React, { useState } from "react";
import InputField from "./InputField";
import Toast from "./Toast";

export const PartTimerRegistrationForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);

  const [partTimerName, setPartTimerName] = useState("");
  const [partTimerEmail, setPartTimerEmail] = useState("");
  const [partTimerPhone, setPartTimerPhone] = useState("");
  const [partTimerCollege, setPartTimerCollege] = useState("");
  const [partTimerReference, setPartTimerReference] = useState("");
  const [partTimerStatus, setPartTimerStatus] = useState("");

  const resetPartTimerForm = () => {
    setPartTimerName("");
    setPartTimerEmail("");
    setPartTimerPhone("");
    setPartTimerCollege("");
    setPartTimerReference("");
    setPartTimerStatus("");
  };

  const handleSubmit = async (e, resetFunction) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("sheetName", "Part Timers Registrations");

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbyhIfzW7rVAx3c3XZUg9SS_qqbyhimucCNphlhTnRrMo-9XQS3nQJfsFYuBYToLObz_0A/exec`,

        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      resetPartTimerForm();

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
        <h3 className="main-heading">Registration</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-5">
            <h5 className=""> Part Timer Registration</h5>
            <div className="underline"></div>
            <form
              onSubmit={(e) => handleSubmit(e, resetPartTimerForm)}
            >
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
                  {loader2 ? "loading..." : "Submit"}
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
