import React, { useState, useEffect } from 'react';
import './Categories.css';
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
import categoryService from '../../../services/categoryService';
import { showSuccess, showError, showWarning, showConfirmDialog } from '../../../utils/toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    parentId: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...categories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cat => 
        filterStatus === 'active' ? cat.isActive : !cat.isActive
      );
    }

    // Featured filter
    if (filterFeatured !== 'all') {
      filtered = filtered.filter(cat =>
        filterFeatured === 'featured' ? cat.isFeatured : !cat.isFeatured
      );
    }

    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [categories, searchTerm, filterStatus, filterFeatured]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.status) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        displayOrder: category.displayOrder || 0,
        isActive: category.isActive,
        isFeatured: category.isFeatured,
        parentId: category.parentId || null
      });
      setImagePreview(category.image ? `http://localhost:3000${category.image}` : null);
      setImageFile(null);
    } else {
      setEditMode(false);
      setCurrentCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        displayOrder: 0,
        isActive: true,
        isFeatured: false,
        parentId: null
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
    setCurrentCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      displayOrder: 0,
      isActive: true,
      isFeatured: false,
      parentId: null
    });
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = { ...formData };
      
      // If a new image file is selected, add it to the data
      if (imageFile) {
        submitData.image = imageFile;
      }

      if (editMode) {
        const response = await categoryService.updateCategory(currentCategory.id, submitData);
        if (response.status) {
          showSuccess('Category updated successfully!');
          fetchCategories();
          handleCloseModal();
        }
      } else {
        const response = await categoryService.createCategory(submitData);
        if (response.status) {
          showSuccess('Category created successfully!');
          fetchCategories();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showError(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog({
      title: 'Delete Category',
      text: `Are you sure you want to delete "${name}"?`,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await categoryService.deleteCategory(id);
        if (response.status) {
          showSuccess('Category deleted successfully!');
          await fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        showError(error.response?.data?.message || 'Failed to delete category');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await categoryService.toggleStatus(id);
      if (response.status) {
        showSuccess(`Category ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        await fetchCategories();
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
          
          // Check if dimensions are exactly 300x300 or at least minimum 300x300
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
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterFeatured('all');
  };

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories Management</h1>
          <p className="page-subtitle">Manage your product categories</p>
        </div>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
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
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCategories.length)} of {filteredCategories.length}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state">
            <FaImage className="empty-icon" />
            <h3>No categories found</h3>
            <p>Start by creating your first category</p>
            <button className="btn-add" onClick={() => handleOpenModal()}>
              <FaPlus /> Add Category
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
                  <th>Slug</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((category) => (
                  <tr key={category.id}>
                    <td>#{category.id}</td>
                    <td>
                      <div className="category-image">
                        {category.image ? (
                          <img src={`http://localhost:3000${category.image}`} alt={category.name} />
                        ) : (
                          <div className="no-image"><FaImage /></div>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td><code>{category.slug}</code></td>
                    <td><span className="order-badge">{category.displayOrder}</span></td>
                    <td>
                      <button
                        className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(category.id, category.isActive)}
                      >
                        {category.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        {category.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      {category.isFeatured ? (
                        <span className="featured-badge"><FaStar /> Featured</span>
                      ) : (
                        <span className="not-featured-badge"><FaRegStar /> Regular</span>
                      )}
                    </td>
                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleOpenModal(category)}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(category.id, category.name)}
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
              <h2>{editMode ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
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
                  placeholder="Enter category description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Category Image</label>
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
                        id="categoryImage"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="image-input"
                      />
                      <label htmlFor="categoryImage" className="image-upload-label">
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
                    <FaStar /> Featured Category
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editMode ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
