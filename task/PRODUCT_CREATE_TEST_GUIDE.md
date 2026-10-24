# Product Creation Testing Guide

## 🚀 Server Status
- ✅ **Frontend**: Running on http://localhost:5174
- ✅ **Backend**: Running on http://localhost:3000

## 📋 Test Scenario: Create Product with Attributes and Variants

### Step 1: Navigate to Product Create Page
1. Open browser: http://localhost:5174
2. Login to admin panel (if required)
3. Navigate to: **Products → Create Product**
4. URL should be: `http://localhost:5174/admin/products/create`

---

### Step 2: Fill Basic Product Information

**Product Details:**
```
Name: Premium Cotton T-Shirt
SKU: TSHIRT-001
Short Description: Comfortable cotton t-shirt for everyday wear
Description: High-quality 100% cotton t-shirt with excellent breathability 
             and comfort. Perfect for casual wear.
```

**Category & Brand:**
```
Category: [Select from dropdown - e.g., Clothing]
Subcategory: [Select from dropdown - e.g., T-Shirts]
Brand: [Select from dropdown - e.g., Nike/Adidas]
```

**Pricing:**
```
Base Price: 29.99
Sale Price: 24.99 (optional)
Cost Price: 15.00
Tax Rate: 18
```

**Inventory:**
```
Stock Quantity: 100
Low Stock Threshold: 10
```

**Physical Details:**
```
Weight: 0.2 (kg)
Dimensions:
  - Length: 28
  - Width: 20
  - Height: 2
  - Unit: cm
```

**Status & Visibility:**
```
☑ Is Active
☑ Is Featured
☐ Is Trending
☑ Is New Arrival
☐ Is Bestseller
Status: Published
Display Order: 1
```

**SEO Meta Information:**
```
Meta Title: Premium Cotton T-Shirt - Comfortable Daily Wear
Meta Description: Shop premium cotton t-shirts. High quality, comfortable, 
                  and stylish. Available in multiple colors and sizes.
Meta Keywords: cotton t-shirt, premium tshirt, comfortable wear
```

---

### Step 3: Add Product Attributes

Click **"Add Attribute"** button and add these specifications:

**Attribute 1:**
```
Attribute Name: Material
Attribute Value: 100% Cotton
[Click "Add Attribute"]
```

**Attribute 2:**
```
Attribute Name: Care Instructions
Attribute Value: Machine wash cold, tumble dry low
[Click "Add Attribute"]
```

**Attribute 3:**
```
Attribute Name: Fit
Attribute Value: Regular Fit
[Click "Add Attribute"]
```

**Attribute 4:**
```
Attribute Name: Neck Style
Attribute Value: Crew Neck
[Click "Add Attribute"]
```

You should see these attributes displayed in a grid with remove buttons.

---

### Step 4: Add Product Variants

Click **"Add Variant"** button and add these variations:

#### **Variant 1 (Black - Small) - DEFAULT**
```
SKU: TSHIRT-001-BLK-S
Size: S
Color: Black
Color Code: #000000 (use color picker or type)
Material: Cotton
Style: Casual
Price Override: (leave empty - uses base price)
Sale Price Override: (leave empty - uses base sale price)
Stock Quantity: 25
Weight Override: (leave empty - uses base weight)
☑ Active
☑ Default (Set as default variant)
[Click "Add Variant"]
```

#### **Variant 2 (Black - Medium)**
```
SKU: TSHIRT-001-BLK-M
Size: M
Color: Black
Color Code: #000000
Material: Cotton
Style: Casual
Stock Quantity: 30
☑ Active
☐ Default
[Click "Add Variant"]
```

#### **Variant 3 (White - Small)**
```
SKU: TSHIRT-001-WHT-S
Size: S
Color: White
Color Code: #FFFFFF
Material: Cotton
Style: Casual
Stock Quantity: 20
☑ Active
☐ Default
[Click "Add Variant"]
```

#### **Variant 4 (White - Medium - Premium Pricing)**
```
SKU: TSHIRT-001-WHT-M
Size: M
Color: White
Color Code: #FFFFFF
Material: Premium Cotton
Style: Casual
Price Override: 34.99
Sale Price Override: 29.99
Stock Quantity: 15
☑ Active
☐ Default
[Click "Add Variant"]
```

#### **Variant 5 (Blue - Large)**
```
SKU: TSHIRT-001-BLU-L
Size: L
Color: Navy Blue
Color Code: #000080
Material: Cotton
Style: Casual
Stock Quantity: 10
☑ Active
☐ Default
[Click "Add Variant"]
```

You should see a table displaying all variants with:
- ✅ Color swatches
- ✅ "Default" badge on the first variant
- ✅ "Active" badges
- ✅ SKU, Size, Material, Style columns
- ✅ Remove buttons

---

### Step 5: Upload Product Images

1. Click **"Choose Images"** or drag & drop
2. Upload 3-5 product images (different angles)
3. First image will be the primary image

**Recommended:**
- Front view
- Back view
- Side view
- Detail shot
- Model wearing (optional)

---

### Step 6: Submit Product

1. Review all entered data
2. Click **"Create Product"** button
3. Wait for loading indicator
4. Should see success toast: ✅ **"Product created successfully!"**
5. Should redirect to: `/admin/products`

---

## 🧪 Expected Results

### Database Records Created:

1. **Product Table:**
   - 1 product record with basic details
   - Name: "Premium Cotton T-Shirt"
   - SKU: "TSHIRT-001"
   - Slug: "premium-cotton-t-shirt"

