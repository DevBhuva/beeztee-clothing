import React, { useState, useEffect } from 'react';
import './Brands.css';
import '../../../utils/toast.css';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaRegStar,
  FaTimes,
  FaImage,
  FaCheck
} from 'react-icons/fa';
import brandService from '../../../services/brandService';
import { showSuccess, showError, showWarning, showConfirmDialog } from '../../../utils/toast';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    let filtered = [...brands];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(brand => 
        filterStatus === 'active' ? brand.isActive : !brand.isActive
      );
    }

    // Featured filter
    if (filterFeatured !== 'all') {
      filtered = filtered.filter(brand =>
        filterFeatured === 'featured' ? brand.isFeatured : !brand.isFeatured
      );
    }

    console.log('Filtered brands:', filtered); // Debug log
    setFilteredBrands(filtered);
    setCurrentPage(1);
  }, [brands, searchTerm, filterStatus, filterFeatured]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getAllBrands();
      console.log('Brands Response:', response); // Debug log
      
      // Handle both response formats
      if (response.data && response.data.brands) {
        setBrands(response.data.brands);
      } else if (response.brands) {
        setBrands(response.brands);
      } else if (Array.isArray(response)) {
        setBrands(response);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      showError('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditMode(true);
      setCurrentBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logo: brand.logo || '',
        displayOrder: brand.displayOrder || 0,
        isActive: brand.isActive,
        isFeatured: brand.isFeatured,
        metaTitle: brand.metaTitle || '',
        metaDescription: brand.metaDescription || '',
        metaKeywords: brand.metaKeywords || ''
      });
      // Set image preview - check both logo_url and construct from logo
      const logoUrl = brand.logo_url || (brand.logo ? `http://localhost:3000${brand.logo}` : null);
      setImagePreview(logoUrl);
      setImageFile(null);
    } else {
      setEditMode(false);
      setCurrentBrand(null);
      setFormData({
        name: '',
        description: '',
        logo: '',
        displayOrder: 0,
        isActive: true,
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentBrand(null);
    setFormData({
      name: '',
      description: '',
      logo: '',
      displayOrder: 0,
      isActive: true,
      isFeatured: false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    });
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Brand name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Brand name must not exceed 100 characters';
    }

    // Description validation (optional but if provided, check length)
    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    // Display order validation
    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order cannot be negative';
    }

    // Meta fields validation (optional but check length if provided)
    if (formData.metaTitle && formData.metaTitle.trim().length > 255) {
      newErrors.metaTitle = 'Meta title must not exceed 255 characters';
    }

    if (formData.metaDescription && formData.metaDescription.trim().length > 500) {
      newErrors.metaDescription = 'Meta description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showWarning('Please fix the validation errors');
      return;
    }

    try {
      setLoading(true);
      const submitData = { ...formData };
      
      if (imageFile) {
        submitData.logo = imageFile;
      }

      if (editMode) {
        const response = await brandService.updateBrand(currentBrand.id, submitData);
        if (response.status || response.data) {
          showSuccess('Brand updated successfully!');
          await fetchBrands();
          handleCloseModal();
        }
      } else {
        const response = await brandService.createBrand(submitData);
        if (response.status || response.data) {
          showSuccess('Brand created successfully!');
          await fetchBrands();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      showError(error.response?.data?.message || 'Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog({
      title: 'Delete Brand',
      text: `Are you sure you want to delete "${name}"?`,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await brandService.deleteBrand(id);
        showSuccess('Brand deleted successfully!');
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        showError('Failed to delete brand');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await brandService.toggleBrandStatus(id);
      if (response.status) {
        showSuccess(`Brand ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        await fetchBrands();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showWarning('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showWarning('Image size should not exceed 5MB');
        return;
      }

      // Simply set the image without dimension validation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, logo: '' }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterFeatured('all');
  };

  return (
    <div className="brands-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Management</h1>
          <p className="page-subtitle">Manage your product brands</p>
        </div>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Brand
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button 
          className="btn-filter" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="filter-dropdown">
            <button 
              className="filter-dropdown-close" 
              onClick={() => setShowFilters(false)}
              title="Close Filters"
            >
              <FaTimes />
            </button>
            
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Featured</label>
              <select 
                value={filterFeatured} 
                onChange={(e) => setFilterFeatured(e.target.value)}
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="notfeatured">Not Featured</option>
              </select>
            </div>

            <button className="btn-reset" onClick={resetFilters}>
              <FaTimes /> Reset
            </button>
          </div>
        )}

        <div className="results-count">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBrands.length)} of {filteredBrands.length}
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading brands...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="empty-state">
            <FaImage className="empty-icon" />
            <h3>No brands found</h3>
            <p>Start by creating your first brand</p>
            <button className="btn-add" onClick={() => handleOpenModal()}>
              <FaPlus /> Add Brand
            </button>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((brand) => {
                  // Construct logo URL if brand has logo
                  const logoUrl = brand.logo_url || (brand.logo ? `http://localhost:3000${brand.logo}` : null);
                  
                  return (
                  <tr key={brand.id}>
                    <td>#{brand.id}</td>
                    <td>
                      <div className="brand-logo">
                        {logoUrl ? (
                          <img src={logoUrl} alt={brand.name} />
                        ) : (
                          <div className="no-image"><FaImage /></div>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{brand.name}</strong>
                    </td>
                    <td><code>{brand.slug}</code></td>
                    <td><span className="order-badge">{brand.displayOrder}</span></td>
                    <td>
                      <button
                        className={`status-badge ${brand.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(brand.id, brand.isActive)}
                      >
                        {brand.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      {brand.isFeatured ? (
                        <span className="featured-badge"><FaStar /> Featured</span>
                      ) : (
                        <span className="not-featured-badge"><FaRegStar /> Regular</span>
                      )}
                    </td>
                    <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleOpenModal(brand)}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(brand.id, brand.name)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Brand' : 'Add New Brand'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="brand-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Brand Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={errors.displayOrder ? 'error' : ''}
                  />
                  {errors.displayOrder && <span className="error-message">{errors.displayOrder}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter brand description (max 500 characters)"
                  rows="4"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label>Brand Logo</label>
                <div className="image-upload-container">
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <button 
                        type="button" 
                        className="btn-remove-image"
                        onClick={handleRemoveImage}
                      >
                        <FaTimes /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="image-upload-box">
                      <input
                        type="file"
                        id="brandLogo"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="image-input"
                      />
                      <label htmlFor="brandLogo" className="image-upload-label">
                        <FaImage className="upload-icon" />
                        <span className="upload-text">Click to upload logo</span>
                        <span className="upload-hint">PNG, JPG, GIF, WebP (Max 5MB)</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO meta title (max 255 characters)"
                  className={errors.metaTitle ? 'error' : ''}
                />
                {errors.metaTitle && <span className="error-message">{errors.metaTitle}</span>}
              </div>

              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO meta description (max 500 characters)"
                  rows="3"
                  className={errors.metaDescription ? 'error' : ''}
                />
                {errors.metaDescription && <span className="error-message">{errors.metaDescription}</span>}
              </div>

              <div className="form-group">
                <label>Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="form-row checkbox-row">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isActive">
                    <FaCheck /> Active Status
                  </label>
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isFeatured">
                    <FaStar /> Featured Brand
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editMode ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
