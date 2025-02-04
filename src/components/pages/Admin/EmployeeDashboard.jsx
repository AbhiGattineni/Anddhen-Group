import React, { useEffect, useState } from 'react';
import { StatusCalendar } from 'src/components/templates/StatusCalender';
import { auth } from '../../../services/Authentication/firebase';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import { useStatusUpdateMutation } from 'src/react-query/useStatusUpdateMutation';
import { useQueryClient } from 'react-query';
import useAuthStore from 'src/services/store/globalStore';
import AssignCards from './AssignCards';
import { adminPlates } from 'src/dataconfig';

export const EmployeeDashboard = () => {
  const empName = '';
  const [formValues, setFormValues] = useState({
    name: '',
    date: '',
    status: '',
  });
  const [msgResponse, setMsgResponse] = useState(null);
  const [disableInputs, setDisableInputs] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const queryClient = useQueryClient();
  const { statusMutation, updateMutation } = useStatusUpdateMutation();
  const [search, setSearch] = useState('');
  const [searchedPlates, setSearchedPlates] = useState(adminPlates);

  const { data } = useStatusCalendar(auth.currentUser?.uid);
  const selectedAcsStatusDate = useAuthStore(
    (state) => state.selectedAcsStatusDate,
  );
  const formattedData = data ? data.map((item) => [item.date, item.name]) : [];

  const currentRole = localStorage.getItem('roles');
  const current_roles = currentRole.split(',');
  const filteredPlates = current_roles.some(
    (role) => role.trim() === 'superadmin',
  )
    ? adminPlates
    : adminPlates.filter((plate) =>
        current_roles.some((role) => role.trim() === plate.route.trim()),
      );

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

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.displayName) {
      setFormValues({
        ...formValues,
        name: auth.currentUser.displayName,
      });
    }
  }, [auth.currentUser]);

  const formatDate = (date) => {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedSelectedDate = formatDate(selectedAcsStatusDate);
    setMsgResponse(null);
    if (data && selectedAcsStatusDate) {
      let found = false;
      data.forEach((status) => {
        if (formattedSelectedDate === status.date) {
          found = true;
          setDisableInputs(true);
          setFormValues({
            name: auth.currentUser.displayName,
            date: status.date,
            status: status.status,
          });
          return;
        }
      });
      if (!found) {
        setDisableInputs(false);
        setFormValues({
          name: auth.currentUser.displayName,
          date: '',
          status: '',
        });
      }
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const isSelectedDateCurrent = formattedSelectedDate === currentDate;
    if (
      data &&
      isSelectedDateCurrent &&
      data.some((obj) => obj.date === currentDate)
    ) {
      setShowEdit(true);
    } else {
      setShowEdit(false);
    }
  }, [selectedAcsStatusDate, data]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = ['date', 'status'];
      const missingField = requiredFields.find((field) => !formValues[field]);

      if (missingField) {
        let missingFieldName = missingField;
        switch (missingField) {
          case 'date':
            missingFieldName = 'Date';
            break;
          case 'status':
            missingFieldName = 'Status';
            break;
          default:
            break;
        }
        setMsgResponse(
          `Please fill in the required field: ${missingFieldName}`,
        );
        return;
      }

      const postStatus = {
        user_id: auth.currentUser.uid,
        user_name: formValues.name,
        date: formValues.date,
        status: formValues.status,
      };

      let response;
      try {
        if (!showEdit) {
          response = await statusMutation.mutateAsync(postStatus);
          setMsgResponse(response.message);
        } else {
          response = await updateMutation.mutateAsync(postStatus);
          setMsgResponse(response.message);
        }

        queryClient.invalidateQueries(['calendarData', postStatus]);
      } catch (error) {
        setMsgResponse('Something went wrong');
        console.error('Mutation error:', error);
      }

      if (!showEdit) {
        setFormValues({
          name: auth.currentUser.displayName,
          date: '',
          status: '',
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
    <div className="container">
      <div className="my-3">
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
          <div className="row">
            <div className="col-6 col-md-3">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            <div className="col-6 col-md-3">
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
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="status"
                  placeholder="Status"
                  value={formValues.status}
                  onChange={handleInputChange}
                  disabled={disableInputs}
                  rows={1}
                />
              </div>
            </div>
          </div>
          <div className="col-12 d-flex justify-content-center gap-3">
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
