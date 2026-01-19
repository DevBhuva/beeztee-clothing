import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import {
  getCustomers,
  deleteCustomer,
  updateCustomerStatus,
  getCustomerStats
} from '../../../services/customer.service';
import { showSuccess, showError, showConfirmDialog } from '../../../utils/toast';
import './Customers.css';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    newThisMonth: 0
  });

  // Filters and pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, statusFilter]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers({
        page: currentPage,
        limit: 10,
        search,
        status: statusFilter,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      if (response.success) {
        setCustomers(response.data.customers);
        setTotalPages(response.data.pagination.pages);
        setTotalCustomers(response.data.pagination.total);
      }
    } catch (error) {
      showError(error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getCustomerStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleView = (customer) => {
    navigate(`/admin/customers/${customer.id}/view`);
  };

  const handleEdit = (customer) => {
    navigate(`/admin/customers/${customer.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/customers/create');
  };

  const handleDelete = async (customer) => {
    const result = await showConfirmDialog({
      title: 'Delete Customer?',
      text: `Are you sure you want to delete ${customer.name}? This action cannot be undone.`,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteCustomer(customer.id);
        if (response.success) {
          showSuccess('Customer deleted successfully!');
          fetchCustomers();
          fetchStats();
        }
      } catch (error) {
        showError(error.message || 'Failed to delete customer');
      }
    }
  };

  const handleStatusClick = async (customer) => {
    // Determine next status in cycle: active -> inactive -> blocked -> active
    const statusCycle = {
      active: 'inactive',
      inactive: 'blocked',
      blocked: 'active'
    };
    
    const newStatus = statusCycle[customer.status] || 'active';
    
    try {
      const response = await updateCustomerStatus(customer.id, newStatus);
      if (response.success) {
        showSuccess(`Customer status changed to ${newStatus}`);
        fetchCustomers();
        fetchStats();
      }
    } catch (error) {
      showError(error.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'status-active', label: 'Active' },
      inactive: { class: 'status-inactive', label: 'Inactive' },
      blocked: { class: 'status-blocked', label: 'Blocked' }
    };
    return badges[status] || badges.active;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div className="customers-header-left">
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Manage your customer database</p>
        </div>
        <button className="btn-add-customer" onClick={handleCreate}>
          <FaPlus /> Add Customer
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="customer-stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Active</p>
          </div>
        </div>

        <div className="stat-card inactive">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>{stats.inactive}</h3>
            <p>Inactive</p>
          </div>
        </div>

        <div className="stat-card blocked">
          <div className="stat-icon">🚫</div>
          <div className="stat-content">
            <h3>{stats.blocked}</h3>
            <p>Blocked</p>
          </div>
        </div>

        <div className="stat-card new">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{stats.newThisMonth}</h3>
            <p>New This Month</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="customers-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, phone, or city..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <button
          className="btn-filter"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="filter-dropdown">
          <button
            className="filter-dropdown-close"
            onClick={() => setShowFilters(false)}
          >
            ×
          </button>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <button
            className="btn-reset"
            onClick={() => {
              setStatusFilter('');
              setSearch('');
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </button>

          <p className="results-count">{totalCustomers} results found</p>
        </div>
      )}

      {/* Customers Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <p>No customers found</p>
          </div>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const statusBadge = getStatusBadge(customer.status);
                return (
                  <tr key={customer.id}>
                    <td>#{customer.id}</td>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      {customer.city && customer.state
                        ? `${customer.city}, ${customer.state}`
                        : customer.city || customer.state || 'N/A'}
                    </td>
                    <td>
                      <span 
                        className={`status-badge ${statusBadge.class} clickable`}
                        onClick={() => handleStatusClick(customer)}
                        title="Click to change status"
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>{formatDate(customer.lastLoginAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn btn-view"
                          onClick={() => handleView(customer)}
                          title="View Details"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          className="action-btn btn-edit"
                          onClick={() => handleEdit(customer)}
                          title="Edit Customer"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(customer)}
                          title="Delete Customer"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Customers;
