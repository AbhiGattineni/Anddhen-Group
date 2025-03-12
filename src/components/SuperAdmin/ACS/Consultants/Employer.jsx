import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Grid,
  Pagination,
} from '@mui/material';
import { Edit, Save, Delete, Add, Search } from '@mui/icons-material';
import {
  useFetchData,
  useAddData,
  useDeleteData,
  useUpdateData,
} from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import Toast from 'src/components/organisms/Toast';

const Employer = () => {
  const [search, setSearch] = useState('');
  const [editRowId, setEditRowId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', address: '' });
  const [newRow, setNewRow] = useState({ name: '', address: '' });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const queryClient = useQueryClient();

  const { data = [] } = useFetchData('employer', '/employers/');

  const handleSearch = (e) => setSearch(e.target.value);

  const handleEditId = (id) => {
    const row = data.find((row) => row.id === id);
    setEditValues({ name: row.name, address: row.address });
    setEditRowId(id);
  };

  const { mutate: updateEmployer, isLoading: isUpdating } = useUpdateData(
    'employer',
    `/employers/${editRowId}/`,
  );

  const handleSave = () => {
    updateEmployer(editValues, {
      onSuccess: () => {
        queryClient.invalidateQueries('employer');
        setToast({
          show: true,
          message: 'Employer updated successfully!',
          color: '#82DD55',
        });
        setTimeout(
          () => setToast({ show: false, message: '', color: undefined }),
          3000,
        );
        setEditRowId(null);
      },
      onError: (error) => {
        console.error('An error occurred:', error);
        setToast({
          show: true,
          message: 'Something went wrong!',
          color: '#E23636',
        });
        setTimeout(
          () => setToast({ show: false, message: '', color: undefined }),
          3000,
        );
      },
    });
  };

  const handleInputChange = (e, field) => {
    setEditValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const { mutate: addEmployer } = useAddData('employer', '/employers/');
  const handleAddRow = () => {
    addEmployer(newRow, {
      onSuccess: () => {
        queryClient.invalidateQueries('employer');
        setNewRow({ name: '', address: '' });
        setToast({
          show: true,
          message: 'Employer added successfully!',
          color: '#82DD55',
        });
        setTimeout(
          () => setToast({ show: false, message: '', color: undefined }),
          3000,
        );
      },
      onError: (error) => {
        console.error('An error occurred:', error);
        setToast({
          show: true,
          message: 'Something went wrong!',
          color: '#E23636',
        });
        setTimeout(
          () => setToast({ show: false, message: '', color: undefined }),
          3000,
        );
      },
    });
  };

  const { mutate: deleteEmployer, isLoading: isDeleting } = useDeleteData(
    'employer',
    `/employers/${selectedId}/`,
  );

  const handleDelete = (id) => {
    setSelectedId(id); // Set the selectedId first
  };

  useEffect(() => {
    if (selectedId !== null) {
      deleteEmployer(null, {
        onSuccess: () => {
          queryClient.invalidateQueries('employer');
          setToast({
            show: true,
            message: 'Employer deleted successfully!',
            color: '#82DD55',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000,
          );
          setSelectedId(null); // Reset selectedId after successful deletion
        },
        onError: (error) => {
          console.error('An error occurred:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000,
          );
          setSelectedId(null); // Reset selectedId after error
        },
      });
    }
  }, [selectedId, deleteEmployer, queryClient]);

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.address.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handlePageChange = (event, value) => setPage(value);

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Employer Management
      </Typography>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            fullWidth
            margin="normal"
            InputProps={{ startAdornment: <Search /> }}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Address</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {['name', 'address'].map((field) => (
                <TableCell key={field}>
                  <TextField
                    value={newRow[field]}
                    onChange={(e) =>
                      setNewRow({ ...newRow, [field]: e.target.value })
                    }
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
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                {['name', 'address'].map((field) => (
                  <TableCell key={field}>
                    {editRowId === row.id ? (
                      <TextField
                        value={editValues[field]}
                        onChange={(e) => handleInputChange(e, field)}
                        fullWidth
                      />
                    ) : (
                      row[field]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editRowId === row.id ? (
                    <IconButton onClick={handleSave} color="primary">
                      {isUpdating ? <CircularProgress size={24} /> : <Save />}
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleEditId(row.id)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => handleDelete(row.id)}
                    color="secondary"
                  >
                    {isDeleting && selectedId === row.id ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Delete />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredData.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
      <Toast
        show={toast.show}
        message={toast.message}
        color={toast.color}
        onClose={() => setToast({ show: false, message: '', color: undefined })}
      />
    </Paper>
  );
};

export default Employer;
