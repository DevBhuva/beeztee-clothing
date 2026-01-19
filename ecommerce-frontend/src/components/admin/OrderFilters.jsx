import React from 'react';
import './OrderFilters.css';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

const OrderFilters = ({ filters, onFilterChange, onDatePreset, onClearFilters }) => {
  return (
    <div className="order-filters-panel">
      <div className="filters-header">
        <h3>Filter Orders</h3>
        <button className="btn-clear-filters" onClick={onClearFilters}>
          <FaTimes />
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        {/* Order Status Filter */}
        <div className="filter-group">
          <label>Order Status</label>
          <select
            value={filters.orderStatus || ''}
            onChange={(e) => onFilterChange('orderStatus', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="filter-group">
          <label>Payment Status</label>
          <select
            value={filters.paymentStatus || ''}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Date Filter Presets */}
        <div className="filter-group">
          <label>Date Range</label>
          <select
            value={filters.dateFilter || ''}
            onChange={(e) => onDatePreset(e.target.value)}
            className="filter-select"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {filters.dateFilter === 'custom' && (
          <>
            <div className="filter-group">
              <label>
                <FaCalendarAlt />
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>
                <FaCalendarAlt />
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                className="filter-input"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;
