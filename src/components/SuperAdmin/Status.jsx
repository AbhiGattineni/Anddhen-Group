import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Select,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { StatusCalendar } from '../templates/StatusCalender';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import useAuthStore from 'src/services/store/globalStore';

export const Status = () => {
  const queryClient = useQueryClient();
  const [employees, setEmployees] = useState([]); // Store employee data fetched from the API
  const [empId, setEmpId] = useState(''); // Selected employee ID
  const [empName, setEmpName] = useState(''); // Selected employee name
  const [formattedData, setFormattedData] = useState([]); // Calendar data (e.g., dates with statuses)
  const [singleStatus, setSingleStatus] = useState([]); // Status of the selected date
  const [allStatuses, setAllStatuses] = useState({}); // All statuses organized by employee ID
  const { data } = useStatusCalendar(empId);
  const [selectedDate, setSelectedDate] = useState('');

  const selectedAcsStatusDate = useAuthStore(
    (state) => state.selectedAcsStatusDate,
  );

  useEffect(() => {
    if (data) {
      const inputDate = new Date(selectedAcsStatusDate);
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
      const status = data.filter((item) => item.date === formattedDate);
      if (status.length > 0) {
        setSingleStatus(status);
      }
    }
  }, [selectedAcsStatusDate, data]);

  const formattedCallenderData = data
    ? data.map((item) => [item.date, item.leave])
    : [];

  // Fetch employee data from API on component mount
  const { data: employeeData = [] } = useFetchData('status', '/get_status_ids');
  const { mutate: getAllStatus } = useAddData('status', '/get_status_update');

  useEffect(() => {
    setEmployees(employeeData);
  }, [employeeData]);

  useEffect(() => {
    if (empId) {
      getAllStatus(
        { user_id: empId },
        {
          onSuccess: (response) => {
            // Check the response structure
            // Format the data
            const newStatuses = response.reduce((acc, item) => {
              const { user_id, date, ...userStatus } = item;
              if (!acc[user_id]) {
                acc[user_id] = [];
              }
              acc[user_id].push({ date, userStatus });
              return acc;
            }, {});
            setAllStatuses(newStatuses);
            queryClient.invalidateQueries('status'); // Ensure no infinite loop
          },
          onError: (error) => {
            setAllStatuses({});
          },
        },
      );
    }
  }, [empId]);

  useEffect(() => {
    if (empId && allStatuses[empId]) {
      setFormattedData(allStatuses[empId]);
    }
  }, [allStatuses, empId]);

  // Handle employee selection from dropdown
  const handleEmployeeChange = (event) => {
    const selectedEmpId = event.target.value;
    const selectedEmpName = employees.find(
      (emp) => emp.user_id === selectedEmpId,
    )?.user_name;

    setEmpId(selectedEmpId);
    setEmpName(selectedEmpName);
    setSingleStatus(''); // Clear single status when switching employees
  };

  return (
    <Box sx={{ flexGrow: 1, paddingY: 2, paddingX: { xs: 2, md: 10 } }}>
      {/* Heading */}
      <h2 className="main-heading mb-4">Employee Status Dashboard</h2>
      {/* Navigation Bar with Dropdown */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'transparent',
          border: '1px solid gray',
          borderRadius: '5px',
          boxShadow: 'none',
          padding: '10px',
        }}
      >
        <Toolbar>
          <Select
            value={empId}
            onChange={handleEmployeeChange}
            displayEmpty
            sx={{ marginLeft: 2, color: 'black' }}
          >
            <MenuItem value="">
              <em>Select an Employee</em>
            </MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee.user_id} value={employee.user_id}>
                {employee.user_name}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>

        {/* Conditional rendering based on employee selection */}
        {empId.length === 0 ? (
          // Show message when no employee is selected
          <Typography
            variant="h6"
            sx={{ marginTop: 2, textAlign: 'center', color: 'black' }}
          >
            Please select an employee to view their status.
          </Typography>
        ) : (
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'start',
              flexDirection: {
                xs: 'column', // mobile
                sm: 'row', // small screens and up
              },
              height: '100%',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            {/* Left Side: Calendar and Single Status */}
            <Grid container spacing={2} sx={{ flex: 1 }}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <StatusCalendar data={formattedCallenderData} empName={''} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">
                    Single Status ({selectedDate})
                  </Typography>
                  {Array.isArray(singleStatus) && singleStatus.length > 0 ? (
                    singleStatus.map((status, statusIndex) => {
                      const filteredEntries = Object.entries(status).filter(
                        ([key, value]) =>
                          value !== '' &&
                          value !== '0.00' &&
                          value !== 0 &&
                          value !== '0' &&
                          value !== null &&
                          key !== 'id' &&
                          key !== 'user_id' &&
                          key !== 'user_name',
                      );

                      return (
                        <div key={statusIndex}>
                          {filteredEntries.map(([key, value], index) => (
                            <Typography key={index}>
                              <strong>{key}:</strong>{' '}
                              {key === 'leave' ? (value ? 'Yes' : 'No') : value}
                            </Typography>
                          ))}
                          {/* Add Divider after each status except the last one */}
                          {statusIndex < singleStatus.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <Typography>Select a date to see status</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
            {/* Right Side: All Statuses */}
            <Grid
              item
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  height: '100%',
                  maxHeight: '100%',
                  overflowY: 'auto',
                }}
              >
                <Typography variant="h6">All Statuses of {empName}</Typography>
                <List>
                  {formattedData.length > 0 ? (
                    formattedData.map((status, index, array) => (
                      <div key={index}>
                        <ListItem>
                          <ListItemText
                            primary={status.date}
                            secondary={
                              Object.entries(status.userStatus)
                                .filter(
                                  ([key, value]) =>
                                    value !== '' &&
                                    value !== '0.00' &&
                                    value !== 0 &&
                                    value !== '0' &&
                                    value !== null &&
                                    key !== 'id' &&
                                    key !== 'user_id' &&
                                    key !== 'user_name' &&
                                    key !== 'date',
                                )
                                .map(([key, value]) =>
                                  key === 'leave'
                                    ? `${key}: ${value ? 'Yes' : 'No'}`
                                    : `${key}: ${value}`,
                                )
                                .join(', ') || 'No relevant data available'
                            }
                          />
                        </ListItem>
                        {index < array.length - 1 && <Divider />}
                      </div>
                    ))
                  ) : (
                    <Typography>
                      No statuses available for this employee.
                    </Typography>
                  )}
                </List>
              </Paper>
            </Grid>
          </Paper>
        )}
      </AppBar>
    </Box>
  );
};
