import React, { useState, useEffect } from 'react';
import { StatusCalendar } from '../templates/StatusCalender';
import { auth } from '../../services/Authentication/firebase';
import { useCalendarData } from '../../react-query/useCalenderData';
import { useStatusMutation } from 'src/react-query/useStatusMutation';
import useAuthStore from 'src/services/store/globalStore';
import { useQueryClient } from 'react-query';

const StatusUpdates = () => {
  const [formValues, setFormValues] = useState({
    parttimerName: '',
    studentName: '',
    date: '',
    applicationsAppliedSaved: '',
    applicationsAppliedSearched: '',
    easyApply: '',
    connectMessages: '',
    recruiterMessages: '',
    reason: '',
    description: '',
  });

  // Safely handle data from useCalendarData
  const { data: calendarData = [] } = useCalendarData(auth.currentUser?.uid || '');
  const selectedAcsStatusDate = useAuthStore(state => state.selectedAcsStatusDate);
  const [msgResponse, setMsgResponse] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);
  const queryClient = useQueryClient();
  const { statusMutation, updateMutation } = useStatusMutation();

  const [fieldsToShow, setFieldsToShow] = useState({
    parttimerName: true,
    studentName: true,
    date: true,
    applicationsAppliedSaved: false,
    applicationsAppliedSearched: false,
    easyApply: false,
    connectMessages: false,
    recruiterMessages: false,
    reason: false,
    description: false,
  });

  // Format data for calendar safely
  const formattedData = Array.isArray(calendarData)
    ? calendarData.map(item => [item.date, item.name])
    : [];

  const formatDate = date => {
    if (!date) return '';
    try {
      const inputDate = new Date(date);
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    const currentDepartment = window.location.pathname.includes('/parttimerportal') ? 'ACS' : '';
    updateFieldsToShow(currentDepartment);

    if (auth.currentUser?.displayName) {
      setFormValues(prev => ({
        ...prev,
        parttimerName: auth.currentUser.displayName,
      }));
    }
  }, []);

  useEffect(() => {
    const formattedSelectedDate = formatDate(selectedAcsStatusDate);
    setMsgResponse(null);

    if (Array.isArray(calendarData) && formattedSelectedDate) {
      const foundStatus = calendarData.find(status => formattedSelectedDate === status.date);

      if (foundStatus) {
        setDisableInputs(true);
        setFormValues({
          parttimerName: foundStatus.parttimerName || auth.currentUser?.displayName || '',
          studentName: foundStatus.studentName || '',
          date: foundStatus.date || '',
          applicationsAppliedSaved: foundStatus.applicationsAppliedSaved || '',
          applicationsAppliedSearched: foundStatus.applicationsAppliedSearched || '',
          easyApply: foundStatus.easyApply || '',
          connectMessages: foundStatus.connectMessages || '',
          recruiterMessages: foundStatus.recruiterDirectMessages || '',
          reason: foundStatus.reason || '',
          description: foundStatus.description || '',
        });
      } else {
        setDisableInputs(false);
        setFormValues(prev => ({
          ...prev,
          studentName: '',
          date: '',
          applicationsAppliedSaved: '',
          applicationsAppliedSearched: '',
          easyApply: '',
          connectMessages: '',
          recruiterMessages: '',
          reason: '',
          description: '',
        }));
      }
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const isSelectedDateCurrent = formattedSelectedDate === currentDate;
    setShowEdit(
      Array.isArray(calendarData) &&
        isSelectedDateCurrent &&
        calendarData.some(obj => obj.date === currentDate)
    );
  }, [selectedAcsStatusDate, calendarData]);

  const updateFieldsToShow = currentDepartment => {
    if (currentDepartment === 'ACS') {
      // Show ACS-related fields
      setFieldsToShow({
        parttimerName: true,
        studentName: true,
        date: true,
        applicationsAppliedSaved: true,
        applicationsAppliedSearched: true,
        easyApply: true,
        connectMessages: true,
        recruiterMessages: true,
        reason: true,
        description: true,
      });
    } else {
      // Show default fields
      setFieldsToShow({
        parttimerName: true,
        studentName: true,
        date: true,
        applicationsAppliedSaved: false,
        applicationsAppliedSearched: false,
        easyApply: false,
        connectMessages: false,
        recruiterMessages: false,
        reason: true,
        description: true,
      });
    }
  };

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleEdit = e => {
    e.preventDefault();
    setDisableInputs(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const requiredFields = [
        'parttimerName',
        'studentName',
        'date',
        'applicationsAppliedSaved',
        'applicationsAppliedSearched',
        'easyApply',
        'connectMessages',
        'recruiterMessages',
      ];
      const missingField = requiredFields.find(field => !formValues[field]);

      if (missingField) {
        // Convert field ID to a user-friendly name (if needed)
        // You can customize this mapping according to your field IDs
        let missingFieldName = missingField;
        switch (missingField) {
          case 'studentName':
            missingFieldName = 'Student Name';
            break;
          case 'date':
            missingFieldName = 'Date';
            break;
          case 'reason':
            missingFieldName = 'Reason';
            break;
          case 'description':
            missingFieldName = 'Description';
            break;
          // Add more cases as needed
          default:
            break;
        }
        const errorMessage = `Please fill in the required field: ${missingFieldName}`;
        setMsgResponse(errorMessage);
        return; // Stop form submission if a required field is missing
      }

      const postStatus = {
        parttimerName: formValues.parttimerName,
        parttimerId: auth.currentUser.uid,
        studentName: formValues.studentName,
        studentId: 'ST001',
        date: formValues.date,
        applicationsAppliedSearched: formValues.applicationsAppliedSearched,
        applicationsAppliedSaved: formValues.applicationsAppliedSaved,
        easyApply: formValues.easyApply,
        recruiterDirectMessages: formValues.recruiterMessages,
        connectMessages: formValues.connectMessages,
        reason: formValues.reason,
        description: formValues.description,
      };
      // const response = await mutate(newStatus); // Call the mutation function with form data
      // Perform mutation based on whether it's an update or a new post
      setMsgResponse('Loading...');
      let response;
      if (!showEdit) {
        response = await statusMutation.mutate(postStatus);
      } else {
        response = await updateMutation.mutate(postStatus);
      }

      // Handle response
      if (response) {
        setMsgResponse('Status updated successfully');
        // Invalidate calendar data query to trigger a refetch
        queryClient.invalidateQueries(['calendarData', auth.currentUser.uid]);
      } else {
        queryClient.invalidateQueries(['calendarData', auth.currentUser.uid]);
        setMsgResponse('Status updated successfully');
      }

      if (!showEdit) {
        setFormValues({
          parttimerName: auth.currentUser.displayName,
          studentName: '',
          date: '',
          applicationsAppliedSaved: '',
          applicationsAppliedSearched: '',
          easyApply: '',
          connectMessages: '',
          recruiterMessages: '',
          reason: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Error posting status:', error);
    }
  };

  function getMaxDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="mb-5">
      <form className="form">
        <h2>Status Update Form</h2>
        <div className="row">
          <div className="col-12">
            <StatusCalendar data={formattedData} empName={auth.currentUser?.displayName || ''} />
          </div>
        </div>
        {msgResponse && (
          <div className="alert alert-info" role="alert">
            {msgResponse}
          </div>
        )}
        <div className="row">
          {fieldsToShow.parttimerName && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="parttimerName"
                  placeholder="Parttimer Name"
                  value={formValues.parttimerName}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
          )}
          {fieldsToShow.studentName && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="studentName"
                  placeholder="Student Name"
                  value={formValues.studentName}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.date && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  placeholder="Date"
                  value={formValues.date}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                  max={getMaxDate()}
                />
              </div>
            </div>
          )}
          {fieldsToShow.studentGroup && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="studentGroup"
                  placeholder="Student Group (Number)"
                  value={formValues.studentGroup}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.applicationsAppliedSaved && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="applicationsAppliedSaved"
                  placeholder="No. of Student Shared Applications"
                  value={formValues.applicationsAppliedSaved}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.applicationsAppliedSearched && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="applicationsAppliedSearched"
                  placeholder="No. of Searched Applications"
                  value={formValues.applicationsAppliedSearched}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.easyApply && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="easyApply"
                  placeholder="No. of Easy Apply"
                  value={formValues.easyApply}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.connectMessages && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="connectMessages"
                  placeholder="No. of Connect Messages"
                  value={formValues.connectMessages}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.recruiterMessages && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="recruiterMessages"
                  placeholder="No. of Recruiter Messages"
                  value={formValues.recruiterMessages}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.reason && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="reason"
                  placeholder="Reason"
                  value={formValues.reason}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                />
              </div>
            </div>
          )}
          {fieldsToShow.description && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Daily status message from whatsapp"
                  rows="3"
                  value={formValues.description}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                ></textarea>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 d-flex justify-content-center gap-3">
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
          {showEdit && (
            <button type="submit" className="btn btn-primary" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StatusUpdates;
