const express = require('express');
const {
  validateBorrow,
  calculateCost,
  borrowBook,
  getActiveBorrows,
  getBorrowSummary,
  submitBorrow,
  getBorrowHistory,
} = require('../controllers/borrowController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/validate', auth, validateBorrow);
router.post('/calculate', auth, calculateCost);
router.post('/', auth, borrowBook);
router.get('/active', auth, getActiveBorrows);
router.get('/history', auth, getBorrowHistory);
router.get('/:borrowId/summary', auth, getBorrowSummary);
router.post('/:borrowId/submit', auth, submitBorrow);

module.exports = router;
