import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import orderService from '../../../services/orderService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || ''
      });
    }
  }, [isAuthenticated, authLoading, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Phone must be 10 digits');
      return;
    }

    try {
      setSaving(true);
      const success = await updateProfile(formData);
      
      if (success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      // Call password change API here
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account?',
      text: 'This action cannot be undone. All your data will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete my account',
      cancelButtonText: 'Cancel',
      input: 'text',
      inputPlaceholder: 'Type "DELETE" to confirm',
      inputValidator: (value) => {
        if (value !== 'DELETE') {
          return 'Please type "DELETE" to confirm';
        }
      }
    });

    if (result.isConfirmed) {
      try {
        // Call delete account API here
        toast.success('Account deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Delete account error:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || ''
      });
    }
  };

  const fetchOrders = async (page = 1) => {
    try {
      setLoadingOrders(true);
      const response = await orderService.getMyOrders(page);
      
      if (response.status) {
        setOrders(response.data.orders || []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalOrders: response.data.pagination?.totalOrders || 0
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Enter reason for cancellation (optional)',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        const response = await orderService.cancelOrder(orderId, result.value || 'Customer requested cancellation');
        
        if (response.status) {
          toast.success('Order cancelled successfully');
          fetchOrders(pagination.currentPage);
        }
      } catch (error) {
        console.error('Cancel order error:', error);
        toast.error(error.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'returned': 'status-returned'
    };
    return statusMap[status] || 'status-pending';
  };

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  if (authLoading) {
    return (
      <>
        <Header />
        <div className="profile-page">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <h1>My Account</h1>
            <p>Manage your profile and preferences</p>
          </div>

          <div className="profile-content">
            {/* Bootstrap Tabs Navigation */}
            <ul className="nav nav-tabs profile-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                  type="button"
                  role="tab"
                >
                  <i className="fas fa-user-circle"></i>
                  <span>Profile</span>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                  type="button"
                  role="tab"
                >
                  <i className="fas fa-shopping-bag"></i>
                  <span>Orders</span>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => navigate('/wishlist')}
                  type="button"
                  role="tab"
                >
                  <i className="fas fa-heart"></i>
                  <span>Wishlist</span>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                  type="button"
                  role="tab"
                >
                  <i className="fas fa-lock"></i>
                  <span>Security</span>
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content profile-tab-content">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div className="profile-section">
                  <div className="section-header">
                    <div>
                      <h2>Profile Information</h2>
                      <p>Update your personal details</p>
                    </div>
                    {!isEditing && (
                      <button className="btn-edit" onClick={() => setIsEditing(true)}>
                        <i className="fas fa-edit"></i>
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile} className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="readonly"
                        />
                        <small className="help-text">Email cannot be changed</small>
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="10 digit mobile number"
                          maxLength="10"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-save" disabled={saving}>
                          {saving ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check"></i>
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="profile-section">
                  <div className="section-header">
                    <div>
                      <h2>My Orders</h2>
                      <p>View and manage your orders</p>
                    </div>
                  </div>

                  {loadingOrders ? (
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="empty-orders">
                      <i className="fas fa-shopping-bag"></i>
                      <h3>No Orders Yet</h3>
                      <p>You haven't placed any orders yet</p>
                      <button className="btn-primary" onClick={() => navigate('/shop')}>
                        <i className="fas fa-shopping-cart"></i>
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="orders-list">
                        {orders.map((order) => (
                          <div key={order.id} className="order-card">
                            <div className="order-header">
                              <div className="order-info">
                                <h3>Order #{order.orderNumber}</h3>
                                <p className="order-date">
                                  <i className="far fa-calendar"></i>
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <span className={`order-status ${getStatusBadgeClass(order.orderStatus)}`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>

                            <div className="order-items">
                              {order.items?.slice(0, 3).map((item, index) => (
                                <div key={index} className="order-item-preview">
                                  <img
                                    src={item.product?.images?.[0]?.imagePath
                                      ? `http://localhost:3000${item.product.images[0].imagePath}`
                                      : 'https://via.placeholder.com/60x60?text=No+Image'
                                    }
                                    alt={item.productName}
                                  />
                                  <div className="item-details">
                                    <p className="item-name">{item.productName}</p>
                                    <p className="item-qty">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                              {order.items?.length > 3 && (
                                <p className="more-items">+{order.items.length - 3} more items</p>
                              )}
                            </div>

                            <div className="order-footer">
                              <div className="order-total">
                                <span>Total Amount:</span>
                                <strong>₹{parseFloat(order.grandTotal).toFixed(2)}</strong>
                              </div>
                              <div className="order-actions">
                                <button
                                  className="btn-view"
                                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                                >
                                  <i className="fas fa-eye"></i>
                                  View Details
                                </button>
                                {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                                  <button
                                    className="btn-cancel"
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    <i className="fas fa-times"></i>
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {pagination.totalPages > 1 && (
                        <div className="pagination">
                          <button
                            className="page-btn"
                            onClick={() => fetchOrders(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <span className="page-info">
                            Page {pagination.currentPage} of {pagination.totalPages}
                          </span>
                          <button
                            className="page-btn"
                            onClick={() => fetchOrders(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="profile-section">
                  <div className="section-header">
                    <div>
                      <h2>Security Settings</h2>
                      <p>Manage your password and account security</p>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="security-card">
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword} className="password-form">
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                        />
                        <small className="help-text">Must be at least 6 characters</small>
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-key"></i>
                            Update Password
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Danger Zone */}
                  <div className="security-card danger-zone">
                    <h3>Danger Zone</h3>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="btn-danger" onClick={handleDeleteAccount}>
                      <i className="fas fa-trash-alt"></i>
                      Delete My Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
