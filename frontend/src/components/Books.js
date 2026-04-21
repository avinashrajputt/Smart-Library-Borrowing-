import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI, borrowAPI } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [borrowing, setBorrowing] = useState(false);
  const [cost, setCost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAllBooks();
      setBooks(response.data.books);
      setError('');
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = async (bookId) => {
    try {
      const response = await borrowAPI.calculateCost(bookId, numberOfDays);
      setCost(response.data.calculation.totalCost);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectBook = async (book) => {
    setSelectedBook(book);
    setCost(null);
    setNumberOfDays(7);
    await calculateCost(book._id);
  };

  const handleBorrow = async () => {
    if (!selectedBook) return;

    try {
      setBorrowing(true);
      setError('');

      // Validate first
      await borrowAPI.validateBorrow(selectedBook._id);

      // Then borrow
      await borrowAPI.borrowBook(selectedBook._id, numberOfDays);
      alert('Book borrowed successfully!');
      setSelectedBook(null);
      navigate('/active-borrows');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  const handleDaysChange = async (e) => {
    const days = parseInt(e.target.value);
    setNumberOfDays(days);
    if (selectedBook) {
      await calculateCost(selectedBook._id);
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="books-container">
      <h1>Available Books</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book._id}
            className={`book-card ${selectedBook?._id === book._id ? 'selected' : ''}`}
          >
            <div className="book-header">
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
            </div>
            <p className="genre">{book.genre}</p>
            <p className="price">{formatCurrency(book.singleBorrowPricePerDay)}/day</p>
            <button
              className="select-btn"
              onClick={() => handleSelectBook(book)}
            >
              {selectedBook?._id === book._id ? 'Selected ✓' : 'Select to Borrow'}
            </button>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="borrow-modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedBook(null)}
            >
              ×
            </button>
            <h2>{selectedBook.title}</h2>
            <p className="author">{selectedBook.author}</p>
            <p className="description">{selectedBook.description}</p>

            <div className="borrow-form">
              <label>
                Number of Days (max 30):
                <select value={numberOfDays} onChange={handleDaysChange}>
                  {[...Array(30)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} day{i !== 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>

              {cost !== null && (
                <div className="cost-summary">
                  <p>Price per Day: {formatCurrency(selectedBook.singleBorrowPricePerDay)}</p>
                  <p>Number of Days: {numberOfDays}</p>
                  <p className="total">
                    Total Cost: <strong>{formatCurrency(cost)}</strong>
                  </p>
                </div>
              )}

              <button
                className="borrow-btn"
                onClick={handleBorrow}
                disabled={borrowing}
              >
                {borrowing ? 'Borrowing...' : 'Confirm Borrow'}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
