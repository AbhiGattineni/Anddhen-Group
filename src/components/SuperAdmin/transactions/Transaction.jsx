import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import { TransactionModal } from 'src/components/organisms/Modal/TransactionModal';
// import 'bootstrap/dist/css/bootstrap.min.css';

export const Transaction = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const columns = useMemo(
    () => [
      { Header: 'Sender', accessor: 'sender_name' },
      { Header: 'Receiver', accessor: 'receiver_name' },
      { Header: 'Transaction ID', accessor: 'transaction_id' },
      { Header: 'Accountant Name', accessor: 'accountant_name' },
      {
        Header: 'Transaction Date',
        accessor: 'transaction_datetime',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Uploaded Date',
        accessor: 'uploaded_datetime',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      { Header: 'Credited Amount', accessor: 'credited_amount' },
      { Header: 'Debited Amount', accessor: 'debited_amount' },
      { Header: 'Payment Type', accessor: 'payment_type' },
      { Header: 'Subsidiary', accessor: 'subsidiary' },
      { Header: 'Currency', accessor: 'currency' },
      { Header: 'Description', accessor: 'description' },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: ({ row }) => calculateRunningTotal(row.index),
      },
    ],
    [transactions]
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
    return `$${total.toFixed(2)}`;
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
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  const handleFilterByDate = () => {
    if (startDate && endDate) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_datetime);
        return transactionDate >= startDate && transactionDate <= endDate;
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
    <div className="container-xl mb-5 mt-2 p-0">
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary m-2"
          onClick={() => setShowModal(true)}
        >
          Add Transactions
        </button>
      </div>
      <div className="border border-black border-2 rounded">
        <nav className="navbar navbar-expand-lg navbar-light bg-light rounded-top">
          <div className="container-fluid">
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center w-100">
              <input
                type="text"
                className="w-50 form-control"
                placeholder="Search..."
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center w-100 gap-2 gap-md-0">
                <div className="form-group mx-2">
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={
                      startDate ? startDate.toISOString().split('T')[0] : ''
                    }
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                  />
                </div>
                <div className="form-group mx-2">
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control w-100"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                  />
                </div>
                <button
                  className="btn btn-primary mx-2"
                  onClick={handleFilterByDate}
                >
                  Filter by Date
                </button>
                <button className="btn btn-secondary" onClick={handleResetData}>
                  Reset
                </button>
              </div>
              <div>
                <span className="nav-link fw-bold">Total: ₹{total}</span>
              </div>
            </div>
          </div>
        </nav>
        <div className="table-responsive">
          <table {...getTableProps()} className="table table-hover m-0">
            <thead className="thead-dark">
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      className="bg-info text-white"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={index}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading ? (
              <p className="p-3 fw-bold">loading...</p>
            ) : (
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => {
                        const columnId = cell.column.id;
                        const isTransactionType =
                          columnId === 'transaction_type';
                        const isTotal = columnId === 'total';
                        const className = isTransactionType
                          ? row.original.transaction_type === 'credit'
                            ? 'bg-success text-white'
                            : 'bg-danger text-white'
                          : isTotal
                            ? row.original.transaction_type === 'credit'
                              ? 'text-success fw-bold'
                              : 'text-danger fw-bold'
                            : '';
                        return (
                          <td {...cell.getCellProps()} key={index}>
                            <div
                              className={`${className} text-center p-1 rounded-pill`}
                            >
                              {cell.render('Cell')}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-bottom">
          <div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'<<'}
            </button>
            <button
              className="btn btn-outline-secondary mx-1"
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
              className="btn btn-outline-secondary mx-1"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>
          </div>
          <div>
            <select
              className="form-select"
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
      <TransactionModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};
