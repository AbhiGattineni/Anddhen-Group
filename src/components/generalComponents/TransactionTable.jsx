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
  TablePagination, // Added TablePagination
} from '@mui/material';
import { CreditCard, MoneyOff, Refresh } from '@mui/icons-material';
import { useFetchData } from 'src/react-query/useFetchApis';

const TransactionTable = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const {
    data: transactions = [], // Provide a default value of an empty array
  } = useFetchData('apstransactions', `/transactions/aps/`);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  useEffect(() => {
    // Filter transactions based on date range
    if (startDate && endDate) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_datetime);
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate <= new Date(endDate)
        );
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <h5 className="pt-5 main-heading text-center">Transactions</h5>
      <div className="underline mx-auto"></div>
      <Box
        container
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

      {/* Table */}
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
              <TableCell sx={{ fontWeight: 'bold' }}>
                Transaction Type
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
                  <TableCell>
                    {transaction.transaction_type === 'credit' ? (
                      <Chip
                        icon={<CreditCard />}
                        label="Credit"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        icon={<MoneyOff />}
                        label="Debit"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}
      />
    </Box>
  );
};

export default TransactionTable;
