const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    description: {
      type: String,
    },
    singleBorrowPricePerDay: {
      type: Number,
      required: [true, 'Single borrow price per day is required'],
      min: 0,
    },
    groupBorrowPricePerDay: {
      type: Number,
      required: [true, 'Group borrow price per day is required'],
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    publishedYear: {
      type: Number,
    },
    genre: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
