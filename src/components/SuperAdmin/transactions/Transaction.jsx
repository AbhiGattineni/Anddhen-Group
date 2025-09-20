import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useResizeColumns,
  useFlexLayout,
} from 'react-table';
import { TransactionModal } from 'src/components/organisms/Modal/TransactionModal';
import PropTypes from 'prop-types';
import { useDeleteData } from 'src/react-query/useFetchApis';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';
import ReactSelectDropdown from 'src/components/atoms/Search/ReactSelectDropdown';
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';

export const Transaction = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('sender_name');
  const [selectedName, setSelectedName] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchTransactions = async () => {
    const response = await fetch(`${API_BASE_URL}/transactions/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const {
    data: transactions = [], // Provide a default value of an empty array
    isLoading,
  } = useQuery('transactions', fetchTransactions);

  const sortedTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return [...transactions].sort((a, b) => {
      return new Date(b.transaction_datetime) - new Date(a.transaction_datetime);
    });
  }, [transactions]);

  const handleEdit = transaction => {
    if (transaction) {
      setEditTransaction(transaction);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (!transactions) return;

    // const key =
    //   selectedColumn === 'sender_name' ? 'sender_name' : 'receiver_name';

    const seen = new Set();
    const empNames = transactions
      .filter(tx => tx[selectedColumn])
      .map(tx => ({
        value: tx[selectedColumn].toLowerCase(),
        label: tx[selectedColumn],
      }))
      .filter(item => {
        const id = `${item.value}:${item.label}`;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

    setEmployeeSearch(prev => {
      const isEqual =
        prev.length === empNames.length &&
        prev.every(
          (item, index) =>
            item.value === empNames[index].value && item.label === empNames[index].label
        );

      return isEqual ? prev : empNames;
    });
  }, [selectedColumn, transactions]);

  const { mutate: deleteTransaction, isLoading: isDeleting } = useDeleteData(
    'transactions',
    `/transactions/${deleteTransactionId}/delete/`
  );

  const handleDeleteTransation = e => {
    e.preventDefault();
    deleteTransaction(null, {
      onSuccess: () => {
        setShowConfirmation(false);
        queryClient.invalidateQueries('transactions');
        setDeleteTransactionId(null);
      },
      onError: error => {
        console.error('An error occurred:', error);
      },
    });
  };

  const handleDelete = transactionId => {
    if (transactionId) {
      setShowConfirmation(true);
      setDeleteTransactionId(transactionId);
    }
  };

  const { paymentTypes, subsidiaries, currencies } = useMemo(() => {
    const getUnique = key => [...new Set(transactions?.map(tx => tx[key]))];
    return {
      paymentTypes: getUnique('payment_type'),
      subsidiaries: getUnique('subsidiary'),
      currencies: getUnique('currency'),
    };
  }, [transactions]);

  const columns = useMemo(
    () => [
      { Header: 'Sender', accessor: 'sender_name' },
      { Header: 'Receiver', accessor: 'receiver_name' },
      {
        Header: 'Acc Name',
        Tooltip: 'Accountant Name',
        accessor: 'accountant_name',
      },
      {
        Header: 'Tr Date',
        Tooltip: 'Transaction Date',
        accessor: 'transaction_datetime',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Up Date',
        Tooltip: 'Uploaded Date',
        accessor: 'uploaded_datetime',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ row }) => {
          const transaction = row.original;
          const amount =
            transaction.transaction_type === 'credit'
              ? transaction.credited_amount
              : transaction.debited_amount;
          const color = transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger';
          return <div className={`${color} fw-bold`}>₹ {parseFloat(amount).toFixed(2)}</div>;
        },
      },
      { Header: 'Pay Type', Tooltip: 'Payment Type', accessor: 'payment_type' },
      { Header: 'Subsidiary', accessor: 'subsidiary' },
      { Header: 'Currency', accessor: 'currency' },
      { Header: 'Desp', Tooltip: 'Description', accessor: 'description' },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: ({ row }) => calculateRunningTotal(row.index),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center gap-2">
            {/* Edit Button */}
            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(row.original)}>
              Edit
            </button>
            {/* Delete Button */}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.original.id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [transactions]
  );

  const calculateRunningTotal = index => {
    let total = 0;
    for (let i = 0; i <= index && i < transactions.length; i++) {
      const transaction = transactions[i];
      if (transaction && transaction.transaction_type === 'credit') {
        total += parseFloat(transaction.credited_amount);
      } else if (transaction && transaction.transaction_type === 'debit') {
        total -= parseFloat(transaction.debited_amount);
      }
    }
    return `₹ ${total.toFixed(2)}`;
  };

  const total = useMemo(() => {
    let totalAmount = 0;
    transactions.forEach(transaction => {
      if (transaction.transaction_type === 'credit') {
        totalAmount += parseFloat(transaction.credited_amount);
      } else {
        totalAmount -= parseFloat(transaction.debited_amount);
      }
    });
    return totalAmount.toFixed(2);
  }, [transactions]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredTransactions || sortedTransactions, // Use filtered data if available, otherwise sorted data
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useResizeColumns,
    useFlexLayout
  );

  const { pageIndex, pageSize } = state;

  const handleFilter = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_datetime);

      const isWithinDateRange =
        (!start || transactionDate >= start) && (!end || transactionDate <= end);

      const matchesName =
        !selectedName ||
        (selectedColumn &&
          transaction[selectedColumn]?.toLowerCase().includes(selectedName.toLowerCase()));

      const matchesPaymentType =
        !selectedPaymentType || transaction.payment_type === selectedPaymentType;

      const matchesSubsidiary =
        !selectedSubsidiary || transaction.subsidiary === selectedSubsidiary;

      const matchesCurrency = !selectedCurrency || transaction.currency === selectedCurrency;

      return (
        isWithinDateRange &&
        matchesName &&
        matchesPaymentType &&
        matchesSubsidiary &&
        matchesCurrency
      );
    });

    setFilteredTransactions(filtered);
  };

  const handleResetData = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedColumn('sender_name'); // or default to '' if you prefer
    setSelectedName('');
    setSelectedPaymentType('');
    setSelectedSubsidiary('');
    setSelectedCurrency('');
    setFilteredTransactions(sortedTransactions); // reset to full list, maintaining sort order
  };

  return (
    <div className="container-xl mb-5 mt-2 px-3">
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary m-2" onClick={() => setShowModal(true)}>
          Add Transactions
        </button>
      </div>
      <div className="border border-black border-2 rounded ">
        <nav className="navbar navbar-light bg-light rounded-top flex-column">
          <div className="container-fluid w-100 px-3 py-2 d-flex justify-content-between align-items-center">
            <h5 className="m-0">Transactions</h5>
            <div className="d-flex align-items-center gap-3">
              <span className="fs-5">
                <strong>Total:</strong>{' '}
                <span className={`${total < 0 ? 'text-danger' : 'text-success'} fw-bold`}>
                  ₹ {total}
                </span>
              </span>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="filterCollapse"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          <div className={`collapse w-100 ${showFilters ? 'show' : ''}`} id="filterCollapse">
            {/* make Paper full‑width so it spans below the header */}
            <Paper elevation={0} className="w-100 mt-2 p-4 bg-light">
              <div className="row gx-4 gy-3 align-items-end">
                {/* Select Option */}
                <div className="col-12 col-md-3">
                  <FormControl fullWidth>
                    <InputLabel id="dropdown-label">Select Option</InputLabel>
                    <Select
                      labelId="dropdown-label"
                      value={selectedColumn}
                      label="Select Option"
                      onChange={e => setSelectedColumn(e.target.value)}
                    >
                      <MenuItem value="sender_name">Sender</MenuItem>
                      <MenuItem value="receiver_name">Receiver</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* ReactSelectDropdown */}
                <div className="col-12 col-md-9">
                  <ReactSelectDropdown
                    options={employeeSearch}
                    value={selectedName}
                    onChange={setSelectedName}
                    placeholder={`Search ${selectedColumn
                      .split('_')
                      .map(w => w[0].toUpperCase() + w.slice(1))
                      .join(' ')}`}
                    variant="mui"
                  />
                </div>

                {/* Start / End Dates */}
                <div className="col-md-3 col-lg-2">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={e => setStartDate(new Date(e.target.value))}
                  />
                </div>
                <div className="col-md-3 col-lg-2">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={e => setEndDate(new Date(e.target.value))}
                  />
                </div>

                {/* Payment Type / Subsidiary / Currency */}
                <div className="col-md-3 col-lg-2">
                  <FormControl fullWidth>
                    <InputLabel id="payment-type-label">Pay Type</InputLabel>
                    <Select
                      labelId="payment-type-label"
                      value={selectedPaymentType}
                      onChange={e => setSelectedPaymentType(e.target.value)}
                    >
                      {paymentTypes.map(t => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 col-lg-2">
                  <FormControl fullWidth>
                    <InputLabel id="subsidiary-label">Subsidiary</InputLabel>
                    <Select
                      labelId="subsidiary-label"
                      value={selectedSubsidiary}
                      onChange={e => setSelectedSubsidiary(e.target.value)}
                    >
                      {subsidiaries.map(s => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 col-lg-2">
                  <FormControl fullWidth>
                    <InputLabel id="currency-label">Currency</InputLabel>
                    <Select
                      labelId="currency-label"
                      value={selectedCurrency}
                      onChange={e => setSelectedCurrency(e.target.value)}
                    >
                      {currencies.map(c => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Actions */}
                <div className="col-md-3 col-lg-2 d-flex gap-2">
                  <button className="btn btn-success w-100" onClick={handleFilter}>
                    Filter
                  </button>
                  <button className="btn btn-outline-secondary w-100" onClick={handleResetData}>
                    Reset
                  </button>
                </div>
              </div>
            </Paper>
          </div>
        </nav>
        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table {...getTableProps()} className="table table-hover m-0">
            <thead
              className="thead-dark"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                background: '#fff',
              }}
            >
              {headerGroups.map((headerGroup, index) => (
                <tr className="text-center" {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps()}
                      key={index}
                      style={{
                        ...column.getHeaderProps().style,
                        position: 'sticky',
                        top: 0,
                        background: '#fff',
                        zIndex: 2,
                      }}
                      data-bs-toggle="tooltip"
                      title={column.Tooltip || column.Header}
                    >
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ textAlign: 'center' }}
                      >
                        {column.render('Header')}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                        <div
                          {...column.getResizerProps()}
                          className="resizer"
                          style={{
                            width: '5px',
                            height: '100%',
                            backgroundColor: 'transparent',
                            cursor: 'col-resize',
                          }}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={headerGroups[0].headers.length} className="text-center p-3">
                    <p className="p-3 fw-bold">Loading...</p>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody {...getTableBodyProps()}>
                {page.length === 0 ? (
                  <tr>
                    <td colSpan={headerGroups[0].headers.length} className="text-center p-3">
                      No transactions available
                    </td>
                  </tr>
                ) : (
                  page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={index}>
                        {row.cells.map((cell, index) => (
                          <td {...cell.getCellProps()} key={index}>
                            <div className="text-center p-1 rounded-pill">
                              {cell.render('Cell')}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            )}
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-bottom">
          <div>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'<<'}
            </button>
            <button
              className="btn btn-outline-secondary mx-1 btn-sm"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </button>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <button
              className="btn btn-outline-secondary mx-1 btn-sm"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>
          </div>
          <div>
            <select
              className="form-select form-select-sm"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <TransactionModal
        editTransaction={editTransaction}
        setEditTransaction={setEditTransaction}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <ConfirmationDialog
        title="Confirmation"
        show={showConfirmation}
        isLoading={isDeleting}
        message="Are you sure you want to delete transaction?"
        onConfirm={handleDeleteTransation}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
};
Transaction.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      transaction_type: PropTypes.string,
      total: PropTypes.number,
      credited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      debited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};
