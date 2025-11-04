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
  Tooltip,
  Chip,
  Typography,
  Pagination,
  Select,
  FormControl,
  InputAdornment,
  Button,
  Collapse,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  FilterList,
  CalendarToday,
  Business,
  ExpandMore,
  ExpandLess,
  Clear,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const StatusTable = ({
  statusUpdates,
  isUpdateAllowed,
  userTimezone,
  updateMutation,
  subsidaryOptions,
}) => {
  const isDateEditable = dateString => {
    if (!dateString) return false;
    const getCurrentAvailableDate = () => {
      const now = new Date();
      const currentUTCDate = new Date();
      const utcYear = currentUTCDate.getUTCFullYear();
      const utcMonth = currentUTCDate.getUTCMonth();
      const utcDay = currentUTCDate.getUTCDate();
      const cutoffTimeUTC = new Date(Date.UTC(utcYear, utcMonth, utcDay + 1, 3, 30, 0, 0));
      if (now < cutoffTimeUTC) {
        return `${utcYear}-${String(utcMonth + 1).padStart(2, '0')}-${String(utcDay).padStart(2, '0')}`;
      } else {
        const tomorrowUTCDate = new Date(Date.UTC(utcYear, utcMonth, utcDay + 1));
        const tomorrowYear = tomorrowUTCDate.getUTCFullYear();
        const tomorrowMonth = tomorrowUTCDate.getUTCMonth();
        const tomorrowDay = tomorrowUTCDate.getUTCDate();
        return `${tomorrowYear}-${String(tomorrowMonth + 1).padStart(2, '0')}-${String(tomorrowDay).padStart(2, '0')}`;
      }
    };
    const currentAvailableDate = getCurrentAvailableDate();
    if (dateString !== currentAvailableDate) return false;
    const now = new Date();
    const cutoffTime = new Date(now);
    cutoffTime.setDate(cutoffTime.getDate() + 1);
    cutoffTime.setUTCHours(3, 30, 0, 0);
    return now <= cutoffTime;
  };

  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    subsidary: '',
  });
  const [msg, setMsg] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtersExpanded, setFiltersExpanded] = useState(false); // Changed to false

  const sortedStatusUpdates = useMemo(() => {
    return [...statusUpdates].sort((a, b) => {
      if (a.date && b.date) return new Date(b.date) - new Date(a.date);
      const aId = a._id || a.id || '';
      const bId = b._id || b.id || '';
      return bId > aId ? 1 : -1;
    });
  }, [statusUpdates]);

  const filteredData = useMemo(() => {
    return sortedStatusUpdates.filter(row => {
      const rowDate = new Date(row.date);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;
      const subsidaryMatch = filters.subsidary ? row.subsidary === filters.subsidary : true;
      const dateMatch = (!start || rowDate >= start) && (!end || rowDate <= end);
      return subsidaryMatch && dateMatch;
    });
  }, [sortedStatusUpdates, filters]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      subsidary: '',
    });
    setPage(1);
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.subsidary;

  const baseColumns = ['date', 'subsidary', 'leave', 'description'];
  const alwaysExclude = ['id', 'user_id', 'user_name', '_id'];

  const isEmptyOrZero = val => {
    if (val === null || val === undefined || val === '') return true;
    if (typeof val === 'number' && val === 0) return true;
    if (typeof val === 'string' && (val === '0' || val === '0.0' || val === '0.00')) return true;
    return false;
  };

  const getDisplayValue = val => {
    if (isEmptyOrZero(val)) return '';
    return val;
  };

  const allKeys = useMemo(() => {
    const keys = new Set();
    statusUpdates.forEach(row => Object.keys(row).forEach(k => keys.add(k)));
    alwaysExclude.forEach(k => keys.delete(k));
    return Array.from(keys);
  }, [statusUpdates]);

  const visibleColumns = useMemo(() => {
    return allKeys.filter(col => {
      return statusUpdates.some(row => !isEmptyOrZero(row[col]));
    });
  }, [allKeys, statusUpdates]);

  const shownBaseColumns = baseColumns.filter(col => visibleColumns.includes(col));
  const extraColumns = visibleColumns.filter(col => !baseColumns.includes(col));

  const handleEdit = row => {
    if (!isDateEditable(row.date)) {
      setMsg("Cannot edit this record. Only today's records can be edited until 9 AM tomorrow.");
      return;
    }
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
    if (field === 'subsidary') return;
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

  const formatDate = dateString => {
    if (!dateString) return '';
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const startRecord = filteredData.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endRecord = Math.min(page * rowsPerPage, filteredData.length);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Modern Collapsible Filter Bar */}
      <Box
        sx={{
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Filter Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            backgroundColor: '#FAFAFA',
            borderBottom: filtersExpanded ? '1px solid #e0e0e0' : 'none',
            cursor: 'pointer',
          }}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FilterList sx={{ color: '#60A1FE', fontSize: 22 }} />
            <Typography
              sx={{
                fontWeight: 600,
                color: '#212429',
                fontSize: '0.9375rem',
              }}
            >
              Filters
            </Typography>
            {hasActiveFilters && (
              <Chip
                label={`${
                  [filters.startDate, filters.endDate, filters.subsidary].filter(Boolean).length
                } active`}
                size="small"
                sx={{
                  backgroundColor: '#60A1FE',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.6875rem',
                  height: 22,
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<Clear sx={{ fontSize: 16 }} />}
                onClick={e => {
                  e.stopPropagation();
                  handleClearFilters();
                }}
                sx={{
                  fontSize: '0.8125rem',
                  color: '#666666',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                    color: '#212429',
                  },
                }}
              >
                Clear all
              </Button>
            )}
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                setFiltersExpanded(!filtersExpanded);
              }}
              sx={{
                color: '#666666',
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                },
              }}
            >
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Filter Controls - Collapsible */}
        <Collapse in={filtersExpanded}>
          <Box sx={{ p: 3, backgroundColor: '#FAFBFF' }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#212429',
                    mb: 1,
                  }}
                >
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  value={filters.startDate}
                  onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
                  fullWidth
                  size="small"
                  placeholder="Select start date"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ fontSize: 18, color: '#999999' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      '& fieldset': {
                        borderColor: '#d0d0d0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#60A1FE',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#60A1FE',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#212429',
                    mb: 1,
                  }}
                >
                  End Date
                </Typography>
                <TextField
                  type="date"
                  value={filters.endDate}
                  onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
                  fullWidth
                  size="small"
                  placeholder="Select end date"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ fontSize: 18, color: '#999999' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      '& fieldset': {
                        borderColor: '#d0d0d0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#60A1FE',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#60A1FE',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#212429',
                    mb: 1,
                  }}
                >
                  Subsidiary
                </Typography>
                <TextField
                  select
                  value={filters.subsidary}
                  onChange={e => setFilters(f => ({ ...f, subsidary: e.target.value }))}
                  fullWidth
                  size="small"
                  placeholder="All subsidiaries"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ fontSize: 18, color: '#999999' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      '& fieldset': {
                        borderColor: '#d0d0d0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#60A1FE',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#60A1FE',
                        borderWidth: '2px',
                      },
                    },
                  }}
                >
                  <MenuItem value="">All Subsidiaries</MenuItem>
                  {subsidaryOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>

      {/* Message Display */}
      {msg && (
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundColor:
              msg.includes('failed') || msg.includes('Cannot') ? '#FEE2E2' : '#E5F6FD',
            borderBottom: '1px solid #e0e0e0',
            borderLeft: `4px solid ${msg.includes('failed') || msg.includes('Cannot') ? '#EF4444' : '#60A1FE'}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: msg.includes('failed') || msg.includes('Cannot') ? '#DC2626' : '#212429',
              fontWeight: 500,
            }}
          >
            {msg}
          </Typography>
        </Box>
      )}

      {/* Records count */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: '0.875rem', color: '#666666', fontWeight: 500 }}>
          Showing <strong style={{ color: '#212429' }}>{startRecord}</strong> to{' '}
          <strong style={{ color: '#212429' }}>{endRecord}</strong> of{' '}
          <strong style={{ color: '#212429' }}>{filteredData.length}</strong> records
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#666666', fontWeight: 500 }}>
            Rows per page:
          </Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              sx={{
                fontSize: '0.875rem',
                minWidth: 80,
                backgroundColor: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d0d0d0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#60A1FE',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#60A1FE',
                },
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          maxHeight: 450,
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F5F5F5',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#C0C0C0',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: '#A0A0A0',
            },
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {shownBaseColumns.map(col => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: '#212429',
                    backgroundColor: '#F0F0F0',
                    borderBottom: '2px solid #E0E0E0',
                    textTransform: 'capitalize',
                    letterSpacing: '0.02em',
                    py: 2,
                    px: 2.5,
                    // Make description column wider
                    ...(col === 'description' && {
                      minWidth: 300,
                      maxWidth: 500,
                    }),
                  }}
                >
                  {col.replace(/_/g, ' ')}
                </TableCell>
              ))}
              {extraColumns.map(col => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: '#212429',
                    backgroundColor: '#F0F0F0',
                    borderBottom: '2px solid #E0E0E0',
                    textTransform: 'capitalize',
                    letterSpacing: '0.02em',
                    py: 2,
                    px: 2.5,
                  }}
                >
                  {col.replace(/_/g, ' ')}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: '#212429',
                  backgroundColor: '#F0F0F0',
                  borderBottom: '2px solid #E0E0E0',
                  textTransform: 'capitalize',
                  letterSpacing: '0.02em',
                  py: 2,
                  px: 2.5,
                  minWidth: 100,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={shownBaseColumns.length + extraColumns.length + 1}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '1rem', color: '#999999', fontWeight: 600 }}>
                      No records found
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#CCCCCC' }}>
                      Try adjusting your filters
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {paginatedData.map((row, idx) => {
              const rowId = row.id || row._id || row.date + row.subsidary;
              const editable = isDateEditable(row.date);
              const isEditing = editRowId === rowId;

              return (
                <TableRow
                  key={rowId}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFBFF',
                    borderLeft: editable ? '3px solid #10B981' : '3px solid transparent',
                    '&:hover': {
                      backgroundColor: '#E5F6FD',
                      transition: 'background-color 0.2s ease',
                    },
                  }}
                >
                  {shownBaseColumns.map(col => (
                    <TableCell
                      key={col}
                      sx={{
                        fontSize: '0.875rem',
                        color: '#212429',
                        py: 2.5,
                        px: 2.5,
                        borderBottom: '1px solid #EEEEEE',
                        // Make description column wider and wrap text
                        ...(col === 'description' && {
                          minWidth: 300,
                          maxWidth: 500,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }),
                      }}
                    >
                      {isEditing && col === 'subsidary' ? (
                        <TextField
                          value={editData.subsidary}
                          disabled
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#999999',
                            },
                          }}
                        />
                      ) : isEditing && col === 'leave' ? (
                        <TextField
                          value={editData.leave}
                          onChange={e => handleChange(e, 'leave')}
                          select
                          size="small"
                          fullWidth
                        >
                          <MenuItem value={true}>Yes</MenuItem>
                          <MenuItem value={false}>No</MenuItem>
                        </TextField>
                      ) : isEditing && col === 'description' ? (
                        <TextField
                          value={editData.description || ''}
                          onChange={e => handleChange(e, 'description')}
                          size="small"
                          fullWidth
                          multiline
                          rows={3}
                        />
                      ) : col === 'leave' ? (
                        row.leave ? (
                          <Chip
                            label="Yes"
                            size="small"
                            sx={{
                              backgroundColor: '#DDE9FF',
                              color: '#212429',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        ) : row.leave === false ? (
                          <Chip
                            label="No"
                            size="small"
                            sx={{
                              backgroundColor: '#F0F0F0',
                              color: '#666666',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        ) : (
                          ''
                        )
                      ) : col === 'date' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography
                            sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#212429' }}
                          >
                            {formatDate(row.date)}
                          </Typography>
                          {editable && (
                            <Chip
                              label="Editable"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                backgroundColor: '#10B981',
                                color: '#FFFFFF',
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        getDisplayValue(row[col])
                      )}
                    </TableCell>
                  ))}
                  {extraColumns.map(col => (
                    <TableCell
                      key={col}
                      sx={{
                        fontSize: '0.875rem',
                        color: '#212429',
                        py: 2.5,
                        px: 2.5,
                        borderBottom: '1px solid #EEEEEE',
                      }}
                    >
                      {isEditing ? (
                        <TextField
                          value={editData[col] || ''}
                          onChange={e => handleChange(e, col)}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        getDisplayValue(row[col])
                      )}
                    </TableCell>
                  ))}
                  <TableCell sx={{ py: 2.5, px: 2.5, borderBottom: '1px solid #EEEEEE' }}>
                    {isEditing ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={handleSave}
                          size="small"
                          sx={{
                            color: '#FFFFFF',
                            backgroundColor: '#10B981',
                            p: 1,
                            '&:hover': {
                              backgroundColor: '#059669',
                            },
                          }}
                        >
                          <Save sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          onClick={handleCancel}
                          size="small"
                          sx={{
                            color: '#FFFFFF',
                            backgroundColor: '#999999',
                            p: 1,
                            '&:hover': {
                              backgroundColor: '#777777',
                            },
                          }}
                        >
                          <Cancel sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ) : (
                      <Tooltip
                        title={
                          editable
                            ? 'Edit this record'
                            : "Cannot edit. Only today's records can be edited until 9 AM tomorrow."
                        }
                        arrow
                      >
                        <span>
                          <IconButton
                            onClick={() => {
                              if (editable) {
                                handleEdit(row);
                              } else {
                                setMsg(
                                  "Cannot edit. Only today's records can be edited until 9 AM tomorrow."
                                );
                              }
                            }}
                            size="small"
                            disabled={!editable}
                            sx={{
                              color: editable ? '#60A1FE' : '#CCCCCC',
                              p: 1,
                              '&:hover': {
                                backgroundColor: editable ? '#E5F6FD' : 'transparent',
                                color: editable ? '#4080DD' : '#CCCCCC',
                              },
                            }}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <Box
        sx={{
          p: 3,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F9F9F9',
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#666666',
              border: '1px solid #d0d0d0',
              backgroundColor: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#E5F6FD',
                borderColor: '#60A1FE',
                color: '#60A1FE',
              },
            },
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: '#60A1FE',
              color: '#FFFFFF',
              borderColor: '#60A1FE',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#4080DD',
              },
            },
            '& .MuiPaginationItem-ellipsis': {
              color: '#999999',
            },
          }}
        />
      </Box>
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
