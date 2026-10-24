import api from './api';
import { USE_DEMO_PRODUCTS } from '../config/demo';
import {
  demoAxiosProductById,
  demoAxiosProductBySlug,
  demoAxiosProducts,
} from './demoCatalogService';

const productService = {
  // ============================================
  // PRODUCT CRUD
  // ============================================

  // Get all products with filters
  getAllProducts: (params = {}) => {
    if (USE_DEMO_PRODUCTS) return demoAxiosProducts(params);
    return api.get('/products', { params });
  },

  // Get product by ID
  getProductById: (id) => {
    if (USE_DEMO_PRODUCTS) return demoAxiosProductById(id);
    return api.get(`/products/${id}`);
  },

  // Get product by slug
  getProductBySlug: (slug) => {
    if (USE_DEMO_PRODUCTS) return demoAxiosProductBySlug(slug);
    return api.get(`/products/slug/${slug}`);
  },

  // Create product
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Append basic fields
    const fields = [
      'name', 'sku', 'shortDescription', 'description',
      'categoryId', 'subCategoryId', 'brandId',
      'basePrice', 'salePrice', 'costPrice', 'taxRate',
      'stockQuantity', 'lowStockThreshold', 'weight',
      'isActive', 'isFeatured', 'isTrending', 'isNewArrival', 'isBestseller',
      'status', 'displayOrder', 'createdBy',
      'metaTitle', 'metaDescription', 'metaKeywords'
    ];

    fields.forEach(field => {
      if (productData[field] !== null && productData[field] !== undefined) {
        formData.append(field, productData[field]);
      }
    });

    // Append dimensions as JSON string
    if (productData.dimensions) {
      formData.append('dimensions', JSON.stringify(productData.dimensions));
    }

    // Append attributes as JSON string
    if (productData.attributes && Array.isArray(productData.attributes)) {
      formData.append('attributes', JSON.stringify(productData.attributes));
    }

    // Append images (multiple files)
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Create product
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Product creation response:', response.data);
    console.log('Has variants to create?', productData.variants?.length);

    // If product created successfully and variants exist, create them
    if (response.data.status && productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
      const productId = response.data.data.id;
      console.log('✅ Creating variants for product:', productId);
      console.log('Variants to create:', productData.variants);
      
      // Create variants one by one (backend doesn't have bulk variant creation)
      const variantPromises = productData.variants.map(variant => {
        const variantData = {
          productId,
          ...variant
        };
        console.log('Creating variant:', variantData);
        return api.post('/products/variants', variantData);
      });
      
      try {
        const variantResults = await Promise.all(variantPromises);
        console.log('✅ Variants created successfully:', variantResults.length);
      } catch (variantError) {
        console.error('❌ Error creating variants:', variantError);
        console.error('Error details:', variantError.response?.data);
        // Product is created, but variants failed - we can continue
      }
    } else {
      console.log('⚠️ Variant creation skipped. Reason:');
      console.log('  - response.data.status:', response.data.status);
      console.log('  - productData.variants exists:', !!productData.variants);
      console.log('  - is array:', Array.isArray(productData.variants));
      console.log('  - length:', productData.variants?.length);
    }

    return response;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    
    // Append all fields to FormData (except variants and attributes which are handled separately)
    Object.keys(productData).forEach(key => {
      if (key === 'variants' || key === 'attributes') {
        // Skip variants and attributes, handle them separately
        return;
      } else if (key === 'dimensions' && productData[key]) {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (key === 'images' && Array.isArray(productData[key])) {
        productData[key].forEach((image) => {
          formData.append('images', image);
        });
      } else if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Update product
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Handle attributes separately if provided
    if (productData.attributes && Array.isArray(productData.attributes)) {
      try {
        // First, delete all existing attributes
        await api.delete(`/products/${id}/attributes`);
        
        // Then add new attributes (if any)
        if (productData.attributes.length > 0) {
          const attributesData = productData.attributes.map(attr => ({
            attributeName: attr.attributeName,
            attributeValue: attr.attributeValue
          }));
          
          await api.post('/products/attributes/bulk', {
            productId: id,
            attributes: attributesData
          });
        }
      } catch (attrError) {
        console.error('Error updating attributes:', attrError);
      }
    }

    // Handle variants separately if provided
    console.log('=== UPDATE PRODUCT VARIANTS ===');
    console.log('Has variants?', !!productData.variants);
    console.log('Is array?', Array.isArray(productData.variants));
    console.log('Length:', productData.variants?.length);
    
    if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
      console.log('✅ Updating variants for product:', id);
      console.log('Variants to update/create:', productData.variants);
      
      // Determine which variants to create or update
      const variantPromises = [];
      
      productData.variants.forEach(variant => {
        if (variant.id) {
          // Update existing variant
          console.log('🔄 Updating existing variant:', variant.id);
          variantPromises.push(api.put(`/products/variants/${variant.id}`, variant));
        } else {
          // Create new variant
          console.log('➕ Creating new variant for product:', id);
          const newVariant = {
            productId: id,
            ...variant
          };
          console.log('New variant data:', newVariant);
          variantPromises.push(api.post('/products/variants', newVariant));
        }
      });

      try {
        const variantResults = await Promise.all(variantPromises);
        console.log('✅ Variants updated/created successfully:', variantResults.length);
      } catch (variantError) {
        console.error('❌ Error updating variants:', variantError);
        console.error('Error details:', variantError.response?.data);
      }
    } else {
      console.log('⚠️ No variants to update');
    }

    return response;
  },

  // Delete product
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  // Toggle product status
  toggleProductStatus: (id) => {
    return api.patch(`/products/status/${id}`);
  },

  // Bulk update products
  bulkUpdateProducts: (productIds, updateData) => {
    return api.patch('/products/bulk-update', { productIds, updateData });
  },

  // ============================================
  // PRODUCT VARIANTS
  // ============================================

  // Get product variants
  getProductVariants: (productId) => {
    return api.get(`/products/${productId}/variants`);
  },

  // Create variant
  createVariant: (variantData) => {
    return api.post('/products/variants', variantData);
  },

  // Get variant by ID
  getVariantById: (id) => {
    return api.get(`/products/variants/${id}`);
  },

  // Update variant
  updateVariant: (id, variantData) => {
    return api.put(`/products/variants/${id}`, variantData);
  },

  // Delete variant
  deleteVariant: (id) => {
    return api.delete(`/products/variants/${id}`);
  },

  // Get available sizes
  getAvailableSizes: (productId) => {
    return api.get(`/products/${productId}/sizes`);
  },

  // Get available colors
  getAvailableColors: (productId) => {
    return api.get(`/products/${productId}/colors`);
  },

  // ============================================
  // PRODUCT IMAGES
  // ============================================

  // Get product images
  getProductImages: (productId, variantId = null) => {
    const params = variantId ? { variantId } : {};
    return api.get(`/products/${productId}/images`, { params });
  },

  // Upload images
  uploadImages: (productId, images, variantId = null, imageType = 'product') => {
    const formData = new FormData();
    
    if (variantId) {
      formData.append('variantId', variantId);
    }
    formData.append('imageType', imageType);
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    return api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get image by ID
  getImageById: (id) => {
    return api.get(`/products/images/${id}`);
  },

  // Update image
  updateImage: (id, imageData) => {
    return api.put(`/products/images/${id}`, imageData);
  },

  // Set primary image
  setPrimaryImage: (id) => {
    return api.patch(`/products/images/${id}/primary`);
  },

  // Delete image
  deleteImage: (id) => {
    return api.delete(`/products/images/${id}`);
  },

  // Reorder images
  reorderImages: (productId, imageOrders) => {
    return api.patch(`/products/${productId}/images/reorder`, { imageOrders });
  },

  // ============================================
  // PRODUCT ATTRIBUTES
  // ============================================

  // Get product attributes
  getProductAttributes: (productId) => {
    return api.get(`/products/${productId}/attributes`);
  },

  // Add single attribute
  addAttribute: (attributeData) => {
    return api.post('/products/attributes', attributeData);
  },

  // Bulk add attributes
  bulkAddAttributes: (productId, attributes) => {
    return api.post('/products/attributes/bulk', { productId, attributes });
  },

  // Get attribute by ID
  getAttributeById: (id) => {
    return api.get(`/products/attributes/${id}`);
  },

  // Update attribute
  updateAttribute: (id, attributeData) => {
    return api.put(`/products/attributes/${id}`, attributeData);
  },

  // Delete attribute
  deleteAttribute: (id) => {
    return api.delete(`/products/attributes/${id}`);
  },

  // Delete all attributes for a product
  deleteProductAttributes: (productId) => {
    return api.delete(`/products/${productId}/attributes`);
  },

  // ============================================
  // SPECIAL QUERIES
  // ============================================

  // Get featured products
  getFeaturedProducts: (limit = 10) => {
    return api.get('/products', { 
      params: { isFeatured: 'true', status: 'published', isActive: 'true', limit } 
    });
  },

  // Get trending products
  getTrendingProducts: (limit = 10) => {
    const params = { isTrending: 'true', status: 'published', isActive: 'true', limit };
    if (USE_DEMO_PRODUCTS) return demoAxiosProducts(params);
    return api.get('/products', { params });
  },

  // Get new arrivals
  getNewArrivals: (limit = 10) => {
    const params = { isNewArrival: 'true', status: 'published', isActive: 'true', limit };
    if (USE_DEMO_PRODUCTS) return demoAxiosProducts(params);
    return api.get('/products', { params });
  },

  // Get bestsellers
  getBestsellers: (limit = 10) => {
    const params = { isBestseller: 'true', status: 'published', isActive: 'true', limit };
    if (USE_DEMO_PRODUCTS) return demoAxiosProducts(params);
    return api.get('/products', { params });
  },

  // Search products
  searchProducts: (searchTerm, params = {}) => {
    const query = { search: searchTerm, ...params };
    if (USE_DEMO_PRODUCTS) return demoAxiosProducts(query);
    return api.get('/products', { params: query });
  },

  // Filter products
  filterProducts: (filters) => {
    if (USE_DEMO_PRODUCTS) return demoAxiosProducts(filters);
    return api.get('/products', { params: filters });
  },

  // ============================================
  // CART & WISHLIST (LocalStorage)
  // ============================================

  // Add to cart
  addToCart: (product, quantity = 1) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      return { success: true, message: 'Product added to cart' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  },

  // Add to wishlist
  addToWishlist: (product) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = wishlist.find(item => item.id === product.id);
      
      if (exists) {
        return { success: false, message: 'Product already in wishlist' };
      }
      
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      return { success: true, message: 'Product added to wishlist' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  },

  // Remove from wishlist
  removeFromWishlist: (productId) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const filtered = wishlist.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
      return { success: true, message: 'Product removed from wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return wishlist.some(item => item.id === productId);
    } catch (error) {
      return false;
    }
  },

  // Get cart count
  getCartCount: () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  },

  // Get wishlist count
  getWishlistCount: () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return wishlist.length;
    } catch (error) {
      return 0;
    }
  }
};

export default productService;
