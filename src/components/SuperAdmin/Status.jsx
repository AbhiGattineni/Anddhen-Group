import React, { useState, useEffect } from 'react';
import { StatusCalendar } from '../templates/StatusCalender';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import useAuthStore from 'src/services/store/globalStore';
import PropTypes from 'prop-types';

import { useMemo } from 'react';

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
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

  const handleDelete = async id => {
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
  };

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
    <div className="container-fluid p-2 p-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4">
        <h3 className="main-heading mb-2 mb-md-0">Subsidiary Management</h3>
        <button className="btn btn-primary btn-sm btn-md" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-1 me-md-2"></i>
          <span className="d-none d-sm-inline">Add Subsidiary</span>
          <span className="d-sm-none">Add</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 fs-6">Loading subsidiaries...</p>
        </div>
      ) : (
        <div className="card shadow">
          <div className="card-body p-2 p-md-4">
            <div className="table-responsive">
              <table className="table table-hover table-sm table-md">
                <thead className="table-light">
                  <tr>
                    <th className="fs-6">ID</th>
                    <th className="fs-6">Subsidiary Name</th>
                    <th className="fs-6 d-none d-md-table-cell">Sub Name</th>
                    <th className="fs-6">Multi Status</th>
                    <th className="fs-6">Active</th>
                    <th className="fs-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidiaries.map(subsidiary => (
                    <tr key={subsidiary.id}>
                      <td className="fs-6 text-break">{subsidiary.id}</td>
                      <td className="fs-6 text-break">{subsidiary.subsidiaryName}</td>
                      <td className="fs-6 d-none d-md-table-cell text-break">
                        {subsidiary.subName}
                      </td>
                      <td>
                        <span
                          className={`badge ${subsidiary.parttimer_multi_status ? 'bg-success' : 'bg-secondary'}`}
                        >
                          {subsidiary.parttimer_multi_status ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${subsidiary.active ? 'bg-success' : 'bg-danger'}`}>
                          {subsidiary.active ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-column flex-sm-row gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(subsidiary)}
                          >
                            <i className="bi bi-pencil me-1 d-none d-sm-inline"></i>
                            <span className="d-none d-sm-inline">Edit</span>
                            <span className="d-sm-none">E</span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeleteModal({ open: true, id: subsidiary.id })}
                          >
                            <i className="bi bi-trash me-1 d-none d-sm-inline"></i>
                            <span className="d-none d-sm-inline">Delete</span>
                            <span className="d-sm-none">D</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {openDialog && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fs-6 fs-md-5">
                    {editingSubsidiary ? 'Edit Subsidiary' : 'Add New Subsidiary'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpenDialog(false)}
                  ></button>
                </div>
                <div className="modal-body p-3 p-md-4">
                  <div className="mb-3">
                    <label className="form-label fs-6">Subsidiary Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm form-control-md"
                      value={formData.subsidiaryName}
                      onChange={e => setFormData({ ...formData, subsidiaryName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fs-6">Sub Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm form-control-md"
                      value={formData.subName}
                      onChange={e => setFormData({ ...formData, subName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.parttimer_multi_status}
                        onChange={e =>
                          setFormData({ ...formData, parttimer_multi_status: e.target.checked })
                        }
                      />
                      <label className="form-check-label fs-6">Part Timer Multi Status</label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.active}
                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      />
                      <label className="form-check-label fs-6">Active</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-md"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-md"
                    onClick={handleSubmit}
                  >
                    {editingSubsidiary ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fs-6">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteModal({ open: false, id: null })}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this subsidiary?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDeleteModal({ open: false, id: null })}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      await handleDelete(deleteModal.id);
                      setDeleteModal({ open: false, id: null });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Employee Status Component with Calendar, Monthly Stats, and Loading States
const EmployeeStatus = () => {
  const queryClient = useQueryClient();
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [formattedData, setFormattedData] = useState([]);
  const [singleStatus, setSingleStatus] = useState([]);
  const [allStatuses, setAllStatuses] = useState({});
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Calendar state management
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter states
  const [leaveFilter, setLeaveFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [filteredStatuses, setFilteredStatuses] = useState([]);

  const selectedAcsStatusDate = useAuthStore(state => state.selectedAcsStatusDate);

  // Fetch data with loading states
  const { data: calendarData, isLoading: isLoadingCalendarData } = useStatusCalendar(empId);

  // Filter calendar data based on subsidiary permissions
  const data = useMemo(() => {
    if (!calendarData?.status_updates) return calendarData;

    const currentRole = localStorage.getItem('roles');
    const userRoles = currentRole?.split(',').map(role => role.trim()) || [];
    const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

    // If user is superadmin or has no subsidiary restrictions, show all data
    if (userRoles.includes('superadmin') || !hasSubsidiaryRoles) {
      return calendarData;
    }

    // Get user's allowed subsidiaries
    const userSubsidiaries = userRoles
      .filter(role => role.startsWith('status_subsidiary_'))
      .map(role => role.replace('status_subsidiary_', '').toUpperCase());

    // Filter status updates based on subsidiary access
    return {
      ...calendarData,
      status_updates: calendarData.status_updates.filter(item => {
        const subsidiary = item.subsidiary || item.subsidary;
        return subsidiary && userSubsidiaries.includes(subsidiary.toUpperCase());
      }),
    };
  }, [calendarData]);
  const {
    data: employeeData = [],
    isLoading: isLoadingEmployees,
    error: employeeError,
  } = useFetchData('status', '/get_status_ids');

  // Debug employee data
  useEffect(() => {
    console.log('Employee Data received:', employeeData);
    console.log('Loading state:', isLoadingEmployees);
  }, [employeeData, isLoadingEmployees]);

  // Log any API errors
  useEffect(() => {
    if (employeeError) {
      console.error('Error fetching employee data:', employeeError);
      setError(employeeError);
    }
  }, [employeeError]);
  const { mutate: getAllStatus } = useAddData('status', '/get_status_update');

  // Handle calendar date changes and update global store
  useEffect(() => {
    useAuthStore.setState({ selectedAcsStatusDate: calendarSelectedDate });
  }, [calendarSelectedDate]);

  useEffect(() => {
    if (data?.status_updates) {
      const inputDate = new Date(selectedAcsStatusDate);
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);

      // Get user roles
      const currentRole = localStorage.getItem('roles');
      const userRoles = currentRole?.split(',').map(role => role.trim()) || [];
      const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

      // Get user's allowed subsidiaries
      const userSubsidiaries = userRoles
        .filter(role => role.startsWith('status_subsidiary_'))
        .map(role => role.replace('status_subsidiary_', '').toUpperCase());

      // Filter statuses for the selected date
      const dateStatuses = data?.status_updates?.filter(item => item.date === formattedDate) || [];

      // Apply subsidiary access filtering
      const filteredStatuses = dateStatuses.filter(item => {
        // If user is superadmin, show all
        if (userRoles.includes('superadmin')) {
          return true;
        }

        // If user has only status role without subsidiary roles, show all
        if (userRoles.includes('status') && !hasSubsidiaryRoles) {
          return true;
        }

        // Get subsidiary from status
        const subsidiary = item.subsidiary || item.subsidary || '';

        // If user has subsidiary roles, only show matching subsidiaries
        if (hasSubsidiaryRoles) {
          // If no subsidiary specified and user has subsidiary roles, don't show
          if (!subsidiary) {
            return false;
          }
          return userSubsidiaries.includes(subsidiary.toUpperCase());
        }

        return false;
      });

      setSingleStatus(filteredStatuses);
    }
  }, [selectedAcsStatusDate, data]);

  const formattedCallenderData = data?.status_updates
    ? data?.status_updates?.map(item => [item.date, item.leave])
    : [];

  useEffect(() => {
    console.log('Processing employee data:', employeeData);

    // If still loading, don't process
    if (isLoadingEmployees) return;

    // Handle empty or invalid data
    if (!employeeData || !Array.isArray(employeeData)) {
      console.warn('Invalid or empty employee data:', employeeData);
      setEmployees([]);
      return;
    }

    // Get user roles
    const currentRole = localStorage.getItem('roles');
    console.log('Current roles:', currentRole);
    const userRoles = currentRole?.split(',').map(role => role.trim()) || [];

    // Check subsidiary access
    const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));
    console.log('Has subsidiary roles:', hasSubsidiaryRoles);

    // If superadmin or no subsidiary restrictions, show all
    if (userRoles.includes('superadmin') || !hasSubsidiaryRoles) {
      console.log('Setting all employees (superadmin or no restrictions)');
      setEmployees(employeeData);
      return;
    }

    // Get allowed subsidiaries
    const userSubsidiaries = userRoles
      .filter(role => role.startsWith('status_subsidiary_'))
      .map(role => role.replace('status_subsidiary_', '').toUpperCase());
    console.log('Allowed subsidiaries:', userSubsidiaries);

    setEmployees(employeeData);
  }, [employeeData]);

  // Function to filter status updates based on subsidiary access
  const filterStatusByAccess = statusData => {
    const currentRole = localStorage.getItem('roles');
    const userRoles = currentRole?.split(',').map(role => role.trim()) || [];

    // If user is superadmin, show all
    if (userRoles.includes('superadmin')) {
      return statusData;
    }

    // Check if user has any subsidiary-specific access
    const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

    // If user has status role but no subsidiary roles, show all
    if (userRoles.includes('status') && !hasSubsidiaryRoles) {
      return statusData;
    }

    // Get the subsidiaries user has access to
    const userSubsidiaries = userRoles
      .filter(role => role.startsWith('status_subsidiary_'))
      .map(role => role.replace('status_subsidiary_', '').toUpperCase());

    return statusData.filter(item => {
      // Extract subsidiary from status data
      const subsidiary =
        item.subsidiary ||
        item.userStatus?.subsidiary ||
        item.subsidary ||
        item.userStatus?.subsidary; // Handle both spellings

      // If no subsidiary info and user has any subsidiary access, deny
      if (!subsidiary && userSubsidiaries.length > 0) {
        return false;
      }

      return userSubsidiaries.includes(subsidiary?.toUpperCase());
    });
  };

  useEffect(() => {
    if (empId) {
      setIsLoadingStatuses(true);
      setError(null);
      getAllStatus(
        { user_id: empId },
        {
          onSuccess: response => {
            // Filter response based on user's subsidiary access
            const filteredResponse = filterStatusByAccess(response);

            const newStatuses = filteredResponse.reduce((acc, item) => {
              const { user_id, date, ...userStatus } = item;
              if (!acc[user_id]) {
                acc[user_id] = [];
              }
              acc[user_id].push({ date, userStatus });
              return acc;
            }, {});

            setAllStatuses(newStatuses);
            queryClient.invalidateQueries('status');
            setIsLoadingStatuses(false);
          },
          onError: error => {
            console.error('Error fetching statuses:', error);
            setAllStatuses({});
            setIsLoadingStatuses(false);
          },
        }
      );
    }
  }, [empId, getAllStatus, queryClient]);
  useEffect(() => {
    if (empId && allStatuses[empId]) {
      setFormattedData(allStatuses[empId]);
    }
  }, [allStatuses, empId]);

  // Apply filters to statuses
  useEffect(() => {
    if (formattedData.length > 0) {
      let filtered = [...formattedData];

      // Date range filter
      if (startDateFilter) {
        filtered = filtered.filter(status => status.date >= startDateFilter);
      }
      if (endDateFilter) {
        filtered = filtered.filter(status => status.date <= endDateFilter);
      }

      // Leave filter
      if (leaveFilter !== 'all') {
        filtered = filtered.filter(status => {
          const hasLeave = status.userStatus.leave === true || status.userStatus.leave === 'true';
          return leaveFilter === 'with_leave' ? hasLeave : !hasLeave;
        });
      }

      setFilteredStatuses(filtered);
    } else {
      setFilteredStatuses([]);
    }
  }, [formattedData, startDateFilter, endDateFilter, leaveFilter]);

  // Calculate monthly stats
  const calculateMonthStats = (data, month) => {
    const year = month.getFullYear();
    const mon = String(month.getMonth() + 1).padStart(2, '0');

    // Filter entries for the current visible month
    const entries = data.filter(([date]) => date.startsWith(`${year}-${mon}`));

    // Count days working (leave === false), leaves (leave === true)
    const daysWorking = entries.filter(([_, leave]) => leave === false).length;
    const leaves = entries.filter(([_, leave]) => leave === true).length;

    // Calculate total days of month up to today if current month; otherwise full month days
    const now = new Date();
    let totalDays = new Date(year, month.getMonth() + 1, 0).getDate();
    if (year === now.getFullYear() && month.getMonth() === now.getMonth()) {
      totalDays = now.getDate();
    }

    // Find days with no status (days in month not in data)
    const filledDates = new Set(entries.map(([date]) => date));
    let emptyDays = 0;
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${mon}-${String(d).padStart(2, '0')}`;
      if (!filledDates.has(dateStr)) emptyDays++;
    }

    return { daysWorking, leaves, emptyDays, totalDays };
  };

  const handleEmployeeChange = event => {
    const selectedEmpId = event.target.value;
    const selectedEmpName = employees?.find(emp => emp.user_id === selectedEmpId)?.user_name;

    // Clear previous data
    setFormattedData([]);
    setAllStatuses({});
    setSingleStatus([]);
    setFilteredStatuses([]);

    // Set new employee
    setEmpId(selectedEmpId);
    setEmpName(selectedEmpName);

    // Reset filters
    setLeaveFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');

    // Reset calendar
    setCalendarSelectedDate(new Date());
    setCurrentMonth(new Date());
  };

  const monthStats = calculateMonthStats(formattedCallenderData, currentMonth);

  // Loading Component
  const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div className="text-center p-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 fs-6 text-muted">{text}</p>
    </div>
  );

  LoadingSpinner.propTypes = {
    text: PropTypes.string,
  };

  // Stats Loading Component
  const StatsLoadingCards = () => (
    <div className="row g-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="col-6 col-md-3">
          <div className="text-center p-3 bg-light rounded">
            <div className="spinner-border spinner-border-sm text-muted mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="placeholder-glow">
              <small className="placeholder col-8 bg-secondary"></small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-fluid p-2 p-md-4">
      <h2 className="main-heading mb-3 mb-md-4">Employee Status Dashboard</h2>

      <div className="card shadow mb-3 mb-md-4">
        <div className="card-body p-3 p-md-4">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label fw-bold mb-2">Select Employee</label>
              {isLoadingEmployees ? (
                <div className="d-flex align-items-center">
                  <select className="form-select" disabled>
                    <option>Loading employees...</option>
                  </select>
                  <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <select className="form-select" value={empId} onChange={handleEmployeeChange}>
                  <option value="">Choose an employee...</option>
                  {Array.isArray(employees) && employees.length > 0 ? (
                    employees.map(employee => (
                      <option key={employee.user_id} value={employee.user_id}>
                        {employee.user_name || 'Unnamed Employee'}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {isLoadingEmployees ? 'Loading employees...' : 'No employees available'}
                    </option>
                  )}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error.message || 'An error occurred while fetching data'}
        </div>
      )}

      {empId.length === 0 ? (
        <div className="text-center py-4 py-md-5">
          <i className="bi bi-person-circle display-4 display-md-1 text-muted"></i>
          <h4 className="text-muted mt-3 fs-5 fs-md-4">
            Please select an employee to view their status
          </h4>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {/* Calendar Section with Stats - Full Width */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="p-3 p-md-4 border-bottom">
                  <h5 className="card-title mb-0 fs-6 fs-md-5">Status Calendar</h5>
                </div>
                <div className="p-2 p-md-3">
                  {isLoadingCalendarData ? (
                    <LoadingSpinner text="Loading calendar data..." />
                  ) : (
                    <div className="d-flex flex-column flex-lg-row gap-4 align-items-stretch">
                      {/* Calendar */}
                      <div className="flex-shrink-0" style={{ minWidth: 320 }}>
                        <StatusCalendar
                          data={formattedCallenderData}
                          empName={empName}
                          selectedDate={calendarSelectedDate}
                          onDateChange={setCalendarSelectedDate}
                          onMonthChange={setCurrentMonth}
                        />
                      </div>

                      {/* Monthly Stats Panel */}
                      <div className="flex-grow-1 d-flex flex-column justify-content-center">
                        <div className="card shadow-sm w-100">
                          <div className="card-body p-3">
                            <h5 className="card-title mb-3 fs-6 fs-md-5">
                              {currentMonth.toLocaleString('default', {
                                month: 'long',
                                year: 'numeric',
                              })}{' '}
                              Statistics
                            </h5>
                            {isLoadingCalendarData ? (
                              <StatsLoadingCards />
                            ) : (
                              <div className="row g-3">
                                <div className="col-6 col-md-3">
                                  <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                                    <div className="h4 mb-1 text-success">
                                      {monthStats.daysWorking}
                                    </div>
                                    <small className="text-muted">Days Working</small>
                                  </div>
                                </div>
                                <div className="col-6 col-md-3">
                                  <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                                    <div className="h4 mb-1 text-warning">{monthStats.leaves}</div>
                                    <small className="text-muted">Leaves</small>
                                  </div>
                                </div>
                                <div className="col-6 col-md-3">
                                  <div className="text-center p-3 bg-danger bg-opacity-10 rounded">
                                    <div className="h4 mb-1 text-danger">
                                      {monthStats.emptyDays}
                                    </div>
                                    <small className="text-muted">Empty Status</small>
                                  </div>
                                </div>
                                <div className="col-6 col-md-3">
                                  <div className="text-center p-3 bg-info bg-opacity-10 rounded">
                                    <div className="h4 mb-1 text-info">{monthStats.totalDays}</div>
                                    <small className="text-muted">Total Days</small>
                                  </div>
                                </div>
                              </div>
                            )}
                            {empName && (
                              <div className="mt-3 pt-3 border-top">
                                <small className="text-muted">
                                  <i className="bi bi-person me-1"></i>
                                  Employee: <strong>{empName}</strong>
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Information - Responsive Columns */}
          <div className="col-12 col-lg-6">
            <div className="card shadow h-100">
              <div className="card-body p-3 p-md-4">
                <h5 className="card-title mb-3 fs-6 fs-md-5">
                  Single Status
                  {selectedDate && (
                    <span className="badge bg-primary ms-2 fs-6">{selectedDate}</span>
                  )}
                </h5>
                <div className="overflow-auto">
                  {isLoadingCalendarData ? (
                    <LoadingSpinner text="Loading status data..." />
                  ) : Array.isArray(data?.status_updates) &&
                    data.status_updates.some(item => item.date === selectedDate) ? (
                    Array.isArray(singleStatus) && singleStatus?.length > 0 ? (
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

                        // Remove duplicates based on key
                        const uniqueEntries = filteredEntries?.reduce((acc, [key, value]) => {
                          const existingIndex = acc.findIndex(
                            ([existingKey]) => existingKey === key
                          );
                          if (existingIndex === -1) {
                            acc.push([key, value]);
                          }
                          return acc;
                        }, []);

                        return (
                          <div key={statusIndex}>
                            {uniqueEntries?.map(([key, value], index) => (
                              <div key={index} className="py-2 border-bottom">
                                <div className="d-flex flex-column">
                                  <strong className="text-capitalize fs-6 text-break mb-1">
                                    {key}:
                                  </strong>
                                  <div className="text-break fs-6">
                                    {key === 'leave' ? (
                                      value ? (
                                        'Yes'
                                      ) : (
                                        'No'
                                      )
                                    ) : key === 'ticket_link' || key === 'github_link' ? (
                                      <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-decoration-none"
                                      >
                                        {value}
                                      </a>
                                    ) : (
                                      value
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      <div className="alert alert-warning" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        You don`t have permission to view this status due to subsidiary
                        restrictions.
                      </div>
                    )
                  ) : (
                    <p className="text-muted fs-6">Select a date to see status</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* All Statuses Section */}
          <div className="col-12 col-lg-6">
            <div className="card shadow h-100">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0 fs-6 fs-md-5">All Statuses of {empName}</h5>
                  <span className="badge bg-secondary fs-6">
                    {isLoadingStatuses ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    ) : null}
                    {filteredStatuses.length} records
                  </span>
                </div>

                {/* Filters - Responsive Layout */}
                <div className="row g-2 g-md-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small mb-1">Date Range</label>
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={startDateFilter}
                        onChange={e => setStartDateFilter(e.target.value)}
                        disabled={isLoadingStatuses}
                      />
                      <span className="align-self-center text-center d-none d-sm-block">to</span>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={endDateFilter}
                        onChange={e => setEndDateFilter(e.target.value)}
                        disabled={isLoadingStatuses}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small mb-1">Leave Status</label>
                    <select
                      className="form-select form-select-sm"
                      value={leaveFilter}
                      onChange={e => setLeaveFilter(e.target.value)}
                      disabled={isLoadingStatuses}
                    >
                      <option value="all">All</option>
                      <option value="with_leave">With Leave</option>
                      <option value="without_leave">Without Leave</option>
                    </select>
                  </div>
                </div>

                <div className="status-list overflow-auto" style={{ maxHeight: '400px' }}>
                  {isLoadingStatuses ? (
                    <LoadingSpinner text="Loading all statuses..." />
                  ) : filteredStatuses?.length > 0 ? (
                    filteredStatuses?.map((status, index) => (
                      <div key={index} className="card mb-2 border-0 bg-light">
                        <div className="card-body p-2 p-md-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="text-primary mb-0 fs-6 text-break">{status.date}</h6>
                            {status.userStatus.leave && (
                              <span className="badge bg-warning text-dark fs-6 flex-shrink-0">
                                Leave
                              </span>
                            )}
                          </div>
                          <div className="row g-1 g-md-2">
                            {Object.entries(status.userStatus)
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
                              .map(([key, value], idx) => (
                                <div key={idx} className="col-6 col-md-6">
                                  <small className="text-muted text-capitalize d-block fs-6 text-break">
                                    {key}:
                                  </small>
                                  <div className="fw-bold fs-6 text-break">
                                    {key === 'leave' ? (value ? 'Yes' : 'No') : value}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-6 display-md-4 text-muted"></i>
                      <p className="text-muted mt-2 fs-6">No statuses found with current filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Status Component with tabs
export const Status = () => {
  const [activeTab, setActiveTab] = useState('employee');

  return (
    <div className="container-fluid p-2 p-md-4">
      <h2 className="main-heading mb-3 mb-md-4">Status Management</h2>

      <ul className="nav nav-tabs flex-column flex-sm-row" id="statusTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'employee' ? 'active' : ''}`}
            id="employee-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('employee')}
          >
            <i className="bi bi-person-check me-1 me-md-2"></i>
            <span className="d-none d-sm-inline">Employee Status</span>
            <span className="d-sm-none">Employee</span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'subsidiary' ? 'active' : ''}`}
            id="subsidiary-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('subsidiary')}
          >
            <i className="bi bi-building me-1 me-md-2"></i>
            <span className="d-none d-sm-inline">Subsidiary Management</span>
            <span className="d-sm-none">Subsidiary</span>
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3 mt-md-4" id="statusTabContent">
        <div
          className={`tab-pane fade ${activeTab === 'employee' ? 'show active' : ''}`}
          id="employee"
          role="tabpanel"
          aria-labelledby="employee-tab"
        >
          <EmployeeStatus />
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'subsidiary' ? 'show active' : ''}`}
          id="subsidiary"
          role="tabpanel"
          aria-labelledby="subsidiary-tab"
        >
          <SubsidiaryManagement />
        </div>
      </div>
    </div>
  );
};
