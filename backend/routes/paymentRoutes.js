const express = require('express');
const { getPaymentHistory, markPaymentAsPaid } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/history', auth, getPaymentHistory);
router.post('/:paymentId/pay', auth, markPaymentAsPaid);

module.exports = router;
