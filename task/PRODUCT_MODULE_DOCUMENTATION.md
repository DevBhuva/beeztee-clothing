# Product Module - Complete Documentation

## Overview
Advanced product management system with support for variants, multiple images, dynamic attributes, SEO optimization, and comprehensive filtering capabilities.

## Database Schema

### Tables Created

#### 1. brands
Stores brand information for products.

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `name` - VARCHAR(100), UNIQUE, NOT NULL
- `slug` - VARCHAR(150), UNIQUE, NOT NULL
- `description` - TEXT
- `logo` - VARCHAR(255) - Brand logo path
- `isActive` - BOOLEAN, DEFAULT true
- `isFeatured` - BOOLEAN, DEFAULT false
- `displayOrder` - INT, DEFAULT 0
- `metaTitle` - VARCHAR(255) - SEO meta title
- `metaDescription` - TEXT - SEO meta description
- `metaKeywords` - TEXT - SEO keywords
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- UNIQUE(slug)
- INDEX(isActive, isFeatured)

---

#### 2. products
Main product table with pricing, inventory, and SEO fields.

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `name` - VARCHAR(255), NOT NULL
- `slug` - VARCHAR(300), UNIQUE, NOT NULL - SEO-friendly URL
- `sku` - VARCHAR(100), UNIQUE, NOT NULL - Stock Keeping Unit
- `shortDescription` - TEXT
- `description` - LONGTEXT - Full product description
- `categoryId` - INT, FOREIGN KEY → categories.id, NOT NULL
- `subCategoryId` - INT, FOREIGN KEY → sub_categories.id
- `brandId` - INT, FOREIGN KEY → brands.id
- `basePrice` - DECIMAL(10,2), NOT NULL
- `salePrice` - DECIMAL(10,2) - Discounted price
- `costPrice` - DECIMAL(10,2) - For margin calculation
- `taxRate` - DECIMAL(5,2), DEFAULT 0.00 - Tax percentage
- `stockQuantity` - INT, DEFAULT 0 - Total stock
- `lowStockThreshold` - INT, DEFAULT 10
- `weight` - DECIMAL(8,2) - Weight in kg
- `dimensions` - JSON - {length, width, height} in cm
- `isActive` - BOOLEAN, DEFAULT true
- `isFeatured` - BOOLEAN, DEFAULT false
- `isTrending` - BOOLEAN, DEFAULT false
- `isNewArrival` - BOOLEAN, DEFAULT false
- `isBestseller` - BOOLEAN, DEFAULT false
- `status` - ENUM('draft', 'published', 'archived'), DEFAULT 'draft'
- `publishedAt` - DATETIME
- `displayOrder` - INT, DEFAULT 0
- `viewCount` - INT, DEFAULT 0
- `salesCount` - INT, DEFAULT 0
- `averageRating` - DECIMAL(3,2), DEFAULT 0.00 (0-5 stars)
- `reviewCount` - INT, DEFAULT 0
- `createdBy` - INT, FOREIGN KEY → users.id
- `updatedBy` - INT, FOREIGN KEY → users.id
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- UNIQUE(slug), UNIQUE(sku)
- INDEX(categoryId, subCategoryId)
- INDEX(brandId)
- INDEX(status, isActive)
- INDEX(isFeatured, isTrending, isNewArrival, isBestseller)
- INDEX(basePrice, salePrice)

**Relationships:**
- belongsTo: Category, SubCategory, Brand, User (creator), User (updater)
- hasMany: ProductVariant, ProductImage, ProductAttribute, Review
- hasOne: ProductMeta

---

#### 3. product_variants
Store product variations (size, color, style, etc.).

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `productId` - INT, FOREIGN KEY → products.id, NOT NULL, CASCADE DELETE
- `sku` - VARCHAR(100), UNIQUE, NOT NULL
- `size` - VARCHAR(20) - XS, S, M, L, XL, XXL, etc.
- `color` - VARCHAR(50) - Red, Blue, Black, etc.
- `colorCode` - VARCHAR(20) - Hex code: #FF0000
- `material` - VARCHAR(100) - Cotton, Polyester, etc.
- `style` - VARCHAR(100) - Slim Fit, Regular Fit, etc.
- `price` - DECIMAL(10,2) - Overrides base price if set
- `salePrice` - DECIMAL(10,2) - Variant sale price
- `stockQuantity` - INT, DEFAULT 0
- `weight` - DECIMAL(8,2) - Variant-specific weight
- `isActive` - BOOLEAN, DEFAULT true
- `isDefault` - BOOLEAN, DEFAULT false - Default variant to display
- `displayOrder` - INT, DEFAULT 0
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- INDEX(productId), UNIQUE(sku)
- INDEX(size, color)
- INDEX(isActive, stockQuantity)

