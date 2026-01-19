import React, { useState } from 'react';
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaUsers, 
  FaBox,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaStar
} from 'react-icons/fa';
import './Analytics.css';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7days');

  // Mock data - Replace with actual API calls
  const metrics = {
    revenue: {
      current: 45780,
      previous: 38920,
      change: 17.6,
      trend: 'up'
    },
    orders: {
      current: 342,
      previous: 298,
      change: 14.8,
      trend: 'up'
    },
    customers: {
      current: 1247,
      previous: 1189,
      change: 4.9,
      trend: 'up'
    },
    products: {
      current: 856,
      previous: 823,
      change: 4.0,
      trend: 'up'
    }
  };

  const topProducts = [
    { id: 1, name: 'Classic Crew Neck T-Shirt', sales: 234, revenue: 5849.66, image: null },
    { id: 2, name: 'Slim Fit Stretch Jeans', sales: 189, revenue: 13221.11, image: null },
    { id: 3, name: 'Air Max Running Sneakers', sales: 156, revenue: 17154.44, image: null },
    { id: 4, name: 'Premium Cotton Polo T-Shirt', sales: 145, revenue: 5798.55, image: null },
    { id: 5, name: 'Little Black Dress', sales: 132, revenue: 11218.68, image: null }
  ];

  const topCategories = [
    { name: "Men's Clothing", sales: 45, percentage: 35, color: '#d4af37' },
    { name: "Women's Clothing", sales: 38, percentage: 29, color: '#e91e63' },
    { name: "Footwear", sales: 25, percentage: 19, color: '#4facfe' },
    { name: "Men's Accessories", sales: 15, percentage: 12, color: '#43e97b' },
    { name: "Women's Accessories", sales: 7, percentage: 5, color: '#ffa700' }
  ];

  const recentOrders = [
    { id: '#ORD-1234', customer: 'John Doe', amount: 234.50, status: 'completed', time: '2 mins ago' },
    { id: '#ORD-1235', customer: 'Jane Smith', amount: 445.00, status: 'processing', time: '15 mins ago' },
    { id: '#ORD-1236', customer: 'Mike Johnson', amount: 189.99, status: 'pending', time: '1 hour ago' },
    { id: '#ORD-1237', customer: 'Sarah Wilson', amount: 567.80, status: 'completed', time: '2 hours ago' },
    { id: '#ORD-1238', customer: 'Tom Brown', amount: 123.45, status: 'cancelled', time: '3 hours ago' }
  ];

  const salesData = [
    { date: 'Mon', sales: 4200 },
    { date: 'Tue', sales: 5800 },
    { date: 'Wed', sales: 4900 },
    { date: 'Thu', sales: 6500 },
    { date: 'Fri', sales: 7200 },
    { date: 'Sat', sales: 8900 },
    { date: 'Sun', sales: 7500 }
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#43e97b',
      processing: '#4facfe',
      pending: '#ffa700',
      cancelled: '#ef4444'
    };
    return colors[status] || '#94a3b8';
  };

  return (
    <div className="analytics-page">
      {/* Page Header */}
      <div className="analytics-header">
        <div className="analytics-header-left">
          <div className="analytics-icon-wrapper">
            <FaChartLine />
          </div>
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Track your ecommerce performance and insights</p>
          </div>
        </div>
        <div className="analytics-header-right">
          <select 
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon revenue">
              <FaDollarSign />
            </div>
            <div className={`metric-trend ${metrics.revenue.trend}`}>
              {metrics.revenue.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              {metrics.revenue.change}%
            </div>
          </div>
          <div className="metric-content">
            <h3>{formatCurrency(metrics.revenue.current)}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="metric-footer">
            <span>Previous: {formatCurrency(metrics.revenue.previous)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon orders">
              <FaShoppingCart />
            </div>
            <div className={`metric-trend ${metrics.orders.trend}`}>
              {metrics.orders.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              {metrics.orders.change}%
            </div>
          </div>
          <div className="metric-content">
            <h3>{formatNumber(metrics.orders.current)}</h3>
            <p>Total Orders</p>
          </div>
          <div className="metric-footer">
            <span>Previous: {formatNumber(metrics.orders.previous)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon customers">
              <FaUsers />
            </div>
            <div className={`metric-trend ${metrics.customers.trend}`}>
              {metrics.customers.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              {metrics.customers.change}%
            </div>
          </div>
          <div className="metric-content">
            <h3>{formatNumber(metrics.customers.current)}</h3>
            <p>Total Customers</p>
          </div>
          <div className="metric-footer">
            <span>Previous: {formatNumber(metrics.customers.previous)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon products">
              <FaBox />
            </div>
            <div className={`metric-trend ${metrics.products.trend}`}>
              {metrics.products.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              {metrics.products.change}%
            </div>
          </div>
          <div className="metric-content">
            <h3>{formatNumber(metrics.products.current)}</h3>
            <p>Total Products</p>
          </div>
          <div className="metric-footer">
            <span>Previous: {formatNumber(metrics.products.previous)}</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Sales Chart */}
        <div className="chart-card sales-chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <FaChartBar />
              <h3>Sales Overview</h3>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot sales"></span>
                Daily Sales
              </span>
            </div>
          </div>
          <div className="chart-content">
            <div className="bar-chart">
              {salesData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div 
                      className="bar"
                      style={{ height: `${(item.sales / maxSales) * 100}%` }}
                    >
                      <div className="bar-tooltip">
                        {formatCurrency(item.sales)}
                      </div>
                    </div>
                  </div>
                  <div className="bar-label">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="chart-card category-chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <FaChartPie />
              <h3>Category Distribution</h3>
            </div>
          </div>
          <div className="chart-content">
            <div className="category-chart">
              {topCategories.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <div 
                      className="category-color"
                      style={{ background: category.color }}
                    ></div>
                    <span className="category-name">{category.name}</span>
                  </div>
                  <div className="category-stats">
                    <div className="category-bar-bg">
                      <div 
                        className="category-bar"
                        style={{ 
                          width: `${category.percentage}%`,
                          background: category.color
                        }}
                      ></div>
                    </div>
                    <span className="category-percentage">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Top Products */}
        <div className="data-card top-products-card">
          <div className="data-card-header">
            <div className="data-card-title">
              <FaStar />
              <h3>Top Selling Products</h3>
            </div>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="data-card-content">
            <div className="products-list">
              {topProducts.map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-image">
                    <FaBox />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>{product.sales} sales</p>
                  </div>
                  <div className="product-revenue">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="data-card recent-orders-card">
          <div className="data-card-header">
            <div className="data-card-title">
              <FaShoppingCart />
              <h3>Recent Orders</h3>
            </div>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="data-card-content">
            <div className="orders-list">
              {recentOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-info">
                    <h4>{order.id}</h4>
                    <p>{order.customer}</p>
                  </div>
                  <div className="order-amount">
                    {formatCurrency(order.amount)}
                  </div>
                  <div 
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </div>
                  <div className="order-time">{order.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
