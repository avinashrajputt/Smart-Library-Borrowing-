const User = require('../models/User');
const Borrow = require('../models/Borrow');
const Payment = require('../models/Payment');

// @route   GET /dashboard/summary
// @desc    Get dashboard summary for user
// @access  Private
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    const activeBorrows = await Borrow.find({ userId, status: 'active' });
    const borrowHistory = await Borrow.find({ userId, status: { $in: ['returned', 'overdue'] } });
    const pendingPayments = await Payment.find({ userId, status: 'pending' });

    // Calculate total pending amount
    let totalPending = 0;
    let overdueDays = 0;

    for (let borrow of activeBorrows) {
      totalPending += borrow.totalCost;
      const today = new Date();
      if (today > borrow.dueDate) {
        const days = Math.floor((today - borrow.dueDate) / (1000 * 60 * 60 * 24));
        overdueDays += days;
      }
    }

    res.json({
      message: 'Dashboard summary fetched successfully',
      summary: {
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        activeBorrows: activeBorrows.length,
        totalBorrowed: user.totalBorrowed,
        totalReturned: user.totalReturned,
        currentDebt: user.currentDebt,
        totalPending,
        overdueDays,
        historyCount: borrowHistory.length,
        pendingPaymentsCount: pendingPayments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
