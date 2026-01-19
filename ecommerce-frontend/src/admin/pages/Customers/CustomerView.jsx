import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaVenusMars, FaClock, FaImage } from 'react-icons/fa';
import { getCustomer, deleteCustomer } from '../../../services/customer.service';
import { showSuccess, showError, showConfirmDialog } from '../../../utils/toast';
import './CustomerView.css';

const CustomerView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await getCustomer(id);
      if (response.success) {
        setCustomer(response.data);
      }
    } catch (error) {
      showError(error.message || 'Failed to load customer data');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/customers');
  };

  const handleEdit = () => {
    navigate(`/admin/customers/${id}/edit`);
  };

  const handleDelete = async () => {
    const result = await showConfirmDialog({
      title: 'Delete Customer?',
      text: `Are you sure you want to delete ${customer.name}? This action cannot be undone.`,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteCustomer(id);
        if (response.success) {
          showSuccess('Customer deleted successfully!');
          navigate('/admin/customers');
        }
      } catch (error) {
        showError(error.message || 'Failed to delete customer');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'status-active', label: 'Active' },
      inactive: { class: 'status-inactive', label: 'Inactive' },
      blocked: { class: 'status-blocked', label: 'Blocked' }
    };
    return badges[status] || badges.active;
  };

  if (loading) {
    return (
      <div className="customer-view-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="customer-view-page">
        <div className="error-container">
          <p>Customer not found</p>
          <button className="btn-back" onClick={handleBack}>
            <FaArrowLeft /> Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(customer.status);

  return (
    <div className="customer-view-page">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={handleBack}>
          <FaArrowLeft /> Back to Customers
        </button>
        <div className="page-title-section">
          <h1 className="page-title">Customer Details</h1>
          <p className="page-subtitle">View complete customer information</p>
        </div>
        <div className="header-actions">
          <button className="btn-edit" onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {customer.profileImage ? (
              <img src={customer.profileImage} alt={customer.name} />
            ) : (
              <div className="avatar-placeholder">
                {customer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{customer.name}</h2>
            <p className="profile-email">
              <FaEnvelope /> {customer.email}
            </p>
            <p className="profile-phone">
              <FaPhone /> {customer.phone}
            </p>
            <span className={`status-badge ${statusBadge.class}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="info-grid">
        {/* Personal Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <FaUser /> Personal Information
            </h3>
          </div>
          <div className="card-body">
            <div className="info-row">
              <label>Full Name</label>
              <span>{customer.name}</span>
            </div>
            {customer.dateOfBirth && (
              <div className="info-row">
                <label>
                  <FaCalendar /> Date of Birth
                </label>
                <span>{formatDate(customer.dateOfBirth)}</span>
              </div>
            )}
            {customer.gender && (
              <div className="info-row">
                <label>
                  <FaVenusMars /> Gender
                </label>
                <span>{customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)}</span>
              </div>
            )}
            {customer.profileImage && (
              <div className="info-row">
                <label>
                  <FaImage /> Profile Image
                </label>
                <a href={customer.profileImage} target="_blank" rel="noopener noreferrer" className="image-link">
                  View Image
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <FaEnvelope /> Contact Information
            </h3>
          </div>
          <div className="card-body">
            <div className="info-row">
              <label>Email Address</label>
              <span>{customer.email}</span>
            </div>
            <div className="info-row">
              <label>Phone Number</label>
              <span>{customer.phone || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Account Status</label>
              <span className={`status-badge ${statusBadge.class}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Location Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <FaMapMarkerAlt /> Location Information
            </h3>
          </div>
          <div className="card-body">
            {customer.address && (
              <div className="info-row">
                <label>Street Address</label>
                <span>{customer.address}</span>
              </div>
            )}
            <div className="info-row">
              <label>City</label>
              <span>{customer.city || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>State / Province</label>
              <span>{customer.state || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Country</label>
              <span>{customer.country || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Zip / Postal Code</label>
              <span>{customer.zipCode || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Account Activity Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <FaClock /> Account Activity
            </h3>
          </div>
          <div className="card-body">
            <div className="info-row">
              <label>Customer ID</label>
              <span>#{customer.id}</span>
            </div>
            <div className="info-row">
              <label>Last Login</label>
              <span>{formatDate(customer.lastLoginAt)}</span>
            </div>
            <div className="info-row">
              <label>Member Since</label>
              <span>{formatDate(customer.createdAt)}</span>
            </div>
            <div className="info-row">
              <label>Last Updated</label>
              <span>{formatDate(customer.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
