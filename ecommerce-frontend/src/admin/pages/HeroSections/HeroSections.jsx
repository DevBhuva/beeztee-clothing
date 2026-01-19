import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { showSuccess, showError } from '../../../utils/toast';
import Swal from 'sweetalert2';
import './HeroSections.css';

const HeroSections = () => {
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedHero, setSelectedHero] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'display_order',
    sortOrder: 'asc',
    isActive: undefined
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    videoUrl: '',
    backgroundImage: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    isActive: true,
    displayOrder: 0
  });
  const [files, setFiles] = useState({
    video: null,
    image: null
  });

  const fetchHeroSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No authentication token found. Please login.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/hero-sections', {
        params: filters,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setHeroSections(response.data.data);
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total,
          limit: response.data.pagination.limit
        });
      }
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      setError(error.response?.data?.message || 'Failed to load hero sections');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHeroSections();
  }, [fetchHeroSections]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      tagline: '',
      videoUrl: '',
      backgroundImage: '',
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      isActive: true,
      displayOrder: 0
    });
    setFiles({ video: null, image: null });
    setShowModal(true);
  };

  const openEditModal = (hero) => {
    setModalMode('edit');
    setSelectedHero(hero);
    setFormData({
      title: hero.title || '',
      tagline: hero.tagline || '',
      videoUrl: hero.videoUrl || '',
      backgroundImage: hero.backgroundImage || '',
      primaryButtonText: hero.primaryButtonText || '',
      primaryButtonLink: hero.primaryButtonLink || '',
      secondaryButtonText: hero.secondaryButtonText || '',
      secondaryButtonLink: hero.secondaryButtonLink || '',
      isActive: hero.isActive,
      displayOrder: hero.displayOrder || 0
    });
    setFiles({ video: null, image: null });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHero(null);
    setFiles({ video: null, image: null });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles({
        ...files,
        [name]: selectedFiles[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const submitData = new FormData();
      
      // Append all form fields except empty videoUrl and backgroundImage
      Object.keys(formData).forEach(key => {
        // Skip videoUrl and backgroundImage as we're using file uploads only
        if (key !== 'videoUrl' && key !== 'backgroundImage') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append files if selected
      if (files.video) {
        submitData.append('video', files.video);
      }
      if (files.image) {
        submitData.append('image', files.image);
      }

      let response;
      if (modalMode === 'create') {
        response = await axios.post('http://localhost:3000/api/hero-sections', submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.put(`http://localhost:3000/api/hero-sections/${selectedHero.id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      console.log('Response:', response.data);
      
      closeModal();
      showSuccess(modalMode === 'create' ? 'Hero section created successfully!' : 'Hero section updated successfully!');
      await fetchHeroSections();
    } catch (error) {
      console.error('Error saving hero section:', error);
      showError(error.response?.data?.message || 'Failed to save hero section');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:3000/api/hero-sections/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('Status updated successfully!');
      fetchHeroSections();
    } catch (error) {
      console.error('Error toggling status:', error);
      showError('Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Hero Section?',
      text: 'Are you sure you want to delete this hero section? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/hero-sections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('Hero section deleted successfully!');
      fetchHeroSections();
    } catch (error) {
      console.error('Error deleting hero section:', error);
      showError('Failed to delete hero section');
    }
  };

  if (loading && heroSections.length === 0) {
    return (
      <div className="hero-sections-container">
        <div className="hs-loading-spinner">
          <div className="hs-spinner"></div>
          <p>Loading hero sections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-sections-container">
        <div className="hs-error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-sections-container">
      <div className="hero-sections-header">
        <div className="hs-header-left">
          <h1 className="hs-page-title">
            <i className="fas fa-image"></i>
            Hero Sections
          </h1>
          <p className="hs-page-subtitle">Manage website hero banners</p>
        </div>
        <button className="hs-btn-create" onClick={openCreateModal}>
          <i className="fas fa-plus"></i>
          Add Hero Section
        </button>
      </div>

      {/* Filters */}
      <div className="hs-filters-section">
        <div className="hs-filter-group">
          <label>Status</label>
          <select 
            value={filters.isActive !== undefined ? filters.isActive : 'all'}
            onChange={(e) => handleFilterChange('isActive', e.target.value === 'all' ? undefined : e.target.value === 'true')}
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="hs-filter-group">
          <label>Sort By</label>
          <select 
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="display_order">Display Order</option>
            <option value="created_at">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="hs-filter-group">
          <label>Order</label>
          <select 
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Hero Sections Table */}
      <div className="hs-table-container">
        <table className="hs-hero-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Tagline</th>
              <th>Media</th>
              <th>Buttons</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {heroSections.map((hero) => (
              <tr key={hero.id}>
                <td>
                  <span className="hs-order-badge">{hero.displayOrder}</span>
                </td>
                <td>
                  <div className="hs-title-cell">
                    <strong>{hero.title}</strong>
                  </div>
                </td>
                <td>
                  <div className="hs-tagline-cell">{hero.tagline || '-'}</div>
                </td>
                <td>
                  <div className="hs-media-cell">
                    {hero.videoUrl && <span className="hs-media-badge video"><i className="fas fa-video"></i> Video</span>}
                    {hero.backgroundImage && <span className="hs-media-badge image"><i className="fas fa-image"></i> Image</span>}
                    {!hero.videoUrl && !hero.backgroundImage && '-'}
                  </div>
                </td>
                <td>
                  <div className="hs-buttons-cell">
                    {hero.primaryButtonText && <span className="hs-btn-badge primary">{hero.primaryButtonText}</span>}
                    {hero.secondaryButtonText && <span className="hs-btn-badge secondary">{hero.secondaryButtonText}</span>}
                    {!hero.primaryButtonText && !hero.secondaryButtonText && '-'}
                  </div>
                </td>
                <td>
                  <button
                    className={`hs-status-toggle ${hero.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(hero.id)}
                  >
                    {hero.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="hs-action-buttons">
                    <button 
                      className="hs-btn-action edit"
                      onClick={() => openEditModal(hero)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="hs-btn-action delete"
                      onClick={() => handleDelete(hero.id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {heroSections.length === 0 && (
          <div className="hs-no-data">
            <i className="fas fa-inbox"></i>
            <p>No hero sections found</p>
            <button className="hs-btn-create-inline" onClick={openCreateModal}>
              Create First Hero Section
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="hs-pagination">
          <button 
            className="hs-page-btn"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <span className="hs-page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            className="hs-page-btn"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="hs-modal-overlay">
          <div className="hs-modal-content">
            <div className="hs-modal-header">
              <h2>{modalMode === 'create' ? 'Create Hero Section' : 'Edit Hero Section'}</h2>
              <button className="hs-close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="hs-hero-form">
              <div className="hs-form-row">
                <div className="hs-form-group full-width">
                  <label>Title <span className="hs-required">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., ÉCLAT"
                    required
                  />
                </div>
              </div>

              <div className="hs-form-row">
                <div className="hs-form-group full-width">
                  <label>Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="e.g., Wear the Future. Redefine the Present."
                  />
                </div>
              </div>

              <div className="hs-form-section-title">Media</div>
              
              {modalMode === 'edit' && (formData.videoUrl || formData.backgroundImage) && (
                <div className="hs-form-row">
                  <div className="hs-form-group full-width">
                    <label>Current Media</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {formData.videoUrl && (
                        <span className="hs-media-badge video">
                          <i className="fas fa-video"></i> Video exists
                        </span>
                      )}
                      {formData.backgroundImage && (
                        <span className="hs-media-badge image">
                          <i className="fas fa-image"></i> Image exists
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="hs-form-row">
                <div className="hs-form-group">
                  <label>Upload Video{modalMode === 'edit' && formData.videoUrl ? ' (Replace)' : ''}</label>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  {files.video && <span className="hs-file-name">{files.video.name}</span>}
                </div>
                <div className="hs-form-group">
                  <label>Upload Background Image{modalMode === 'edit' && formData.backgroundImage ? ' (Replace)' : ''}</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {files.image && <span className="hs-file-name">{files.image.name}</span>}
                </div>
              </div>

              <div className="hs-form-section-title">Primary Button</div>

              <div className="hs-form-row">
                <div className="hs-form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="primaryButtonText"
                    value={formData.primaryButtonText}
                    onChange={handleInputChange}
                    placeholder="e.g., Explore Collection"
                  />
                </div>
                <div className="hs-form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    name="primaryButtonLink"
                    value={formData.primaryButtonLink}
                    onChange={handleInputChange}
                    placeholder="e.g., /shop"
                  />
                </div>
              </div>

              <div className="hs-form-section-title">Secondary Button</div>

              <div className="hs-form-row">
                <div className="hs-form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="secondaryButtonText"
                    value={formData.secondaryButtonText}
                    onChange={handleInputChange}
                    placeholder="e.g., Discover More"
                  />
                </div>
                <div className="hs-form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    name="secondaryButtonLink"
                    value={formData.secondaryButtonLink}
                    onChange={handleInputChange}
                    placeholder="e.g., /about"
                  />
                </div>
              </div>

              <div className="hs-form-section-title">Settings</div>

              <div className="hs-form-row">
                <div className="hs-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                {modalMode === 'edit' && (
                  <div className="hs-form-group hs-checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="hs-form-actions">
                <button type="button" className="hs-btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="hs-btn-submit">
                  <i className="fas fa-save"></i>
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSections;
