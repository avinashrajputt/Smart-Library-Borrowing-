const Payment = require('../models/Payment');
const User = require('../models/User');
const Borrow = require('../models/Borrow');

// @route   GET /payments/history
// @desc    Get payment history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const payments = await Payment.find({ userId })
      .populate('borrowId')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Payment history fetched successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /payments/:paymentId/pay
// @desc    Mark payment as paid
// @access  Private
exports.markPaymentAsPaid = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const userId = req.userId;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to mark this payment' });
    }

    payment.status = 'paid';
    payment.paymentDate = new Date();
    await payment.save();

    // Update user current debt
    const user = await User.findById(userId);
    const pendingPayments = await Payment.find({ userId, status: 'pending' });
    const totalDebt = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    user.currentDebt = totalDebt;
    await user.save();

    res.json({
      message: 'Payment marked as paid',
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
