import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaCalendar, FaVenusMars, FaImage } from 'react-icons/fa';
import { getCustomer, updateCustomer } from '../../../services/customer.service';
import { showSuccess, showError } from '../../../utils/toast';
import './CustomerForm.css';

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
    profileImage: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCustomerData = async () => {
    setFetchingData(true);
    try {
      const response = await getCustomer(id);
      if (response.success) {
        const customer = response.data;
        setFormData({
          name: customer.name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          password: '',
          confirmPassword: '',
          status: customer.status || 'active',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          country: customer.country || '',
          zipCode: customer.zipCode || '',
          dateOfBirth: customer.dateOfBirth || '',
          gender: customer.gender || '',
          profileImage: customer.profileImage || ''
        });
      }
    } catch (error) {
      showError(error.message || 'Failed to load customer data');
      navigate('/admin/customers');
    } finally {
      setFetchingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Phone must be 10-15 digits';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      
      // Remove password fields if empty
      if (!submitData.password) {
        delete submitData.password;
      }

      const response = await updateCustomer(id, submitData);

      if (response.success) {
        showSuccess('Customer updated successfully!');
        navigate('/admin/customers');
      }
    } catch (error) {
      showError(error.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/customers');
  };

  if (fetchingData) {
    return (
      <div className="customer-form-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-form-page">
      <div className="page-header">
        <button className="btn-back" onClick={handleCancel}>
          <FaArrowLeft /> Back to Customers
        </button>
        <div className="page-title-section">
          <h1 className="page-title">Edit Customer</h1>
          <p className="page-subtitle">Update customer information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="customer-form-container">
        {/* Account Information Card */}
        <div className="form-card">
          <div className="card-header">
            <h2>Account Information</h2>
            <p>Basic account credentials and status</p>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaUser className="label-icon" />
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>
                  <FaEnvelope className="label-icon" />
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="customer@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaPhone className="label-icon" />
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="1234567890"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Account Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="password-section">
              <h3>Change Password (Optional)</h3>
              <p className="section-note">Leave blank to keep current password</p>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaLock className="label-icon" />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <FaLock className="label-icon" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="form-card">
          <div className="card-header">
            <h2>Personal Details</h2>
            <p>Additional customer information (Optional)</p>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaCalendar className="label-icon" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaVenusMars className="label-icon" />
                  Gender
                </label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <FaImage className="label-icon" />
                Profile Image URL
              </label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <small className="form-help">Enter a URL for the customer's profile image</small>
            </div>
          </div>
        </div>

        {/* Location Information Card */}
        <div className="form-card">
          <div className="card-header">
            <h2>
              <FaMapMarkerAlt /> Location Information
            </h2>
            <p>Customer's address details (Optional)</p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Street Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Street address, apartment, suite, unit, building, floor, etc."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State or Province"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>

              <div className="form-group">
                <label>Zip / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Updating Customer...' : 'Update Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEdit;
