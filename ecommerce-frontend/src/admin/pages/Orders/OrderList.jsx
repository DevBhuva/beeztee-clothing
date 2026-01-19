import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderList.css';
import { 
  FaSearch, 
  FaFilter,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaCog,
  FaShippingFast,
  FaBoxOpen,
  FaTimes,
  FaUndo,
  FaCalendarAlt,
  FaDollarSign,
  FaFileInvoice
} from 'react-icons/fa';
import adminOrderService from '../../../services/admin/orderService';
import { showSuccess, showError, showConfirmDialog } from '../../../utils/toast';
import OrderStatusBadge from '../../../components/admin/OrderStatusBadge';
import OrderFilters from '../../../components/admin/OrderFilters';

const OrderList = () => {
  const navigate = useNavigate();
  
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    orderStatus: '',
    paymentStatus: '',
    dateFilter: '',
    dateFrom: '',
    dateTo: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0
  });

  // Fetch orders on mount and when filters/pagination change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await adminOrderService.getAllOrders(params);
      
      if (response.status) {
        setOrders(response.data.orders || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        }));
        setStats(response.data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle date filter preset
  const handleDateFilterPreset = (preset) => {
    const today = new Date();
    let dateFrom = '';
    let dateTo = today.toISOString().split('T')[0];

    switch (preset) {
      case 'today':
        dateFrom = today.toISOString().split('T')[0];
        break;
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        dateFrom = last7Days.toISOString().split('T')[0];
        break;
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        dateFrom = last30Days.toISOString().split('T')[0];
        break;
      case 'custom':
        // Keep current dates
        return;
      default:
        dateFrom = '';
        dateTo = '';
    }

    setFilters(prev => ({
      ...prev,
      dateFilter: preset,
      dateFrom,
      dateTo
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      orderStatus: '',
      paymentStatus: '',
      dateFilter: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // View order details
  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-list-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">Manage and track all customer orders</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="order-stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <FaFileInvoice />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-subtext">
              Revenue: {formatCurrency(stats.totalRevenue || 0)}
            </div>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingOrders || 0}</div>
            <div className="stat-label">Pending</div>
            <div className="stat-badge">Awaiting Confirmation</div>
          </div>
        </div>

        <div className="stat-card stat-processing">
          <div className="stat-icon">
            <FaCog />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {(stats.confirmedOrders || 0) + (stats.processingOrders || 0)}
            </div>
            <div className="stat-label">In Process</div>
            <div className="stat-badge">Confirmed + Processing</div>
          </div>
        </div>

        <div className="stat-card stat-shipped">
          <div className="stat-icon">
            <FaShippingFast />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.shippedOrders || 0}</div>
            <div className="stat-label">Shipped</div>
            <div className="stat-badge">Out for Delivery</div>
          </div>
        </div>

        <div className="stat-card stat-delivered">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.deliveredOrders || 0}</div>
            <div className="stat-label">Delivered</div>
            <div className="stat-badge">Successfully Completed</div>
          </div>
        </div>

        <div className="stat-card stat-cancelled">
          <div className="stat-icon">
            <FaTimes />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {(stats.cancelledOrders || 0) + (stats.returnedOrders || 0)}
            </div>
            <div className="stat-label">Cancelled/Returned</div>
            <div className="stat-badge">Needs Attention</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="orders-toolbar">
        <div className="toolbar-left">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by order number, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-search">
              Search
            </button>
          </form>
        </div>

        <div className="toolbar-right">
          <button
            className={`btn btn-filter ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
            {(filters.orderStatus || filters.paymentStatus || filters.dateFilter) && (
              <span className="filter-badge">●</span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onDatePreset={handleDateFilterPreset}
          onClearFilters={clearFilters}
        />
      )}

      {/* Orders Table */}
      <div className="orders-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <FaBoxOpen className="empty-icon" />
            <h3>No Orders Found</h3>
            <p>No orders match your current filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="order-number">
                          <FaFileInvoice className="order-icon" />
                          {order.orderNumber}
                        </div>
                      </td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {order.user?.name?.charAt(0) || order.shippingName?.charAt(0) || 'U'}
                          </div>
                          <div className="customer-details">
                            <div className="customer-name">
                              {order.user ? order.user.name : order.shippingName}
                            </div>
                            <div className="customer-email">{order.shippingEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="order-date">
                          <FaCalendarAlt className="date-icon" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="order-items-count">
                          {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>
                      <td>
                        <div className="payment-info">
                          <div className="payment-method">{order.paymentMethod?.toUpperCase()}</div>
                          <OrderStatusBadge status={order.paymentStatus} type="payment" />
                        </div>
                      </td>
                      <td>
                        <OrderStatusBadge status={order.orderStatus} type="order" />
                      </td>
                      <td>
                        <div className="order-total">
                          <FaDollarSign className="currency-icon" />
                          {formatCurrency(order.grandTotal)}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-view"
                            onClick={() => handleViewOrder(order.id)}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} orders
                </div>
                <div className="pagination-controls">
                  <button
                    className="btn-pagination"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show first, last, current, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      Math.abs(pageNum - pagination.page) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`btn-pagination ${pagination.page === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (Math.abs(pageNum - pagination.page) === 2) {
                      return <span key={pageNum} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}

                  <button
                    className="btn-pagination"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
