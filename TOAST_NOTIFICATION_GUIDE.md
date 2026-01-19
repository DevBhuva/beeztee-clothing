# Toast Notification System Guide

## Overview
This guide documents the SweetAlert2 toast notification system integrated throughout the application. All JavaScript `alert()` calls have been replaced with elegant, themed toast notifications that match the admin panel design.

## Installation
```bash
npm install sweetalert2
```

## File Structure
```
ecommerce-frontend/src/
├── utils/
│   ├── toast.js          # Toast utility functions
│   └── toast.css         # Custom toast styling
```

## Toast Utility Functions

### Location
`src/utils/toast.js`

### Available Functions

#### 1. showSuccess(message)
Display a success toast notification.
```javascript
import { showSuccess } from '../../utils/toast';

showSuccess('Category created successfully!');
```

#### 2. showError(message)
Display an error toast notification.
```javascript
import { showError } from '../../utils/toast';

showError('Failed to fetch categories');
```

#### 3. showWarning(message)
Display a warning toast notification.
```javascript
import { showWarning } from '../../utils/toast';

showWarning('Image size should not exceed 5MB');
```

#### 4. showInfo(message)
Display an info toast notification.
```javascript
import { showInfo } from '../../utils/toast';

showInfo('New feature available!');
```

#### 5. showConfirmDialog(options)
Display a confirmation dialog (used for delete confirmations).
```javascript
import { showConfirmDialog } from '../../utils/toast';

const result = await showConfirmDialog({
  title: 'Delete Category',
  text: 'Are you sure you want to delete "Electronics"?',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'Cancel'
});

if (result.isConfirmed) {
  // Proceed with deletion
}
```

#### 6. showLoading(message)
Display a loading indicator.
```javascript
import { showLoading, closeLoading } from '../../utils/toast';

showLoading('Processing...');
// ... perform async operation
closeLoading();
```

## Toast Configuration

