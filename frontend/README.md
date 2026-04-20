# Smart Library Borrowing - Frontend Setup Guide

## 📋 Overview

The frontend is a React.js single-page application with user authentication, book browsing, borrowing management, and dashboard features.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `react-scripts` - Build scripts

### 2. Configure API Connection

The frontend automatically connects to `http://localhost:5000/api` by default.

To change the API URL, update the `API_BASE_URL` in `src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 3. Start the Development Server

```bash
npm start
```

The application will automatically open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth.js / Auth.css          - Login and Signup forms
│   ├── Books.js / Books.css        - Book browsing and selection
│   ├── ActiveBorrows.js            - Current active borrows
│   ├── History.js / History.css    - Borrowing history
│   ├── Dashboard.js / Dashboard.css - Main dashboard
│   ├── Profile.js / Profile.css    - User profile
│   └── ProtectedRoute.js           - Auth protected routes
├── pages/                           - Page components (future)
├── utils/
│   ├── api.js                      - API service and axios config
│   ├── helpers.js                  - Utility functions
│   └── AuthContext.js              - Authentication state management
├── App.js                          - Main app component with routing
├── App.css                         - App styling
├── index.js                        - App entry point
└── index.css                       - Global styles
```

## 🔐 Authentication Flow

1. **Sign Up / Login**: User enters credentials
2. **Token Received**: Backend returns JWT token
3. **Token Storage**: Token stored in localStorage
4. **API Requests**: Token automatically attached to all requests
5. **Token Validation**: AuthContext verifies token on app load
6. **Protected Routes**: Non-authenticated users redirected to login

## 🎨 UI Components

### Auth Component
- Login form with email and password
- Signup form with additional fields
- Form validation with error messages
- Redirect to dashboard on successful auth

### Books Component
- Grid view of all available books
- Book selection modal with cost calculation
- Borrowing validation and confirmation
- Error handling for business logic

### ActiveBorrows Component
- List of current active borrows
- Due date and remaining days display
- Return book modal with date selection
- Overdue status indication

### History Component
- Table of past borrows
- Shows borrow and return dates
- Displays costs and overdue charges
- Responsive design for mobile

### Dashboard Component
- Welcome message and user info
- Summary cards with key metrics
- Active borrows count
- Amount due and debt status
- Quick action buttons
- Overdue alerts
- Navigation links

### Profile Component
- User information display
- Borrowing statistics
- Account creation date
- Debt status indicator

## 🔄 State Management

### AuthContext
Manages global authentication state:
- `user` - Current user object
- `token` - JWT token
- `loading` - Loading state
- `isAuthenticated` - Auth status
- Methods: `login()`, `signup()`, `logout()`

Uses `localStorage` for token persistence across sessions.

## 🌐 API Integration

All API calls are made through the `utils/api.js` file which:
- Configures axios instance
- Adds JWT token to request headers
- Provides organized API methods
- Handles response/error formats

### Available API Services:
```javascript
authAPI.signup()
authAPI.login()
authAPI.getProfile()

bookAPI.getAllBooks()
bookAPI.getBookById()

borrowAPI.validateBorrow()
borrowAPI.calculateCost()
borrowAPI.borrowBook()
borrowAPI.getActiveBorrows()
borrowAPI.getBorrowSummary()
borrowAPI.submitBorrow()
borrowAPI.getBorrowHistory()

paymentAPI.getPaymentHistory()
paymentAPI.markPaymentAsPaid()

dashboardAPI.getDashboardSummary()
```

## 🎯 User Workflows

### 1. New User Registration
- Navigate to Sign Up
- Enter first name, last name, username, email, password
- System creates account and logs in automatically
- Redirected to dashboard

### 2. Book Borrowing
- Go to "Browse Books"
- Select a book from the grid
- Choose number of days (1-30)
- See calculated cost
- Confirm borrowing
- Book appears in active borrows

### 3. Returning a Book
- Go to "Active Borrows"
- Click "Return Book" on desired borrow
- Select return date
- Confirm return
- Book moves to history with final charges

### 4. Viewing History
- Go to "History"
- See all past borrows
- Review costs, overdue charges, and total amounts

### 5. Checking Dashboard
- See summary of all activities
- Monitor debt and due amounts
- Quick actions to other features

## 🔒 Security Features

- **Protected Routes**: Use `ProtectedRoute` component
- **Token-based Auth**: JWT stored in localStorage
- **Password Security**: Passwords hashed on backend
- **Secure API Calls**: Tokens sent in Authorization header
- **Input Validation**: Frontend validation before API calls
- **Error Handling**: User-friendly error messages

## 🎨 Styling

The application uses:
- **Global CSS**: `index.css` and `App.css`
- **Component CSS**: Individual `.css` files per component
- **Color Scheme**:
  - Primary: #667eea (purple-blue)
  - Secondary: #764ba2 (purple)
  - Success: #28a745 (green)
  - Error: #f44336 (red)
  - Background: #f8f9ff (light blue)

## 📱 Responsive Design

- **Mobile First**: CSS designed for mobile and scales up
- **Breakpoints**: Media queries for tablets and desktops
- **Flexible Layouts**: Grid and flexbox for responsiveness
- **Touch Friendly**: Adequate button/link sizes for touch

## 🔧 Helper Functions

Located in `utils/helpers.js`:

```javascript
formatDate(date)           // Format date to readable string
formatCurrency(amount)     // Format number as currency
getDaysUntilDue(dueDate)  // Calculate remaining days
isOverdue(dueDate)        // Check if overdue
```

## ⚠️ Common Issues & Solutions

### Issue: API Connection Failed
- Ensure backend is running on port 5000
- Check `API_BASE_URL` in `src/utils/api.js`
- Verify CORS settings on backend

### Issue: Token Expired
- Tokens expire after 30 days
- User will be automatically logged out
- Must log in again to continue

### Issue: Books Not Loading
- Ensure backend has seeded books
- Check MongoDB connection
- Verify API endpoint is working

### Issue: Layout Issues on Mobile
- Clear browser cache
- Use responsive preview tool
- Test on actual mobile device

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel via web or CLI
```

### Netlify
```bash
npm run build
# Drag and drop build folder or use CLI
```

### AWS S3 + CloudFront
```bash
npm run build
# Upload build folder to S3
# Configure CloudFront distribution
```

### Other Platforms
Most platforms accept:
- Node.js hosting: npm start
- Static hosting: npm run build output

## 📝 Environment Configuration

Create `.env` file in frontend root (if needed):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Then use in code: `process.env.REACT_APP_API_URL`

## 🧪 Testing Tips

1. **Test Authentication**:
   - Create new account
   - Login with correct credentials
   - Test with wrong credentials

2. **Test Borrowing**:
   - Borrow a book
   - Try borrowing with debt (add payment endpoint first)
   - Try borrowing while having active borrow

3. **Test Return Flow**:
   - Return book on same day
   - Return book after due date
   - Check overdue calculations

4. **Test Dashboard**:
   - Verify all statistics update correctly
   - Check alert messages appear when needed

## 📚 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔄 Development Workflow

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm start` (in frontend folder)
3. Create new components as needed
4. Update API calls in `utils/api.js`
5. Test features end-to-end
6. Build for production when ready

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify API connectivity
4. Review error messages
5. Check Reddit or Stack Overflow for similar issues

---

**Frontend Version**: 1.0.0
**Last Updated**: April 2026
