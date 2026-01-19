import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductForm.css';
import { 
  FaSave, 
  FaTimes, 
  FaImage,
  FaPlus,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import subcategoryService from '../../../services/subcategoryService';
import brandService from '../../../services/brandService';
import { showSuccess, showError } from '../../../utils/toast';

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
  const [existingImages, setExistingImages] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [catResponse, brandResponse, productResponse] = await Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands(),
        productService.getProductById(id)
      ]);

      console.log('Product Response:', productResponse);

      // Set categories
      if (catResponse && catResponse.data) {
        setCategories(Array.isArray(catResponse.data) ? catResponse.data : []);
      }

      // Set brands
      if (brandResponse && brandResponse.data && brandResponse.data.brands) {
        setBrands(brandResponse.data.brands);
      }

      // Set product data - Check response structure
      const product = productResponse?.data?.data || productResponse?.data;
      
      if (!product) {
        throw new Error('Product data not found in response');
      }

      console.log('Product Data:', product);
        
      // Set form data
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        subCategoryId: product.subCategoryId || '',
        brandId: product.brandId || '',
        basePrice: product.basePrice || '',
        salePrice: product.salePrice || '',
        costPrice: product.costPrice || '',
        taxRate: product.taxRate || '0',
        stockQuantity: product.stockQuantity || '0',
        lowStockThreshold: product.lowStockThreshold || '10',
        weight: product.weight || '',
        isActive: product.isActive !== undefined ? product.isActive : false,
        isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
        isTrending: product.isTrending !== undefined ? product.isTrending : false,
        isNewArrival: product.isNewArrival !== undefined ? product.isNewArrival : false,
        isBestseller: product.isBestseller !== undefined ? product.isBestseller : false,
        status: product.status || 'draft',
        displayOrder: product.displayOrder || '0',
        metaTitle: product.meta?.metaTitle || '',
        metaDescription: product.meta?.metaDescription || '',
        metaKeywords: product.meta?.metaKeywords || ''
      });

      // Set category selection
      if (product.categoryId && catResponse.data) {
        const category = catResponse.data.find(cat => cat.id === product.categoryId);
        if (category) {
          setSelectedCategory(category);
          // Fetch subcategories
          fetchSubcategories(product.categoryId);
        }
      }

      // Set brand selection
      if (product.brandId && brandResponse.data.brands) {
        const brand = brandResponse.data.brands.find(b => b.id === product.brandId);
        if (brand) {
          setSelectedBrand(brand);
        }
      }

      // Set subcategory after loading
      if (product.subCategoryId) {
        const subCatResponse = await subcategoryService.getSubcategoriesByCategoryId(product.categoryId);
        if (subCatResponse && subCatResponse.data) {
          const subs = Array.isArray(subCatResponse.data) ? subCatResponse.data : [];
          setSubcategories(subs);
          const subcategory = subs.find(sub => sub.id === product.subCategoryId);
          if (subcategory) {
            setSelectedSubcategory(subcategory);
          }
        }
      }

      // Set attributes
      if (product.attributes && Array.isArray(product.attributes)) {
        console.log('Loading attributes:', product.attributes);
        setAttributes(product.attributes.map(attr => ({
          id: attr.id,
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue
        })));
      } else {
        console.log('No attributes found');
        setAttributes([]);
      }

      // Set variants
      if (product.variants && Array.isArray(product.variants)) {
        console.log('Loading variants:', product.variants);
        setVariants(product.variants.map(variant => ({
          id: variant.id,
          sku: variant.sku || '',
          size: variant.size || '',
          color: variant.color || '',
          colorCode: variant.colorCode || '',
          material: variant.material || '',
          style: variant.style || '',
          price: variant.price || '',
          salePrice: variant.salePrice || '',
          stockQuantity: variant.stockQuantity || '0',
          weight: variant.weight || '',
          isActive: variant.isActive !== undefined ? variant.isActive : false,
          isDefault: variant.isDefault !== undefined ? variant.isDefault : false
        })));
      } else {
        console.log('No variants found');
        setVariants([]);
      }

      // Set existing images
      if (product.images && Array.isArray(product.images)) {
        console.log('Setting existing images:', product.images);
        setExistingImages(product.images);
      } else {
        console.log('No images found');
        setExistingImages([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      showError(error.response?.data?.message || error.message || 'Failed to load product data');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await subcategoryService.getSubcategoriesByCategoryId(categoryId);
      console.log('Subcategories Response:', response);
      
      if (response && response.data) {
        const subs = Array.isArray(response.data) ? response.data : [];
        setSubcategories(subs);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSelectedSubcategory(null);
    setSubcategories([]);
    
    if (newValue) {
      setFormData({ ...formData, categoryId: newValue.id, subCategoryId: '' });
      fetchSubcategories(newValue.id);
    } else {
      setFormData({ ...formData, categoryId: '', subCategoryId: '' });
    }
  };

  const handleSubcategoryChange = (event, newValue) => {
    setSelectedSubcategory(newValue);
    setFormData({ ...formData, subCategoryId: newValue ? newValue.id : '' });
  };

  const handleBrandChange = (event, newValue) => {
    setSelectedBrand(newValue);
    setFormData({ ...formData, brandId: newValue ? newValue.id : '' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = async (imageId, index) => {
    try {
      await productService.deleteImage(imageId);
      const newExistingImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExistingImages);
      showSuccess('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Failed to delete image');
    }
  };

  // Attribute handlers
  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute({ ...newAttribute, [name]: value });
  };

  const addAttribute = () => {
    if (!newAttribute.attributeName.trim() || !newAttribute.attributeValue.trim()) {
      showError('Please enter both attribute name and value');
      return;
    }

    setAttributes([...attributes, { ...newAttribute }]);
    setNewAttribute({ attributeName: '', attributeValue: '' });
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Variant handlers
  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVariant({
      ...newVariant,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addVariant = () => {
    if (!newVariant.sku.trim()) {
      showError('Variant SKU is required');
      return;
    }

    // Check for duplicate SKU
    const isDuplicate = variants.some(v => v.sku === newVariant.sku);
    if (isDuplicate) {
      showError('Variant SKU must be unique');
      return;
    }

    // If this is set as default, unset other defaults
    if (newVariant.isDefault) {
      setVariants(variants.map(v => ({ ...v, isDefault: false })));
    }

    setVariants([...variants, { ...newVariant }]);
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

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const setAsDefaultVariant = (index) => {
    setVariants(variants.map((v, i) => ({
      ...v,
      isDefault: i === index
    })));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.basePrice) newErrors.basePrice = 'Base price is required';

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
          id: attr.id, // Include ID for updates
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue
        })),
        variants: variants.map(variant => ({
          id: variant.id, // Include ID for updates (undefined for new variants)
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

      console.log('=== PRODUCT EDIT FORM SUBMISSION ===');
      console.log('Variants in state:', variants);
      console.log('Variants being sent:', productData.variants);
      console.log('Number of variants:', productData.variants.length);

      const response = await productService.updateProduct(id, productData);

      if (response.data.status || response.data) {
        showSuccess('Product updated successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="product-form-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="form-header">
        <div>
          <h1>Edit Product</h1>
          <p>Update product information, attributes, and variants</p>
        </div>
        <div className="header-actions">
          <button 
            type="button" 
            className="btn-view"
            onClick={() => navigate(`/admin/products/${id}/view`)}
          >
            <FaEye /> View Product
          </button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin/products')}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter product name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sku">
                SKU <span className="required">*</span>
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={errors.sku ? 'error' : ''}
                placeholder="Enter SKU"
              />
              {errors.sku && <span className="error-message">{errors.sku}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="shortDescription">Short Description</label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief product description"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Full Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Detailed product description"
              />
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="form-section">
          <h2 className="section-title">Category & Brand</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>
                Category <span className="required">*</span>
              </label>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name || ''}
                value={selectedCategory}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Select category"
                    error={!!errors.categoryId}
                    helperText={errors.categoryId}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </div>

            <div className="form-group">
              <label>Subcategory</label>
              <Autocomplete
                options={subcategories}
                getOptionLabel={(option) => option.name || ''}
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                disabled={!selectedCategory}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder={selectedCategory ? "Select subcategory" : "Select category first"}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <Autocomplete
                options={brands}
                getOptionLabel={(option) => option.name || ''}
                value={selectedBrand}
                onChange={handleBrandChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Select brand"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h2 className="section-title">Pricing</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="basePrice">
                Base Price <span className="required">*</span>
              </label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                className={errors.basePrice ? 'error' : ''}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {errors.basePrice && <span className="error-message">{errors.basePrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="salePrice">Sale Price</label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="costPrice">Cost Price</label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="taxRate">Tax Rate (%)</label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="form-section">
          <h2 className="section-title">Inventory</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
              <input
                type="number"
                id="lowStockThreshold"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                min="0"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Physical Details */}
        <div className="form-section">
          <h2 className="section-title">Physical Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="form-section">
          <h2 className="section-title">Product Images</h2>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="existing-images-container">
              <h3>Current Images</h3>
              <div className="image-preview-grid">
                {existingImages.map((image, index) => (
                  <div key={image.id} className="image-preview-item">
                    <img src={`http://localhost:3000${image.imagePath}`} alt={`Product ${index + 1}`} />
                    {image.isPrimary && <span className="primary-badge">Primary</span>}
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeExistingImage(image.id, index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="image-upload-container">
            <label htmlFor="images" className="image-upload-label">
              <FaImage />
              <span>Add New Images</span>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>

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
                  </div>
                ))}
              </div>
            )}
          </div>
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
                {attributes.map((attr, index) => (
                  <div key={index} className="attribute-item">
                    <div className="attribute-content">
                      <strong>{attr.attributeName}:</strong>
                      <span>{attr.attributeValue}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
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
          <h2 className="section-title">Product Variants</h2>
          <p className="section-description">Add product variations like different sizes, colors, or materials</p>
          
          <div className="variant-form">
            <div className="variant-form-grid">
              <div className="form-group">
                <label>Variant SKU <span className="required">*</span></label>
                <input
                  type="text"
                  name="sku"
                  value={newVariant.sku}
                  onChange={handleVariantChange}
                  placeholder="e.g., PROD-001-BLK-S"
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
                  placeholder="e.g., Black, White"
                />
              </div>

              <div className="form-group">
                <label>Color Code</label>
                <input
                  type="color"
                  name="colorCode"
                  value={newVariant.colorCode}
                  onChange={handleVariantChange}
                  style={{ height: '40px' }}
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
                  placeholder="e.g., Casual, Formal"
                />
              </div>

              <div className="form-group">
                <label>Price Override</label>
                <input
                  type="number"
                  name="price"
                  value={newVariant.price}
                  onChange={handleVariantChange}
                  step="0.01"
                  placeholder="Leave empty to use base price"
                />
              </div>

              <div className="form-group">
                <label>Sale Price Override</label>
                <input
                  type="number"
                  name="salePrice"
                  value={newVariant.salePrice}
                  onChange={handleVariantChange}
                  step="0.01"
                  placeholder="Leave empty to use base sale price"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={newVariant.stockQuantity}
                  onChange={handleVariantChange}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Weight Override (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={newVariant.weight}
                  onChange={handleVariantChange}
                  step="0.01"
                  placeholder="Leave empty to use base weight"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newVariant.isActive}
                    onChange={handleVariantChange}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newVariant.isDefault}
                    onChange={handleVariantChange}
                  />
                  <span>Set as Default</span>
                </label>
              </div>
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
            <div className="variants-table-container">
              <table className="variants-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Material</th>
                    <th>Style</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, index) => (
                    <tr key={index}>
                      <td>{variant.sku}</td>
                      <td>{variant.size || '-'}</td>
                      <td>
                        <div className="color-display">
                          {variant.colorCode && (
                            <span 
                              className="color-swatch" 
                              style={{ backgroundColor: variant.colorCode }}
                            ></span>
                          )}
                          {variant.color || '-'}
                        </div>
                      </td>
                      <td>{variant.material || '-'}</td>
                      <td>{variant.style || '-'}</td>
                      <td>${variant.price || 'Base'}</td>
                      <td>{variant.stockQuantity}</td>
                      <td>
                        <div className="variant-badges">
                          {variant.isDefault && <span className="badge badge-default">Default</span>}
                          {variant.isActive ? 
                            <span className="badge badge-active">Active</span> : 
                            <span className="badge badge-inactive">Inactive</span>
                          }
                        </div>
                      </td>
                      <td>
                        <div className="variant-actions">
                          {!variant.isDefault && (
                            <button
                              type="button"
                              onClick={() => setAsDefaultVariant(index)}
                              className="btn-set-default"
                              title="Set as default"
                            >
                              Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="btn-remove-item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status & Visibility */}
        <div className="form-section">
          <h2 className="section-title">Status & Visibility</h2>
          <div className="form-grid">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <span>Featured</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                />
                <span>Trending</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                />
                <span>New Arrival</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleChange}
                />
                <span>Bestseller</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="displayOrder">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Information */}
        <div className="form-section">
          <h2 className="section-title">SEO Meta Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="metaTitle">Meta Title</label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="SEO optimized title"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows="3"
                placeholder="SEO meta description"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="metaKeywords">Meta Keywords</label>
              <input
                type="text"
                id="metaKeywords"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/admin/products')}
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span> Updating...
              </>
            ) : (
              <>
                <FaSave /> Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
