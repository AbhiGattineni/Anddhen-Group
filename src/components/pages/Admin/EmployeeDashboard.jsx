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
} from '@mui/material';

const subsidaryOptions = ['ACS', 'ASS', 'ATI', 'ANS', 'AMS'];

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
    studentId: '',
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

  const { data: statusUpdates } = useStatusCalendar(auth.currentUser?.uid); // Use statusUpdates directly
  const selectedAcsStatusDate = useAuthStore(
    (state) => state.selectedAcsStatusDate,
  );
  const formattedData = statusUpdates
    ? statusUpdates.map((item) => [item.date, item.leave])
    : [];

  const currentRole = localStorage.getItem('roles');
  const current_roles = currentRole?.split(',');
  const filteredPlates = current_roles?.some(
    (role) => role.trim() === 'superadmin',
  )
    ? adminPlates
    : adminPlates.filter((plate) =>
        current_roles?.some((role) => role.trim() === plate.route.trim()),
      );
  const [openHappinessDialog, setOpenHappinessDialog] = useState(false);
  useEffect(() => {
    setOpenHappinessDialog(true); // Open the popup when the page loads
  }, []);

  useEffect(() => {
    if (searchedPlates !== filteredPlates) {
      setSearchedPlates(filteredPlates);
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setSearchedPlates(
      filteredPlates.filter(
        (plate) =>
          plate.child.toLowerCase().includes(query) ||
          plate.route.toLowerCase().includes(query),
      ),
    );
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setDisableInputs(false);
  };

  const resetForm = () => {
    setFormValues({
      ...initialFormState,
      date: formatDate(selectedAcsStatusDate),
      user_id: auth.currentUser.uid,
      user_name: auth.currentUser.displayName,
    });
  };

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.displayName) {
      resetForm();
    }
  }, [auth.currentUser]);

  const formatDate = (date) => {
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
        studentId: flatObj.studentId || null,
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
    if (statusUpdates && selectedAcsStatusDate) {
      const filteredStatuses = statusUpdates.status_updates.filter(
        (status) => formattedSelectedDate === status.date,
      );
      setUserSubsidaries(filteredStatuses);
      if (!filteredStatuses.length) {
        setDisableInputs(false);
        resetForm();
      }
    }
  }, [selectedAcsStatusDate, statusUpdates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [subsidary, field] = name.split('.');
      setFormValues((prev) => ({
        ...prev,
        [subsidary]: { ...prev[subsidary], [field]: value },
      }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
    if (name === 'leave' && value === true) {
      setDisableInputs(true);
    }
    if (name === 'subsidary' && Array.isArray(userSubsidaries)) {
      const filtered = userSubsidaries.filter((sub) => sub.subsidary === value);
      if (filtered.length > 0) {
        const currentStatus = restructureObject(filtered[0]);
        setFormValues(currentStatus);
        setDisableInputs(true);
      } else {
        setDisableInputs(false);
        setFormValues({
          ...initialFormState,
          subsidary: value,
          date: formatDate(selectedAcsStatusDate),
          user_name: auth.currentUser.displayName,
          user_id: auth.currentUser.uid,
        });
      }
      const formattedSelectedDate = formatDate(selectedAcsStatusDate);
      const currentDate = formatDate(new Date());
      const isSelectedDateCurrent = formattedSelectedDate === currentDate;
      if (
        statusUpdates &&
        isSelectedDateCurrent &&
        statusUpdates?.some(
          (obj) => obj.date === currentDate && obj.subsidary === value,
        )
      ) {
        setShowEdit(true);
      } else {
        setShowEdit(false);
      }
    }
  };

  const renderSubsidaryFields = () => {
    if (!formValues.subsidary) return null;

    const selectedSubsidary = formValues.subsidary;
    const fields = initialFormState[selectedSubsidary];

    if (!fields) return null; // Ensure fields exist

    // Initialize formValues[selectedSubsidary] if undefined
    if (!formValues[selectedSubsidary]) {
      formValues[selectedSubsidary] = { ...fields };
    }

    return Object.keys(fields).map((key) => (
      <Grid item xs={12} sm={6} key={key}>
        <TextField
          fullWidth
          label={key
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase())} // Capitalize first letter of each word
          name={`${selectedSubsidary}.${key}`}
          value={formValues[selectedSubsidary]?.[key] || ''}
          onChange={handleChange}
          disabled={disableInputs}
          variant="outlined"
        />
      </Grid>
    ));
  };

  const flattenObject = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        return { ...acc, ...obj[key] }; // Spread nested object properties
      }
      acc[key] = obj[key]; // Keep top-level properties
      return acc;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = ['date', 'subsidary'];
      const missingField = requiredFields.find((field) => !formValues[field]);

      if (missingField) {
        let missingFieldName = missingField;
        switch (missingField) {
          case 'date':
            missingFieldName = 'Date';
            break;
          case 'subsidary':
            missingFieldName = 'Subsidary';
            break;
          default:
            break;
        }
        setMsgResponse(
          `Please fill in the required field: ${missingFieldName}`,
        );
        return;
      }
      const postStatus = flattenObject(formValues);

      let response;
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
          <div className="row">
            <div className="col-12">
              <StatusCalendar data={formattedData} empName={empName} />
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
                <InputLabel>Subsidary</InputLabel>
                <Select
                  name="subsidary"
                  value={formValues.subsidary}
                  onChange={handleChange}
                >
                  {subsidaryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
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
                disabled={disableInputs}
                variant="outlined"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>
            {/* Dynamic Fields */}
            {renderSubsidaryFields()}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                disabled={disableInputs}
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
            >
              Submit
            </button>
            {showEdit && (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleEdit}
                // disabled={showEdit}
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Conditionally render search bar if cards are available */}
      {searchedPlates.length > 0 && (
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
