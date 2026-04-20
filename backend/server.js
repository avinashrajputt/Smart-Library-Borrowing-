require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Book = require('./models/Book');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));
app.use('/api/borrows', require('./routes/borrowRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Seed books on startup
const seedBooks = async () => {
  const booksCount = await Book.countDocuments();
  
  if (booksCount === 0) {
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel set in the Jazz Age',
        singleBorrowPricePerDay: 5,
        groupBorrowPricePerDay: 3,
        isbn: '978-0743273565',
        publishedYear: 1925,
        genre: 'Fiction',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of racial injustice and childhood innocence',
        singleBorrowPricePerDay: 5,
        groupBorrowPricePerDay: 3,
        isbn: '978-0061120084',
        publishedYear: 1960,
        genre: 'Fiction',
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel about a totalitarian society',
        singleBorrowPricePerDay: 6,
        groupBorrowPricePerDay: 4,
        isbn: '978-0451524935',
        publishedYear: 1949,
        genre: 'Science Fiction',
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A romantic novel about love and marriage',
        singleBorrowPricePerDay: 4,
        groupBorrowPricePerDay: 2,
        isbn: '978-0141439518',
        publishedYear: 1813,
        genre: 'Romance',
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'A coming-of-age novel about teenage disillusionment',
        singleBorrowPricePerDay: 5,
        groupBorrowPricePerDay: 3,
        isbn: '978-0316769174',
        publishedYear: 1951,
        genre: 'Fiction',
      },
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        description: 'The beginning of the magical wizard saga',
        singleBorrowPricePerDay: 7,
        groupBorrowPricePerDay: 5,
        isbn: '978-0439708180',
        publishedYear: 1997,
        genre: 'Fantasy',
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        description: 'An epic fantasy adventure in Middle-earth',
        singleBorrowPricePerDay: 8,
        groupBorrowPricePerDay: 6,
        isbn: '978-0544003415',
        publishedYear: 1954,
        genre: 'Fantasy',
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'A science fiction epic set on a desert planet',
        singleBorrowPricePerDay: 7,
        groupBorrowPricePerDay: 5,
        isbn: '978-0441172719',
        publishedYear: 1965,
        genre: 'Science Fiction',
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        description: 'A dystopian vision of a future society',
        singleBorrowPricePerDay: 6,
        groupBorrowPricePerDay: 4,
        isbn: '978-0060085260',
        publishedYear: 1932,
        genre: 'Science Fiction',
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'An adventure story of a hobbit and a quest',
        singleBorrowPricePerDay: 6,
        groupBorrowPricePerDay: 4,
        isbn: '978-0547928227',
        publishedYear: 1937,
        genre: 'Fantasy',
      },
      {
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        description: 'A dystopian novel about book burning and censorship',
        singleBorrowPricePerDay: 5,
        groupBorrowPricePerDay: 3,
        isbn: '978-1451673265',
        publishedYear: 1953,
        genre: 'Science Fiction',
      },
      {
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        description: 'A gothic romance and coming-of-age story',
        singleBorrowPricePerDay: 4,
        groupBorrowPricePerDay: 2,
        isbn: '978-0486427669',
        publishedYear: 1847,
        genre: 'Romance',
      },
      {
        title: 'Wuthering Heights',
        author: 'Emily Brontë',
        description: 'A dark, passionate tale of love and revenge',
        singleBorrowPricePerDay: 4,
        groupBorrowPricePerDay: 2,
        isbn: '978-0486298146',
        publishedYear: 1847,
        genre: 'Romance',
      },
      {
        title: 'The Odyssey',
        author: 'Homer',
        description: 'An epic poem about a hero\'s journey home',
        singleBorrowPricePerDay: 6,
        groupBorrowPricePerDay: 4,
        isbn: '978-0199232765',
        publishedYear: -1000,
        genre: 'Epic',
      },
      {
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        description: 'A psychological novel about guilt and redemption',
        singleBorrowPricePerDay: 7,
        groupBorrowPricePerDay: 5,
        isbn: '978-0143039999',
        publishedYear: 1866,
        genre: 'Fiction',
      },
      {
        title: 'The Brothers Karamazov',
        author: 'Fyodor Dostoevsky',
        description: 'A philosophical novel exploring faith and doubt',
        singleBorrowPricePerDay: 8,
        groupBorrowPricePerDay: 6,
        isbn: '978-0374529130',
        publishedYear: 1879,
        genre: 'Fiction',
      },
      {
        title: 'Anna Karenina',
        author: 'Leo Tolstoy',
        description: 'A novel about marriage, society, and morality',
        singleBorrowPricePerDay: 8,
        groupBorrowPricePerDay: 6,
        isbn: '978-0143039952',
        publishedYear: 1877,
        genre: 'Fiction',
      },
      {
        title: 'The Iliad',
        author: 'Homer',
        description: 'An epic poem about the Trojan War',
        singleBorrowPricePerDay: 7,
        groupBorrowPricePerDay: 5,
        isbn: '978-0199232765',
        publishedYear: -1000,
        genre: 'Epic',
      },
      {
        title: 'Moby Dick',
        author: 'Herman Melville',
        description: 'An adventure story about hunting a great white whale',
        singleBorrowPricePerDay: 6,
        groupBorrowPricePerDay: 4,
        isbn: '978-0486439761',
        publishedYear: 1851,
        genre: 'Adventure',
      },
      {
        title: 'The Great Expectations',
        author: 'Charles Dickens',
        description: 'A coming-of-age novel set in Victorian England',
        singleBorrowPricePerDay: 5,
        groupBorrowPricePerDay: 3,
        isbn: '978-0486414676',
        publishedYear: 1860,
        genre: 'Fiction',
      },
    ];

    await Book.insertMany(books);
    console.log('20 books have been seeded to the database');
  }
};

seedBooks().catch(console.error);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
