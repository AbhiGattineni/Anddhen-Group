import React, { useEffect, useState } from 'react';
import { StatusCalendar } from 'src/components/templates/StatusCalender';
import { auth } from '../../../services/Authentication/firebase';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import { useStatusUpdateMutation } from 'src/react-query/useStatusUpdateMutation';
import { useQueryClient } from 'react-query';
import useAuthStore from 'src/services/store/globalStore';
import AssignCards from './AssignCards';
import { adminPlates } from 'src/dataconfig';
import HappinessIndex from './HappinessIndex';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
  FormHelperText,
} from '@mui/material';
import StatusTable from '../../generalComponents/StatusTable';
import useGetSubsidiaries from 'src/react-query/useGetSubsidiaries';

const initialFormState = {
  user_id: auth?.currentUser?.uid || '',
  user_name: auth?.currentUser?.displayName || '',
  subsidary: '',
  date: '',
  endDate: '',
  leave: false,
  description: '',
  AMS: { source: '' },
  ACS: {
    studentName: '',
    whatsappId: '',
    applicationsAppliedSearched: 0,
    applicationsAppliedSaved: 0,
    easyApply: 0,
    recruiterDirectMessages: '',
    connectMessages: '',
    reason: '',
  },
  ASS: {},
  ATI: {
    account_name: '',
    stock_name: '',
    stock_quantity: 0,
    stock_value: 0.0,
    transaction_type: '',
    total_current_amount: 0.0,
  },
  ANS: {
    pickup_location: '',
    pickup_contact: '',
    dropoff_location: '',
    dropoff_contact: '',
    distance_travelled: 0.0,
    whatsapp_group_number: '',
  },
};

