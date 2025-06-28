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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { StatusCalendar } from '../templates/StatusCalender';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import useAuthStore from 'src/services/store/globalStore';

// Subsidiary Management Component
const SubsidiaryManagement = () => {
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubsidiary, setEditingSubsidiary] = useState(null);
  const [formData, setFormData] = useState({
    subsidiaryName: '',
    subName: '',
    parttimer_multi_status: false,
    active: true,
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch subsidiaries
  const fetchSubsidiaries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/subsidiaries/`);
      if (!response.ok) {
        throw new Error('Failed to fetch subsidiaries');
      }
      const data = await response.json();
      setSubsidiaries(data);
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubsidiaries();
  }, []);

  // Add/Edit subsidiary
  const handleSubmit = async () => {
    try {
      const url = editingSubsidiary
        ? `${API_BASE_URL}/subsidiaries/update/${editingSubsidiary.id}/`
        : `${API_BASE_URL}/subsidiaries/add/`;

      const method = editingSubsidiary ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save subsidiary');
      }

      setOpenDialog(false);
      setEditingSubsidiary(null);
      setFormData({
        subsidiaryName: '',
        subName: '',
        parttimer_multi_status: false,
        active: true,
      });
      fetchSubsidiaries();
    } catch (error) {
      console.error('Error saving subsidiary:', error);
    }
  };

  // Delete subsidiary
  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this subsidiary?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/subsidiaries/delete/${id}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete subsidiary');
        }

        fetchSubsidiaries();
      } catch (error) {
        console.error('Error deleting subsidiary:', error);
      }
    }
  };

  // Edit subsidiary
  const handleEdit = subsidiary => {
    setEditingSubsidiary(subsidiary);
    setFormData({
      subsidiaryName: subsidiary.subsidiaryName,
      subName: subsidiary.subName,
      parttimer_multi_status: subsidiary.parttimer_multi_status,
      active: subsidiary.active,
    });
    setOpenDialog(true);
  };

  // Add new subsidiary
  const handleAdd = () => {
    setEditingSubsidiary(null);
    setFormData({
      subsidiaryName: '',
      subName: '',
      parttimer_multi_status: false,
      active: true,
    });
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Subsidiary Management</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Subsidiary
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading subsidiaries...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Subsidiary Name</TableCell>
                <TableCell>Sub Name</TableCell>
                <TableCell>Multi Status</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subsidiaries.map(subsidiary => (
                <TableRow key={subsidiary.id}>
                  <TableCell>{subsidiary.id}</TableCell>
                  <TableCell>{subsidiary.subsidiaryName}</TableCell>
                  <TableCell>{subsidiary.subName}</TableCell>
                  <TableCell>{subsidiary.parttimer_multi_status ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{subsidiary.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(subsidiary)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(subsidiary.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSubsidiary ? 'Edit Subsidiary' : 'Add New Subsidiary'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subsidiary Name"
            value={formData.subsidiaryName}
            onChange={e => setFormData({ ...formData, subsidiaryName: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Sub Name"
            value={formData.subName}
            onChange={e => setFormData({ ...formData, subName: e.target.value })}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2 }}>
            <label>
              <input
                type="checkbox"
                checked={formData.parttimer_multi_status}
                onChange={e =>
                  setFormData({ ...formData, parttimer_multi_status: e.target.checked })
                }
              />
              Part Timer Multi Status
            </label>
          </Box>
          <Box sx={{ mt: 2 }}>
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={e => setFormData({ ...formData, active: e.target.checked })}
              />
              Active
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSubsidiary ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Employee Status Component (existing functionality)
const EmployeeStatus = () => {
  const queryClient = useQueryClient();
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [formattedData, setFormattedData] = useState([]);
  const [singleStatus, setSingleStatus] = useState([]);
  const [allStatuses, setAllStatuses] = useState({});
  const { data } = useStatusCalendar(empId);
  const [selectedDate, setSelectedDate] = useState('');

  const selectedAcsStatusDate = useAuthStore(state => state.selectedAcsStatusDate);

  useEffect(() => {
    if (data?.status_updates) {
      const inputDate = new Date(selectedAcsStatusDate);
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
      const status = data?.status_updates?.filter(item => item.date === formattedDate);
      if (status.length > 0) {
        setSingleStatus(status);
      }
    }
  }, [selectedAcsStatusDate, data]);

  const formattedCallenderData = data?.status_updates
    ? data?.status_updates?.map(item => [item.date, item.leave])
    : [];

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
          onSuccess: response => {
            const newStatuses = response.reduce((acc, item) => {
              const { user_id, date, ...userStatus } = item;
              if (!acc[user_id]) {
                acc[user_id] = [];
              }
              acc[user_id].push({ date, userStatus });
              return acc;
            }, {});
            setAllStatuses(newStatuses);
            queryClient.invalidateQueries('status');
          },
          onError: error => {
            setAllStatuses({});
          },
        }
      );
    }
  }, [empId]);

  useEffect(() => {
    if (empId && allStatuses[empId]) {
      setFormattedData(allStatuses[empId]);
    }
  }, [allStatuses, empId]);

  const handleEmployeeChange = event => {
    const selectedEmpId = event.target.value;
    const selectedEmpName = employees?.find(emp => emp.user_id === selectedEmpId)?.user_name;

    setEmpId(selectedEmpId);
    setEmpName(selectedEmpName);
    setSingleStatus('');
  };

  return (
    <Box sx={{ flexGrow: 1, paddingY: 2, paddingX: { xs: 2, md: 10 } }}>
      <h2 className="main-heading mb-4">Employee Status Dashboard</h2>
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
            {employees?.map(employee => (
              <MenuItem key={employee.user_id} value={employee.user_id}>
                {employee.user_name}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>

        {empId.length === 0 ? (
          <Typography variant="h6" sx={{ marginTop: 2, textAlign: 'center', color: 'black' }}>
            Please select an employee to view their status.
          </Typography>
        ) : (
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'start',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              height: '100%',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            <Grid container spacing={2} sx={{ flex: 1 }}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <StatusCalendar data={formattedCallenderData} empName={''} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Single Status ({selectedDate})</Typography>
                  {Array.isArray(singleStatus) && singleStatus?.length > 0 ? (
                    singleStatus?.map((status, statusIndex) => {
                      const filteredEntries = Object.entries(status)?.filter(
                        ([key, value]) =>
                          value !== '' &&
                          value !== '0.00' &&
                          value !== 0 &&
                          value !== '0' &&
                          value !== null &&
                          key !== 'id' &&
                          key !== 'user_id' &&
                          key !== 'user_name'
                      );

                      return (
                        <div key={statusIndex}>
                          {filteredEntries?.map(([key, value], index) => (
                            <Typography key={index}>
                              <strong>{key}:</strong>{' '}
                              {key === 'leave' ? (value ? 'Yes' : 'No') : value}
                            </Typography>
                          ))}
                          {statusIndex < singleStatus.length - 1 && <Divider sx={{ my: 1 }} />}
                        </div>
                      );
                    })
                  ) : (
                    <Typography>Select a date to see status</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
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
                  {formattedData?.length > 0 ? (
                    formattedData?.map((status, index, array) => (
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
                                    key !== 'date'
                                )
                                .map(([key, value]) =>
                                  key === 'leave'
                                    ? `${key}: ${value ? 'Yes' : 'No'}`
                                    : `${key}: ${value}`
                                )
                                .join(', ') || 'No relevant data available'
                            }
                          />
                        </ListItem>
                        {index < array.length - 1 && <Divider />}
                      </div>
                    ))
                  ) : (
                    <Typography>No statuses available for this employee.</Typography>
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

// Main Status Component with tabs
export const Status = () => {
  const [activeTab, setActiveTab] = useState('employee');

  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <h2 className="main-heading my-4">Status Management</h2>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'employee' ? 'active' : ''}`}
            id="employee-tab"
            data-bs-toggle="tab"
            data-bs-target="#employee"
            type="button"
            role="tab"
            aria-controls="employee"
            aria-selected={activeTab === 'employee'}
            onClick={() => setActiveTab('employee')}
          >
            Employee Status
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'subsidiary' ? 'active' : ''}`}
            id="subsidiary-tab"
            data-bs-toggle="tab"
            data-bs-target="#subsidiary"
            type="button"
            role="tab"
            aria-controls="subsidiary"
            aria-selected={activeTab === 'subsidiary'}
            onClick={() => setActiveTab('subsidiary')}
          >
            Subsidiary Management
          </button>
        </li>
      </ul>
      <div
        className="tab-content"
        id="myTabContent"
        style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}
      >
        <div
          className={`tab-pane fade ${activeTab === 'employee' ? 'show active' : ''}`}
          id="employee"
          role="tabpanel"
          aria-labelledby="employee-tab"
          style={{ height: '100%' }}
        >
          <EmployeeStatus />
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'subsidiary' ? 'show active' : ''}`}
          id="subsidiary"
          role="tabpanel"
          aria-labelledby="subsidiary-tab"
          style={{ height: '100%' }}
        >
          <SubsidiaryManagement />
        </div>
      </div>
    </div>
  );
};
