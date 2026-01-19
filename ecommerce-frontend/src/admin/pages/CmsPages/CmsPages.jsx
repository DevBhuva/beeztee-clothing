import React, { useState, useEffect, useCallback } from 'react';
import { getAllPages, createPage, updatePage, deletePage, togglePageStatus } from '../../../services/cms.service';
import { showSuccess, showError } from '../../../utils/toast';
import Swal from 'sweetalert2';
import './CmsPages.css';

export default function CmsPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentPage, setCurrentPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSection, setFilterSection] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    pageType: 'page',
    footerSection: '',
    showInFooter: false,
    showInHeader: false,
    isActive: true,
    displayOrder: 0,
    externalUrl: '',
    openInNewTab: false
  });

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterType) params.pageType = filterType;
      if (filterSection) params.footerSection = filterSection;

      const response = await getAllPages(params);
      if (response.success) {
        setPages(response.data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType, filterSection]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const openModal = (mode, page = null) => {
    setModalMode(mode);
    setCurrentPage(page);
    if (page) {
      setFormData({
        title: page.title,
        content: page.content || '',
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        pageType: page.pageType,
        footerSection: page.footerSection || '',
        showInFooter: page.showInFooter,
        showInHeader: page.showInHeader,
        isActive: page.isActive,
        displayOrder: page.displayOrder,
        externalUrl: page.externalUrl || '',
        openInNewTab: page.openInNewTab
      });
    } else {
      setFormData({
        title: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        pageType: 'page',
        footerSection: '',
        showInFooter: false,
        showInHeader: false,
        isActive: true,
        displayOrder: 0,
        externalUrl: '',
        openInNewTab: false
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPage(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await createPage(formData);
        showSuccess('Page created successfully!');
      } else {
        await updatePage(currentPage.id, formData);
        showSuccess('Page updated successfully!');
      }
      closeModal();
      fetchPages();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save page');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Page?',
      text: 'Are you sure you want to delete this page? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deletePage(id);
        showSuccess('Page deleted successfully!');
        fetchPages();
      } catch (error) {
        showError('Failed to delete page');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await togglePageStatus(id);
      showSuccess('Status updated successfully!');
      fetchPages();
    } catch (error) {
      showError('Failed to toggle status');
    }
  };

  return (
    <div className="cms-pages-container">
      <div className="cms-header">
        <h1>CMS Pages Management</h1>
        <button className="cms-btn-create" onClick={() => openModal('create')}>
          <i className="fas fa-plus"></i> Create New Page
        </button>
      </div>

      {/* Filters */}
      <div className="cms-filters">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="cms-search-input"
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="cms-filter-select">
          <option value="">All Types</option>
          <option value="page">Page</option>
          <option value="footer_link">Footer Link</option>
          <option value="header_link">Header Link</option>
        </select>
        <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="cms-filter-select">
          <option value="">All Sections</option>
          <option value="quick_links">Quick Links</option>
          <option value="support">Support</option>
          <option value="company">Company</option>
          <option value="legal">Legal</option>
        </select>
      </div>

      {/* Table */}
      <div className="cms-table-container">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Type</th>
              <th>Footer Section</th>
              <th>Footer</th>
              <th>Header</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner"></div>
                </td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                  No pages found
                </td>
              </tr>
            ) : (
              pages.map(page => (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td><code>{page.slug}</code></td>
                  <td><span className="cms-badge">{page.pageType}</span></td>
                  <td>{page.footerSection || '-'}</td>
                  <td>{page.showInFooter ? '✓' : '-'}</td>
                  <td>{page.showInHeader ? '✓' : '-'}</td>
                  <td>
                    <span 
                      className={`cms-status ${page.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(page.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{page.displayOrder}</td>
                  <td>
                    <div className="cms-actions">
                      <button className="cms-btn-edit" onClick={() => openModal('edit', page)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="cms-btn-delete" onClick={() => handleDelete(page.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="cms-modal-overlay">
          <div className="cms-modal">
            <div className="cms-modal-header">
              <h2>{modalMode === 'create' ? 'Create New Page' : 'Edit Page'}</h2>
              <button className="cms-modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="cms-form">
              <div className="cms-form-row">
                <div className="cms-form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="cms-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="cms-form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                ></textarea>
              </div>

              <div className="cms-form-row">
                <div className="cms-form-group">
                  <label>Page Type</label>
                  <select name="pageType" value={formData.pageType} onChange={handleInputChange}>
                    <option value="page">Page</option>
                    <option value="footer_link">Footer Link</option>
                    <option value="header_link">Header Link</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Footer Section</label>
                  <select name="footerSection" value={formData.footerSection} onChange={handleInputChange}>
                    <option value="">None</option>
                    <option value="quick_links">Quick Links</option>
                    <option value="support">Support</option>
                    <option value="company">Company</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
              </div>

              <div className="cms-form-group">
                <label>External URL (optional)</label>
                <input
                  type="text"
                  name="externalUrl"
                  value={formData.externalUrl}
                  onChange={handleInputChange}
                  placeholder="/shop or https://example.com"
                />
              </div>

              <div className="cms-form-row">
                <div className="cms-form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="cms-form-group">
                  <label>Meta Description</label>
                  <input
                    type="text"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="cms-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    name="showInFooter"
                    checked={formData.showInFooter}
                    onChange={handleInputChange}
                  />
                  Show in Footer
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="showInHeader"
                    checked={formData.showInHeader}
                    onChange={handleInputChange}
                  />
                  Show in Header
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="openInNewTab"
                    checked={formData.openInNewTab}
                    onChange={handleInputChange}
                  />
                  Open in New Tab
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="cms-modal-footer">
                <button type="button" className="cms-btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="cms-btn-save">
                  {modalMode === 'create' ? 'Create' : 'Update'} Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
