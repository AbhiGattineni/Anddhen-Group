import React, { useMemo, useState } from 'react';
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

export const Transaction = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const handleEdit = (transaction) => {
    if (transaction) {
      setEditTransaction(transaction);
      setShowModal(true);
    }
  };

  const { mutate: deleteTransaction, isLoading: isDeleting } = useDeleteData(
    'transactions',
    `/transactions/${deleteTransactionId}/delete/`,
  );

  const handleDeleteTransation = (e) => {
    e.preventDefault();
    deleteTransaction(null, {
      onSuccess: () => {
        setShowConfirmation(false);
        queryClient.invalidateQueries('transactions');
        setDeleteTransactionId(null);
      },
      onError: (error) => {
        console.error('An error occurred:', error);
      },
    });
  };

  const handleDelete = (transactionId) => {
    if (transactionId) {
      setShowConfirmation(true);
      setDeleteTransactionId(transactionId);
    }
  };

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
          const color =
            transaction.transaction_type === 'credit'
              ? 'text-success'
              : 'text-danger';
          return (
            <div className={`${color} fw-bold`}>
              ₹ {parseFloat(amount).toFixed(2)}
            </div>
          );
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
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            {/* Delete Button */}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [transactions],
  );

  const calculateRunningTotal = (index) => {
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
    transactions.forEach((transaction) => {
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
    setGlobalFilter,
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
      data: filteredTransactions || transactions, // Use filtered data if available
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useResizeColumns,
    useFlexLayout,
  );

  const { globalFilter, pageIndex, pageSize } = state;

  const handleFilterByDate = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Normalize startDate to the beginning of the day
      start.setHours(0, 0, 0, 0);

      // Normalize endDate to the end of the day
      end.setHours(23, 59, 59, 999);

      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_datetime);
        return transactionDate >= start && transactionDate <= end;
      });
      setFilteredTransactions(filtered);
    }
  };

  const handleResetData = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredTransactions(null);
  };

  return (
    <div className="container-xl mb-5 mt-2 px-3">
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary m-2"
          onClick={() => setShowModal(true)}
        >
          Add Transactions
        </button>
      </div>
      <div className="border border-black border-2 rounded ">
        <nav className="navbar navbar-expand-lg navbar-light bg-light rounded-top">
          <div className="container-fluid">
            <div className="row w-100 gap-3 p-2">
              {/* Search input */}
              <input
                type="text"
                className="form-control w-auto col"
                placeholder="Search..."
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />

              {/* Start Date */}
              <div className="d-flex align-items-center gap-2 col">
                <label htmlFor="startDate" className="mb-0 text-nowrap">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control w-auto"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>

              {/* End Date */}
              <div className="d-flex align-items-center gap-2 col">
                <label htmlFor="endDate" className="mb-0 text-nowrap">
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control w-auto"
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </div>

              {/* Filter and Reset Buttons */}
              <div className="d-flex gap-2 col text-nowrap">
                <button
                  className="btn btn-primary"
                  onClick={handleFilterByDate}
                >
                  Filter by Date
                </button>
                <button className="btn btn-secondary" onClick={handleResetData}>
                  Reset
                </button>
              </div>

              {/* Total display */}
              <div className="col text-nowrap text-sm-start text-md-end">
                <span className="nav-link">
                  Total :
                  <span
                    className={`fs-5 px-1 fw-bold ${total < 0 ? 'text-danger' : ''}`}
                  >
                    ₹ {total}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </nav>
        <div className="table-responsive">
          <table {...getTableProps()} className="table table-hover m-0">
            <thead className="thead-dark">
              {headerGroups.map((headerGroup, index) => (
                <tr
                  className="text-center"
                  {...headerGroup.getHeaderGroupProps()}
                  key={index}
                >
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps()}
                      key={index}
                      style={{ ...column.getHeaderProps().style }}
                      data-bs-toggle="tooltip"
                      title={column.Tooltip || column.Header}
                    >
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ textAlign: 'center' }}
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
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
              <p className="p-3 fw-bold">loading...</p>
            ) : (
              <tbody {...getTableBodyProps()}>
                {page.length === 0 ? ( // Check if there are no rows
                  <tr>
                    <td
                      colSpan={headerGroups[0].headers.length}
                      className="text-center p-3"
                    >
                      No transactions available
                    </td>
                  </tr>
                ) : (
                  page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={index}>
                        {row.cells.map((cell, index) => {
                          return (
                            <td {...cell.getCellProps()} key={index}>
                              <div className="text-center p-1 rounded-pill">
                                {cell.render('Cell')}
                              </div>
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
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
      credited_amount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      debited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};
