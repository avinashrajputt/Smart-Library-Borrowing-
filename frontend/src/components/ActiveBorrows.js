import React, { useState, useEffect } from 'react';
import { borrowAPI } from '../utils/api';
import { formatDate, formatCurrency, getDaysUntilDue, isOverdue } from '../utils/helpers';
import './ActiveBorrows.css';

const ActiveBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveBorrows();
  }, []);

  const fetchActiveBorrows = async () => {
    try {
      setLoading(true);
      const response = await borrowAPI.getActiveBorrows();
      setBorrows(response.data.borrows);
      setError('');
    } catch (err) {
      setError('Failed to load active borrows');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrow) => {
    setSelectedBorrow(borrow);
    setReturnDate(new Date().toISOString().split('T')[0]);
  };

  const submitReturn = async () => {
    if (!returnDate) {
      alert('Please select a return date');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await borrowAPI.submitBorrow(selectedBorrow._id, returnDate);
      alert('Book returned successfully!');
      setSelectedBorrow(null);
      fetchActiveBorrows();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading active borrows...</div>;

  return (
    <div className="active-borrows-container">
      <h1>Active Borrows</h1>

      {error && <div className="error-message">{error}</div>}

      {borrows.length === 0 ? (
        <div className="no-data">
          <p>You have no active borrows. Start by borrowing a book!</p>
        </div>
      ) : (
        <div className="borrows-list">
          {borrows.map((borrow) => (
            <div key={borrow._id} className="borrow-card">
              <div className="borrow-header">
                <h3>{borrow.bookId.title}</h3>
                <p className="author">{borrow.bookId.author}</p>
              </div>

              <div className="borrow-details">
                <p>
                  <strong>Borrow Date:</strong> {formatDate(borrow.borrowDate)}
                </p>
                <p>
                  <strong>Due Date:</strong> {formatDate(borrow.dueDate)}{' '}
                  {isOverdue(borrow.dueDate) ? (
                    <span className="overdue">OVERDUE</span>
                  ) : (
                    <span className={getDaysUntilDue(borrow.dueDate) <= 3 ? 'warning' : ''}>
                      ({getDaysUntilDue(borrow.dueDate)} days remaining)
                    </span>
                  )}
                </p>
                <p>
                  <strong>Duration:</strong> {borrow.numberOfDays} days
                </p>
                <p>
                  <strong>Price Per Day:</strong> {formatCurrency(borrow.pricePerDay)}
                </p>
                <p className="total-cost">
                  <strong>Total Cost:</strong> {formatCurrency(borrow.totalCost)}
                </p>
              </div>

              <button
                className="return-btn"
                onClick={() => handleReturnBook(borrow)}
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBorrow && (
        <div className="return-modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedBorrow(null)}
            >
              ×
            </button>
            <h2>Return: {selectedBorrow.bookId.title}</h2>

            <div className="return-form">
              <label>
                Return Date:
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </label>

              <div className="return-summary">
                <p>
                  <strong>Original Cost:</strong> {formatCurrency(selectedBorrow.totalCost)}
                </p>
              </div>

              <button
                className="confirm-return-btn"
                onClick={submitReturn}
                disabled={submitting}
              >
                {submitting ? 'Returning...' : 'Confirm Return'}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBorrows;
