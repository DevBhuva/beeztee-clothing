import React from 'react'
import './orders.css'

const Orders = () => {
  const orders = [
    { 
      id: 1001, 
      customer: 'John Smith', 
      date: '2024-01-15', 
      items: 3, 
      total: '₹234.50', 
      status: 'Delivered',
      paymentMethod: 'Credit Card'
    },
    { 
      id: 1002, 
      customer: 'Emma Wilson', 
      date: '2024-01-14', 
      items: 2, 
      total: '₹189.00', 
      status: 'Shipped',
      paymentMethod: 'PayPal'
    },
    { 
      id: 1003, 
      customer: 'Michael Brown', 
      date: '2024-01-14', 
      items: 5, 
      total: '₹456.75', 
      status: 'Processing',
      paymentMethod: 'Credit Card'
    },
    { 
      id: 1004, 
      customer: 'Sarah Davis', 
      date: '2024-01-13', 
      items: 1, 
      total: '₹89.99', 
      status: 'Pending',
      paymentMethod: 'Debit Card'
    },
    { 
      id: 1005, 
      customer: 'James Miller', 
      date: '2024-01-13', 
      items: 4, 
      total: '₹378.25', 
      status: 'Cancelled',
      paymentMethod: 'Credit Card'
    },
    { 
      id: 1006, 
      customer: 'Lisa Anderson', 
      date: '2024-01-12', 
      items: 2, 
      total: '₹156.50', 
      status: 'Delivered',
      paymentMethod: 'Cash on Delivery'
    },
  ];

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="search-input"
          />
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-stats">
        <div className="order-stat">
          <div className="stat-icon pending-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <span className="stat-number">248</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="order-stat">
          <div className="stat-icon processing-icon">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-details">
            <span className="stat-number">185</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
        <div className="order-stat">
          <div className="stat-icon shipped-icon">
            <i className="fas fa-truck"></i>
          </div>
          <div className="stat-details">
            <span className="stat-number">312</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
        <div className="order-stat">
          <div className="stat-icon delivered-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <span className="stat-number">1,523</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">{order.customer.charAt(0)}</div>
                    {order.customer}
                  </div>
                </td>
                <td>{order.date}</td>
                <td>{order.items} items</td>
                <td className="order-total">{order.total}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="order-actions">
                    <button className="action-btn view" title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit" title="Edit Order">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn print" title="Print Invoice">
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders
