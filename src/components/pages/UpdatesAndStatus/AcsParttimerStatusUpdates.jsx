import React, { useEffect, useState } from 'react';
import InputField from '../../organisms/InputField';
import Toast from '../../organisms/Toast';
import { useApi } from '../../../hooks/useApi';
import TextAreaField from '../../atoms/TextAreaField';

const AcsParttimerStatusUpdates = () => {
  const [showToast, setShowToast] = useState(false);

  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [studentGroup, setStudentGroup] = useState('');
  const [applications, setApplications] = useState('');
  const [easyApply, setEasyApply] = useState('');
  const [connectMessages, setConnectMessages] = useState('');
  const [directMessages, setDirectMessages] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');

  const { loading, callApi } = useApi();
  const [fieldErrors, setFieldErrors] = useState({});
  const [toastMsg, setToastMsg] = useState(null);
  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };
  const fields = {
    date,
    name,
    studentGroup,
    applications,
    easyApply,
    connectMessages,
    directMessages,
    reason,
    status,
  };
  useEffect(() => {
    if (parseInt(applications) >= 20) {
      setReason('N/A');
    }
  }, [applications]);
  const allFieldsFilled = Object.values(fields).every(Boolean);
  const hasErrors = Object.values(fieldErrors).some(error => error);
  const disableButton = !allFieldsFilled || hasErrors || loading || status.length <= 0;
  const resetForm = () => {
    setDate('');
    setName('');
    setStudentGroup('');
    setApplications('');
    setEasyApply('');
    setConnectMessages('');
    setDirectMessages('');
    setReason('');
    setStatus('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!allFieldsFilled || hasErrors) return;
    const formData = new FormData();
    formData.append('date', date);
    formData.append('name', name);
    formData.append('studentGroup', studentGroup);
    formData.append('applications', applications);
    formData.append('easyApply', easyApply);
    formData.append('connectMessages', connectMessages);
    formData.append('directMessages', directMessages);
    if (parseInt(applications) < 20) {
      formData.append('reason', reason);
    }
    formData.append('status', status);
    formData.append('sheetName', 'Part Timer Status');

    try {
      await callApi(formData);
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
        <h3 className="main-heading">ACS Part-timer Daily Status & Updates</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-6">
            <h5 className="">Daily Status</h5>
            <div className="underline"></div>
            <form onSubmit={handleSubmit}>
              <InputField
                name="date"
                label="Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                setError={error => handleFieldError('date', error)}
              />
              <InputField
                name="name"
                label="Name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                setError={error => handleFieldError('name', error)}
              />
              <InputField
                name="studentGroup"
                label="Student Group"
                type="text"
                value={studentGroup}
                onChange={e => setStudentGroup(e.target.value)}
                setError={error => handleFieldError('studentGroup', error)}
              />
              <InputField
                name="applications"
                label="Applications"
                type="number"
                value={applications}
                onChange={e => setApplications(e.target.value)}
                setError={error => handleFieldError('applications', error)}
              />
              <InputField
                name="easyApply"
                label="Easy Apply"
                type="number"
                value={easyApply}
                onChange={e => setEasyApply(e.target.value)}
                setError={error => handleFieldError('easyApply', error)}
              />
              <InputField
                name="connectMessages"
                label="Connect Messages"
                type="number"
                value={connectMessages}
                onChange={e => setConnectMessages(e.target.value)}
                setError={error => handleFieldError('connectMessages', error)}
              />
              <InputField
                name="directMessages"
                label="Direct Messages"
                type="number"
                value={directMessages}
                onChange={e => setDirectMessages(e.target.value)}
                setError={error => handleFieldError('directMessages', error)}
              />
              {parseInt(applications) < 20 && (
                <InputField
                  name="reason"
                  label="Reason"
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  setError={error => handleFieldError('reason', error)}
                  placeholder="Due to Health issues and Festival"
                />
              )}
              <TextAreaField
                name="status"
                label="Status"
                placeholder="Enter your status here..."
                value={status}
                onChange={e => setStatus(e.target.value)}
              />
              <div className="form-group py-3">
                <button
                  type="submit"
                  className="btn btn-warning shadow w-100"
                  disabled={disableButton}
                >
                  {loading ? 'Loading...' : 'Submit'}
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

export default AcsParttimerStatusUpdates;
