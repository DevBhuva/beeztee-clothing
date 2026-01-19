import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, archived: 0 });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
      
      console.log('Fetching contacts with filters:', filters);
      console.log('Token:', token ? 'exists' : 'missing');
      
      if (!token) {
        setError('No authentication token found. Please login.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/contacts', {
        params: filters,
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        console.log('Contacts data:', response.data.data);
        setContacts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        console.error('API returned success: false');
        setError('Failed to load contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Unauthorized. Please login as admin.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(error.response?.data?.message || 'Failed to load contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3000/api/contacts/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Stats response:', response.data);

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Stats error response:', error.response?.data);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleViewContact = async (contact) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:3000/api/contacts/${contact.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedContact(response.data.data);
        setShowModal(true);
        fetchContacts(); // Refresh to update status
        fetchStats();
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:3000/api/contacts/${contactId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedContact({ ...selectedContact, status: newStatus });
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    const result = await Swal.fire({
      title: 'Delete Contact?',
      text: 'Are you sure you want to delete this contact? This action cannot be undone.',
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
      await axios.delete(`http://localhost:3000/api/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { icon: 'fa-envelope', class: 'status-new', text: 'New' },
      read: { icon: 'fa-envelope-open', class: 'status-read', text: 'Read' },
      replied: { icon: 'fa-reply', class: 'status-replied', text: 'Replied' },
      archived: { icon: 'fa-archive', class: 'status-archived', text: 'Archived' }
    };

    const badge = badges[status] || badges.new;
    return (
      <span className={`status-badge ${badge.class}`}>
        <i className={`fas ${badge.icon}`}></i>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log('Current state - contacts:', contacts);
  console.log('Current state - loading:', loading);
  console.log('Current state - stats:', stats);

  return (
    <div className="contact-list-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Contact Messages</h1>
          <p className="page-subtitle">Manage customer inquiries and messages</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Messages</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon new">
            <i className="fas fa-envelope-open"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">New Messages</p>
            <h3 className="stat-value">{stats.new}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon read">
            <i className="fas fa-eye"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Read</p>
            <h3 className="stat-value">{stats.read}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon replied">
            <i className="fas fa-reply"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Replied</p>
            <h3 className="stat-value">{stats.replied}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="created_at">Date</option>
            <option value="first_name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Order:</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="table-container">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}
        <table className="contacts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-cell">
                  <div className="spinner"></div>
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="empty-cell">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{error}</p>
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
                  <i className="fas fa-inbox"></i>
                  <p>No contacts found</p>
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className={contact.status === 'new' ? 'unread-row' : ''}>
                  <td>#{contact.id}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <span>{contact.firstName} {contact.lastName}</span>
                    </div>
                  </td>
                  <td>{contact.email}</td>
                  <td className="subject-cell">{contact.subject}</td>
                  <td>{getStatusBadge(contact.status)}</td>
                  <td>{formatDate(contact.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewContact(contact)}
                        title="View Message"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteContact(contact.id)}
                        title="Delete"
                      >
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            <span className="total-items">({pagination.totalItems} total)</span>
          </div>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.totalPages}
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Message Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="contact-detail">
                <div className="detail-header">
                  <div className="user-info-large">
                    <div className="user-avatar-large">
                      {selectedContact.firstName.charAt(0)}{selectedContact.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3>{selectedContact.firstName} {selectedContact.lastName}</h3>
                      <p className="email">{selectedContact.email}</p>
                      {selectedContact.phone && (
                        <p className="phone">
                          <i className="fas fa-phone"></i> {selectedContact.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="detail-meta">
                    <div className="meta-item">
                      <span className="meta-label">Status:</span>
                      {getStatusBadge(selectedContact.status)}
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Received:</span>
                      <span>{formatDate(selectedContact.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-content">
                  <div className="subject-section">
                    <h4>Subject</h4>
                    <p>{selectedContact.subject}</p>
                  </div>
                  <div className="message-section">
                    <h4>Message</h4>
                    <p>{selectedContact.message}</p>
                  </div>
                </div>
                <div className="modal-actions">
                  <div className="status-changer">
                    <label>Change Status:</label>
                    <select
                      value={selectedContact.status}
                      onChange={(e) => handleStatusChange(selectedContact.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="action-buttons-modal">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                      className="btn-reply"
                    >
                      <i className="fas fa-reply"></i>
                      Reply via Email
                    </a>
                    <button
                      className="btn-delete-modal"
                      onClick={() => handleDeleteContact(selectedContact.id)}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
