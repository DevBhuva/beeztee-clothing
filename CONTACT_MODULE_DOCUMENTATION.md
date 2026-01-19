# Contact Us Module - Complete Documentation

## Overview
The Contact Us module is a complete end-to-end implementation that allows users to send messages through a beautiful contact form and enables admins to manage those messages in the admin panel.

## Features Implemented

### Frontend (User Side)
1. **Beautiful Contact Page** (`/contact`)
   - Hero section with gradient background
   - Three contact option cards (Email, Phone, WhatsApp)
   - Full contact form with validation
   - Store information section
   - FAQ accordion section
   - Business hours display
   - Social media links section
   - Fully responsive design
   - Toast notifications for success/error messages

### Admin Panel
1. **Contact Messages Listing** (`/admin/contacts`)
   - Statistics cards showing total, new, read, and replied messages
   - Advanced filtering (status, search, sort)
   - Responsive table with contact details
   - Status badges with color coding
   - Pagination support
   - View message in modal
   - Change message status
   - Delete messages
   - Reply via email directly from modal
   - Gold/Pink theme consistent with admin panel

## Database Structure

### Table: `Contacts`
```sql
CREATE TABLE Contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes
- `email` - For faster email lookups
- `status` - For filtering by status
- `created_at` - For sorting by date

## Backend API Endpoints

### Public Endpoints

#### POST `/api/contacts`
Create a new contact message
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Product Inquiry",
    "message": "I would like to know more about..."
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "Your message has been sent successfully...",
    "data": { ... }
  }
  ```

### Admin Endpoints (Require Authentication & Admin Role)

#### GET `/api/contacts`
Get all contacts with filtering and pagination
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (new, read, replied, archived, all)
  - `search` (search in name, email, subject)
  - `sortBy` (created_at, first_name, status)
  - `sortOrder` (DESC, ASC)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
  ```

#### GET `/api/contacts/stats`
Get contact statistics
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "total": 150,
      "new": 25,
      "read": 50,
      "replied": 60,
      "archived": 15
    }
  }
  ```

#### GET `/api/contacts/:id`
Get single contact by ID (automatically marks as read if status is 'new')
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

#### PUT `/api/contacts/:id/status`
Update contact status
- **Body:**
  ```json
  {
    "status": "replied"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Contact status updated successfully",
    "data": { ... }
  }
  ```

#### DELETE `/api/contacts/:id`
Delete a contact message
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Contact deleted successfully"
  }
  ```

## File Structure

### Backend
```
ecommerce-backend/
├── src/
│   ├── controllers/
│   │   └── contact.controller.js          # Controller with all business logic
│   ├── models/
│   │   └── contact.js                     # Sequelize model
│   ├── routes/
│   │   └── contact.routes.js              # API routes
│   ├── validations/
│   │   └── contact.validation.js          # Joi validation schemas
│   └── migrations/
│       └── 20251127191438-create-contacts.js  # Database migration
```

### Frontend
```
ecommerce-frontend/
├── src/
│   ├── user/
│   │   └── pages/
│   │       └── Contact/
│   │           ├── ContactUs.jsx          # User contact form page
│   │           └── ContactUs.css          # Styles for contact page
│   ├── admin/
│   │   └── pages/
│   │       └── Contact/
│   │           ├── ContactList.jsx        # Admin contact listing
│   │           └── ContactList.css        # Admin styles with gold/pink theme
│   └── routes/
│       └── AppRoutes.jsx                  # Route configuration
```

## Usage Instructions

### For Users
1. Navigate to `/contact` page
2. Fill out the contact form:
   - First Name (required, 2-50 characters)
   - Last Name (required, 2-50 characters)
   - Email (required, valid email format)
   - Phone (optional)
   - Subject (required, 5-200 characters)
   - Message (required, 10-5000 characters)
3. Click "Send Message"
4. Success message will be displayed

### For Admins
1. Login to admin panel
2. Navigate to "Contact Messages" in the sidebar under "COMMUNICATION"
3. View statistics at the top (Total, New, Read, Replied)
4. Use filters to find specific messages:
   - Search by name, email, or subject
   - Filter by status
   - Sort by date, name, or status
5. Click "View" button (eye icon) to see full message details
6. In the modal:
   - View complete message
   - Change status (new → read → replied → archived)
   - Reply via email (opens default email client)
   - Delete message

## Status Flow
```
new → read → replied → archived
     ↓        ↓          ↓
     └────────┴──────────┘
      (Can move to any status)
