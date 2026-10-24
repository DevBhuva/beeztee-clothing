# Authentication System Documentation

## Overview
Complete authentication system implemented for Beetes E-commerce platform with optimized security and user experience.

## Features Implemented

### ✅ Backend (Already Existing)
- Admin login with email/password (bcrypt hashing)
- Customer registration
- Customer OTP-based login (Twilio SMS)
- JWT token generation and validation
- Role-based access control (ADMIN, CUSTOMER)

### ✅ Frontend (New Implementation)

#### 1. **Service Layer** (`src/services/`)
- **`api.js`**: Axios instance with interceptors
  - Automatic token injection in headers
  - Global error handling
  - Auto-redirect on 401 (unauthorized)
  
- **`authService.js`**: Authentication functions
  - `adminLogin(email, password)` - Admin authentication
  - `customerRegister(name, email, phone)` - Customer registration
  - `sendOTP(phone)` - Request OTP for customer login
  - `verifyOTP(phone, otp)` - Verify OTP and login
  - `logout()` - Clear auth data
  - `getCurrentUser()` - Get logged-in user data
  - `isAuthenticated()`, `isAdmin()`, `isCustomer()` - Auth checks

#### 2. **State Management** (`src/context/AuthContext.jsx`)
- Global authentication state using React Context
- Automatic user persistence (localStorage)
- Auth status on app load
- Easy access via `useAuth()` hook

```jsx
const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
```

#### 3. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
- Wrapper component for protected pages
- Automatic redirect to login if not authenticated
- Role-based access (admin-only routes)
- Loading state during auth check

#### 4. **Admin Login Page** (`src/admin/pages/Login.jsx`)
- Modern, animated UI design
- Email and password validation
- Show/hide password toggle
- Loading states during authentication
- Error handling with user-friendly messages
- Responsive design

#### 5. **Security Features**
- JWT tokens stored in localStorage
- Tokens automatically sent with API requests
- Auto-logout on token expiry (401 response)
- Password validation (min 6 characters)
- Email format validation
- CORS enabled on backend

## Setup Instructions

### Backend Setup

1. **Environment Variables** (`.env` already configured)
```env
PORT=3000
JWT_SECRET=your-secret-key
DB_NAME=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=
```

2. **Start Backend Server**
```bash
cd ecommerce-backend
npm install
npm run dev
```

Server runs on: `http://localhost:3000`

### Frontend Setup

1. **Environment Variables** (`.env` created)
```env
VITE_API_URL=http://localhost:3000/api
```

2. **Start Frontend Server**
```bash
cd ecommerce-frontend
npm install
npm run dev
```

App runs on: `http://localhost:5173` (or next available port)

## Usage

### Admin Login
1. Navigate to: `http://localhost:5173/admin/login`
2. Use admin credentials:
   - Email: `admin@beetes.com` (default from seeder)
   - Password: `admin123` (default from seeder)
3. After login, redirected to: `/admin` (dashboard)

### Protected Admin Routes
All routes under `/admin/*` require authentication:
- `/admin` - Dashboard
- `/admin/products` - Products Management
- `/admin/orders` - Orders Management

### Logout
Click profile dropdown in TopBar → Logout

## File Structure

```
ecommerce-frontend/
├── src/
│   ├── services/
│   │   ├── api.js                 # Axios configuration
│   │   └── authService.js         # Auth API calls
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state
│   ├── components/
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Admin login page
│   │   │   └── login.css          # Login page styles
│   │   └── Componets/
│   │       └── topbar/
│   │           └── TopBar.jsx     # Updated with logout
│   └── routes/
│       └── AppRoutes.jsx          # Updated with protection
```

## API Endpoints

### Authentication APIs (Backend)
- `POST /api/auth/login/admin` - Admin login
- `POST /api/auth/register/customer` - Customer registration
- `POST /api/auth/login/customer/send-otp` - Request OTP
- `POST /api/auth/login/customer/verify-otp` - Verify OTP & login

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT tokens for stateless auth
- HTTP-only approach ready (can be enhanced with httpOnly cookies)
- Token expiry (24 hours)
- Role-based access control
- Input validation on both frontend and backend
- Secure password fields (type="password")
- CORS configuration

🔒 **Production Recommendations:**
1. Use httpOnly cookies instead of localStorage for tokens
2. Implement refresh tokens
3. Add rate limiting on login endpoints
4. Use HTTPS in production
5. Implement CSRF protection
6. Add 2FA for admin accounts
7. Log authentication attempts
8. Implement account lockout after failed attempts

## Testing

### Test Admin Login Flow

1. **Start both servers**
```bash
# Terminal 1 - Backend
cd ecommerce-backend
npm run dev

# Terminal 2 - Frontend  
cd ecommerce-frontend
npm run dev
```

2. **Test Login**
- Go to: `http://localhost:5173/admin/login`
- Enter credentials
- Should redirect to dashboard
- Check if TopBar shows admin name
- Test logout functionality

3. **Test Protected Routes**
- Try accessing `/admin` without login
- Should redirect to `/admin/login`
- After login, should access dashboard

4. **Test Token Persistence**
- Login and refresh page
- Should remain logged in
- Check localStorage for `authToken` and `user`

## Troubleshooting

### Issue: Can't login
- Check backend server is running (`localhost:3000`)
- Check database connection
- Verify admin user exists in database
- Check browser console for errors

### Issue: Redirects immediately after login
- Check JWT_SECRET in backend `.env`
- Verify token is stored in localStorage
- Check axios interceptor isn't blocking requests

### Issue: CORS errors
- Verify backend has `cors()` middleware
- Check `VITE_API_URL` in frontend `.env`

## Next Steps (Optional Enhancements)

1. **Customer Authentication UI**
   - Registration page
   - OTP login page
   - Profile management

2. **Enhanced Security**
   - Refresh tokens
   - httpOnly cookies
   - Password reset flow
   - Email verification

3. **UX Improvements**
   - Remember me functionality
   - Session timeout warnings
   - Multi-device session management

## Notes

- Default admin account is seeded in database
- Customer accounts require phone for OTP login
- Twilio is optional (OTP logged to console in dev mode)
- All passwords are hashed with bcrypt
- Tokens expire after 24 hours

---

**Status**: ✅ Fully Functional  
**Last Updated**: November 5, 2025  
**Version**: 1.0.0
