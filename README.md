# Smart Library Borrowing System

A full-stack web application to manage book borrowing, cost calculation, expense splitting, and user balances among students.

## 📋 Project Overview

This application allows students to:
- **Authenticate**: Sign up, log in, and manage their profile
- **Browse Books**: View a predefined list of 20 books available for borrowing
- **Borrow Books**: With validation (no debt, one book at a time, max 30 days)
- **Calculate Costs**: Automatic cost calculation based on days borrowed
- **Track Borrows**: Monitor active borrows with due dates and costs
- **Return Books**: Submit returns with return dates, calculate overdue charges
- **View History**: See complete borrowing history with payment status
- **Dashboard**: Summary view of active borrows, total debt, and statistics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **React Router** - Navigation
- **Axios** - HTTP Client
- **CSS** - Styling

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB Atlas** - Cloud Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

## 🔑 Sample Login Credentials

For testing purposes, you can create your own account during signup or use:
- **Email**: test@example.com
- **Password**: password123

## 📚 Features & API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:bookId` - Get specific book

### Borrowing
- `POST /api/borrow/validate` - Validate if book can be borrowed
- `POST /api/borrow/calculate` - Calculate borrowing cost
- `POST /api/borrow` - Create new borrow record
- `GET /api/borrows/active` - Get active borrows
- `GET /api/borrows/:borrowId/summary` - Get borrow summary
- `POST /api/borrows/:borrowId/submit` - Return a book
- `GET /api/borrows/history` - Get borrowing history

### Payments
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/:paymentId/pay` - Mark payment as paid

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary

## 💾 Database Models

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  totalBorrowed: Number,
  totalReturned: Number,
  currentDebt: Number,
  createdAt: Date
}
```

### Book
```javascript
{
  title: String,
  author: String,
  description: String,
  singleBorrowPricePerDay: Number,
  groupBorrowPricePerDay: Number,
  available: Boolean,
  isbn: String,
  publishedYear: Number,
  genre: String
}
```

### Borrow
```javascript
{
  userId: ObjectId,
  bookId: ObjectId,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  numberOfDays: Number,
  pricePerDay: Number,
  totalCost: Number,
  overdueDays: Number,
  overdueCost: Number,
  totalAmount: Number,
  status: String (active, returned, overdue),
  isPaid: Boolean
}
```

### Payment
```javascript
{
  userId: ObjectId,
  borrowId: ObjectId,
  amount: Number,
  status: String (pending, paid),
  paymentDate: Date,
  description: String
}
```

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: All sensitive routes require authentication
- **Input Validation**: All inputs are validated on both frontend and backend
- **Error Handling**: Comprehensive error handling with meaningful messages

## 📊 Business Logic

### Cost Calculation
```
Total Cost = Price Per Day × Number of Days
```

### Overdue Charges
```
Overdue Cost = Price Per Day × Overdue Days × 0.5 (50% premium)
Total Amount = Total Cost + Overdue Cost
```

### Validation Rules
- Users can only borrow one book at a time
- Users must have zero debt to borrow
- Maximum borrow duration is 30 days
- Users cannot borrow if they already have an active borrow

## 📱 User Interface

The frontend includes:
- **Authentication Pages**: Login and signup forms with validation
- **Dashboard**: Overview of borrows, debt, and statistics
- **Books Browser**: Grid view of all available books with borrowing modal
- **Active Borrows**: List of current borrows with return functionality
- **Borrowing History**: Table view of past borrows with costs and dates
- **User Profile**: User information and borrowing statistics

## 🚀 Deployment

### Backend (Node.js)
Can be deployed to:
- Heroku
- AWS (EC2, Elastic Beanstalk)
- Azure App Service
- DigitalOcean
- Railway.app
- Render

### Frontend (React)
Can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Heroku
- Azure Static Web Apps

## 📝 API Response Format

All API responses follow this format:
```json
{
  "message": "Success/Error message",
  "data": {}
}
```

## 🐛 Error Handling

The application handles various error scenarios:
- Invalid credentials
- Missing required fields
- Unauthorized access
- Book not found
- User already has active borrow
- Outstanding debt
- Invalid date ranges
- Server errors

## 📄 Project Structure

```
Smart Library Borrowing/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Borrow.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Auth.js
    │   │   ├── Books.js
    │   │   ├── ActiveBorrows.js
    │   │   ├── History.js
    │   │   ├── Dashboard.js
    │   │   ├── Profile.js
    │   │   ├── ProtectedRoute.js
    │   │   └── *.css
    │   ├── pages/
    │   ├── utils/
    │   │   ├── api.js
    │   │   ├── helpers.js
    │   │   └── AuthContext.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🎓 Key Learning Points

This project demonstrates:
- Full-stack web development
- RESTful API design
- Database modeling and relationships
- User authentication with JWT
- Form validation and error handling
- State management in React
- Component-based architecture
- Responsive UI design

## 📧 Contact & Support

For issues or questions, please check the GitHub repository or contact the development team.

## 📜 License

This project is provided as-is for educational purposes.

---

**Created**: April 2026
**Version**: 1.0.0
#   S m a r t - L i b r a r y - B o r r o w i n g -  
 #   S m a r t - L i b r a r y - B o r r o w i n g -  
 