**Relationships:**
- belongsTo: Product
- hasMany: ProductImage, Review

---

#### 4. product_images
Store multiple images for products and variants.

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `productId` - INT, FOREIGN KEY → products.id, NOT NULL, CASCADE DELETE
- `variantId` - INT, FOREIGN KEY → product_variants.id, CASCADE DELETE
- `imagePath` - VARCHAR(500), NOT NULL
- `altText` - VARCHAR(255) - SEO alt text
- `title` - VARCHAR(255) - Image title
- `isPrimary` - BOOLEAN, DEFAULT false - Featured image
- `displayOrder` - INT, DEFAULT 0
- `imageType` - ENUM('product', 'variant', 'gallery', 'thumbnail'), DEFAULT 'product'
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- INDEX(productId), INDEX(variantId)
- INDEX(isPrimary, displayOrder)

**Relationships:**
- belongsTo: Product, ProductVariant

---

#### 5. product_attributes
Store dynamic product attributes (fit, fabric, pattern, occasion, etc.).

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `productId` - INT, FOREIGN KEY → products.id, NOT NULL, CASCADE DELETE
- `attributeName` - VARCHAR(100), NOT NULL - fit, fabric, pattern, etc.
- `attributeValue` - VARCHAR(255), NOT NULL
- `displayOrder` - INT, DEFAULT 0
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- INDEX(productId)
- INDEX(attributeName, attributeValue)

**Relationships:**
- belongsTo: Product

---

#### 6. product_meta
SEO metadata for products (one-to-one with products).

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `productId` - INT, FOREIGN KEY → products.id, UNIQUE, NOT NULL, CASCADE DELETE
- `metaTitle` - VARCHAR(255) - SEO title
- `metaDescription` - TEXT - SEO description
- `metaKeywords` - TEXT - Comma-separated keywords
- `canonicalUrl` - VARCHAR(500) - Canonical URL
- `ogTitle` - VARCHAR(255) - Open Graph title
- `ogDescription` - TEXT - Open Graph description
- `ogImage` - VARCHAR(500) - Open Graph image
- `twitterCard` - VARCHAR(50) - Twitter card type
- `focusKeyphrase` - VARCHAR(255) - Primary SEO keyphrase
- `schemaMarkup` - JSON - JSON-LD schema for rich snippets
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- UNIQUE(productId)

**Relationships:**
- belongsTo: Product

---

#### 7. reviews
Customer product reviews and ratings.

**Fields:**
- `id` - INT, PRIMARY KEY, AUTO_INCREMENT
- `productId` - INT, FOREIGN KEY → products.id, NOT NULL, CASCADE DELETE
- `userId` - INT, FOREIGN KEY → users.id, NOT NULL, CASCADE DELETE
- `variantId` - INT, FOREIGN KEY → product_variants.id, SET NULL
- `rating` - TINYINT(1-5), NOT NULL
- `title` - VARCHAR(255) - Review headline
- `comment` - TEXT - Review text
- `images` - JSON - Array of review images
- `isVerifiedPurchase` - BOOLEAN, DEFAULT false
- `isApproved` - BOOLEAN, DEFAULT false - Admin approval
- `helpfulCount` - INT, DEFAULT 0 - Helpful votes
- `reportCount` - INT, DEFAULT 0 - Report flags
- `adminResponse` - TEXT - Admin/seller response
- `respondedAt` - DATETIME
- `createdAt` - DATETIME
- `updatedAt` - DATETIME

**Indexes:**
- INDEX(productId), INDEX(userId)
- INDEX(rating, isApproved)
- INDEX(isVerifiedPurchase)

**Relationships:**
- belongsTo: Product, User, ProductVariant

---

## Database Relationships Summary

```
brands (1) ──────< (N) products
categories (1) ──────< (N) products
sub_categories (1) ──────< (N) products
users (1) ──────< (N) products (creator/updater)

products (1) ──────< (N) product_variants
products (1) ──────< (N) product_images
products (1) ──────< (N) product_attributes
products (1) ────── (1) product_meta
products (1) ──────< (N) reviews

product_variants (1) ──────< (N) product_images
product_variants (1) ──────< (N) reviews
users (1) ──────< (N) reviews
```

---

## API Endpoints (Planned)

### Products

