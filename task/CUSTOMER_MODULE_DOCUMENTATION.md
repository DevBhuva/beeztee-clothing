# Customer Module Documentation

## Overview
Complete customer management system for the admin panel with CRUD operations, status management, and detailed customer information tracking.

## Features
✅ Customer listing with pagination
✅ Search by name, email, phone, or city
✅ Filter by status (Active, Inactive, Blocked)
✅ Customer statistics dashboard
✅ View customer details
✅ Create new customers
✅ Edit customer information
✅ Delete customers
✅ Change customer status (Active/Inactive/Blocked)
✅ Full dark/light mode support

## Database Schema

### Extended User Table Fields
- `status` - ENUM('active', 'inactive', 'blocked') DEFAULT 'active'
- `address` - TEXT
- `city` - VARCHAR(100)
- `state` - VARCHAR(100)
- `country` - VARCHAR(100)
- `zipCode` - VARCHAR(20)
- `profileImage` - VARCHAR(500)
- `dateOfBirth` - DATEONLY
- `gender` - ENUM('male', 'female', 'other')
- `lastLoginAt` - DATE

## API Endpoints

### GET /api/customers/stats
Get customer statistics
**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 120,
    "inactive": 20,
    "blocked": 10,
    "newThisMonth": 15
  }
}
```

### GET /api/customers
Get paginated customer list with filters
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term (searches name, email, phone, city)
- `status` - Filter by status (active/inactive/blocked)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - ASC or DESC (default: DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

### GET /api/customers/:id
Get single customer details

### POST /api/customers
Create new customer
**Required Fields:**
- name (2-100 characters)
- email (valid email format)
- phone (10-15 digits)

**Optional Fields:**
- status, address, city, state, country, zipCode
- profileImage, dateOfBirth, gender

### PUT /api/customers/:id
Update customer (all fields optional)

### PATCH /api/customers/:id/status
Update customer status
**Body:**
```json
{
  "status": "active" // or "inactive" or "blocked"
}
```

### DELETE /api/customers/:id
Delete customer (hard delete)

## Frontend Components

### Customers.jsx
Main listing page with:
- Statistics cards (Total, Active, Inactive, Blocked, New This Month)
- Search bar
- Status filter
- Customer table with actions
- Pagination
- Modal management

### CustomerViewModal.jsx
Read-only customer details modal with:
- Profile avatar
- Personal information
- Contact details
- Location information
- Account activity

### CustomerFormModal.jsx
Create/Edit customer form with:
- Basic information (name, email, phone, status, password)
- Personal details (date of birth, gender, profile image)
- Location (address, city, state, country, zip code)
- Form validation
- Error handling

### Customers.css
Complete styling with:
- Theme-aware colors
- Dark/light mode support
- Responsive design
- Gradient backgrounds
- Status badges
- Action button styles

## Customer Status System

### Active (Green)
- Customer can access the platform
- All features available
- Default status for new customers

### Inactive (Gray)
- Temporarily disabled account
- Customer can be reactivated
- Use for temporary suspensions

### Blocked (Red)
- Permanently restricted access
- Cannot access platform
- Use for violations or security issues

## Usage Examples

### Creating a Customer
1. Click "Add Customer" button
2. Fill required fields (name, email, phone, password)
3. Optionally add personal details and location
4. Click "Create Customer"

### Editing a Customer
1. Click "Edit" button in customer row
2. Modify desired fields
3. Click "Update Customer"

### Changing Customer Status
1. Click status button (Activate/Deactivate/Block)
2. Confirmation is automatic
3. Status updates immediately

### Searching Customers
- Type in search box to search name, email, phone, or city
- Results update automatically
- Use status filter for additional filtering

### Viewing Customer Details
1. Click "View" button
2. Modal shows all customer information
3. Click "Close" to dismiss

## Security Features
- ✅ Customer role verification on all operations
- ✅ Duplicate email/phone checks
- ✅ Password hashing for new customers
- ✅ Sensitive data excluded from responses (password, OTP)
- ✅ Input validation on all fields

## Validation Rules

### Create Customer
- **Name**: Required, 2-100 characters
- **Email**: Required, valid email format, unique
- **Phone**: Required, 10-15 digits, unique
- **Password**: Required, minimum 6 characters
- **Status**: Must be active/inactive/blocked
- **Date of Birth**: Valid date format
- **Gender**: male/female/other

### Update Customer
- All fields optional
- Same validation rules apply to provided fields
- Password not required (only if changing)

## Statistics Calculations
- **Total**: All customers with customer role
- **Active**: status = 'active'
- **Inactive**: status = 'inactive'
- **Blocked**: status = 'blocked'
- **New This Month**: Created this calendar month

## Navigation
- Location: Admin Panel > Management > Customers
- Route: `/admin/customers`
- Icon: FaUsers
- Access: Admin role required

## Files Created

### Backend
- `migrations/20251110000002-add-customer-fields.js` - Database migration
- `models/user.js` - Extended with customer fields
- `controllers/customer.controller.js` - Business logic
- `routes/customer.routes.js` - Route definitions
- `validations/customer.validation.js` - Input validation

### Frontend
- `admin/pages/Customers.jsx` - Main listing page
- `admin/pages/CustomerViewModal.jsx` - View modal
- `admin/pages/CustomerFormModal.jsx` - Create/Edit form
- `admin/pages/Customers.css` - Styling
- `services/customer.service.js` - API communication

## Testing Checklist
- [ ] Create new customer
- [ ] View customer details
- [ ] Edit customer information
- [ ] Delete customer
- [ ] Change status to Active
- [ ] Change status to Inactive
- [ ] Change status to Blocked
- [ ] Search by name
- [ ] Search by email
- [ ] Search by phone
- [ ] Search by city
- [ ] Filter by status
- [ ] Pagination works
- [ ] Statistics display correctly
- [ ] Form validation works
- [ ] Duplicate email prevention
- [ ] Duplicate phone prevention
- [ ] Dark mode styling
- [ ] Light mode styling
- [ ] Responsive on mobile
- [ ] Modal close on overlay click
- [ ] Error handling

## Known Limitations
1. Hard delete - Consider implementing soft delete with `deletedAt` field
2. No customer order history view (future enhancement)
3. No customer activity log (future enhancement)
4. Profile image upload not implemented (uses URL input)
5. No email verification system yet

## Future Enhancements
- [ ] Soft delete with restore functionality
- [ ] Customer order history view
- [ ] Customer activity timeline
- [ ] Profile image upload functionality
- [ ] Email verification system
- [ ] Bulk status update
- [ ] Export customer data (CSV/Excel)
- [ ] Advanced filters (date range, location)
- [ ] Customer groups/segments
- [ ] Email template integration

## Troubleshooting

### Customers not loading
- Check backend is running
- Verify migration executed: `npx sequelize-cli db:migrate:status`
- Check console for API errors

### Status change not working
- Verify customer has customer role (not admin)
- Check network tab for API response
- Ensure backend validation passes

### Search not working
- Clear search and try again
- Check search term length (minimum 1 character)
- Verify database connection

### Modal not closing
- Click overlay outside modal
- Click X button in modal header
- Press ESC key (if implemented)

## Support
For issues or questions, check:
1. Browser console for errors
2. Network tab for API failures
3. Backend logs for server errors
4. Database migration status
