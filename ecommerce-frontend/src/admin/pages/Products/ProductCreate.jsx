import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';
import { 
  FaSave, 
  FaTimes, 
  FaImage,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import subcategoryService from '../../../services/subcategoryService';
import brandService from '../../../services/brandService';
import { showSuccess, showError } from '../../../utils/toast';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Selected objects for Autocomplete
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    brandId: '',
    basePrice: '',
    salePrice: '',
    costPrice: '',
    taxRate: '0',
    stockQuantity: '0',
    lowStockThreshold: '10',
    weight: '',
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    isBestseller: false,
    status: 'draft',
    displayOrder: '0',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Product Attributes
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ attributeName: '', attributeValue: '' });

  // Product Variants
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    sku: '',
    size: '',
    color: '',
    colorCode: '',
    material: '',
    style: '',
    price: '',
    salePrice: '',
    stockQuantity: '0',
    weight: '',
    isActive: true,
    isDefault: false
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catResponse, brandResponse] = await Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands()
      ]);

      console.log('Category Response:', catResponse);
      console.log('Brand Response:', brandResponse);

      // Service already returns response.data, so catResponse is the backend response
      // Categories: catResponse = { status, statusCode, message, data: categories[] }
      if (catResponse && catResponse.data) {
        setCategories(Array.isArray(catResponse.data) ? catResponse.data : []);
      }

      // Brands: brandResponse = { status, statusCode, message, data: { brands: [], pagination: {} } }
      if (brandResponse && brandResponse.data && brandResponse.data.brands) {
        setBrands(Array.isArray(brandResponse.data.brands) ? brandResponse.data.brands : []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showError('Failed to load form data');
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await subcategoryService.getAllSubcategories();
      console.log('Subcategories Response:', response);
      
      // Service returns response.data, so response = { status, statusCode, message, data: subcategories[] }
      if (response && response.data) {
        const allSubcategories = Array.isArray(response.data) ? response.data : [];
        const filtered = allSubcategories.filter(
          sub => sub.categoryId === parseInt(categoryId)
        );
        console.log('Filtered Subcategories:', filtered);
        setSubcategories(filtered);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        showError(`${file.name} is not a valid image type`);
        return false;
      }

      if (file.size > maxSize) {
        showError(`${file.name} exceeds 5MB size limit`);
        return false;
      }

      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Product Attribute Handlers
  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute(prev => ({ ...prev, [name]: value }));
  };

  const addAttribute = () => {
    if (!newAttribute.attributeName.trim() || !newAttribute.attributeValue.trim()) {
      showError('Attribute name and value are required');
      return;
    }

    setAttributes(prev => [...prev, { ...newAttribute, id: Date.now() }]);
    setNewAttribute({ attributeName: '', attributeValue: '' });
  };

  const removeAttribute = (id) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id));
  };

  // Product Variant Handlers
  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addVariant = () => {
    if (!newVariant.sku.trim()) {
      showError('Variant SKU is required');
      return;
    }

    // Check for duplicate SKU
    if (variants.some(v => v.sku === newVariant.sku)) {
      showError('Variant SKU must be unique');
      return;
    }

    setVariants(prev => [...prev, { ...newVariant, id: Date.now() }]);
    setNewVariant({
      sku: '',
      size: '',
      color: '',
      colorCode: '',
      material: '',
      style: '',
      price: '',
      salePrice: '',
      stockQuantity: '0',
      weight: '',
      isActive: true,
      isDefault: false
    });
  };

  const removeVariant = (id) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const setAsDefaultVariant = (id) => {
    setVariants(prev => prev.map(v => ({
      ...v,
      isDefault: v.id === id
    })));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.sku || formData.sku.trim().length < 2) {
      newErrors.sku = 'SKU is required (minimum 2 characters)';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }

    if (formData.salePrice && parseFloat(formData.salePrice) >= parseFloat(formData.basePrice)) {
      newErrors.salePrice = 'Sale price must be less than base price';
    }

    if (formData.stockQuantity && parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix all validation errors');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        images: images,
        attributes: attributes.map(attr => ({
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue
        })),
        variants: variants.map(variant => ({
          sku: variant.sku,
          size: variant.size || null,
          color: variant.color || null,
          colorCode: variant.colorCode || null,
          material: variant.material || null,
          style: variant.style || null,
          price: variant.price ? parseFloat(variant.price) : null,
          salePrice: variant.salePrice ? parseFloat(variant.salePrice) : null,
          stockQuantity: parseInt(variant.stockQuantity) || 0,
          weight: variant.weight ? parseFloat(variant.weight) : null,
          isActive: variant.isActive,
          isDefault: variant.isDefault
        }))
      };

      console.log('=== PRODUCT CREATE FORM SUBMISSION ===');
      console.log('Variants in state:', variants);
      console.log('Variants being sent:', productData.variants);
      console.log('Number of variants:', productData.variants.length);

      const response = await productService.createProduct(productData);

      if (response.data.status || response.data) {
        showSuccess('Product created successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="form-header">
        <div>
          <h1>Create New Product</h1>
          <p className="form-subtitle">Add a new product to your catalog</p>
        </div>
        <button 
          type="button"
          className="btn-cancel"
          onClick={() => navigate('/admin/products')}
        >
          <FaTimes /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g., PRD-001"
                className={errors.sku ? 'error' : ''}
              />
              {errors.sku && <span className="error-message">{errors.sku}</span>}
            </div>

            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label>Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief product description (max 500 characters)"
                rows="3"
                maxLength="500"
              />
            </div>

            <div className="form-group full-width">
              <label>Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed product description"
                rows="5"
              />
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="form-section">
          <h2 className="section-title">Category & Brand</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Category *</label>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name || ''}
                value={selectedCategory}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue);
                  setFormData(prev => ({
                    ...prev,
                    categoryId: newValue ? newValue.id : '',
                    subCategoryId: '' // Reset subcategory when category changes
                  }));
                  setSelectedSubcategory(null);
                  if (newValue) {
                    fetchSubcategories(newValue.id);
                  } else {
                    setSubcategories([]);
                  }
                  // Clear error
                  if (errors.categoryId) {
                    setErrors(prev => ({ ...prev, categoryId: '' }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Category"
                    variant="outlined"
                    size="small"
                    error={!!errors.categoryId}
                    helperText={errors.categoryId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#f5f5f5',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: errors.categoryId ? '#ef4444' : 'rgba(212, 175, 55, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(212, 175, 55, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d4af37',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#f5f5f5',
                        padding: '8px 12px',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#64748b',
                        opacity: 1,
                      },
                      '& .MuiAutocomplete-endAdornment': {
                        '& .MuiSvgIcon-root': {
                          color: '#d4af37',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ef4444',
                        marginLeft: 0,
                      },
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popper': {
                    '& .MuiPaper-root': {
                      backgroundColor: '#1a1a1a',
                      color: '#f5f5f5',
                    },
                  },
                }}
              />
            </div>

            <div className="form-group">
              <label>Subcategory</label>
              <Autocomplete
                options={subcategories}
                getOptionLabel={(option) => option.name || ''}
                value={selectedSubcategory}
                disabled={!formData.categoryId}
                onChange={(event, newValue) => {
                  setSelectedSubcategory(newValue);
                  setFormData(prev => ({
                    ...prev,
                    subCategoryId: newValue ? newValue.id : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Subcategory"
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#f5f5f5',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(212, 175, 55, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(212, 175, 55, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d4af37',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          '& fieldset': {
                            borderColor: 'rgba(212, 175, 55, 0.15)',
                          },
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#f5f5f5',
                        padding: '8px 12px',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#64748b',
                        opacity: 1,
                      },
                      '& .MuiAutocomplete-endAdornment': {
                        '& .MuiSvgIcon-root': {
                          color: '#d4af37',
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <Autocomplete
                options={brands}
                getOptionLabel={(option) => option.name || ''}
                value={selectedBrand}
                onChange={(event, newValue) => {
                  setSelectedBrand(newValue);
                  setFormData(prev => ({
                    ...prev,
                    brandId: newValue ? newValue.id : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Brand"
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#f5f5f5',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(212, 175, 55, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(212, 175, 55, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d4af37',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#f5f5f5',
                        padding: '8px 12px',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#64748b',
                        opacity: 1,
                      },
                      '& .MuiAutocomplete-endAdornment': {
                        '& .MuiSvgIcon-root': {
                          color: '#d4af37',
                        },
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h2 className="section-title">Pricing & Tax</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Base Price *</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.basePrice ? 'error' : ''}
              />
              {errors.basePrice && <span className="error-message">{errors.basePrice}</span>}
            </div>

            <div className="form-group">
              <label>Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.salePrice ? 'error' : ''}
              />
              {errors.salePrice && <span className="error-message">{errors.salePrice}</span>}
            </div>

            <div className="form-group">
              <label>Cost Price</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="form-section">
          <h2 className="section-title">Inventory & Shipping</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className={errors.stockQuantity ? 'error' : ''}
              />
              {errors.stockQuantity && <span className="error-message">{errors.stockQuantity}</span>}
            </div>

            <div className="form-group">
              <label>Low Stock Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                placeholder="10"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2 className="section-title">Product Images</h2>
          
          <div className="image-upload-section">
            <label htmlFor="product-images" className="image-upload-btn">
              <FaPlus /> Add Images
            </label>
            <input
              type="file"
              id="product-images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <p className="upload-hint">Supports: JPG, PNG, GIF, WebP (Max 5MB each)</p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-preview-grid">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    <FaTrash />
                  </button>
                  {index === 0 && <span className="primary-badge">Primary</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Attributes */}
        <div className="form-section">
          <h2 className="section-title">Product Attributes</h2>
          <p className="section-description">Add custom attributes like Material, Size Guide, Care Instructions, etc.</p>
          
          <div className="attributes-container">
            <div className="attribute-form">
              <div className="attribute-inputs-row">
                <div className="form-group">
                  <label>Attribute Name (e.g., Material)</label>
                  <input
                    type="text"
                    name="attributeName"
                    value={newAttribute.attributeName}
                    onChange={handleAttributeChange}
                    placeholder="e.g., Material, Size Guide, Care Instructions"
                  />
                </div>
                <div className="form-group">
                  <label>Attribute Value (e.g., 100% Cotton)</label>
                  <input
                    type="text"
                    name="attributeValue"
                    value={newAttribute.attributeValue}
                    onChange={handleAttributeChange}
                    placeholder="e.g., 100% Cotton, Hand Wash Only"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="btn-add-attribute"
                >
                  <FaPlus /> Add
                </button>
              </div>
            </div>

            {attributes.length > 0 && (
              <div className="attributes-list">
                <h3>Attributes List ({attributes.length})</h3>
                <div className="items-grid">
                  {attributes.map((attr) => (
                    <div key={attr.id} className="attribute-item">
                      <div className="attribute-content">
                        <strong>{attr.attributeName}:</strong>
                        <span>{attr.attributeValue}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttribute(attr.id)}
                        className="btn-remove-item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Variants */}
        <div className="form-section">
          <h2 className="section-title">Product Variants (Size, Color, etc.)</h2>
          
          <div className="variants-container">
            <div className="variant-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Variant SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    value={newVariant.sku}
                    onChange={handleVariantChange}
                    placeholder="e.g., PROD-001-SM-RED"
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    name="size"
                    value={newVariant.size}
                    onChange={handleVariantChange}
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={newVariant.color}
                    onChange={handleVariantChange}
                    placeholder="e.g., Red, Blue"
                  />
                </div>
                <div className="form-group">
                  <label>Color Code</label>
                  <input
                    type="color"
                    name="colorCode"
                    value={newVariant.colorCode}
                    onChange={handleVariantChange}
                  />
                </div>
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={newVariant.material}
                    onChange={handleVariantChange}
                    placeholder="e.g., Cotton, Polyester"
                  />
                </div>
                <div className="form-group">
                  <label>Style</label>
                  <input
                    type="text"
                    name="style"
                    value={newVariant.style}
                    onChange={handleVariantChange}
                    placeholder="e.g., Slim Fit, Regular"
                  />
                </div>
                <div className="form-group">
                  <label>Price Override</label>
                  <input
                    type="number"
                    name="price"
                    value={newVariant.price}
                    onChange={handleVariantChange}
                    placeholder="Override base price"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price Override</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={newVariant.salePrice}
                    onChange={handleVariantChange}
                    placeholder="Override sale price"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={newVariant.stockQuantity}
                    onChange={handleVariantChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Weight Override (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={newVariant.weight}
                    onChange={handleVariantChange}
                    placeholder="Override weight"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="variant-flags">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newVariant.isActive}
                    onChange={handleVariantChange}
                  />
                  <span>Active</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newVariant.isDefault}
                    onChange={handleVariantChange}
                  />
                  <span>Set as Default Variant</span>
                </label>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="btn-add-item"
              >
                <FaPlus /> Add Variant
              </button>
            </div>

            {variants.length > 0 && (
              <div className="variants-list">
                <h3>Variants List ({variants.length})</h3>
                <div className="variants-table">
                  <table>
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Material</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Default</th>
                        <th>Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => (
                        <tr key={variant.id}>
                          <td><code>{variant.sku}</code></td>
                          <td>{variant.size || '-'}</td>
                          <td>
                            {variant.color && (
                              <div className="color-cell">
                                {variant.colorCode && (
                                  <span 
                                    className="color-swatch" 
                                    style={{ backgroundColor: variant.colorCode }}
                                  ></span>
                                )}
                                <span>{variant.color}</span>
                              </div>
                            ) || '-'}
                          </td>
                          <td>{variant.material || '-'}</td>
                          <td>{variant.stockQuantity}</td>
                          <td>
                            {variant.price ? `₹${variant.price}` : '-'}
                            {variant.salePrice && <div className="sale-price">₹{variant.salePrice}</div>}
                          </td>
                          <td>
                            {variant.isDefault ? (
                              <span className="badge-default">Default</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAsDefaultVariant(variant.id)}
                                className="btn-set-default"
                              >
                                Set Default
                              </button>
                            )}
                          </td>
                          <td>
                            {variant.isActive ? (
                              <span className="badge-active">Yes</span>
                            ) : (
                              <span className="badge-inactive">No</span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              className="btn-remove-item"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status & Flags */}
        <div className="form-section">
          <h2 className="section-title">Status & Visibility</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span>Active</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                <span>Featured</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleInputChange}
                />
                <span>Trending</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                />
                <span>New Arrival</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleInputChange}
                />
                <span>Bestseller</span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="form-section">
          <h2 className="section-title">SEO Information</h2>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="SEO title (max 255 characters)"
                maxLength="255"
              />
            </div>

            <div className="form-group full-width">
              <label>Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="SEO description (max 500 characters)"
                rows="3"
                maxLength="500"
              />
            </div>

            <div className="form-group full-width">
              <label>Meta Keywords</label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/products')}
            disabled={loading}
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : <><FaSave /> Create Product</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
