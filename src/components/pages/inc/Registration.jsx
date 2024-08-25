import React, { useState } from 'react';
import InputField from '../../organisms/InputField';
import Toast from '../../organisms/Toast';

export const Registration = () => {
  const [showToast, setShowToast] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCollege, setStudentCollege] = useState('');
  const [studentReference, setStudentReference] = useState('');
  const [studentJob, setStudentJob] = useState('');

  const [partTimerName, setPartTimerName] = useState('');
  const [partTimerEmail, setPartTimerEmail] = useState('');
  const [partTimerPhone, setPartTimerPhone] = useState('');
  const [partTimerCollege, setPartTimerCollege] = useState('');
  const [partTimerReference, setPartTimerReference] = useState('');
  const [partTimerStatus, setPartTimerStatus] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const resetStudentForm = () => {
    setStudentName('');
    setStudentEmail('');
    setStudentPhone('');
    setStudentCollege('');
    setStudentReference('');
    setStudentJob('');
  };

  const resetPartTimerForm = () => {
    setPartTimerName('');
    setPartTimerEmail('');
    setPartTimerPhone('');
    setPartTimerCollege('');
    setPartTimerReference('');
    setPartTimerStatus('');
  };

  const handleSubmit = async (e, sheetName, resetFunction) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('sheetName', sheetName);
    if (sheetName === 'Sheet1') {
      setLoader1(true);
    } else if (sheetName === 'Sheet2') {
      setLoader2(true);
    }

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbypYp94MQ_ypnwfMf_jUQrKocmo1aDOAr4jeYAiNw1vUkJekOJqXsUUY1yBFaEKN3v6Jg/exec',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (sheetName === 'Sheet1') {
        resetStudentForm();
      } else if (sheetName === 'Sheet2') {
        resetPartTimerForm();
      }
      setToastMsg('Data successfully submitted!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMsg('Something went wrong!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error('Error:', error);
    }
    setLoader1(false);
    setLoader2(false);
  };

  return (
    <div className="py-3">
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">Registration</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="row gap-4">
          <div className="col-md-6">
            <h5 className="">Student Registration</h5>
            <div className="underline"></div>
            <form onSubmit={(e) => handleSubmit(e, 'Sheet1', resetStudentForm)}>
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
                    checked={studentJob === 'Internship'}
                    onChange={() => setStudentJob('Internship')}
                  />
                  Internship
                  <input
                    type="radio"
                    name="job"
                    value="Full Time"
                    checked={studentJob === 'Full Time'}
                    onChange={() => setStudentJob('Full Time')}
                  />
                  Full Time
                </div>
              </div>
              <div className="form-group py-3">
                <button type="submit" className="btn btn-warning shadow w-100">
                  {loader1 ? 'loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-5">
            <h5 className=""> Part Timer Registration</h5>
            <div className="underline"></div>
            <form
              onSubmit={(e) => handleSubmit(e, 'Sheet2', resetPartTimerForm)}
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
                  {loader2 ? 'loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast
        show={showToast}
        message={toastMsg}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
