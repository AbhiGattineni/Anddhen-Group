import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StatusCalendar } from 'src/components/templates/StatusCalender';
import { auth } from '../../../services/Authentication/firebase';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import { useStatusUpdateMutation } from 'src/react-query/useStatusUpdateMutation';
import { useQueryClient } from 'react-query';
import useAuthStore from 'src/services/store/globalStore';
import AssignCards from './AssignCards';
import { adminPlates } from 'src/dataconfig';
import HappinessIndex from './HappinessIndex';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Alert } from '@mui/material';
import StatusTable from '../../generalComponents/StatusTable';
import useGetSubsidiaries from 'src/react-query/useGetSubsidiaries';

const initialFormState = {
  user_id: auth?.currentUser?.uid || '',
  user_name: auth?.currentUser?.displayName || '',
  subsidary: '',
  date: '',
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
  ASS: { ticket_link: '', github_link: '' },
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
  const queryClient = useQueryClient();
  const { statusMutation, updateMutation } = useStatusUpdateMutation();
  const [search, setSearch] = useState('');
  const [searchedPlates, setSearchedPlates] = useState(adminPlates);
  const [userSubsidaries, setUserSubsidaries] = useState([]);
  const [userTimezone, setUserTimezone] = useState('UTC');

  const { data: statusUpdates } = useStatusCalendar(auth.currentUser?.uid);
  const selectedAcsStatusDate = useAuthStore(state => state.selectedAcsStatusDate);
  const formattedData = useMemo(
    () =>
      statusUpdates ? statusUpdates?.status_updates?.map(item => [item.date, item.leave]) : [],
    [statusUpdates]
  );

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

  // Timezone handling functions
  const isUpdateAllowed = selectedDate => {
    if (!selectedDate) return false;

    const selectedDateLocal = new Date(selectedDate);
    const nowLocal = new Date();

    const cutoffTime = new Date(selectedDateLocal);
    cutoffTime.setDate(cutoffTime.getDate() + 1);
    cutoffTime.setHours(9, 0, 0, 0);

    return nowLocal <= cutoffTime;
  };

  const isTodayOrPast = selectedDate => {
    if (!selectedDate) return false;

    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);

    const selectedDateLocal = new Date(selectedDate);
    selectedDateLocal.setHours(0, 0, 0, 0);

    return selectedDateLocal <= todayLocal;
  };

  const formatDateForDisplay = dateString => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: userTimezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const getLocalCutoffTimeDisplay = dateString => {
    if (!dateString) return '';
    const cutoff = new Date(dateString);
    cutoff.setDate(cutoff.getDate() + 1);
    cutoff.setHours(9, 0, 0, 0);
    return formatDateForDisplay(cutoff);
  };

  useEffect(() => {
    if (statusUpdates?.has_submitted_happiness_today !== undefined) {
      statusUpdates['has_submitted_happiness_today'] = true;
    }
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(detectedTimezone || 'UTC');
    } catch (e) {
      console.error('Could not detect timezone:', e);
      setUserTimezone('UTC');
    }
  }, [statusUpdates]);

  useEffect(() => {
    if (searchedPlates !== filteredPlates) {
      setSearchedPlates(filteredPlates);
    }
  }, [filteredPlates, searchedPlates]);

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

  const handleEdit = e => {
    e.preventDefault();
    setDisableInputs(false);
  };

  const resetForm = useCallback(() => {
    setFormValues({
      ...initialFormState,
      date: formatDate(selectedAcsStatusDate),
      user_id: auth.currentUser.uid,
      user_name: auth.currentUser.displayName,
    });
  }, [selectedAcsStatusDate]);

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.displayName) {
      resetForm();
    }
  }, [auth.currentUser, resetForm]);

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
      const filteredStatuses = statusUpdates.status_updates?.filter(
        status => formattedSelectedDate === status.date
      );
      setUserSubsidaries(filteredStatuses);
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
  }, [
    selectedAcsStatusDate,
    statusUpdates?.status_updates,
    resetForm,
    formValues.selectedSubsidiaryObj,
  ]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [subsidary, field] = name.split('.');
      setFormValues(prev => ({
        ...prev,
        [subsidary]: { ...prev[subsidary], [field]: value },
      }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
    if (name === 'leave' && value === true) {
      setDisableInputs(true);
    } else if (name === 'leave' && value === false) {
      setDisableInputs(false);
    }
    if (name === 'subsidary' && Array.isArray(userSubsidaries)) {
      // Find the selected subsidiary object
      const selectedSubsidiaryObj = activeSubsidiaries.find(sub => sub.subName === value);
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
      const currentDate = formatDate(new Date());
      const isSelectedDateCurrent = formattedSelectedDate === currentDate;

      if (
        statusUpdates?.status_updates &&
        isSelectedDateCurrent &&
        statusUpdates?.status_updates?.some(
          obj => obj.date === currentDate && obj.subsidary === value
        )
      ) {
        setShowEdit(true);
      } else {
        setShowEdit(false);
      }
      // Store the selected subsidiary object for multi-status logic
      setFormValues(prev => ({ ...prev, selectedSubsidiaryObj }));
    }
  };

  const renderSubsidaryFields = () => {
    if (!formValues.subsidary) return null;

    const selectedSubsidary = formValues.subsidary;
    const fields = initialFormState[selectedSubsidary];

    if (!fields) return null;

    if (!formValues[selectedSubsidary]) {
      formValues[selectedSubsidary] = { ...fields };
    }

    const updatesAllowed = isUpdateAllowed(formValues.date);
    const isPastDate = !isTodayOrPast(formValues.date);
    return Object.keys(fields)?.map(key => (
      <Grid item xs={12} sm={6} key={key}>
        <TextField
          fullWidth
          label={key
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())}
          name={`${selectedSubsidary}.${key}`}
          value={formValues[selectedSubsidary]?.[key] || ''}
          onChange={handleChange}
          disabled={disableInputs || !updatesAllowed || isPastDate}
          variant="outlined"
        />
      </Grid>
    ));
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

    // Multi-status logic
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

    if (!isTodayOrPast(formValues.date)) {
      setMsgResponse('You can only submit status for today or past dates.');
      return;
    }

    if (!isUpdateAllowed(formValues.date)) {
      setMsgResponse(
        `Status updates are only allowed until ${getLocalCutoffTimeDisplay(formValues.date)} (your local time)`
      );
      return;
    }

    try {
      // Dynamically require all fields for the selected subsidiary except description
      const selectedSubsidary = formValues.subsidary;
      const fields = initialFormState[selectedSubsidary];
      if (fields) {
        for (const key of Object.keys(fields)) {
          if (key === 'description') continue;
          const value = formValues[selectedSubsidary]?.[key];
          if (
            value === undefined ||
            value === null ||
            value === '' ||
            value === 0 ||
            value === 0.0 ||
            value === '0' ||
            value === '0.00'
          ) {
            setMsgResponse(
              `Please fill in the required field: ${key
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/_/g, ' ')
                .replace(/^\w/, c => c.toUpperCase())}`
            );
            return;
          }
        }
      }

      const postStatus = flattenObject(formValues);

      let response = '';
      try {
        if (!showEdit) {
          response = await statusMutation.mutateAsync(postStatus);
          setMsgResponse(response.message);
          resetForm();
        } else {
          response = await updateMutation.mutateAsync(postStatus);
          setMsgResponse(response.message);
          setShowEdit(false);
        }

        queryClient.invalidateQueries(['calendarData', formValues]);
      } catch (error) {
        setMsgResponse(response.message);
        console.error('Mutation error:', error);
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
    <div className="container">
      <div className="my-3">
        {statusUpdates && !statusUpdates?.has_submitted_happiness_today && (
          <HappinessIndex
            open={openHappinessDialog}
            handleClose={() => setOpenHappinessDialog(false)}
          />
        )}
        <form className="form">
          <h2>Status Update Form</h2>

          <Alert severity="info" sx={{ mb: 2 }}>
            Status updates are allowed until 9 AM the next day in your local timezone.
            <div>Detected timezone: {userTimezone}</div>
          </Alert>

          <div className="row">
            <div className="col-12">
              {formattedData && <StatusCalendar data={formattedData} empName={empName} />}
            </div>
          </div>

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

          {msgResponse && (
            <div className="alert alert-info" role="alert">
              {msgResponse}
            </div>
          )}

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
              <FormControl fullWidth>
                <InputLabel>Subsidiary</InputLabel>
                <Select
                  name="subsidary"
                  value={formValues.subsidary}
                  onChange={handleChange}
                  disabled={isSubsidiariesLoading}
                >
                  {activeSubsidiaries.map(sub => (
                    <MenuItem key={sub.id || sub.subsidiaryName || sub.subName} value={sub.subName}>
                      {sub.subName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formValues.date}
                onChange={handleChange}
                disabled={disableInputs}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                inputProps={{ max: getMaxDate() }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
              />
            </Grid>
          </Grid>

          <div className="col-12 d-flex justify-content-center gap-3 py-2">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!isUpdateAllowed(formValues.date) || !isTodayOrPast(formValues.date)}
            >
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
