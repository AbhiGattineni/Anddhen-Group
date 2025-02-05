import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Chip,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { Refresh, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useFetchData } from 'src/react-query/useFetchApis';

const TransactionTable = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10; // Fixed rows per page

  const { data: transactions = [] } = useFetchData(
    'apstransactions',
    `/transactions/aps/`,
  );

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_datetime);
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        return transactionDate >= start && transactionDate <= end;
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [startDate, endDate, transactions]);

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleNextPage = () => {
    if ((page + 1) * rowsPerPage < filteredTransactions.length) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h5 className="pt-5 main-heading text-center">Transactions</h5>
      <div className="underline mx-auto"></div>

      {/* Date Filters and Reset Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          my: 3,
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{
              color: 'black',
              backgroundColor: '#ffc107',
              '&:hover': {
                backgroundColor: '#edb100',
              },
            }}
            onClick={handleReset}
            startIcon={<Refresh />}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {/* Transaction Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Receiver Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sender Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Credited Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Debited Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                Transaction Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.receiver_name}</TableCell>
                  <TableCell>{transaction.sender_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={`₹${transaction.credited_amount}`}
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`₹${transaction.debited_amount}`}
                      color="error"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(
                      transaction.transaction_datetime,
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <IconButton onClick={handlePreviousPage} disabled={page === 0}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="body1" sx={{ mx: 2 }}>
          Page {page + 1} of{' '}
          {Math.ceil(filteredTransactions.length / rowsPerPage)}
        </Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={(page + 1) * rowsPerPage >= filteredTransactions.length}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TransactionTable;