**Public Endpoints:**
- `GET /api/products` - Get all products (with filters, pagination)
- `GET /api/products/:slug` - Get product by slug (SEO-friendly)
- `GET /api/products/:id/variants` - Get product variants
- `GET /api/products/:id/reviews` - Get product reviews
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/bestsellers` - Get bestsellers

**Admin Endpoints:**
- `POST /api/products` - Create product (with images)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/status` - Toggle product status
- `POST /api/products/:id/variants` - Add variant
- `PUT /api/products/variants/:id` - Update variant
- `DELETE /api/products/variants/:id` - Delete variant
- `POST /api/products/:id/images` - Upload product images
- `DELETE /api/products/images/:id` - Delete image
- `POST /api/products/:id/attributes` - Add attribute
- `DELETE /api/products/attributes/:id` - Delete attribute

### Brands

**Public Endpoints:**
- `GET /api/brands` - Get all brands
- `GET /api/brands/:slug` - Get brand by slug

**Admin Endpoints:**
- `POST /api/brands` - Create brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand
- `PATCH /api/brands/:id/status` - Toggle brand status

### Reviews

**Customer Endpoints:**
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update own review
- `DELETE /api/reviews/:id` - Delete own review
- `POST /api/reviews/:id/helpful` - Mark review helpful

**Admin Endpoints:**
- `PATCH /api/reviews/:id/approve` - Approve review
- `POST /api/reviews/:id/respond` - Add admin response

---

## Product Filtering Capabilities

**Filter Parameters:**
- `categoryId` - Filter by category
- `subCategoryId` - Filter by subcategory
- `brandId` - Filter by brand
- `minPrice` / `maxPrice` - Price range
- `size` - Filter by size (joins with variants)
- `color` - Filter by color (joins with variants)
- `material` - Filter by material
- `isFeatured` - Featured products only
- `isTrending` - Trending products only
- `isNewArrival` - New arrivals only
- `isBestseller` - Bestsellers only
- `status` - draft / published / archived
- `inStock` - Only products with stock > 0

**Sorting Options:**
- `sortBy` - name, basePrice, createdAt, salesCount, averageRating, viewCount
- `order` - ASC / DESC

**Pagination:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

---

## SEO-Friendly URL Structure

### Product URLs:
```
/products/{category-slug}/{subcategory-slug}/{product-slug}
/products/men/shirts/cotton-slim-fit-blue-shirt
/products/women/dresses/floral-maxi-summer-dress
```

### Brand URLs:
```
/brands/{brand-slug}
/brands/nike
/brands/adidas
```

### Category URLs:
```
/shop/{category-slug}
/shop/men

/shop/{category-slug}/{subcategory-slug}
/shop/men/shirts
```

---

## Image Upload Strategy

### Directory Structure:
```
uploads/
├── products/
│   ├── product-1699264800000-123456789.jpg
│   ├── product-1699264800000-987654321.jpg
│   └── ...
├── brands/
│   ├── brand-1699264800000-123456789.png
│   └── ...
├── categories/
└── subcategories/
```

### Image Types:
- **Product Images**: Main product photos (multiple allowed)
- **Variant Images**: Specific to size/color combinations
- **Gallery Images**: Additional product showcase images
- **Thumbnails**: Auto-generated or manually uploaded

### Upload Limits:
- **Max file size**: 5MB per image
- **Max images per product**: 10 images
- **Allowed formats**: JPEG, PNG, GIF, WebP

---

## Future Extension Points

### 1. Coupons / Discounts System

**New Tables Needed:**
```sql
CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed_amount') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minOrderAmount DECIMAL(10,2),
  maxDiscountAmount DECIMAL(10,2),
  usageLimit INT,
  usedCount INT DEFAULT 0,
  validFrom DATETIME,
  validTo DATETIME,
  isActive BOOLEAN DEFAULT true
);

CREATE TABLE product_coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  couponId INT FOREIGN KEY → coupons.id,
  productId INT FOREIGN KEY → products.id,
  categoryId INT FOREIGN KEY → categories.id,
  -- Apply coupon to specific products or entire categories
);
```

**Implementation:**
- Add `discountPrice` calculation in product queries
- Apply coupon logic at checkout
- Track coupon usage per user

---

### 2. Inventory Tracking

**New Fields in `products` table:**
```sql
ALTER TABLE products ADD COLUMN reservedStock INT DEFAULT 0;
ALTER TABLE products ADD COLUMN availableStock INT GENERATED ALWAYS AS (stockQuantity - reservedStock) STORED;
```

