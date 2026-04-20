# Smart Library Borrowing - Backend Setup Guide

## 📋 Overview

The backend is built with Node.js and Express, using MongoDB for data persistence and JWT for authentication.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages listed in `package.json`:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `validator` - Input validation
- `nodemon` - Development auto-reload

### 2. Configure MongoDB Atlas

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Generate a connection string for your cluster
5. Update your `.env` file with the connection string

Example `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

For development with auto-reload:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:5000` and automatically seed 20 books into the database on first run.

## 📚 API Endpoints

### Authentication

#### Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response**: User object and JWT token

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: User object and JWT token

#### Get Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile details

### Books

#### Get All Books
- **Endpoint**: `GET /api/books`
- **Response**: Array of all books with details

#### Get Book by ID
- **Endpoint**: `GET /api/books/:bookId`
- **Response**: Single book details

### Borrowing

#### Validate Borrow
- **Endpoint**: `POST /api/borrow/validate`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "bookId": "book_id" }`
- **Response**: Validation status and book details

#### Calculate Cost
- **Endpoint**: `POST /api/borrow/calculate`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "bookId": "book_id", "numberOfDays": 7 }`
- **Response**: Cost breakdown

#### Borrow Book
- **Endpoint**: `POST /api/borrow`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "bookId": "book_id", "numberOfDays": 7 }`
- **Response**: Borrow record created

#### Get Active Borrows
- **Endpoint**: `GET /api/borrows/active`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of active borrows

#### Get Borrow Summary
- **Endpoint**: `GET /api/borrows/:borrowId/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Detailed borrow information with overdue calculation

#### Submit/Return Borrow
- **Endpoint**: `POST /api/borrows/:borrowId/submit`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "returnDate": "2026-04-25" }`
- **Response**: Updated borrow record

#### Get Borrow History
- **Endpoint**: `GET /api/borrows/history`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of returned/overdue borrows

### Payments

#### Get Payment History
- **Endpoint**: `GET /api/payments/history`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of payment records

#### Mark as Paid
- **Endpoint**: `POST /api/payments/:paymentId/pay`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Updated payment record

### Dashboard

#### Get Summary
- **Endpoint**: `GET /api/dashboard/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Dashboard summary with statistics

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 30 days and are managed by the frontend.

## 📊 Database Schema

### User Schema
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password (bcryptjs)
- `firstName` - User's first name
- `lastName` - User's last name
- `totalBorrowed` - Count of books borrowed
- `totalReturned` - Count of books returned
- `currentDebt` - Outstanding debt amount
- `timestamps` - Auto-generated created and updated times

### Book Schema
- `title` - Book title
- `author` - Author name
- `description` - Book description
- `singleBorrowPricePerDay` - Cost per day for single borrower
- `groupBorrowPricePerDay` - Cost per day for group sharing
- `available` - Availability status
- `isbn` - ISBN number
- `publishedYear` - Publication year
- `genre` - Book genre
- `timestamps` - Auto-generated created and updated times

### Borrow Schema
- `userId` - Reference to User
- `bookId` - Reference to Book
- `borrowDate` - Date book was borrowed
- `dueDate` - Due date for return
- `returnDate` - Actual return date
- `numberOfDays` - Duration of borrow
- `pricePerDay` - Price charged per day
- `totalCost` - Total cost of borrow
- `overdueDays` - Days overdue
- `overdueCost` - Cost of overdue charges
- `totalAmount` - Total amount to pay
- `status` - Status (active/returned/overdue)
- `isPaid` - Payment status
- `timestamps` - Auto-generated created and updated times

### Payment Schema
- `userId` - Reference to User
- `borrowId` - Reference to Borrow
- `amount` - Payment amount
- `status` - Status (pending/paid)
- `paymentDate` - Date of payment
- `description` - Payment description
- `timestamps` - Auto-generated created and updated times

## 🛡️ Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description"
}
```

HTTP Status Codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## 📝 Middleware

### Authentication Middleware
Located in `middleware/auth.js`, verifies JWT tokens and sets `req.userId` for protected routes.

## 🔑 Environment Variables

Required variables in `.env`:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 📦 Book Seeding

The server automatically seeds 20 classic books into the database on startup if no books exist. Books include titles from classic literature with pricing and metadata.

## 🧪 Testing with Postman or cURL

Example request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment Tips

1. Set `NODE_ENV=production` in production environment
2. Use strong `JWT_SECRET` in production
3. Ensure MongoDB Atlas IP whitelist includes your server
4. Enable CORS with specific origins in production
5. Use environment variables for sensitive data
6. Set up proper error logging and monitoring

## 📞 Support

For issues or questions, refer to the main README.md or check the code comments for detailed implementation information.

---

**Backend Version**: 1.0.0
**Last Updated**: April 2026