```

## Validation Rules

### Frontend Validation (HTML5)
- All required fields marked with `required` attribute
- Email field has `type="email"` for browser validation
- Phone field has `type="tel"` for mobile keyboard

### Backend Validation (Joi)
- **firstName:** 2-50 characters, trimmed
- **lastName:** 2-50 characters, trimmed
- **email:** Valid email format, lowercase, trimmed
- **phone:** Optional, valid phone number pattern
- **subject:** 5-200 characters, trimmed
- **message:** 10-5000 characters, trimmed
- **status:** Must be one of: new, read, replied, archived

## Design Features

### User Contact Page
- Elegant pink/gold gradient theme
- Smooth animations and transitions
- Floating label inputs
- FAQ accordion with smooth expand/collapse
- Responsive grid layouts
- Social media icons with hover effects
- Professional typography (Playfair Display, Poppins, Dancing Script)

### Admin Panel
- Consistent gold/pink theme matching other admin pages
- Light/Dark mode support
- Responsive table with horizontal scroll on mobile
- Color-coded status badges:
  - **New:** Red gradient (needs attention)
  - **Read:** Blue gradient (acknowledged)
  - **Replied:** Green gradient (completed)
  - **Archived:** Gray gradient (stored)
- Statistics cards with gradient icons
- Modal with smooth animations
- Action buttons with hover effects

## Testing Checklist

### User Side
- [ ] Contact form loads correctly
- [ ] All form fields work properly
- [ ] Form validation works (required fields)
- [ ] Success message appears after submission
- [ ] Error message appears on failure
- [ ] FAQ accordion expands/collapses
- [ ] Responsive on mobile devices
- [ ] Email/Phone links work
- [ ] WhatsApp link opens correctly

### Admin Side
- [ ] Contact list loads with data
- [ ] Statistics show correct counts
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Sorting works (date, name, status)
- [ ] Pagination works
- [ ] View modal opens with correct data
- [ ] Status can be changed
- [ ] Reply via email opens email client
- [ ] Delete confirmation works
- [ ] Table is responsive on mobile
- [ ] Theme toggle works (light/dark)

## Migration Commands

### Run Migration
```bash
cd ecommerce-backend
npx sequelize-cli db:migrate
```

### Rollback Migration
```bash
npx sequelize-cli db:migrate:undo
```

### Check Migration Status
```bash
npx sequelize-cli db:migrate:status
```

## Security Features
1. **CORS Protection:** Enabled for API endpoints
2. **Authentication:** Admin endpoints require valid JWT token
3. **Authorization:** Only admins can access contact management
4. **Input Validation:** All inputs validated on backend
5. **SQL Injection Prevention:** Using Sequelize ORM with parameterized queries
6. **XSS Prevention:** React automatically escapes output
7. **Rate Limiting:** Should be added for public contact endpoint (recommended)

## Performance Optimizations
1. **Database Indexes:** On email, status, created_at for fast queries
2. **Pagination:** Prevents loading all records at once
3. **Lazy Loading:** Contact details loaded only when viewed
4. **Efficient Queries:** Using Sequelize's findAndCountAll for pagination
5. **CSS Optimization:** Using CSS Grid and Flexbox for layouts

## Future Enhancements (Optional)
1. Email notifications when new message received
2. Auto-replies with acknowledgment
3. File attachment support
4. Email templates for replies
5. Bulk actions (mark multiple as read/archived)
6. Export contacts to CSV
7. Integration with CRM systems
8. Chat widget integration
9. Spam detection
10. Message templates for common replies

## Troubleshooting

### Issue: Contact form not submitting
- Check if backend server is running on port 3000
- Verify CORS is enabled
- Check browser console for errors
- Ensure all required fields are filled

### Issue: Admin panel not showing contacts
- Verify admin is logged in
- Check if JWT token is valid
- Ensure database migration ran successfully
- Check if Contact model is properly loaded

### Issue: Email reply not working
- Check if default email client is configured
- Verify email format is correct
- Try right-click → copy email address

### Issue: Status not updating
- Check network tab for API errors
- Verify admin has proper permissions
- Ensure database connection is stable

## Support
For issues or questions about the Contact module:
1. Check this documentation first
2. Review console logs for errors
3. Verify database connection
4. Check API endpoint responses
5. Ensure all migrations are run

## Version History
- **v1.0.0** (November 27, 2024) - Initial release
  - Complete contact form implementation
  - Admin panel with full CRUD operations
  - Statistics dashboard
  - Filtering and pagination
  - Gold/Pink theme integration
  - Light/Dark mode support
