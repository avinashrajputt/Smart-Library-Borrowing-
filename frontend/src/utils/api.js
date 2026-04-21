import axios from 'axios';

const API_BASE_URL = 'https://smart-library-borrowing.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Book APIs
export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  getBookById: (bookId) => api.get(`/books/${bookId}`),
};

// Borrow APIs
export const borrowAPI = {
  validateBorrow: (bookId) => api.post('/borrow/validate', { bookId }),
  calculateCost: (bookId, numberOfDays) =>
    api.post('/borrow/calculate', { bookId, numberOfDays }),
  borrowBook: (bookId, numberOfDays) =>
    api.post('/borrow', { bookId, numberOfDays }),
  getActiveBorrows: () => api.get('/borrows/active'),
  getBorrowSummary: (borrowId) => api.get(`/borrows/${borrowId}/summary`),
  submitBorrow: (borrowId, returnDate) =>
    api.post(`/borrows/${borrowId}/submit`, { returnDate }),
  getBorrowHistory: () => api.get('/borrows/history'),
};

// Payment APIs
export const paymentAPI = {
  getPaymentHistory: () => api.get('/payments/history'),
  markPaymentAsPaid: (paymentId) => api.post(`/payments/${paymentId}/pay`),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboardSummary: () => api.get('/dashboard/summary'),
};

export default api;
