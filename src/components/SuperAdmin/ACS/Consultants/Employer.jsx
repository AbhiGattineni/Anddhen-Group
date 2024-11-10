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
  CircularProgress,
  Grid,
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
  const queryClient = useQueryClient();

  const { data = [] } = useFetchData('employer', '/employers/');

  const handleSearch = (e) => setSearch(e.target.value);

  // Initialize edit state with current row values
  const handleEditId = (id) => {
    const row = data.find((row) => row.id === id);
    setEditValues({ name: row.name, address: row.address });
    setEditRowId(id);
  };

  // Save updated data
  const { mutate: updateEmployer, isLoading: isUpdating } = useUpdateData(
    'employer',
    `/employers/${editRowId}/`
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
          3000
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
          3000
        );
      },
    });
  };

  // Update local edit values on input change
  const handleInputChange = (e, field) => {
    setEditValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Add new employer
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
          3000
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
          3000
        );
      },
    });
  };

  // Delete employer
  const { mutate: deleteEmployer, isLoading: isDeleting } = useDeleteData(
    'employer',
    `/employers/${selectedId}/`
  );
  const handleDelete = (id) => {
    setSelectedId(id); // Set the ID to delete
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
          3000
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
          3000
        );
      },
    });
  };

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Employer Management
      </Typography>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          {/* <TextField
              label="Search"
              variant="outlined"
              value={search}
              onChange={handleSearch}
              fullWidth
              /> */}
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <Search />,
            }}
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
            {filteredData.map((row) => (
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