**New Table:**
```sql
CREATE TABLE stock_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT FOREIGN KEY → products.id,
  variantId INT FOREIGN KEY → product_variants.id,
  movementType ENUM('purchase', 'sale', 'return', 'adjustment', 'damage'),
  quantity INT NOT NULL,
  previousStock INT,
  newStock INT,
  reason TEXT,
  createdBy INT FOREIGN KEY → users.id,
  createdAt DATETIME
);
```

**Features:**
- Track every stock change with reason
- Low stock alerts when < lowStockThreshold
- Out-of-stock notifications
- Reorder point management

---

### 3. Order Analytics

**New Tables:**
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT FOREIGN KEY → users.id,
  totalAmount DECIMAL(10,2),
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  createdAt DATETIME
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT FOREIGN KEY → orders.id,
  productId INT FOREIGN KEY → products.id,
  variantId INT FOREIGN KEY → product_variants.id,
  quantity INT,
  price DECIMAL(10,2),
  discount DECIMAL(10,2),
  tax DECIMAL(10,2)
);
```

**Analytics Capabilities:**
- Product sales performance (update `salesCount`)
- Revenue per product/category/brand
- Best-selling products by time period
- Customer purchase patterns
- Inventory turnover rate
- Profit margin analysis

**Analytics Queries:**
```sql
-- Top selling products
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.productId
GROUP BY p.id
ORDER BY total_sold DESC LIMIT 10;

-- Revenue by category
SELECT c.name, SUM(oi.quantity * oi.price) as revenue
FROM categories c
JOIN products p ON c.id = p.categoryId
JOIN order_items oi ON p.id = oi.productId
GROUP BY c.id;
```

---

## Performance Optimization Tips

### Database Indexes:
All critical indexes already created in migrations:
- Primary keys, foreign keys
- Unique constraints on slugs and SKUs
- Composite indexes on frequently filtered columns
- Full-text indexes for search (can be added later)

### Caching Strategy:
- Cache popular product listings (featured, trending, bestsellers)
- Cache category trees
- Cache brand lists
- Use Redis for session and frequently accessed data

### Query Optimization:
- Use pagination for large datasets
- Eager load associations with `include`
- Use `attributes` to select only needed fields
- Index foreign keys for JOIN operations

### Image Optimization:
- Resize images on upload (multiple sizes: thumbnail, medium, large)
- Use CDN for image delivery
- Lazy loading for product galleries
- WebP format for modern browsers

---

## Testing Checklist

### Database:
- [ ] Run all migrations successfully
- [ ] Verify all foreign key constraints
- [ ] Test cascade deletes
- [ ] Check index performance

### API Endpoints:
- [ ] Product CRUD operations
- [ ] Variant management
- [ ] Image upload (single & multiple)
- [ ] Filtering and search
- [ ] Pagination
- [ ] Review submission and approval

### Business Logic:
- [ ] Stock management (increase/decrease)
- [ ] Price calculations (base, sale, tax)
- [ ] Rating aggregation
- [ ] Slug generation (unique)
- [ ] SEO meta auto-generation

### Security:
- [ ] Authentication on admin routes
- [ ] Input validation on all endpoints
- [ ] File upload validation (type, size)
- [ ] SQL injection prevention
- [ ] XSS prevention in reviews

---

## Next Steps

1. **Backend:**
   - ✅ Database migrations created
   - ✅ Sequelize models created
   - ✅ Validation schemas created
   - ✅ Upload middleware updated
   - ⏳ Create product controllers
   - ⏳ Create brand controllers
   - ⏳ Create product routes
   - ⏳ Create brand routes
   - ⏳ Test all API endpoints

2. **Frontend:**
   - ⏳ Create product service (API calls)
   - ⏳ Create brand service
   - ⏳ Build admin Products page (listing, CRUD)
   - ⏳ Build admin Brands page
   - ⏳ Build product image manager
   - ⏳ Build variant manager
   - ⏳ Build attribute manager

3. **Public Frontend:**
   - ⏳ Product listing page with filters
   - ⏳ Product detail page
   - ⏳ Product search
   - ⏳ Category/brand pages

---

## Conclusion

This product module provides:
- ✅ Normalized database design
- ✅ Support for unlimited variants
- ✅ Multiple images per product/variant
- ✅ Dynamic attributes system
- ✅ Comprehensive SEO fields
- ✅ Review and rating system
- ✅ Advanced filtering capabilities
- ✅ Scalable architecture for future features

The schema is production-ready and optimized for e-commerce applications with complex product catalogs.
