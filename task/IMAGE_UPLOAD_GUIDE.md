# Category Image Upload - Complete Implementation

## ✅ Backend Implementation

### 1. **Multer Configuration** (`src/middlewares/upload.middleware.js`)
- File upload middleware using multer
- Stores images in `uploads/categories/` directory
- Auto-generates unique filenames with timestamp
- File validation:
  - Allowed types: JPEG, JPG, PNG, GIF, WebP
  - Maximum size: 5MB
  - Proper error handling

### 2. **Updated Routes** (`src/routes/category.routes.js`)
```javascript
POST   /api/categories          - upload.single('image')
PUT    /api/categories/:id      - upload.single('image')
```

### 3. **Controller Updates** (`src/controllers/category.controller.js`)
- **Create Category**: Handles file upload and saves path to database
- **Update Category**: 
  - Accepts new image upload
  - Deletes old image from filesystem
  - Updates database with new path
- Boolean conversion for form data (string to boolean)

### 4. **Static File Serving** (`src/app.js`)
```javascript
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```
Images accessible at: `http://localhost:3000/uploads/categories/[filename]`

### 5. **Directory Structure**
```
ecommerce-backend/
└── uploads/
    └── categories/
        ├── .gitkeep
        └── [uploaded images]
```

---

## ✅ Frontend Implementation

### 1. **Updated Service** (`src/services/categoryService.js`)
- Converts data to FormData for file uploads
- Sets correct Content-Type headers
- Handles multipart/form-data requests

### 2. **Categories Component Updates** (`src/admin/pages/Categories.jsx`)

#### New State Variables:
```javascript
const [imageFile, setImageFile] = useState(null);      // Stores selected file
const [imagePreview, setImagePreview] = useState(null); // Preview URL
```

#### New Functions:
- **handleImageChange()** - File selection with validation
  - File type validation (JPEG, PNG, GIF, WebP)
  - File size validation (max 5MB)
  - Creates preview using FileReader API
  
- **handleRemoveImage()** - Removes selected image and preview

- **handleOpenModal()** - Sets preview for existing images

- **handleSubmit()** - Sends file with FormData

### 3. **UI Components**

#### Image Upload Box (No Image Selected):
```jsx
<div className="image-upload-box">
  <input type="file" accept="image/*" onChange={handleImageChange} />
  <label>
    <FaImage /> Click to upload image
    PNG, JPG, GIF, WebP (Max 5MB)
  </label>
</div>
```

#### Image Preview (With Image):
```jsx
<div className="image-preview-wrapper">
  <img src={imagePreview} alt="Preview" />
  <button onClick={handleRemoveImage}>
    <FaTimes /> Remove
  </button>
</div>
```

### 4. **Styling** (`src/admin/pages/Categories.css`)
- Dashed border upload box
- Hover effects with gold gradient
- Image preview with remove button overlay
- Responsive design
- Matches admin panel theme

---

## 🎨 Features

### Upload Box
- ✅ Dashed border with gold accent
- ✅ Large upload icon
- ✅ Clear instructions
- ✅ Hover animation
- ✅ File type restrictions in file picker

### Image Preview
- ✅ Full image preview before upload
- ✅ Remove button with red gradient
- ✅ Maintains aspect ratio
- ✅ Maximum height constraint (300px)
- ✅ Dark background

### Table Display
- ✅ Shows uploaded images as thumbnails (50x50px)
- ✅ Fallback icon for categories without images
- ✅ Rounded borders with gradient
- ✅ Proper image sizing and cropping

### Validation
- ✅ Client-side: File type and size checks
- ✅ Server-side: Multer file filter
- ✅ User-friendly error messages
- ✅ Prevents invalid uploads

---

## 📝 Usage Guide

### For Admin Users:

#### 1. **Create Category with Image:**
   - Click "Add Category"
   - Fill in category details
   - Click upload box to select image
   - Preview appears instantly
   - Submit form

#### 2. **Update Category Image:**
   - Click Edit on any category
   - Existing image shows in preview
   - Click "Remove" to delete current image
   - Upload new image if needed
   - Submit to update

#### 3. **Remove Category Image:**
   - Click Edit on category
   - Click "Remove" button on preview
   - Submit without selecting new image
   - Category saved without image

---

## 🔒 Security Features

1. **File Type Validation**
   - Only image formats allowed
   - Checked on both client and server

2. **File Size Limit**
   - Maximum 5MB per image
   - Prevents server storage issues

3. **Unique Filenames**
   - Timestamp + random number
   - Prevents filename conflicts

4. **Protected Routes**
   - Only authenticated admins can upload
   - JWT token validation

5. **Old File Cleanup**
   - Deletes old image when updating
   - Prevents orphaned files

---

## 🌐 API Endpoints

### Upload Image (Create)
```http
POST /api/categories
Content-Type: multipart/form-data

FormData:
  - name: string (required)
  - description: string (optional)
  - image: file (optional)
  - displayOrder: number (optional)
  - isActive: boolean (optional)
  - isFeatured: boolean (optional)
```

### Upload Image (Update)
```http
PUT /api/categories/:id
Content-Type: multipart/form-data

FormData:
  - name: string (optional)
  - description: string (optional)
  - image: file (optional) - replaces existing
  - displayOrder: number (optional)
  - isActive: boolean (optional)
  - isFeatured: boolean (optional)
```

### Access Uploaded Images
```http
GET http://localhost:3000/uploads/categories/[filename]
```

---

## 📁 File Structure

### Backend:
```
ecommerce-backend/
├── src/
│   ├── middlewares/
│   │   └── upload.middleware.js      ✅ NEW
│   ├── controllers/
│   │   └── category.controller.js    ✅ UPDATED
│   ├── routes/
│   │   └── category.routes.js        ✅ UPDATED
│   └── app.js                         ✅ UPDATED
└── uploads/
    └── categories/
        └── .gitkeep                   ✅ NEW
```

### Frontend:
```
ecommerce-frontend/
└── src/
    ├── services/
    │   └── categoryService.js         ✅ UPDATED
    └── admin/
        └── pages/
            ├── Categories.jsx         ✅ UPDATED
            └── Categories.css         ✅ UPDATED
```

---

## ✨ Complete Feature Set

✅ File upload with drag-and-drop ready UI
✅ Image preview before upload
✅ File type validation (images only)
✅ File size validation (5MB max)
✅ Unique filename generation
✅ Old image deletion on update
✅ Thumbnail display in table
✅ Responsive design
✅ Error handling
✅ Loading states
✅ Gold/Pink gradient theme
✅ Glassmorphism effects
✅ Professional admin interface

---

## 🚀 Ready to Use!

The complete image upload system is now fully integrated into your Categories module. Both backend and frontend are configured and ready for production use!

### Test It:
1. Navigate to `/admin/categories`
2. Click "Add Category"
3. Upload an image
4. See it appear in the table
5. Edit and update the image
6. Everything works seamlessly! 🎉