export const EmployeeDashboard = () => {
  const empName = '';
  const [formValues, setFormValues] = useState(initialFormState);
  const [msgResponse, setMsgResponse] = useState(null);
  const [disableInputs, setDisableInputs] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { statusMutation, updateMutation } = useStatusUpdateMutation();
  const [search, setSearch] = useState('');
  const [searchedPlates, setSearchedPlates] = useState(adminPlates);
  const [userSubsidaries, setUserSubsidaries] = useState([]);
  const [userTimezone, setUserTimezone] = useState('UTC');

  // Calendar state management - NEW
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(new Date());

  const { data: statusUpdates } = useStatusCalendar(auth.currentUser?.uid);
  const selectedAcsStatusDate = useAuthStore(state => state.selectedAcsStatusDate);

  // Handle calendar date changes and update global store - NEW
  useEffect(() => {
    useAuthStore.setState({ selectedAcsStatusDate: calendarSelectedDate });
  }, [calendarSelectedDate]);

  const formattedData = statusUpdates
    ? statusUpdates?.status_updates?.map(item => [item.date, item.leave])
    : [];

  const currentRole = localStorage.getItem('roles');
  const current_roles = currentRole?.split(',');
  const filteredPlates = current_roles?.some(role => role.trim() === 'superadmin')
    ? adminPlates
    : adminPlates.filter(plate => current_roles?.some(role => role.trim() === plate.route.trim()));
  const [openHappinessDialog, setOpenHappinessDialog] = useState(
    !statusUpdates?.has_submitted_happiness_today
  );

  // Fetch subsidiaries from backend
  const { data: subsidiariesData, isLoading: isSubsidiariesLoading } = useGetSubsidiaries();
  // Only show active subsidiaries
  const activeSubsidiaries = Array.isArray(subsidiariesData)
    ? subsidiariesData.filter(sub => sub.active === true || sub.active === 'Yes')
    : [];

  // Fallback subsidiary options if backend data is not available
  const fallbackSubsidiaries = [
    { subName: 'ACS', id: 'acs' },
    { subName: 'ASS', id: 'ass' },
    { subName: 'ATI', id: 'ati' },
    { subName: 'ANS', id: 'ans' },
    { subName: 'AMS', id: 'ams' },
  ];

  // Use active subsidiaries if available, otherwise use fallback
  const availableSubsidiaries =
    activeSubsidiaries.length > 0 ? activeSubsidiaries : fallbackSubsidiaries;

  // Timezone handling functions
  const isUpdateAllowed = selectedDate => {
    if (!selectedDate) return false;

    const currentAvailableDate = getCurrentAvailableDate();
    const selectedDateLocal = new Date(selectedDate);
    const nowLocal = new Date();

    // Set both dates to start of day for comparison
    const selectedDateStart = new Date(selectedDateLocal);
    selectedDateStart.setHours(0, 0, 0, 0);

    const availableDateStart = new Date(currentAvailableDate);
    availableDateStart.setHours(0, 0, 0, 0);

    // Only allow updates for the current available date
    if (selectedDateStart.getTime() !== availableDateStart.getTime()) {
      return false;
    }

    // Allow updates until 3:30 AM UTC tomorrow (9 AM IST)
    const cutoffTime = new Date(selectedDateLocal);
    cutoffTime.setDate(cutoffTime.getDate() + 1);
    cutoffTime.setUTCHours(3, 30, 0, 0); // 3:30 AM UTC

    return nowLocal <= cutoffTime;
  };

  const isTodayOrPast = selectedDate => {
    if (!selectedDate) return false;

    const currentAvailableDate = getCurrentAvailableDate();

    // Compare dates as strings in YYYY-MM-DD format
    return selectedDate === currentAvailableDate;
  };

  const getLocalCutoffTimeDisplay = dateString => {
    if (!dateString) return '';

    // Create a date object from the input (ensure it's treated as local date)
    let inputDate;
    if (typeof dateString === 'string' && dateString.includes('-')) {
      // If it's a date string like "2025-07-29", create a proper date in local timezone
      const [year, month, day] = dateString.split('-');
      inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      inputDate = new Date(dateString);
    }

    // Create cutoff time: 3:30 AM UTC tomorrow (which is 9 AM IST)
    const cutoff = new Date(inputDate);
    cutoff.setDate(cutoff.getDate() + 1);
    cutoff.setUTCHours(3, 30, 0, 0); // 3:30 AM UTC

    // Format the cutoff time in the user's timezone
    return cutoff.toLocaleString('en-US', {
      timeZone: userTimezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  // Validation functions
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'date':
        if (!value) return 'Date is required';
        if (!formValues.leave && !isTodayOrPast(value))
          return 'You can only submit status for the current available date';
        if (!formValues.leave && !isUpdateAllowed(value))
          return `Status updates are only allowed until ${getLocalCutoffTimeDisplay(value)} (your local time)`;
        return '';

      case 'endDate':
        if (formValues.leave && value) {
          if (value < formValues.date) {
            return 'End date must be after or equal to start date';
          }
        }
        return '';

      case 'subsidary':
        if (!value) return 'Subsidiary is required';
        return '';

      case 'description':
        if (formValues.leave && !value?.trim()) return 'Description is required when taking leave';
        if (formValues.subsidary === 'ASS' && !value?.trim())
          return 'Description is required for ASS subsidiary';
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate required fields
    const dateError = validateField('date', formValues.date);
    if (dateError) errors.date = dateError;

    const subsidaryError = validateField('subsidary', formValues.subsidary);
    if (subsidaryError) errors.subsidary = subsidaryError;

    const descriptionError = validateField('description', formValues.description);
    if (descriptionError) errors.description = descriptionError;

    // Validate end date if it's a leave request
    if (formValues.leave && formValues.endDate) {
      const endDateError = validateField('endDate', formValues.endDate);
      if (endDateError) errors.endDate = endDateError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canSubmit = () => {
    if (isSubmitting) return false;
    if (!formValues.date || !formValues.subsidary) return false;

    // For non-leave submissions
    if (!formValues.leave) {
      if (!isTodayOrPast(formValues.date) || !isUpdateAllowed(formValues.date)) return false;
      // For ASS subsidiary, description is always required
      if (formValues.subsidary === 'ASS' && !formValues.description?.trim()) return false;
      return true;
    }

    // For leave submissions
    if (formValues.leave) {
      // Require description for all leave requests
      if (!formValues.description?.trim()) return false;

      // If endDate is provided, it must be valid
      if (formValues.endDate && formValues.endDate < formValues.date) return false;

      // Single day leave doesn't require endDate
      return true;
    }

    return true;
  };

  useEffect(() => {
    // Detect user's timezone
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(detectedTimezone || 'UTC');
    } catch (e) {
      console.error('Could not detect timezone:', e);
      setUserTimezone('UTC');
    }
  }, []);

  // Real-time form validation
  useEffect(() => {
    if (formValues.date || formValues.subsidary) {
      validateForm();
    }
  }, [
    formValues.date,
    formValues.subsidary,
    formValues.description,
    formValues.leave,
    formValues.endDate,
  ]);

  useEffect(() => {
    if (searchedPlates !== filteredPlates) {
      setSearchedPlates(filteredPlates);
    }
  }, []);

  const handleSearch = e => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setSearchedPlates(
      filteredPlates.filter(
        plate =>
          plate.child.toLowerCase().includes(query) || plate.route.toLowerCase().includes(query)
      )
    );
  };

  const resetForm = () => {
    setFormValues({
      ...initialFormState,
      date: getCurrentAvailableDate(),
      user_id: auth.currentUser.uid,
      user_name: auth.currentUser.displayName,
    });
    setFieldErrors({});
    setMsgResponse(null);
    setShowEdit(false);
  };

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.displayName) {
      resetForm();
    }
  }, [auth.currentUser]);

  const formatDate = date => {
    if (!date) return '';
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  function restructureObject(flatObj) {
    return {
      user_id: flatObj.user_id || '',
      user_name: flatObj.user_name || '',
      subsidary: flatObj.subsidary || '',
      date: flatObj.date || '',
      leave: flatObj.leave || false,
      description: flatObj.description || null,
      AMS: { source: flatObj.source || null },
      ACS: {
        studentName: flatObj.studentName || null,
        whatsappId: flatObj.whatsappId || null,
        applicationsAppliedSearched: flatObj.applicationsAppliedSearched || 0,
        applicationsAppliedSaved: flatObj.applicationsAppliedSaved || 0,
        easyApply: flatObj.easyApply || 0,
        recruiterDirectMessages: flatObj.recruiterDirectMessages || null,
        connectMessages: flatObj.connectMessages || null,
        reason: flatObj.reason || null,
      },
      ASS: {
        ticket_link: flatObj.ticket_link || null,
        github_link: flatObj.github_link || null,
      },
      ATI: {
        account_name: flatObj.account_name || null,
        stock_name: flatObj.stock_name || null,
        stock_quantity: flatObj.stock_quantity || 0,
        stock_value: flatObj.stock_value || 0.0,
        transaction_type: flatObj.transaction_type || null,
        total_current_amount: flatObj.total_current_amount || 0.0,
      },
      ANS: {
        pickup_location: flatObj.pickup_location || null,
        pickup_contact: flatObj.pickup_contact || null,
        dropoff_location: flatObj.dropoff_location || null,
        dropoff_contact: flatObj.dropoff_contact || null,
        distance_travelled: flatObj.distance_travelled || 0.0,
        whatsapp_group_number: flatObj.whatsapp_group_number || null,
      },
    };
  }

  useEffect(() => {
    resetForm();
    const formattedSelectedDate = formatDate(selectedAcsStatusDate);
    setMsgResponse(null);
    if (statusUpdates?.status_updates && selectedAcsStatusDate) {
      // More robust date comparison - check if the dates are the same regardless of timezone
      const filteredStatuses = statusUpdates.status_updates?.filter(status => {
        // Convert both dates to YYYY-MM-DD format in local timezone for comparison
        const statusDate = new Date(status.date);
        const statusYear = statusDate.getFullYear();
        const statusMonth = String(statusDate.getMonth() + 1).padStart(2, '0');
        const statusDay = String(statusDate.getDate()).padStart(2, '0');
        const statusDateString = `${statusYear}-${statusMonth}-${statusDay}`;

        return statusDateString === formattedSelectedDate;
      });
      setUserSubsidaries(filteredStatuses);
      // Check if selected subsidiary is multi-status
      const selectedSubsidiaryObj = formValues.selectedSubsidiaryObj;
      const isMultiStatus =
        selectedSubsidiaryObj?.parttimer_multi_status === true ||
        selectedSubsidiaryObj?.parttimer_multi_status === 'Yes';
      if (!filteredStatuses?.length) {
        setDisableInputs(false);
        resetForm();
      } else if (isMultiStatus) {
        setDisableInputs(false);
      } else {
        setDisableInputs(true);
      }
    }
  }, [selectedAcsStatusDate, statusUpdates?.status_updates]);

  const handleChange = e => {
    const { name, value } = e.target;

    // Update form values
    if (name.includes('.')) {
      const [subsidary, field] = name.split('.');
      setFormValues(prev => ({
        ...prev,
        [subsidary]: { ...prev[subsidary], [field]: value },
      }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Handle leave field
    if (name === 'leave') {
      const leaveValue = value === 'true' || value === true;

      // Clear description error if user unchecks leave
      if (!leaveValue && fieldErrors.description) {
        setFieldErrors(prev => ({ ...prev, description: undefined }));
      }
    }
    if (name === 'subsidary' && Array.isArray(userSubsidaries)) {
      // Find the selected subsidiary object
      const selectedSubsidiaryObj = availableSubsidiaries.find(sub => sub.subName === value);
      const filtered = userSubsidaries?.filter(sub => sub.subsidary === value);
      const isMultiStatus =
        selectedSubsidiaryObj?.parttimer_multi_status === true ||
        selectedSubsidiaryObj?.parttimer_multi_status === 'Yes';
      if (filtered?.length > 0) {
        if (isMultiStatus) {
          // For multi-status, allow new entry, clear WhatsApp ID and keep form enabled
          setFormValues(prev => ({
            ...initialFormState,
            subsidary: value,
            date: formatDate(selectedAcsStatusDate),
            user_name: auth.currentUser.displayName,
            user_id: auth.currentUser.uid,
            selectedSubsidiaryObj,
            ACS: { ...initialFormState.ACS, whatsappId: '' },
          }));
          setDisableInputs(false);
        } else {
          // For non-multi-status, disable after one entry
          const currentStatus = restructureObject(filtered[0]);
          setFormValues(currentStatus);
          setDisableInputs(true);
        }
      } else {
        setDisableInputs(false);
        setFormValues({
          ...initialFormState,
          subsidary: value,
          date: formatDate(selectedAcsStatusDate),
          user_name: auth.currentUser.displayName,
          user_id: auth.currentUser.uid,
          selectedSubsidiaryObj,
        });
      }
      const formattedSelectedDate = formatDate(selectedAcsStatusDate);
      const currentAvailableDate = getCurrentAvailableDate();
      const isSelectedDateCurrent = formattedSelectedDate === currentAvailableDate;

      const existingStatus = statusUpdates?.status_updates?.some(
        obj => obj.date === formattedSelectedDate && obj.subsidary === value
      );

      if (statusUpdates?.status_updates && isSelectedDateCurrent && existingStatus) {
        setShowEdit(true); // Show warning banner
        setDisableInputs(true); // Disable all inputs
      } else {
        setShowEdit(false);
        setDisableInputs(false);
      }
      // Store the selected subsidiary object for multi-status logic
      setFormValues(prev => ({ ...prev, selectedSubsidiaryObj }));
    }
  };

  const renderSubsidaryFields = () => {
    // For now, return null to show only basic fields (name, subsidiary, date, leave, description)
    // All subsidiary-specific logic is kept intact for future use
    return null;
  };

  const flattenObject = obj => {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        return { ...acc, ...obj[key] };
      }
      acc[key] = obj[key];
      return acc;
    }, {});
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setMsgResponse('Please fix the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setMsgResponse(null);

    try {
      // Handle leave requests (both single and multiple days)
      if (formValues.leave) {
        let dateArray = [];
        const startDate = new Date(formValues.date);

        if (formValues.endDate) {
          // Multiple day leave
          const endDate = new Date(formValues.endDate);
          // Generate array of dates between start and end date (inclusive)
          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            dateArray.push(new Date(date));
          }
        } else {
          // Single day leave
          dateArray = [startDate];
        }

        try {
          // Submit status for each date in sequence
          for (const date of dateArray) {
            const formattedDate = formatDate(date);
            const statusData = {
              ...formValues,
              date: formattedDate,
            };

            await statusMutation.mutateAsync(statusData, {
              onError: error => {
                throw new Error(`Error submitting status for ${formattedDate}: ${error.message}`);
              },
            });
          }

          setMsgResponse(`Successfully submitted leave for ${dateArray.length} day(s)`);
          resetForm();

          // Invalidate and refetch the relevant queries
          await Promise.all([
            queryClient.invalidateQueries(['calendarData']),
            queryClient.invalidateQueries(['statusUpdates', auth.currentUser?.uid]),
          ]);
        } catch (error) {
          setMsgResponse(error.message || 'An error occurred while submitting leave');
          console.error('Leave submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      // Regular single day submission
      const selectedSubsidiaryObj = formValues.selectedSubsidiaryObj;
      const isMultiStatus =
        selectedSubsidiaryObj?.parttimer_multi_status === true ||
        selectedSubsidiaryObj?.parttimer_multi_status === 'Yes';
      const currentStatuses = (statusUpdates?.status_updates || []).filter(
        s => s.subsidary === formValues.subsidary && s.date === formValues.date
      );

      if (isMultiStatus) {
        // Only allow if whatsappId is unique for this date+subsidiary
        if (
          formValues.ACS?.whatsappId &&
          currentStatuses.some(s => s.whatsappId === formValues.ACS.whatsappId)
        ) {
          setMsgResponse(
            'A status for this WhatsApp ID already exists for this subsidiary and date.'
          );
          return;
        }
      } else {
        // Only allow one status for this subsidiary+date, regardless of whatsappId
        if (currentStatuses.length > 0) {
          setMsgResponse('You can only add one status for this subsidiary and date.');
          return;
        }
      }

      const postStatus = flattenObject(formValues);

      try {
        // Only create new status, never update from form
        const response = await statusMutation.mutateAsync(postStatus);
        setMsgResponse(response.message);
        resetForm();

        // Invalidate and refetch both queries
        await Promise.all([
          queryClient.invalidateQueries(['calendarData']),
          queryClient.invalidateQueries(['statusUpdates', auth.currentUser?.uid]),
        ]);
      } catch (error) {
        setMsgResponse(error.message || 'An error occurred while submitting status');
        console.error('Mutation error:', error);
      }
    } catch (error) {
      setMsgResponse('An error occurred while processing your request');
      console.error('Error posting status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function getCurrentAvailableDate() {
    const now = new Date();

    // Get current UTC date
    const currentUTCDate = new Date();
    const utcYear = currentUTCDate.getUTCFullYear();
    const utcMonth = currentUTCDate.getUTCMonth();
    const utcDay = currentUTCDate.getUTCDate();

    // Calculate the cutoff time for today (3:30 AM UTC tomorrow)
    const cutoffTimeUTC = new Date(Date.UTC(utcYear, utcMonth, utcDay + 1, 3, 30, 0, 0));

    // If current time is before cutoff, show today's date
    // If current time is after cutoff, show tomorrow's date
    if (now < cutoffTimeUTC) {
      // Before cutoff - show today's date
      return `${utcYear}-${String(utcMonth + 1).padStart(2, '0')}-${String(utcDay).padStart(2, '0')}`;
    } else {
      // After cutoff - show tomorrow's date
      const tomorrowUTCDate = new Date(Date.UTC(utcYear, utcMonth, utcDay + 1));
      const tomorrowYear = tomorrowUTCDate.getUTCFullYear();
      const tomorrowMonth = tomorrowUTCDate.getUTCMonth();
      const tomorrowDay = tomorrowUTCDate.getUTCDate();
      return `${tomorrowYear}-${String(tomorrowMonth + 1).padStart(2, '0')}-${String(tomorrowDay).padStart(2, '0')}`;
    }
  }

  return (
    <div className="container">
      <div className="my-3">
        {statusUpdates && statusUpdates.has_submitted_happiness_today === false && (
          <HappinessIndex
            open={openHappinessDialog}
            handleClose={() => setOpenHappinessDialog(false)}
          />
        )}
        <form className="form">
          <h2>Status Update Form</h2>

          <Alert severity="info" sx={{ mb: 2 }}>
            Status updates are allowed until 3:30 AM UTC the next day (9 AM IST).
            <div>Detected timezone: {userTimezone}</div>
            <div>
              Cutoff time for today ({formatDate(new Date())}):{' '}
              {getLocalCutoffTimeDisplay(formatDate(new Date()))}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
              (Status updates allowed until 3:30 AM UTC tomorrow, shown in your local timezone)
            </div>
          </Alert>

          <div className="row">
            <div className="col-12">
              {formattedData && (
                <StatusCalendar
                  data={formattedData}
                  empName={empName}
                  selectedDate={calendarSelectedDate}
                  onDateChange={setCalendarSelectedDate}
                />
              )}
            </div>
          </div>

          {msgResponse && (
            <div className="alert alert-info" role="alert">
              {msgResponse}
            </div>
          )}

          {showEdit && (
            <div
              className="alert alert-warning"
              role="alert"
              style={{
                marginBottom: '16px',
                border: '2px solid #ffc107',
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '12px 16px',
                borderRadius: '4px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                ⚠️ Status Already Submitted
              </div>
              <div style={{ marginBottom: '8px' }}>
                A status for <strong>{formValues.subsidary}</strong> on{' '}
                <strong>{formValues.date}</strong> has already been submitted.
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '8px', fontStyle: 'italic' }}>
                Please use the pencil edit icon in the Status Table below to edit this status.
              </div>
            </div>
          )}

          <div className="row mb-3">
            <div className="col-12 text-center">
              <h4 className="text-primary mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Update your status here
              </h4>
            </div>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User Name"
                name="user_name"
                value={formValues.user_name}
                onChange={handleChange}
                disabled={true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!fieldErrors.subsidary}>
                <InputLabel>Subsidiary</InputLabel>
                <Select
                  name="subsidary"
                  value={formValues.subsidary}
                  onChange={handleChange}
                  disabled={isSubsidiariesLoading}
                >
                  {availableSubsidiaries.map(sub => (
                    <MenuItem key={sub.id || sub.subsidiaryName || sub.subName} value={sub.subName}>
                      {sub.subName}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.subsidary && <FormHelperText>{fieldErrors.subsidary}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={formValues.leave ? 4 : 6}>
              <TextField
                fullWidth
                label={formValues.leave ? 'Start Date' : 'Date'}
                type="date"
                name="date"
                value={formValues.date}
                onChange={handleChange}
                disabled={disableInputs}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                inputProps={{
                  min: getCurrentAvailableDate(),
                }}
                error={!!fieldErrors.date}
                helperText={fieldErrors.date || (formValues.leave ? 'First day of your leave' : '')}
              />
            </Grid>
            {formValues.leave && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="End Date (Optional)"
                  type="date"
                  name="endDate"
                  value={formValues.endDate}
                  onChange={handleChange}
                  disabled={disableInputs}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  inputProps={{
                    min: formValues.date || getCurrentAvailableDate(),
                  }}
                  error={!!fieldErrors.endDate}
                  helperText={
                    fieldErrors.endDate || 'Leave empty for single day, or select last day of leave'
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} sm={formValues.leave ? 4 : 6}>
              <TextField
                select
                fullWidth
                label="Leave"
                name="leave"
                value={formValues.leave}
                onChange={handleChange}
                disabled={false}
                variant="outlined"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>

            {renderSubsidaryFields()}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                disabled={false}
                multiline
                rows={4}
                variant="outlined"
                error={!!fieldErrors.description}
                helperText={fieldErrors.description}
                placeholder={
                  formValues.subsidary === 'ASS'
                    ? 'Description is required for ASS subsidiary...'
                    : formValues.leave
                      ? 'Please provide a reason for your leave...'
                      : 'Optional description...'
                }
              />
            </Grid>
          </Grid>

          <div className="col-12 d-flex justify-content-center gap-3 py-2">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!canSubmit() || showEdit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Status'}
            </button>
          </div>
        </form>

        <div className="row my-4">
          <div className="col-12">
            <StatusTable
              statusUpdates={statusUpdates?.status_updates || []}
              isUpdateAllowed={isUpdateAllowed}
              userTimezone={userTimezone}
              updateMutation={updateMutation}
              subsidaryOptions={activeSubsidiaries.map(sub => sub.subName)}
            />
          </div>
        </div>
      </div>

      {searchedPlates?.length > 0 && (
        <div className="input-group px-5 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search cards..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      )}
      <AssignCards adminPlates={searchedPlates} />
    </div>
  );
};
