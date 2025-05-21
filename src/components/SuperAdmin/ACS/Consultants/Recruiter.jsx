import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { Edit, Save, Delete, Add, Search } from '@mui/icons-material';
import {
  useFetchData,
  useAddData,
  useDeleteData,
  useUpdateData,
} from 'src/react-query/useFetchApis';
import Toast from 'src/components/organisms/Toast';
import { useQueryClient } from 'react-query';

const Recruiter = () => {
  const [search, setSearch] = useState('');
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [newRow, setNewRow] = useState({
    name: '',
    phone: '',
    employer: '',
    email: '',
  });

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const { data = [], isLoading, error } = useFetchData('recruiter', '/recruiters/');

  const handleSearch = e => setSearch(e.target.value);

  const { mutate: updateRecruiter, isLoading: isUpdating } = useUpdateData(
    'recruiter',
    `/recruiters/${selectedId}/`
  );
  const { mutate: addRecruiters, isLoading: isAdding } = useAddData('recruiter', '/recruiters/');
  const { mutate: deleteRecruiter, isLoading: isDeleting } = useDeleteData(
    'recruiter',
    `/recruiters/${selectedId}/`
  );

  const handleEditClick = (id, row) => {
    setSelectedId(id);
    setEditRowId(id);
    setEditData(row);
  };

  const handleSave = async id => {
    await updateRecruiter(editData, {
      onSuccess: () => {
        queryClient.invalidateQueries('recruiter');
        setEditRowId(null);
        showToast('Details updated successfully!', '#82DD55');
      },
      onError: () => showToast('Something went wrong!', '#E23636'),
    });
  };

  const handleAddRow = async () => {
    await addRecruiters(newRow, {
      onSuccess: () => {
        queryClient.invalidateQueries('recruiter');
        setNewRow({ name: '', phone: '', employer: '', email: '' });
        showToast('Details added successfully!', '#82DD55');
      },
      onError: () => showToast('Something went wrong!', '#E23636'),
    });
  };

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    if (id === 'new') {
      setNewRow({ ...newRow, [field]: value });
    } else {
      setEditData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDelete = async id => {
    console.log('Deleting recruiter with ID:', id); // Debugging log

    if (!id) {
      showToast('Invalid recruiter ID!', '#E23636');
      return;
    }

    setSelectedId(id); // Ensure state updates
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for state update

    deleteRecruiter(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('recruiter');
        showToast('Details deleted successfully!', '#82DD55');
      },
      onError: () => showToast('Something went wrong!', '#E23636'),
    });
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
    setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
  };

  const filteredData = data.filter(
    row =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.phone.includes(search) ||
      row.employer.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (event, value) => setPage(value);

  return (
    <div>
      <TableContainer component={Paper} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Recruiter Management
        </Typography>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search"
              variant="outlined"
              value={search}
              onChange={handleSearch}
              fullWidth
              InputProps={{ startAdornment: <Search /> }}
            />
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Employer</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {['name', 'phone', 'employer', 'email'].map(field => (
                <TableCell key={field}>
                  <TextField
                    value={newRow[field]}
                    onChange={e => handleInputChange(e, 'new', field)}
                    fullWidth
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  onClick={handleAddRow}
                  color="primary"
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ width: '100%' }}
                  disabled={isAdding}
                >
                  {isAdding ? <CircularProgress size={24} /> : 'Add'}
                </Button>
              </TableCell>
            </TableRow>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="error">
                    An error occurred:{' '}
                    {error.message || 'Failed to fetch data. Please try again later.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>No records to display.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(row => (
                <TableRow key={row.id}>
                  {['name', 'phone', 'employer', 'email'].map(field => (
                    <TableCell key={field}>
                      {editRowId === row.id ? (
                        <TextField
                          value={editData[field] || ''}
                          onChange={e => handleInputChange(e, row.id, field)}
                          fullWidth
                        />
                      ) : (
                        <Typography>{row[field]}</Typography>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editRowId === row.id ? (
                      <IconButton
                        onClick={() => handleSave(row.id)}
                        color="primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? <CircularProgress size={24} /> : <Save />}
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEditClick(row.id, row)} color="primary">
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      color="secondary"
                      disabled={isDeleting}
                    >
                      {isDeleting && selectedId === row.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Delete />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Grid>
      </TableContainer>
      <Toast
        show={toast.show}
        message={toast.message}
        color={toast.color}
        onClose={() => setToast({ show: false, message: '', color: undefined })}
      />
    </div>
  );
};

export default Recruiter;
