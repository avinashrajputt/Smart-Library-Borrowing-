const Book = require('../models/Book');

// @route   GET /books
// @desc    Get all books
// @access  Public
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json({
      message: 'Books fetched successfully',
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /books/:bookId
// @desc    Get book by ID
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book fetched successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