### Theme
Toasts are configured to match the admin panel's dark theme:
- **Background**: Linear gradient (#1a1a1a to #2a2a2a)
- **Text Color**: White (#ffffff)
- **Accent Colors**: 
  - Success: Green (#10b981)
  - Error: Red (#ef4444)
  - Warning: Orange (#f59e0b)
  - Info: Blue (#3b82f6)

### Position & Behavior
- **Position**: Top-right corner
- **Duration**: 3 seconds (auto-dismiss)
- **Progress Bar**: Gold to Pink gradient
- **Hover**: Pauses auto-dismiss
- **Animation**: Slide in from right

## Implementation Examples

### Categories Component
File: `src/admin/pages/Categories.jsx`

#### Before (JavaScript alert)
```javascript
alert('Category created successfully!');
```

#### After (Toast notification)
```javascript
import { showSuccess, showError, showWarning, showConfirmDialog } from '../../utils/toast';
import '../../utils/toast.css';

// Success notification
if (response.status) {
  showSuccess('Category created successfully!');
}

// Error notification
catch (error) {
  showError(error.response?.data?.message || 'Failed to save category');
}

// Warning notification
if (file.size > 5 * 1024 * 1024) {
  showWarning('Image size should not exceed 5MB');
  return;
}

// Confirm dialog
const handleDelete = async (id, name) => {
  const result = await showConfirmDialog({
    title: 'Delete Category',
    text: `Are you sure you want to delete "${name}"?`,
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    // Proceed with deletion
  }
};
```

### Contact Form
File: `src/user/pages/Contact.jsx`

#### Before
```javascript
onSubmit={(e) => {
  e.preventDefault();
  alert("Message sent! We'll get back to you soon.");
}}
```

#### After
```javascript
import { showSuccess } from '../../utils/toast';
import '../../utils/toast.css';

onSubmit={(e) => {
  e.preventDefault();
  showSuccess("Message sent! We'll get back to you soon.");
  e.target.reset();
}}
```

## Custom Styling

### Toast Styles
File: `src/utils/toast.css`

The CSS file includes:
- Custom popup styling with glassmorphism
- Gradient progress bar
- Hover effects
- Dark theme colors
- Smooth animations
- Button styling for confirm dialogs

### Importing Styles
Always import the toast CSS file when using toast notifications:
```javascript
import '../../utils/toast.css';
```

## Migration Checklist

### Files Updated
- ✅ `src/admin/pages/Categories.jsx` - 11 alerts replaced
  - Fetch error
  - Create success
  - Update success
  - Save error
  - Delete confirmation (window.confirm)
  - Delete success
  - Delete error
  - Toggle status success
  - Toggle status error
  - Image validation warnings (2)

- ✅ `src/user/pages/Contact.jsx` - 1 alert replaced
  - Form submission success

### Alert Types Replaced
1. **Simple alerts** → `showSuccess()`, `showError()`, `showWarning()`
2. **window.confirm()** → `showConfirmDialog()`

## Best Practices

### 1. Import What You Need
```javascript
// Only import the functions you'll use
import { showSuccess, showError } from '../../utils/toast';
```

### 2. Always Import CSS
```javascript
import '../../utils/toast.css';
```

### 3. Use Appropriate Toast Types
- ✅ **Success**: Operations completed successfully
- ❌ **Error**: Operations failed or errors occurred
- ⚠️ **Warning**: Validation issues or cautionary messages
- ℹ️ **Info**: General information or tips

### 4. Keep Messages Concise
```javascript
// Good
showSuccess('Category created successfully!');

// Avoid
showSuccess('The category has been successfully created and saved to the database with all the information you provided.');
```

### 5. Use Confirm Dialogs for Destructive Actions
```javascript
// Always confirm before deleting
const result = await showConfirmDialog({
  title: 'Delete Item',
  text: 'This action cannot be undone',
  confirmButtonText: 'Yes, delete it!'
});

if (result.isConfirmed) {
  // Proceed with deletion
}
```

## Advanced Usage

### Custom Timeout
```javascript
Toast.fire({
  icon: 'success',
  title: 'Custom message',
  timer: 5000  // 5 seconds
});
```

### No Auto-Dismiss
```javascript
Toast.fire({
  icon: 'info',
  title: 'Important message',
  timer: undefined,
  showConfirmButton: true
});
```

### Custom Confirm Dialog
```javascript
const result = await Swal.fire({
  title: 'Custom Dialog',
  html: '<p>Custom HTML content</p>',
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  color: '#ffffff'
});
```

## Testing

### Test Success Toast
```javascript
showSuccess('Test success message');
```

### Test Error Toast
```javascript
showError('Test error message');
```

### Test Warning Toast
```javascript
showWarning('Test warning message');
```

### Test Confirm Dialog
```javascript
const result = await showConfirmDialog({
  title: 'Test Confirm',
  text: 'This is a test confirmation'
});
console.log('User confirmed:', result.isConfirmed);
```

## Troubleshooting

### Toast Not Appearing
1. Ensure SweetAlert2 is installed: `npm install sweetalert2`
2. Check if toast.css is imported: `import '../../utils/toast.css'`
3. Verify function is called correctly
4. Check browser console for errors

### Styling Issues
1. Clear browser cache
2. Ensure toast.css is loaded (check Network tab)
3. Check for CSS conflicts with other libraries
4. Verify import path is correct

### Confirm Dialog Not Working
```javascript
// Must use await or .then()
const result = await showConfirmDialog({...});

// OR
showConfirmDialog({...}).then((result) => {
  if (result.isConfirmed) {
    // Handle confirmation
  }
});
```

## Browser Support
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Opera: ✅ Fully supported
- IE11: ❌ Not supported (use polyfills if needed)

## Resources
- [SweetAlert2 Documentation](https://sweetalert2.github.io/)
- [SweetAlert2 GitHub](https://github.com/sweetalert2/sweetalert2)
- [Custom Themes](https://sweetalert2.github.io/#themes)

## Future Enhancements
- [ ] Add sound effects for different toast types
- [ ] Implement toast queue for multiple notifications
- [ ] Add custom toast templates
- [ ] Implement toast history/log
- [ ] Add accessibility improvements (ARIA labels)
- [ ] Create toast service with React Context