2. **ProductAttribute Table:**
   - 4 attribute records linked to product
   - Material, Care Instructions, Fit, Neck Style

3. **ProductVariant Table:**
   - 5 variant records linked to product
   - Each with unique SKU
   - One marked as default (isDefault: true)
   - Different prices for white medium variant

4. **ProductImage Table:**
   - 3-5 image records
   - First image marked as primary (isPrimary: true)

5. **ProductMeta Table:**
   - 1 meta record with SEO information

---

## ✅ Validation Checks

### Before Submission:
- ✅ All required fields filled (Name, SKU, Category, Base Price)
- ✅ Variant SKUs are unique (no duplicates)
- ✅ At least one image uploaded
- ✅ Dropdown data loaded correctly

### After Submission:
- ✅ Success toast notification appears
- ✅ Redirects to products list page
- ✅ New product visible in products table
- ✅ Product card shows correct thumbnail
- ✅ Stats updated (Total Products count increased)

---

## 🔍 Backend API Calls Made

Monitor Network tab in DevTools (F12):

1. **POST** `/api/products` (Create product with attributes)
   - FormData with product details
   - attributes as JSON string
   - images as files
   
2. **POST** `/api/products/variants` × 5 (Create each variant)
   - One request per variant
   - Includes productId from step 1

---

## 🐛 Common Issues & Solutions

### Issue 1: Dropdowns not loading
**Solution:** 
- Check console for API errors
- Verify backend is running on port 3000
- Check Categories, Brands exist in database

### Issue 2: "SKU already exists" error
**Solution:** 
- Use unique SKU for each product
- Change "TSHIRT-001" to "TSHIRT-002", etc.

### Issue 3: Variants not created
**Solution:** 
- Check console for API errors
- Verify productService.createProduct handles variants
- Check backend variant controller is working

### Issue 4: Images not uploading
**Solution:** 
- Check file size (max 5MB typically)
- Verify uploads/products folder exists
- Check multer middleware configuration

### Issue 5: "Failed to create product"
**Solution:** 
- Open DevTools Console (F12)
- Check Network tab for failed requests
- Look for validation errors in response

---

## 📊 Test Verification

After product creation, verify in Products List:

```
Product Card Should Show:
├── Thumbnail: First uploaded image
├── Name: "Premium Cotton T-Shirt"
├── SKU: "TSHIRT-001"
├── Category: Selected category name
├── Brand: Selected brand name
├── Price: $29.99 (with sale price strikethrough)
├── Stock: 100 (sum of all variants)
├── Status: Active (green badge)
└── Actions: Edit, Delete, Toggle Status
```

---

## 🔄 Database Verification

Run these SQL queries to verify:

```sql
-- Check product created
SELECT * FROM Products WHERE sku = 'TSHIRT-001';

-- Check attributes (should be 4 records)
SELECT * FROM ProductAttributes WHERE productId = [product_id];

-- Check variants (should be 5 records)
SELECT * FROM ProductVariants WHERE productId = [product_id];

-- Check images
SELECT * FROM ProductImages WHERE productId = [product_id];

-- Check meta
SELECT * FROM ProductMetas WHERE productId = [product_id];
```

---

## 🎯 Advanced Testing

### Test 2: Product with NO Variants
- Create product with only attributes
- No variants added
- Should create successfully

### Test 3: Product with NO Attributes
- Create product with only variants
- No attributes added
- Should create successfully

### Test 4: Minimal Product
- Only required fields:
  - Name, SKU, Category, Base Price
- No attributes, variants, or images
- Should create successfully

### Test 5: Variant Pricing Override
- Create variant with custom price
- Verify it uses variant price instead of base price
- Check both regular and sale price overrides

### Test 6: Default Variant Logic
- Add 3 variants
- Set middle one as default
- Verify only one variant has isDefault=true
- Check color swatch display

---

## 📝 Test Results Template

```
Date: November 8, 2025
Tester: [Your Name]

✅ PASS / ❌ FAIL

[ ] Product form loads correctly
[ ] Dropdowns populated (Categories, Subcategories, Brands)
[ ] All form fields editable
[ ] Attributes can be added/removed
[ ] Variants can be added/removed
[ ] Color picker works
[ ] SKU uniqueness validation works
[ ] Image upload works
[ ] Form submission successful
[ ] Success toast displayed
[ ] Redirects to products list
[ ] Product appears in list
[ ] Database records created correctly
[ ] Attributes saved correctly (4 records)
[ ] Variants saved correctly (5 records)
[ ] Images saved correctly
[ ] Meta data saved correctly
[ ] Default variant marked correctly
[ ] Variant pricing overrides work
[ ] Product thumbnail displays
[ ] Product status badge shows

Total Tests: 21
Passed: __
Failed: __
Success Rate: __%

Issues Found:
1. 
2. 
3. 

Notes:

```

---

## 🚀 Quick Test Command

For quick backend API testing without UI:

```bash
# Test product creation via curl
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001",
    "shortDescription": "Test description",
    "categoryId": 1,
    "basePrice": 29.99,
    "stockQuantity": 100
  }'
```

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12 → Console tab)
2. Check network requests (F12 → Network tab)
3. Check backend terminal logs
4. Verify database connection
5. Review this guide's troubleshooting section

**Ready to test?** Navigate to: http://localhost:5174/admin/products/create

---

*Last Updated: November 8, 2025*
