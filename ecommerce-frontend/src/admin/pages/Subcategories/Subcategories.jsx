import React, { useState, useEffect } from 'react';
import './Subcategories.css';
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
import subcategoryService from '../../../services/subcategoryService';
import categoryService from '../../../services/categoryService';
import { showSuccess, showError, showWarning, showConfirmDialog } from '../../../utils/toast';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    image: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...subcategories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => 
        filterStatus === 'active' ? sub.isActive : !sub.isActive
      );
    }

    // Featured filter
    if (filterFeatured !== 'all') {
      filtered = filtered.filter(sub =>
        filterFeatured === 'featured' ? sub.isFeatured : !sub.isFeatured
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(sub => 
        sub.categoryId === parseInt(filterCategory)
      );
    }

    setFilteredSubcategories(filtered);
    setCurrentPage(1);
  }, [subcategories, searchTerm, filterStatus, filterFeatured, filterCategory]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await subcategoryService.getAllSubcategories();
      if (response.status) {
        setSubcategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      showError('Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.status) {
        // Only show active categories
        const activeCategories = response.data.filter(cat => cat.isActive);
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenModal = (subcategory = null) => {
    if (subcategory) {
      setEditMode(true);
      setCurrentSubcategory(subcategory);
      setFormData({
        name: subcategory.name,
        categoryId: subcategory.categoryId,
        description: subcategory.description || '',
        image: subcategory.image || '',
        displayOrder: subcategory.displayOrder || 0,
        isActive: subcategory.isActive,
        isFeatured: subcategory.isFeatured
      });
      setImagePreview(subcategory.image ? `http://localhost:3000${subcategory.image}` : null);
    } else {
      setEditMode(false);
      setCurrentSubcategory(null);
      setFormData({
        name: '',
        categoryId: '',
        description: '',
        image: '',
        displayOrder: 0,
        isActive: true,
        isFeatured: false
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentSubcategory(null);
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      image: '',
      displayOrder: 0,
      isActive: true,
      isFeatured: false
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subcategory name is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Parent category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showWarning('Please fill in all required fields');
      return;
    }

    try {
      const submitData = { ...formData };
      
      // If a new image file is selected, add it to the data
      if (imageFile) {
        submitData.image = imageFile;
      }

      if (editMode) {
        const response = await subcategoryService.updateSubcategory(currentSubcategory.id, submitData);
        if (response.status) {
          showSuccess('Subcategory updated successfully!');
          fetchSubcategories();
          handleCloseModal();
        }
      } else {
        const response = await subcategoryService.createSubcategory(submitData);
        if (response.status) {
          showSuccess('Subcategory created successfully!');
          fetchSubcategories();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving subcategory:', error);
      showError(error.response?.data?.message || 'Failed to save subcategory');
    }
  };

  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog({
      title: 'Delete Subcategory',
      text: `Are you sure you want to delete "${name}"?`,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await subcategoryService.deleteSubcategory(id);
        if (response.status) {
          showSuccess('Subcategory deleted successfully!');
          await fetchSubcategories();
        }
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        showError(error.response?.data?.message || 'Failed to delete subcategory');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await subcategoryService.toggleStatus(id);
      if (response.status) {
        showSuccess(`Subcategory ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        await fetchSubcategories();
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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showWarning('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showWarning('Image size should not exceed 5MB');
        return;
      }

      // Validate image dimensions
      const img = new Image();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        img.src = reader.result;
        
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          
          // Check if dimensions are at least minimum 300x300
          if (width < 300 || height < 300) {
            showWarning(`Image dimensions must be at least 300x300 pixels. Your image is ${width}x${height} pixels.`);
            return;
          }
          
          if (width !== 300 || height !== 300) {
            showWarning(`Recommended image dimensions are 300x300 pixels. Your image is ${width}x${height} pixels. It will be resized.`);
          }
          
          // If all validations pass, set the image
          setImageFile(file);
          setImagePreview(reader.result);
        };
        
        img.onerror = () => {
          showError('Failed to load image. Please try another file.');
        };
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubcategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterFeatured('all');
    setFilterCategory('all');
  };

  return (
    <div className="subcategories-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Subcategories Management</h1>
          <p className="page-subtitle">Manage your product subcategories</p>
        </div>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Subcategory
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search subcategories..."
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
              <label>Category</label>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

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
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSubcategories.length)} of {filteredSubcategories.length}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading subcategories...</p>
          </div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="empty-state">
            <FaImage className="empty-icon" />
            <h3>No subcategories found</h3>
            <p>Start by creating your first subcategory</p>
            <button className="btn-add" onClick={() => handleOpenModal()}>
              <FaPlus /> Add Subcategory
            </button>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((subcategory) => (
                  <tr key={subcategory.id}>
                    <td>#{subcategory.id}</td>
                    <td>
                      <div className="category-image">
                        {subcategory.image ? (
                          <img src={`http://localhost:3000${subcategory.image}`} alt={subcategory.name} />
                        ) : (
                          <div className="no-image"><FaImage /></div>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{subcategory.name}</strong>
                    </td>
                    <td>
                      <span className="category-badge">{subcategory.category?.name || 'N/A'}</span>
                    </td>
                    <td><code>{subcategory.slug}</code></td>
                    <td><span className="order-badge">{subcategory.displayOrder}</span></td>
                    <td>
                      <button
                        className={`status-badge ${subcategory.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(subcategory.id, subcategory.isActive)}
                      >
                        {subcategory.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        {subcategory.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      {subcategory.isFeatured ? (
                        <span className="featured-badge"><FaStar /> Featured</span>
                      ) : (
                        <span className="not-featured-badge"><FaRegStar /> Regular</span>
                      )}
                    </td>
                    <td>{new Date(subcategory.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleOpenModal(subcategory)}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(subcategory.id, subcategory.name)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Subcategory Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter subcategory name"
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
                <label>Parent Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={errors.categoryId ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter subcategory description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Subcategory Image</label>
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
                        id="subcategoryImage"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="image-input"
                      />
                      <label htmlFor="subcategoryImage" className="image-upload-label">
                        <FaImage className="upload-icon" />
                        <span className="upload-text">Click to upload image</span>
                        <span className="upload-hint">300x300 pixels • PNG, JPG, GIF, WebP (Max 5MB)</span>
                      </label>
                    </div>
                  )}
                </div>
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
                    <FaStar /> Featured
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <FaCheck /> {editMode ? 'Update' : 'Create'} Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategories;
