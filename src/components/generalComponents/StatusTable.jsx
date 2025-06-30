import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Box,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import PropTypes from 'prop-types';

const StatusTable = ({
  statusUpdates,
  isUpdateAllowed,
  userTimezone,
  updateMutation,
  subsidaryOptions,
}) => {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    subsidary: '',
  });
  const [msg, setMsg] = useState('');

  // Filtering logic
  const filteredData = useMemo(() => {
    return statusUpdates.filter(row => {
      const rowDate = new Date(row.date);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;
      const subsidaryMatch = filters.subsidary ? row.subsidary === filters.subsidary : true;
      const dateMatch = (!start || rowDate >= start) && (!end || rowDate <= end);
      return subsidaryMatch && dateMatch;
    });
  }, [statusUpdates, filters]);

  // Columns to show (dynamic for extra fields)
  const baseColumns = ['date', 'subsidary', 'leave', 'description'];
  const alwaysExclude = ['id', 'user_id', 'user_name'];
  // Helper to check if a column has any visible value
  const getDisplayValue = val => {
    if (
      val === null ||
      val === undefined ||
      val === '' ||
      val === 0 ||
      val === 0.0 ||
      val === '0' ||
      val === '0.00'
    )
      return '';
    return val;
  };
  // Compute all possible columns except always excluded
  const allKeys = useMemo(() => {
    const keys = new Set();
    statusUpdates.forEach(row => Object.keys(row).forEach(k => keys.add(k)));
    alwaysExclude.forEach(k => keys.delete(k));
    return Array.from(keys);
  }, [statusUpdates]);
  // Only show columns that have at least one non-empty value
  const visibleColumns = useMemo(() => {
    return allKeys.filter(col => statusUpdates.some(row => getDisplayValue(row[col]) !== ''));
  }, [allKeys, statusUpdates]);
  // Only show base columns if they are present and not excluded, and have at least one value
  const shownBaseColumns = baseColumns.filter(
    col =>
      !alwaysExclude.includes(col) && statusUpdates.some(row => getDisplayValue(row[col]) !== '')
  );
  // Extra columns are visibleColumns minus shownBaseColumns
  const extraColumns = visibleColumns.filter(col => !shownBaseColumns.includes(col));

  // Handlers
  const handleEdit = row => {
    setEditRowId(row.id || row._id || row.date + row.subsidary);
    setEditData({ ...row });
    setMsg('');
  };
  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
    setMsg('');
  };
  const handleChange = (e, field) => {
    setEditData(prev => ({ ...prev, [field]: e.target.value }));
  };
  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(editData);
      setMsg('Status updated successfully.');
      setEditRowId(null);
    } catch (err) {
      setMsg('Update failed.');
    }
  };

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 4,
        p: { xs: 2, md: 4 },
        my: 2,
        background: 'linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)',
      }}
    >
      <Box
        sx={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 3,
          p: 2,
          mb: 3,
          boxShadow: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                borderRadius: 2,
                background: '#f5faff',
                boxShadow: 1,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                '&:hover': { boxShadow: 3 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                borderRadius: 2,
                background: '#f5faff',
                boxShadow: 1,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                '&:hover': { boxShadow: 3 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Subsidiary"
              value={filters.subsidary}
              onChange={e => setFilters(f => ({ ...f, subsidary: e.target.value }))}
              fullWidth
              sx={{
                borderRadius: 2,
                background: '#f5faff',
                boxShadow: 1,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                '&:hover': { boxShadow: 3 },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {subsidaryOptions.map(opt => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 2, borderColor: '#e0e7ef' }} />
      {msg && <Box sx={{ mb: 2, color: 'green', fontWeight: 500 }}>{msg}</Box>}
      <TableContainer component={Box} sx={{ borderRadius: 3, boxShadow: 2, background: 'white' }}>
        <Table size="small" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {shownBaseColumns.map(col => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '1.08rem',
                    borderTopLeftRadius: col === shownBaseColumns[0] ? 12 : 0,
                    borderTopRightRadius:
                      col === shownBaseColumns[shownBaseColumns.length - 1] &&
                      extraColumns.length === 0
                        ? 12
                        : 0,
                  }}
                >
                  {col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </TableCell>
              ))}
              {extraColumns.map(col => (
                <TableCell
                  key={col}
                  sx={{ fontWeight: 'bold', color: '#333', fontSize: '1.08rem' }}
                >
                  {col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '1.08rem',
                  borderTopRightRadius: 12,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={shownBaseColumns.length + extraColumns.length + 1}
                  align="center"
                  sx={{ py: 4, color: '#888' }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
            {filteredData.map((row, idx) => {
              const rowId = row.id || row._id || row.date + row.subsidary;
              const editable = isUpdateAllowed(row.date);
              const isEditing = editRowId === rowId;
              return (
                <TableRow
                  key={rowId}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#e3f0ff',
                    '&:hover': {
                      backgroundColor: '#e0e7ef',
                      boxShadow: 2,
                      borderLeft: '4px solid #1976d2',
                    },
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  {shownBaseColumns.map(col => (
                    <TableCell
                      key={col}
                      sx={{ fontWeight: col === 'date' || col === 'subsidary' ? 600 : 400 }}
                    >
                      {isEditing && col === 'subsidary' ? (
                        <TextField
                          value={editData.subsidary}
                          onChange={e => handleChange(e, 'subsidary')}
                          select
                          size="small"
                          sx={{ borderRadius: 2, background: '#f5faff' }}
                        >
                          {subsidaryOptions.map(opt => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : isEditing && col === 'leave' ? (
                        <TextField
                          value={editData.leave}
                          onChange={e => handleChange(e, 'leave')}
                          select
                          size="small"
                          sx={{ borderRadius: 2, background: '#f5faff' }}
                        >
                          <MenuItem value={true}>Yes</MenuItem>
                          <MenuItem value={false}>No</MenuItem>
                        </TextField>
                      ) : isEditing && col === 'description' ? (
                        <TextField
                          value={editData.description || ''}
                          onChange={e => handleChange(e, 'description')}
                          size="small"
                          sx={{ borderRadius: 2, background: '#f5faff' }}
                        />
                      ) : col === 'leave' ? (
                        row.leave ? (
                          'Yes'
                        ) : row.leave === false ? (
                          'No'
                        ) : (
                          ''
                        )
                      ) : col === 'date' ? (
                        formatDate(row.date)
                      ) : (
                        getDisplayValue(row[col])
                      )}
                    </TableCell>
                  ))}
                  {extraColumns.map(col => (
                    <TableCell key={col}>
                      {isEditing ? (
                        <TextField
                          value={editData[col] || ''}
                          onChange={e => handleChange(e, col)}
                          size="small"
                          sx={{ borderRadius: 2, background: '#f5faff' }}
                        />
                      ) : (
                        getDisplayValue(row[col])
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {isEditing ? (
                      <>
                        <IconButton onClick={handleSave} color="primary" size="small">
                          <Save />
                        </IconButton>
                        <IconButton onClick={handleCancel} color="secondary" size="small">
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() => editable && handleEdit(row)}
                        color="primary"
                        size="small"
                        disabled={!editable}
                        sx={{
                          borderRadius: 2,
                          background: editable ? '#e3f0ff' : '#f5faff',
                          '&:hover': { background: '#1976d2', color: 'white' },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

StatusTable.propTypes = {
  statusUpdates: PropTypes.array.isRequired,
  isUpdateAllowed: PropTypes.func.isRequired,
  userTimezone: PropTypes.string.isRequired,
  updateMutation: PropTypes.shape({ mutateAsync: PropTypes.func.isRequired }).isRequired,
  subsidaryOptions: PropTypes.array.isRequired,
};

export default StatusTable;
