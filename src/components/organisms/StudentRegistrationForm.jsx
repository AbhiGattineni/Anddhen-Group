import React, { useState } from 'react';
import InputField from '../organisms/InputField';
import Toast from '../organisms/Toast';
import { useApi } from '../../hooks/useApi';
import { sendEmail } from '../templates/emailService';

const StudentRegistrationForm = () => {
  const [showToast, setShowToast] = useState(false);
  const { loading, callApi } = useApi();

  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState('');
  const [college, setcollege] = useState('');
  const [reference, setreference] = useState('');
  const [studentJob, setStudentJob] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submissionError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const fields = {
    name,
    email,
    phone,
    college,
    reference,
    studentJob,
  };

  const allFieldsFilled = Object.values(fields).every(Boolean);
  const hasErrors = Object.values(fieldErrors).some(error => error);
  const disableButton = !allFieldsFilled || hasErrors || loading;

  const resetForm = () => {
    setname('');
    setemail('');
    setphone('');
    setcollege('');
    setreference('');
    setStudentJob('');
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('sheetName', 'Student Registration');

    if (!allFieldsFilled || hasErrors) {
      return;
    }
    try {
      await callApi(formData);
      sendEmail('student', {
        name: name,
        email: email,
        phone: phone,
        college: college,
        reference: reference,
        studentJob: studentJob,
      });
      resetForm();
      setToastMsg('Data successfully submitted!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMsg('Something went wrong!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error('Error:', error);
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
            <form onSubmit={handleSubmit}>
              <InputField
                name="name"
                label="Name"
                placeholder="Full Name"
                type="text"
                value={name}
                onChange={e => setname(e.target.value)}
                setError={error => handleFieldError('name', error)}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setemail(e.target.value)}
                setError={error => handleFieldError('email', error)}
              />
              <InputField
                name="phone"
                label="Phone"
                placeholder="Phone"
                type="tel"
                value={phone}
                onChange={e => setphone(e.target.value)}
                setError={error => handleFieldError('phone', error)}
              />
              <InputField
                name="college"
                label="College"
                placeholder="College"
                type="text"
                value={college}
                onChange={e => setcollege(e.target.value)}
                setError={error => handleFieldError('college', error)}
              />
              <InputField
                name="reference"
                label="Referred by"
                placeholder="Referrer Name"
                type="text"
                value={reference}
                onChange={e => setreference(e.target.value)}
                setError={error => handleFieldError('reference', error)}
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
                <button
                  type="submit"
                  className="btn btn-warning shadow w-100"
                  disabled={disableButton}
                >
                  {loading ? 'loading...' : 'Submit'}
                </button>
                {submissionError && <p className="text-danger mt-3">{submissionError}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast show={showToast} message={toastMsg} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default StudentRegistrationForm;
