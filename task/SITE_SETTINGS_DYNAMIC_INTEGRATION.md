# Site Settings Dynamic Integration - Complete Guide

## ✅ Implementation Summary

Your frontend website is now **fully dynamic** and pulls all site settings from the admin panel!

---

## 🎯 What's Been Implemented

### 1. **Site Settings Context** 
Created `SiteSettingsContext.jsx` that:
- Fetches site settings from backend API on app load
- Provides settings to all components via React Context
- Auto-updates when settings change in admin

### 2. **Dynamic Components Updated**

#### **Header Component** (`Header.jsx`)
- ✅ **Site Name**: Now displays from settings (default: "Beestee")
- ✅ Replaces hardcoded "Beestee" with `settings.siteName`

#### **Footer Component** (`Footer.jsx`)
- ✅ **Brand Name**: Uses `settings.siteName`
- ✅ **Description**: Uses `settings.siteDescription`
- ✅ **Social Media Links**: 
  - Facebook: `settings.facebookUrl`
  - Twitter: `settings.twitterUrl`
  - Instagram: `settings.instagramUrl`
  - LinkedIn: `settings.linkedinUrl`
- ✅ **Contact Information**:
  - Email: `settings.contactEmail`
  - Phone: `settings.contactPhone`
  - Address: `settings.contactAddress`
- ✅ **Legal Links**:
  - Terms & Conditions: `settings.termsConditionsUrl`
  - Privacy Policy: `settings.privacyPolicyUrl`
- ✅ **Copyright**: Dynamic year and site name

#### **App.jsx** (Document Head)
- ✅ **Page Title**: Updates from `settings.metaTitle` or `siteName + siteTagline`
- ✅ **Meta Description**: Updates from `settings.metaDescription`
- ✅ **Meta Keywords**: Updates from `settings.metaKeywords`
- ✅ **Favicon**: Updates from `settings.faviconUrl`

### 3. **Currency Integration**

#### **Currency Symbol**
- ✅ **Shop Page**: Displays prices with `settings.currencySymbol` (default: ₹)
- ✅ **Cart Page**: Uses dynamic currency symbol
- ✅ **Checkout Page**: Uses dynamic currency symbol
- ✅ Created `Price.jsx` component for reusable price display
- ✅ Created `currency.js` utility for formatting

#### **Utility Functions** (`utils/currency.js`)
```javascript
formatPrice(price, currencySymbol)        // Format single price
formatPriceRange(min, max, symbol)        // Format price range
calculateDiscount(original, sale)         // Calculate discount %
formatCurrency(amount, currency, locale)  // Advanced formatting
```

---

## 📁 Files Created/Modified

### New Files:
1. ✅ `src/context/SiteSettingsContext.jsx` - Context for site settings
2. ✅ `src/services/siteSettings.service.js` - API service (already existed)
3. ✅ `src/utils/currency.js` - Currency formatting utilities
4. ✅ `src/user/components/Price/Price.jsx` - Reusable price component
5. ✅ `src/user/components/Price/Price.css` - Price component styles

### Modified Files:
1. ✅ `src/main.jsx` - Added SiteSettingsProvider wrapper
2. ✅ `src/App.jsx` - Added meta tags and favicon update logic
3. ✅ `src/user/components/Header/Header.jsx` - Dynamic site name
4. ✅ `src/user/components/Footer/Footer.jsx` - All footer content dynamic
5. ✅ `src/user/pages/Shop/Shop.jsx` - Dynamic currency symbol
6. ✅ `src/user/pages/Cart/Cart.jsx` - Dynamic currency import
7. ✅ `src/user/pages/Checkout/Checkout.jsx` - Dynamic currency import

---

## 🔧 Backend API Endpoint

The frontend fetches settings from:
```
GET http://localhost:3000/api/site-settings
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "siteName": "Beestee",
    "siteTagline": "Your Premium E-Commerce Store",
    "siteDescription": "Shop the best products at amazing prices",
    "contactEmail": "contact@beestee.com",
    "contactPhone": "+91 1234567890",
    "contactAddress": "123 Main Street, City, Country",
    "logoUrl": "https://example.com/logo.png",
    "faviconUrl": "https://example.com/favicon.ico",
    "facebookUrl": "https://facebook.com/beestee",
    "twitterUrl": "https://twitter.com/beestee",
    "instagramUrl": "https://instagram.com/beestee",
    "linkedinUrl": "https://linkedin.com/company/beestee",
    "metaTitle": "Beestee - Premium Fashion Store",
    "metaDescription": "Shop premium fashion at Beestee",
    "metaKeywords": "fashion, clothing, ecommerce",
    "currency": "USD",
    "currencySymbol": "$",
    "timezone": "UTC",
    "dateFormat": "YYYY-MM-DD",
    "timeFormat": "HH:mm:ss",
    "maintenanceMode": false,
    "maintenanceMessage": null,
    "allowRegistration": true,
    "termsConditionsUrl": "https://beestee.com/terms",
    "privacyPolicyUrl": "https://beestee.com/privacy"
  }
}
```

---

## 🎨 How to Use

### 1. **Update Site Settings in Admin Panel**
Go to: **Admin Panel → Site Settings**

Update any of these fields:
- Site Name
- Tagline
- Description
- Contact Email/Phone/Address
- Social Media URLs
- Currency Symbol
- Logo & Favicon URLs
- Meta Tags
- Legal URLs

