import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import { AuthContext } from '../utils/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboardSummary();
      setSummary(response.data.summary);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!summary) return <div className="loading">No data available</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">📚 Smart Library Borrowing</div>
        <div className="nav-links">
          <Link to="/books">Browse Books</Link>
          <Link to="/active-borrows">Active Borrows</Link>
          <Link to="/history">History</Link>
          <Link to="/profile">Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome, {summary.user.firstName} {summary.user.lastName}!</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="summary-cards">
          <div className="card">
            <div className="card-icon">📖</div>
            <div className="card-content">
              <p className="card-label">Active Borrows</p>
              <p className="card-value">{summary.activeBorrows}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <p className="card-label">Amount Due</p>
              <p className="card-value">{formatCurrency(summary.totalPending)}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <p className="card-label">Total Borrowed</p>
              <p className="card-value">{summary.totalBorrowed}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <p className="card-label">Total Returned</p>
              <p className="card-value">{summary.totalReturned}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <p className="card-label">Overdue Days</p>
              <p className={`card-value ${summary.overdueDays > 0 ? 'warning' : ''}`}>
                {summary.overdueDays}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">📜</div>
            <div className="card-content">
              <p className="card-label">History Count</p>
              <p className="card-value">{summary.historyCount}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/books" className="action-btn">
            Borrow a Book
          </Link>
          <Link to="/active-borrows" className="action-btn">
            View Active Borrows
          </Link>
          <Link to="/history" className="action-btn">
            View History
          </Link>
        </div>

        {summary.totalPending > 0 && (
          <div className="alert-box">
            <p>
              💳 You have {formatCurrency(summary.totalPending)} due. Please make a payment.
            </p>
          </div>
        )}

        {summary.overdueDays > 0 && (
          <div className="warning-box">
            <p>
              ⚠️ You have {summary.overdueDays} day(s) overdue! Late fees may apply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
