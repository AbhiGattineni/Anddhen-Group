import React, { useCallback, useMemo, useState } from 'react';
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
import { generateTransactionPDF } from './TransactionPDFGenerator';
import './Transaction.css';

export const Transaction = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('sender_name');
  const [selectedName, setSelectedName] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchTransactions = async () => {
    const response = await fetch(`${API_BASE_URL}/transactions/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: transactions = [], isLoading } = useQuery('transactions', fetchTransactions, {
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });

  // Stable sorted transactions reference
  const sortedTransactions = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];
    return [...transactions].sort((a, b) => {
      return new Date(b.transaction_datetime) - new Date(a.transaction_datetime);
    });
  }, [transactions]);

  // Stable table data reference - CRITICAL FIX
  const tableData = useMemo(() => {
    if (isFiltered && Array.isArray(filteredTransactions) && filteredTransactions.length > 0) {
      return filteredTransactions;
    }
    return sortedTransactions;
  }, [isFiltered, filteredTransactions, sortedTransactions]);

  const employeeSearch = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const seen = new Set();
    return transactions
      .filter(tx => tx && tx[selectedColumn])
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
  }, [selectedColumn, transactions]);

  const handleEdit = useCallback(transaction => {
    if (transaction) {
      setEditTransaction(transaction);
      setShowModal(true);
    }
  }, []);

  const { mutate: deleteTransaction, isLoading: isDeleting } = useDeleteData(
    'transactions',
    `/transactions/${deleteTransactionId}/delete/`
  );

  const handleDeleteTransation = useCallback(
    e => {
      if (e) e.preventDefault();
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
    },
    [deleteTransaction, queryClient, deleteTransactionId]
  );

  const handleDelete = useCallback(transactionId => {
    if (transactionId) {
      setShowConfirmation(true);
      setDeleteTransactionId(transactionId);
    }
  }, []);

  const { paymentTypes, subsidiaries, currencies } = useMemo(() => {
    if (!Array.isArray(transactions)) return { paymentTypes: [], subsidiaries: [], currencies: [] };

    const getUnique = key => [...new Set(transactions.map(tx => tx && tx[key]).filter(Boolean))];
    return {
      paymentTypes: getUnique('payment_type'),
      subsidiaries: getUnique('subsidiary'),
      currencies: getUnique('currency'),
    };
  }, [transactions]);

  // STABLE columns definition with memoized callbacks
  const columns = useMemo(() => {
    const handleEditClick = transaction => {
      handleEdit(transaction);
    };

    const handleDeleteClick = id => {
      handleDelete(id);
    };

    return [
      { Header: 'Sender', accessor: 'sender_name', width: 150, disableSortBy: false },
      { Header: 'Receiver', accessor: 'receiver_name', width: 150, disableSortBy: false },
      {
        Header: 'Acc Name',
        Tooltip: 'Accountant Name',
        accessor: 'accountant_name',
        width: 140,
        disableSortBy: false,
      },
      {
        Header: 'Tr Date',
        Tooltip: 'Transaction Date',
        accessor: 'transaction_datetime',
        width: 160,
        disableSortBy: false,
        Cell: ({ value }) => {
          if (!value) return '-';
          try {
            return new Date(value).toLocaleString();
          } catch (e) {
            return value;
          }
        },
      },
      {
        Header: 'Up Date',
        Tooltip: 'Uploaded Date',
        accessor: 'uploaded_datetime',
        width: 160,
        disableSortBy: false,
        Cell: ({ value }) => {
          if (!value) return '-';
          try {
            return new Date(value).toLocaleString();
          } catch (e) {
            return value;
          }
        },
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        width: 130,
        disableSortBy: false,
        Cell: ({ row }) => {
          const transaction = row.original;
          if (!transaction) return '-';

          const amount =
            transaction.transaction_type === 'credit'
              ? transaction.credited_amount
              : transaction.debited_amount;
          const color = transaction.transaction_type === 'credit' ? 'credit-badge' : 'debit-badge';
          return (
            <span className={`amount-badge ${color}`}>₹ {parseFloat(amount || 0).toFixed(2)}</span>
          );
        },
      },
      {
        Header: 'Pay Type',
        Tooltip: 'Payment Type',
        accessor: 'payment_type',
        width: 120,
        disableSortBy: false,
      },
      {
        Header: 'Subsidiary',
        accessor: 'subsidiary',
        width: 120,
        disableSortBy: false,
      },
      {
        Header: 'Currency',
        accessor: 'currency',
        width: 100,
        disableSortBy: false,
      },
      {
        Header: 'Desp',
        Tooltip: 'Description',
        accessor: 'description',
        width: 180,
        disableSortBy: false,
      },
      {
        Header: 'Total',
        accessor: 'total',
        width: 130,
        disableSortBy: true,
        Cell: ({ row }) => {
          if (!row || !tableData) return '₹ 0.00';

          let total = 0;
          for (let i = 0; i <= row.index && i < tableData.length; i++) {
            const transaction = tableData[i];
            if (transaction && transaction.transaction_type === 'credit') {
              total += parseFloat(transaction.credited_amount || 0);
            } else if (transaction && transaction.transaction_type === 'debit') {
              total -= parseFloat(transaction.debited_amount || 0);
            }
          }
          const colorClass = total >= 0 ? 'total-positive' : 'total-negative';
          return <span className={`total-amount ${colorClass}`}>₹ {total.toFixed(2)}</span>;
        },
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        width: 160,
        disableSortBy: true,
        Cell: ({ row }) => {
          if (!row || !row.original) return null;

          return (
            <div className="action-buttons">
              <button
                className="btn-edit"
                onClick={e => {
                  e.stopPropagation();
                  handleEditClick(row.original);
                }}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                </svg>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteClick(row.original.id);
                }}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
                Delete
              </button>
            </div>
          );
        },
      },
    ];
  }, [tableData, handleEdit, handleDelete]);

  const total = useMemo(() => {
    if (!Array.isArray(tableData)) return '0.00';

    let totalAmount = 0;
    tableData.forEach(transaction => {
      if (!transaction) return;

      if (transaction.transaction_type === 'credit') {
        totalAmount += parseFloat(transaction.credited_amount || 0);
      } else {
        totalAmount -= parseFloat(transaction.debited_amount || 0);
      }
    });
    return totalAmount.toFixed(2);
  }, [tableData]);

  // Use stable configuration for useTable
  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [],
      },
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
      autoResetGlobalFilter: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useResizeColumns,
    useFlexLayout
  );

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
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const handleFilter = useCallback(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const filtered = transactions.filter(transaction => {
      if (!transaction) return false;

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

    const sortedFiltered = filtered.sort((a, b) => {
      return new Date(b.transaction_datetime) - new Date(a.transaction_datetime);
    });

    setFilteredTransactions(sortedFiltered);
    setIsFiltered(true);
  }, [
    startDate,
    endDate,
    transactions,
    selectedName,
    selectedColumn,
    selectedPaymentType,
    selectedSubsidiary,
    selectedCurrency,
  ]);

  const handleExportPDF = useCallback(async () => {
    setIsGeneratingPDF(true);

    try {
      if (!Array.isArray(tableData) || tableData.length === 0) {
        setIsGeneratingPDF(false);
        return;
      }

      const filterData = {
        startDate,
        endDate,
        selectedName,
        selectedColumn,
        selectedPaymentType,
        selectedSubsidiary,
        selectedCurrency,
      };

      const result = await generateTransactionPDF(tableData, filterData);
      console.log('PDF generated successfully:', result);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [
    tableData,
    startDate,
    endDate,
    selectedName,
    selectedColumn,
    selectedPaymentType,
    selectedSubsidiary,
    selectedCurrency,
  ]);

  const handleResetData = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setSelectedColumn('sender_name');
    setSelectedName('');
    setSelectedPaymentType('');
    setSelectedSubsidiary('');
    setSelectedCurrency('');
    setFilteredTransactions([]);
    setIsFiltered(false);
  }, []);

  return (
    <div className="transaction-container">
      <div className="header-section">
        <div className="header-content">
          <div>
            <h4 className="page-title">Transaction Management</h4>
            <p className="page-subtitle">Track and manage all financial transactions</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-export-pdf"
              onClick={handleExportPDF}
              disabled={
                isGeneratingPDF || isLoading || !Array.isArray(tableData) || tableData.length === 0
              }
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              className="btn-add-transaction"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
              {isLoading ? 'Loading...' : 'Add Transaction'}
            </button>
          </div>
        </div>
      </div>

      <div className="main-card">
        <div className="card-header">
          <div className="summary-section">
            <div className="summary-label">Current Balance</div>
            <div className={`summary-value ${parseFloat(total) >= 0 ? 'positive' : 'negative'}`}>
              ₹ {total}
            </div>
          </div>
          <button
            className={`btn-filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M7 11h4v-1H7v1zm-3-4h10V6H4v1zm6 7h2v-1h-2v1z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="filter-section expanded">
            <Paper elevation={0} className="filter-paper">
              <div className="filter-grid">
                <div className="filter-item filter-item-full">
                  <FormControl fullWidth size="small">
                    <InputLabel>Search By</InputLabel>
                    <Select
                      value={selectedColumn}
                      label="Search By"
                      onChange={e => setSelectedColumn(e.target.value)}
                    >
                      <MenuItem value="sender_name">Sender</MenuItem>
                      <MenuItem value="receiver_name">Receiver</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="filter-item filter-item-large">
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

                <div className="filter-item">
                  <label className="filter-label">Start Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={e => setStartDate(new Date(e.target.value))}
                  />
                </div>

                <div className="filter-item">
                  <label className="filter-label">End Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={e => setEndDate(new Date(e.target.value))}
                  />
                </div>

                <div className="filter-item">
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                      label="Payment Type"
                      value={selectedPaymentType}
                      onChange={e => setSelectedPaymentType(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {paymentTypes.map(t => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="filter-item">
                  <FormControl fullWidth size="small">
                    <InputLabel>Subsidiary</InputLabel>
                    <Select
                      label="Subsidiary"
                      value={selectedSubsidiary}
                      onChange={e => setSelectedSubsidiary(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {subsidiaries.map(s => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="filter-item">
                  <FormControl fullWidth size="small">
                    <InputLabel>Currency</InputLabel>
                    <Select
                      label="Currency"
                      value={selectedCurrency}
                      onChange={e => setSelectedCurrency(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {currencies.map(c => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="filter-actions">
                  <button className="btn-apply-filter" onClick={handleFilter} type="button">
                    Apply Filters
                  </button>
                  <button className="btn-reset-filter" onClick={handleResetData} type="button">
                    Reset
                  </button>
                </div>
              </div>
            </Paper>
          </div>
        )}

        <div className="table-wrapper">
          <div className="table-container">
            <table {...getTableProps()} className="data-table">
              <thead className="table-header">
                {headerGroups.map((headerGroup, hgIndex) => {
                  const { key: headerGroupKey, ...headerGroupProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={headerGroupKey || hgIndex} {...headerGroupProps}>
                      {headerGroup.headers.map((column, colIndex) => {
                        const { key: columnKey, ...columnProps } = column.getHeaderProps();
                        return (
                          <th
                            key={columnKey || colIndex}
                            {...columnProps}
                            title={column.Tooltip || column.Header}
                          >
                            <div className="header-content">
                              {column.render('Header')}
                              {column.isSorted && (
                                <span className="sort-indicator">
                                  {column.isSortedDesc ? '↓' : '↑'}
                                </span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={columns.length} className="loading-cell">
                      <div className="loading-spinner"></div>
                      <p>Loading transactions...</p>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody {...getTableBodyProps()}>
                  {page.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="empty-cell">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <path
                            d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                            stroke="#E0E7FF"
                            strokeWidth="2"
                          />
                          <path
                            d="M24 16V24L28 28"
                            stroke="#A5B4FC"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p>No transactions found</p>
                        <span>Try adjusting your filters or add a new transaction</span>
                      </td>
                    </tr>
                  ) : (
                    page.map((row, rowIndex) => {
                      prepareRow(row);
                      const { key: rowKey, ...rowProps } = row.getRowProps();
                      return (
                        <tr key={rowKey || rowIndex} {...rowProps} className="table-row">
                          {row.cells.map((cell, cellIndex) => {
                            const { key: cellKey, ...cellProps } = cell.getCellProps();
                            return (
                              <td key={cellKey || cellIndex} {...cellProps}>
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>

        <div className="pagination-section">
          <div className="pagination-info">
            Showing <strong>{page.length}</strong> of <strong>{tableData.length}</strong>{' '}
            transactions
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              title="First page"
              type="button"
            >
              ⟨⟨
            </button>
            <button
              className="pagination-btn"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              title="Previous page"
              type="button"
            >
              ⟨
            </button>
            <span className="page-indicator">
              Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length || 1}</strong>
            </span>
            <button
              className="pagination-btn"
              onClick={() => nextPage()}
              disabled={!canNextPage}
              title="Next page"
              type="button"
            >
              ⟩
            </button>
            <button
              className="pagination-btn"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              title="Last page"
              type="button"
            >
              ⟩⟩
            </button>
          </div>
          <div className="page-size-selector">
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[5, 10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          editTransaction={editTransaction}
          setEditTransaction={setEditTransaction}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      {showConfirmation && (
        <ConfirmationDialog
          title="Confirmation"
          show={showConfirmation}
          isLoading={isDeleting}
          message="Are you sure you want to delete transaction?"
          onConfirm={handleDeleteTransation}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

Transaction.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      transaction_type: PropTypes.string,
      total: PropTypes.number,
      credited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      debited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};