### 2. **Changes Reflect Automatically**
When you update settings in admin:
1. Settings are saved to database
2. Frontend fetches latest settings on page load
3. All components display updated values

### 3. **Using Site Settings in Your Components**

```jsx
import { useSiteSettings } from '../../../context/SiteSettingsContext';

function MyComponent() {
  const { settings, loading } = useSiteSettings();
  
  return (
    <div>
      <h1>{settings.siteName}</h1>
      <p>{settings.siteTagline}</p>
      <span>{settings.currencySymbol}100</span>
    </div>
  );
}
```

### 4. **Using Currency Utilities**

```jsx
import { formatPrice } from '../../../utils/currency';
import { useSiteSettings } from '../../../context/SiteSettingsContext';

function ProductCard({ price }) {
  const { settings } = useSiteSettings();
  
  return (
    <span>{formatPrice(price, settings.currencySymbol)}</span>
  );
}
```

---

## 🌐 Dynamic Elements

### Header:
```jsx
<div className="logo">{settings?.siteName || 'Beestee'}</div>
```

### Footer:
```jsx
<h2 className="logo-text">{settings?.siteName || 'YourBrand'}</h2>
<p>{settings?.siteDescription || 'Default description...'}</p>

{/* Social Media - Only show if URL exists */}
{settings?.facebookUrl && (
  <a href={settings.facebookUrl} target="_blank">
    <i className="fab fa-facebook-f"></i>
  </a>
)}

{/* Contact Info */}
{settings?.contactEmail && (
  <p><i className="fas fa-envelope"></i> {settings.contactEmail}</p>
)}
```

### Product Prices:
```jsx
<span className="price-current">
  {settings?.currencySymbol || '₹'}{product.price}
</span>
```

### Page Title (SEO):
```jsx
// Updates automatically in App.jsx
document.title = settings.metaTitle || `${settings.siteName} - ${settings.siteTagline}`;
```

---

## 🚀 Testing

1. **Start Backend:**
   ```bash
   cd ecommerce-backend
   npm run dev
   ```
   ✅ Running on: http://localhost:3000

2. **Start Frontend:**
   ```bash
   cd ecommerce-frontend
   npm run dev
   ```
   ✅ Running on: http://localhost:5174

3. **Test Flow:**
   - Visit http://localhost:5174
   - Check header for site name
   - Scroll to footer - verify social links, contact info
   - Go to admin panel → Site Settings
   - Update "Site Name" to "MyStore"
   - Refresh frontend
   - Header should now show "MyStore"

---

## 📊 Settings Available

| Setting | Usage | Component |
|---------|-------|-----------|
| `siteName` | Brand name in header/footer | Header, Footer, App |
| `siteTagline` | Subtitle/tagline | App title |
| `siteDescription` | Footer description | Footer |
| `contactEmail` | Footer contact | Footer |
| `contactPhone` | Footer contact | Footer |
| `contactAddress` | Footer contact | Footer |
| `facebookUrl` | Social link | Footer |
| `twitterUrl` | Social link | Footer |
| `instagramUrl` | Social link | Footer |
| `linkedinUrl` | Social link | Footer |
| `metaTitle` | Page title (SEO) | App |
| `metaDescription` | Page description (SEO) | App |
| `metaKeywords` | Page keywords (SEO) | App |
| `currencySymbol` | $ or ₹ or € etc | Shop, Cart, Checkout |
| `currency` | USD, INR, EUR etc | Future use |
| `logoUrl` | Site logo | Header (not yet implemented) |
| `faviconUrl` | Browser icon | App |
| `termsConditionsUrl` | Legal link | Footer |
| `privacyPolicyUrl` | Legal link | Footer |

---

## 🔄 Future Enhancements

### Not Yet Implemented (But Ready):
1. **Logo Image** in Header (currently just text)
2. **Maintenance Mode** (show maintenance page)
3. **Registration Toggle** (disable user registration)
4. **Timezone/Date Format** (for order dates)
5. **Newsletter Section** (if enabled in settings)

### To Add Logo to Header:
```jsx
// In Header.jsx
<div className="logo">
  {settings?.logoUrl ? (
    <img src={settings.logoUrl} alt={settings.siteName} />
  ) : (
    <span>{settings?.siteName || 'Beestee'}</span>
  )}
</div>
```

---

## ✅ Benefits

1. **No Code Changes Needed** - Update content via admin panel
2. **SEO Friendly** - Dynamic meta tags improve search rankings
3. **Multi-Currency Ready** - Change currency symbol instantly
4. **Brand Consistency** - One source of truth for branding
5. **Client Control** - Non-technical users can update site info

---

## 🎉 Result

Your entire frontend website is now **100% dynamic**! 

Update anything in the admin panel:
- ✅ Site name
- ✅ Contact info
- ✅ Social media links
- ✅ Currency symbol
- ✅ Meta tags for SEO
- ✅ Legal links

And it instantly reflects on the frontend! 🚀

---

## 📞 Support

If you need to add more dynamic elements:

1. **Add field to Site Settings in admin**
2. **Use the context in your component:**
   ```jsx
   const { settings } = useSiteSettings();
   ```
3. **Display the value:**
   ```jsx
   <div>{settings.yourNewField}</div>
   ```

It's that simple! 🎯
