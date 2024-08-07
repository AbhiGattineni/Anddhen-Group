import React, { useState } from 'react';
import InputField from '../../organisms/InputField';
import TextAreaField from '../../atoms/TextAreaField';
import Toast from '../../organisms/Toast';
import { useApi } from '../../../hooks/useApi';

const AcsManagerUpdates = () => {
  const [showToast, setShowToast] = useState(false);
  const { loading, error, callApi } = useApi();

  const [date, setDate] = useState('');
  const [managerName, setManagerName] = useState('');
  const [activeParttimers, setActiveParttimers] = useState('');
  const [activeStudents, setActiveStudents] = useState('');
  const [needToUpdate, setNeedToUpdate] = useState('');
  const [notUpdatedFrom3Days, setNotUpdatedFrom3Days] = useState('');
  const [applicationsBelow20From2Days, setApplicationsBelow20From2Days] =
    useState('');
  const [leave, setLeave] = useState('');
  const [needWeekendTime, setNeedWeekendTime] = useState('');
  const [holdByStudent, setHoldByStudent] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [status, setStatus] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [toastMsg, setToastMsg] = useState(null);
  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };
  const fields = {
    date,
    managerName,
    activeParttimers,
    activeStudents,
    needToUpdate,
    notUpdatedFrom3Days,
    applicationsBelow20From2Days,
    leave,
    needWeekendTime,
    holdByStudent,
    newStudent,
  };
  const allFieldsFilled = Object.values(fields).every(Boolean);
  const hasErrors = Object.values(fieldErrors).some((error) => error);
  const disableButton =
    !allFieldsFilled || hasErrors || loading || status.length <= 0;

  const resetForm = () => {
    setDate('');
    setManagerName('');
    setActiveParttimers('');
    setActiveStudents('');
    setNeedToUpdate('');
    setNotUpdatedFrom3Days('');
    setApplicationsBelow20From2Days('');
    setLeave('');
    setNeedWeekendTime('');
    setHoldByStudent('');
    setNewStudent('');
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFieldsFilled || hasErrors) return;
    const formData = new FormData(e.target);
    formData.append('sheetName', 'Manager Status');
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
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="py-3">
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">ACS Managers Daily Status & Updates</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="d-flex justify-content-center">
          <div className="col-md-6">
            <h5>Daily Updates</h5>
            <div className="underline"></div>
            <form onSubmit={handleSubmit}>
              <InputField
                name="date"
                label="Date"
                type="date"
                max={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                setError={(error) => handleFieldError('date', error)}
              />
              <InputField
                name="managerName"
                label="Manager Name"
                placeholder="Manager Name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                setError={(error) => handleFieldError('managerName', error)}
              />
              <InputField
                name="activeParttimers"
                label="Active Parttimers"
                type="number"
                value={activeParttimers}
                onChange={(e) => setActiveParttimers(e.target.value)}
                setError={(error) =>
                  handleFieldError('activeParttimers', error)
                }
              />
              <InputField
                name="activeStudents"
                label="Active Students"
                type="number"
                value={activeStudents}
                onChange={(e) => setActiveStudents(e.target.value)}
                setError={(error) => handleFieldError('activeStudents', error)}
              />
              <InputField
                name="needToUpdate"
                label="Need to Update"
                value={needToUpdate}
                onChange={(e) => setNeedToUpdate(e.target.value)}
                setError={(error) => handleFieldError('needToUpdate', error)}
              />
              <InputField
                name="notUpdatedFrom3Days"
                label="Not Updated From 3 Days"
                value={notUpdatedFrom3Days}
                onChange={(e) => setNotUpdatedFrom3Days(e.target.value)}
                setError={(error) =>
                  handleFieldError('notUpdatedFrom3Days', error)
                }
              />
              <InputField
                name="applicationsBelow20From2Days"
                label="Applications Below 20 From 2 Days"
                value={applicationsBelow20From2Days}
                onChange={(e) =>
                  setApplicationsBelow20From2Days(e.target.value)
                }
                setError={(error) =>
                  handleFieldError('applicationsBelow20From2Days', error)
                }
              />
              <InputField
                name="leave"
                label="Leave"
                placeholder="Leave Details"
                value={leave}
                onChange={(e) => setLeave(e.target.value)}
                setError={(error) => handleFieldError('leave', error)}
              />
              <InputField
                name="needWeekendTime"
                label="Need Weekend Time"
                placeholder="Need Weekend Time Details"
                value={needWeekendTime}
                onChange={(e) => setNeedWeekendTime(e.target.value)}
                setError={(error) => handleFieldError('needWeekendTime', error)}
              />
              <InputField
                name="holdByStudent"
                label="Hold By Student"
                value={holdByStudent}
                onChange={(e) => setHoldByStudent(e.target.value)}
                setError={(error) => handleFieldError('holdByStudent', error)}
              />
              <InputField
                name="newStudent"
                label="New Student"
                placeholder="New Student Details"
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
                setError={(error) => handleFieldError('newStudent', error)}
              />
              <TextAreaField
                name="status"
                label="Status"
                placeholder="Enter your status here..."
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
      <Toast
        show={showToast}
        message={toastMsg}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default AcsManagerUpdates;
