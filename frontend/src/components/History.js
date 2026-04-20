import React, { useState, useEffect } from 'react';
import { borrowAPI } from '../utils/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await borrowAPI.getBorrowHistory();
      setHistory(response.data.borrows);
      setError('');
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history-container">
      <h1>Borrowing History</h1>

      {error && <div className="error-message">{error}</div>}

      {history.length === 0 ? (
        <div className="no-data">
          <p>No borrowing history yet.</p>
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Duration</th>
                <th>Cost</th>
                <th>Overdue Days</th>
                <th>Overdue Cost</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((borrow) => (
                <tr key={borrow._id}>
                  <td className="book-title">{borrow.bookId.title}</td>
                  <td>{borrow.bookId.author}</td>
                  <td>{formatDate(borrow.borrowDate)}</td>
                  <td>{formatDate(borrow.returnDate)}</td>
                  <td>{borrow.numberOfDays} days</td>
                  <td>{formatCurrency(borrow.totalCost)}</td>
                  <td>{borrow.overdueDays || 0} days</td>
                  <td>{formatCurrency(borrow.overdueCost || 0)}</td>
                  <td className="total-amount">
                    {formatCurrency(borrow.totalAmount || borrow.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
