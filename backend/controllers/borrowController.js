const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @route   POST /borrow/validate
// @desc    Validate if a book can be borrowed
// @access  Private
exports.validateBorrow = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userId;

    // Validate input
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has outstanding debt
    const user = await User.findById(userId);
    if (user.currentDebt > 0) {
      return res.status(400).json({ message: 'Cannot borrow. You have outstanding debt. Please pay first.' });
    }

    // Check if user already has an active borrow
    const activeBorrow = await Borrow.findOne({
      userId,
      status: 'active',
    });

    if (activeBorrow) {
      return res.status(400).json({ message: 'You can only borrow one book at a time. Please return the current book first.' });
    }

    res.json({
      message: 'Book can be borrowed',
      valid: true,
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        singleBorrowPricePerDay: book.singleBorrowPricePerDay,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /borrow/calculate
// @desc    Calculate the cost of borrowing
// @access  Private
exports.calculateCost = async (req, res) => {
  try {
    const { bookId, numberOfDays } = req.body;

    // Validate input
    if (!bookId || !numberOfDays) {
      return res.status(400).json({ message: 'Book ID and number of days are required' });
    }

    if (numberOfDays <= 0) {
      return res.status(400).json({ message: 'Number of days must be greater than 0' });
    }

    if (numberOfDays > 30) {
      return res.status(400).json({ message: 'Maximum borrow period is 30 days' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate cost
    const pricePerDay = book.singleBorrowPricePerDay;
    const totalCost = pricePerDay * numberOfDays;

    res.json({
      message: 'Cost calculated successfully',
      calculation: {
        pricePerDay,
        numberOfDays,
        totalCost,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /borrow
// @desc    Borrow a book
// @access  Private
exports.borrowBook = async (req, res) => {
  try {
    const { bookId, numberOfDays } = req.body;
    const userId = req.userId;

    // Validate input
    if (!bookId || !numberOfDays) {
      return res.status(400).json({ message: 'Book ID and number of days are required' });
    }

    if (numberOfDays <= 0 || numberOfDays > 30) {
      return res.status(400).json({ message: 'Number of days must be between 1 and 30' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has active borrow
    const activeBorrow = await Borrow.findOne({ userId, status: 'active' });
    if (activeBorrow) {
      return res.status(400).json({ message: 'You can only borrow one book at a time' });
    }

    // Check user debt
    const user = await User.findById(userId);
    if (user.currentDebt > 0) {
      return res.status(400).json({ message: 'Please pay your outstanding debt first' });
    }

    // Create borrow record
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + numberOfDays);

    const pricePerDay = book.singleBorrowPricePerDay;
    const totalCost = pricePerDay * numberOfDays;

    const borrow = await Borrow.create({
      userId,
      bookId,
      borrowDate,
      dueDate,
      numberOfDays,
      pricePerDay,
      totalCost,
      status: 'active',
    });

    // Update user's total borrowed
    user.totalBorrowed += 1;
    user.currentDebt += totalCost;
    await user.save();

    // Create payment record
    await Payment.create({
      userId,
      borrowId: borrow._id,
      amount: totalCost,
      status: 'pending',
      description: `Payment for borrowing "${book.title}" for ${numberOfDays} days`,
    });

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrow: {
        id: borrow._id,
        bookId: borrow.bookId,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        numberOfDays: borrow.numberOfDays,
        totalCost: borrow.totalCost,
        status: borrow.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /borrows/active
// @desc    Get all active borrows for a user
// @access  Private
exports.getActiveBorrows = async (req, res) => {
  try {
    const userId = req.userId;

    const borrows = await Borrow.find({
      userId,
      status: 'active',
    })
      .populate('bookId', 'title author')
      .sort({ borrowDate: -1 });

    res.json({
      message: 'Active borrows fetched successfully',
      count: borrows.length,
      borrows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /borrows/:borrowId/summary
// @desc    Get borrow summary
// @access  Private
exports.getBorrowSummary = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId)
      .populate('bookId')
      .populate('userId');

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow not found' });
    }

    // Check if borrow is overdue
    const today = new Date();
    let overdueDays = 0;
    let overdueCost = 0;

    if (borrow.status === 'active' && today > borrow.dueDate) {
      overdueDays = Math.floor((today - borrow.dueDate) / (1000 * 60 * 60 * 24));
      overdueCost = borrow.pricePerDay * overdueDays * 0.5; // 50% overdue charge
    }

    res.json({
      message: 'Borrow summary fetched successfully',
      borrow: {
        id: borrow._id,
        book: {
          id: borrow.bookId._id,
          title: borrow.bookId.title,
          author: borrow.bookId.author,
        },
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        returnDate: borrow.returnDate,
        numberOfDays: borrow.numberOfDays,
        totalCost: borrow.totalCost,
        overdueDays,
        overdueCost,
        totalAmount: borrow.totalCost + overdueCost,
        status: borrow.status,
        isPaid: borrow.isPaid,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /borrows/:borrowId/submit
// @desc    Submit (return) a borrow
// @access  Private
exports.submitBorrow = async (req, res) => {
  try {
    const { returnDate } = req.body;
    const borrowId = req.params.borrowId;

    if (!returnDate) {
      return res.status(400).json({ message: 'Return date is required' });
    }

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow not found' });
    }

    const returnDateObj = new Date(returnDate);
    borrow.returnDate = returnDateObj;

    // Calculate overdue
    let overdueDays = 0;
    let overdueCost = 0;

    if (returnDateObj > borrow.dueDate) {
      overdueDays = Math.floor((returnDateObj - borrow.dueDate) / (1000 * 60 * 60 * 24));
      overdueCost = borrow.pricePerDay * overdueDays * 0.5;
    }

    borrow.overdueDays = overdueDays;
    borrow.overdueCost = overdueCost;
    borrow.totalAmount = borrow.totalCost + overdueCost;
    borrow.status = 'returned';

    await borrow.save();

    // Update user stats
    const user = await User.findById(borrow.userId);
    user.totalReturned += 1;
    await user.save();

    // Update payment status if no overdue
    if (overdueDays === 0) {
      await Payment.findOneAndUpdate(
        { borrowId },
        { status: 'paid', paymentDate: new Date() }
      );
    } else {
      // Update payment with new amount
      await Payment.findOneAndUpdate(
        { borrowId },
        { amount: borrow.totalAmount, status: 'pending' }
      );
    }

    res.json({
      message: 'Book returned successfully',
      borrow: {
        id: borrow._id,
        returnDate: borrow.returnDate,
        totalCost: borrow.totalCost,
        overdueDays: borrow.overdueDays,
        overdueCost: borrow.overdueCost,
        totalAmount: borrow.totalAmount,
        status: borrow.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /borrows/history
// @desc    Get borrowing history
// @access  Private
exports.getBorrowHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const borrows = await Borrow.find({
      userId,
      status: { $in: ['returned', 'overdue'] },
    })
      .populate('bookId', 'title author')
      .sort({ returnDate: -1 });

    res.json({
      message: 'Borrow history fetched successfully',
      count: borrows.length,
      borrows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
