# Site Settings Module Documentation

## Overview
The Site Settings module allows administrators to manage website configuration from a centralized dashboard. All settings are stored in the database and can be easily modified without code changes.

## Features

### 1. **General Settings**
- Site Name
- Site Tagline
- Site Description
- Logo URL
- Favicon URL

### 2. **Contact Information**
- Email Address
- Phone Number
- Physical Address

### 3. **Social Media Links**
- Facebook URL
- Twitter URL
- Instagram URL
- LinkedIn URL

### 4. **SEO Settings**
- Meta Title
- Meta Description
- Meta Keywords

### 5. **Regional Settings**
- Currency (USD, EUR, GBP, INR, etc.)
- Currency Symbol ($, €, £, ₹, etc.)
- Timezone
- Date Format (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY)
- Time Format (24-hour, 12-hour)

### 6. **System Settings**
- Maintenance Mode (Enable/Disable)
- Maintenance Message
- Allow User Registration
- Terms & Conditions URL
- Privacy Policy URL

## Backend API

### Endpoints

#### Get Settings
```
GET /api/site-settings
```
Returns the current site settings. If no settings exist, creates default settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "siteName": "Beestee",
    "siteTagline": "Your Premium E-Commerce Store",
    ...
  }
}
```

#### Update Settings
```
PUT /api/site-settings
```
Updates the site settings with provided data.

**Request Body:**
```json
{
  "siteName": "Beestee",
  "contactEmail": "contact@beestee.com",
  "currency": "USD",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": { ... }
}
```

#### Reset to Default
```
POST /api/site-settings/reset
```
Resets all settings to default values.

**Response:**
```json
{
  "success": true,
  "message": "Settings reset to default successfully",
  "data": { ... }
}
```

## Frontend Usage

### Accessing Site Settings
Navigate to: **Admin Panel → Settings → Site Settings**

Or directly: `/admin/site-settings`

### Features

#### 1. **Tabbed Interface**
- General
- Contact
- Social Media
- SEO
- Regional
- System

#### 2. **Form Validation**
- Email validation for email fields
- URL validation for all URL fields
- Required field validation
- Character limit enforcement

#### 3. **Actions**
- **Save Changes**: Updates all settings
- **Reset to Default**: Restores default configuration

#### 4. **Theme Support**
- Fully supports Dark Mode and Light Mode
- Matches admin panel design
- Responsive layout

## Database Schema

### Table: `SiteSettings`

```sql
CREATE TABLE SiteSettings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_name VARCHAR(100) DEFAULT 'Beestee',
  site_tagline VARCHAR(200),
  site_description TEXT,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_address TEXT,
  logo_url VARCHAR(500),
  favicon_url VARCHAR(500),
  facebook_url VARCHAR(200),
  twitter_url VARCHAR(200),
  instagram_url VARCHAR(200),
  linkedin_url VARCHAR(200),
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT,
  currency VARCHAR(10) DEFAULT 'USD',
  currency_symbol VARCHAR(5) DEFAULT '$',
  timezone VARCHAR(50) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
  time_format VARCHAR(20) DEFAULT 'HH:mm:ss',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  maintenance_message TEXT,
  allow_registration BOOLEAN DEFAULT TRUE,
  terms_conditions_url VARCHAR(500),
  privacy_policy_url VARCHAR(500),
  createdAt DATETIME,
  updatedAt DATETIME
);
```

## Files Created

### Backend
- `src/migrations/20251110000001-create-site-settings.js` - Database migration
- `src/models/siteSettings.js` - Sequelize model
- `src/controllers/siteSettings.controller.js` - Controller logic
- `src/routes/siteSettings.routes.js` - API routes
- `src/validations/siteSettings.validation.js` - Input validation

### Frontend
- `src/services/siteSettings.service.js` - API service
- `src/admin/pages/SiteSettings.jsx` - Main component
- `src/admin/pages/SiteSettings.css` - Styling

### Updated Files
- `src/app.js` - Added site settings routes
- `src/routes/AppRoutes.jsx` - Added site settings route
- `src/admin/Componets/Sidebar/Sidebar.jsx` - Added navigation link

## Usage Examples

### Getting Settings in Frontend
```javascript
import { getSettings } from '../services/siteSettings.service';

const fetchSettings = async () => {
  try {
    const response = await getSettings();
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching settings:', error);
  }
};
```

### Updating Settings
```javascript
import { updateSettings } from '../services/siteSettings.service';

const updateSiteSettings = async (data) => {
  try {
    const response = await updateSettings(data);
    console.log('Updated:', response.data);
  } catch (error) {
    console.error('Error updating settings:', error);
  }
};
```

### Reset to Default
```javascript
import { resetSettings } from '../services/siteSettings.service';

const resetToDefault = async () => {
  try {
    const response = await resetSettings();
    console.log('Reset complete:', response.data);
  } catch (error) {
    console.error('Error resetting settings:', error);
  }
};
```

## Best Practices

1. **Validation**: Always validate settings before saving
2. **Backup**: Keep backups before resetting to default
3. **Testing**: Test maintenance mode in staging before enabling in production
4. **URLs**: Ensure all URLs are properly formatted
5. **Currency**: Update currency symbol when changing currency code

## Future Enhancements

Potential features to add:
- File upload for logo and favicon
- Email template settings
- Payment gateway configuration
- Shipping settings
- Tax configuration
- Multi-language support
- Theme customization (colors, fonts)
- Google Analytics integration
- SMTP configuration

## Troubleshooting

### Settings Not Saving
- Check browser console for errors
- Verify API endpoint is accessible
- Check database connection
- Review validation errors

### Migration Issues
- Ensure database is running
- Run: `npx sequelize-cli db:migrate:status`
- Check migration file syntax

### Form Not Loading
- Check API response in network tab
- Verify service is properly imported
- Check for JavaScript errors

## Support

For issues or questions:
1. Check console logs
2. Review API responses
3. Verify database records
4. Check validation errors
