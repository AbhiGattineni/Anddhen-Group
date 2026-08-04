import React, { useState, useEffect } from 'react';
import { connector } from 'src/services/connector';
import './TransactionTable.css';

const ROWS_PER_PAGE = 10;

const inr = v => `₹${Number(v || 0).toLocaleString('en-IN')}`;

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  // Philanthropy records come straight from the transactions table (APS rows),
  // newest first — anything the admin records there shows up here.
  useEffect(() => {
    connector
      .query('transactions', { filters: [['subsidiary', '==', 'APS']] })
      .then(rows =>
        setTransactions(
          [...rows].sort(
            (a, b) => new Date(b.transaction_datetime) - new Date(a.transaction_datetime)
          )
        )
      )
      .catch(setError);
  }, []);

  useEffect(() => {
    setPage(0);
    if (startDate && endDate) {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      setFilteredTransactions(
        transactions.filter(t => {
          const d = new Date(t.transaction_datetime);
          return d >= start && d <= end;
        })
      );
    } else {
      setFilteredTransactions(transactions);
    }
  }, [startDate, endDate, transactions]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / ROWS_PER_PAGE));
  const shown = filteredTransactions.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <section className="container py-4">
      <h5 className="pt-4 main-heading text-center">Transactions</h5>
      <div className="underline mx-auto"></div>

      <div className="tx-card mx-auto mt-4">
        <div className="tx-filters">
          <label>
            <span>From</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="form-control form-control-sm"
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="form-control form-control-sm"
            />
          </label>
          {(startDate || endDate) && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="tx-scroll">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Receiver</th>
                <th className="tx-right">Amount</th>
                <th className="tx-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={4} className="tx-empty">
                    Could not load transactions right now.
                  </td>
                </tr>
              ) : shown.length === 0 ? (
                <tr>
                  <td colSpan={4} className="tx-empty">
                    No records to show.
                  </td>
                </tr>
              ) : (
                shown.map(t => {
                  const credit = Number(t.credited_amount) > 0;
                  const amount = credit ? t.credited_amount : t.debited_amount;
                  return (
                    <tr key={t.id}>
                      <td>{t.sender_name}</td>
                      <td>{t.receiver_name}</td>
                      <td className={`tx-right tx-amount ${credit ? 'tx-credit' : 'tx-debit'}`}>
                        {credit ? '+' : '−'} {inr(amount)}
                      </td>
                      <td className="tx-right tx-date">
                        {new Date(t.transaction_datetime).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="tx-pager">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <span>
              Page {page + 1} of {pageCount}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage(p => p + 1)}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionTable;
