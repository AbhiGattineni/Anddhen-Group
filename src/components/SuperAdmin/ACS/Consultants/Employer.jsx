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
  Pagination,
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { useFetchData } from 'src/react-query/useFetchApis';
import Toast from 'src/components/organisms/Toast';

const Employer = () => {
  const [search, setSearch] = useState('');
  const [editValues, setEditValues] = useState({ name: '', address: '' });
  const [newRow, setNewRow] = useState({ name: '', address: '' });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const { data = [] } = useFetchData('employer', '/employers/');
  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.address.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSearch = (e) => setSearch(e.target.value);
  const handlePageChange = (event, value) => setPage(value);

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

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
                <Button color="primary" variant="contained" startIcon={<Add />}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                {['name', 'address'].map((field) => (
                  <TableCell key={field}>{row[field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>
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
