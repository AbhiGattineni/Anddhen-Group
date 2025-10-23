import React, { useState, useMemo } from 'react';
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Grid,
  Button,
  Pagination,
} from '@mui/material';
import { useFetchData } from '../../../react-query/useFetchApis';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const HappinessIndexList = () => {
  const { data, isLoading, error } = useFetchData('happiness', '/happiness/');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items per page (3x3 grid)

  const filteredData = useMemo(() => {
    if (!data) return [];

    const filtered = data.filter(({ full_name, date }) => {
      const normalizedName = (full_name || 'Undefined').toLowerCase();
      const nameMatch = normalizedName.includes(searchQuery.toLowerCase());

      const recordDate = new Date(date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const dateMatch = (!from || recordDate >= from) && (!to || recordDate <= to);

      return nameMatch && dateMatch;
    });

    // Sort by date in descending order (latest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data, searchQuery, fromDate, toDate]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData.length, itemsPerPage]);

  const averageScore = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const total = filteredData.reduce((sum, record) => sum + record.happiness_score, 0);
    return (total / filteredData.length).toFixed(2);
  }, [filteredData]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, fromDate, toDate]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = score => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 1,
        paddingX: 1,
        paddingY: 0.5,
        gap: 0.5,
      }}
    >
      {[...Array(5)].map((_, i) =>
        i < score ? (
          <StarIcon key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
        ) : (
          <StarBorderIcon key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
        )
      )}
      <Typography sx={{ marginLeft: 2, color: '#000', fontWeight: 500 }}>
        {score + ' / 5'}
      </Typography>
    </Box>
  );

  if (isLoading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Typography color="error">Error fetching data.</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      {/* Filter Controls */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            fullWidth
            label="Search by Employee Name"
            variant="outlined"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: '#ffc107', color: '#000' }}
            onClick={() => {
              setFromDate(fromDate);
              setToDate(toDate);
            }}
          >
            Apply
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            fullWidth
            sx={{ backgroundColor: '#ffc107', color: '#000' }}
            onClick={() => {
              setFromDate('');
              setToDate('');
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      {/* Average Happiness Index */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          color: '#000',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: 2,
          padding: 1.5,
          textAlign: 'center',
        }}
      >
        Average Happiness Index: {averageScore} / 5
      </Typography>

      {/* Records Count and Page Info */}
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          textAlign: 'center',
          color: '#666',
        }}
      >
        Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
        {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
      </Typography>

      {/* Display Happiness Index Records */}
      {filteredData.length === 0 ? (
        <Typography align="center">No records found.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedData.map(({ full_name, happiness_score, description, date }, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: 160,
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 1,
                    backgroundColor: '#fafafa',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      {full_name || 'Undefined'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'gray',
                      }}
                    >
                      {new Date(date).toDateString()}
                    </Typography>
                    {renderStars(happiness_score)}
                    <Box sx={{ height: 40, marginTop: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontStyle: 'italic',
                          visibility: description ? 'visible' : 'hidden',
                        }}
                      >
                        {`"${description || 'placeholder'}"`}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#000',
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#ffc107 !important',
                    color: '#000',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default HappinessIndexList;
