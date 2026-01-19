import React, { useState } from 'react';
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaPercentage,
  FaCreditCard,
  FaChartLine,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaTags,
  FaUsers,
  FaBoxes,
  FaMoneyBillWave
} from 'react-icons/fa';
import './Sales.css';

export default function Sales() {
  const [dateRange, setDateRange] = useState('7days');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Sales Metrics
  const salesMetrics = {
    totalSales: {
      current: 125480.50,
      previous: 98750.25,
      change: 27.1,
      trend: 'up',
      count: 1247
    },
    averageOrderValue: {
      current: 245.80,
      previous: 215.30,
      change: 14.2,
      trend: 'up'
    },
    totalProfit: {
      current: 45280.75,
      previous: 38920.50,
      change: 16.3,
      trend: 'up'
    },
    profitMargin: {
      current: 36.1,
      previous: 39.4,
      change: -3.3,
      trend: 'down'
    }
  };

  // Sales by Payment Method
  const paymentMethods = [
    { method: 'Credit Card', amount: 65240.30, percentage: 52, count: 648, color: '#4facfe' },
    { method: 'Debit Card', amount: 38145.20, percentage: 30, count: 385, color: '#43e97b' },
    { method: 'PayPal', amount: 15072.50, percentage: 12, count: 152, color: '#ffa700' },
    { method: 'Cash on Delivery', amount: 7022.50, percentage: 6, count: 62, color: '#e91e63' }
  ];

  // Hourly Sales Distribution
  const hourlySales = [
    { hour: '12 AM', sales: 1200 },
    { hour: '3 AM', sales: 800 },
    { hour: '6 AM', sales: 2400 },
    { hour: '9 AM', sales: 4500 },
    { hour: '12 PM', sales: 6800 },
    { hour: '3 PM', sales: 5200 },
    { hour: '6 PM', sales: 7500 },
    { hour: '9 PM', sales: 4200 }
  ];

  const maxHourlySales = Math.max(...hourlySales.map(h => h.sales));

  // Top Selling Categories by Revenue
  const topCategories = [
    { category: "Men's Clothing", revenue: 42580.50, orders: 456, avgOrder: 93.38, color: '#d4af37' },
    { category: "Women's Clothing", revenue: 38920.75, orders: 398, avgOrder: 97.79, color: '#e91e63' },
    { category: "Footwear", revenue: 24560.25, orders: 234, avgOrder: 104.96, color: '#4facfe' },
    { category: "Accessories", revenue: 12845.60, orders: 189, avgOrder: 67.96, color: '#43e97b' },
    { category: "Sports & Outdoors", revenue: 6573.40, orders: 78, avgOrder: 84.27, color: '#ffa700' }
  ];

  // Sales Comparison Data
  const salesComparison = [
    { day: 'Mon', current: 15200, previous: 12400 },
    { day: 'Tue', current: 18500, previous: 14800 },
    { day: 'Wed', current: 16800, previous: 15200 },
    { day: 'Thu', current: 21400, previous: 16900 },
    { day: 'Fri', current: 24600, previous: 19500 },
    { day: 'Sat', current: 28900, previous: 24200 },
    { day: 'Sun', current: 25100, previous: 21800 }
  ];

  const maxComparisonSales = Math.max(
    ...salesComparison.map(d => Math.max(d.current, d.previous))
  );

  // Sales by Region
  const salesByRegion = [
    { region: 'North America', sales: 52340.50, percentage: 41.7, orders: 524 },
    { region: 'Europe', sales: 38920.25, percentage: 31.0, orders: 389 },
    { region: 'Asia Pacific', sales: 21450.75, percentage: 17.1, orders: 215 },
    { region: 'Latin America', sales: 8734.50, percentage: 7.0, orders: 87 },
    { region: 'Middle East', sales: 4034.50, percentage: 3.2, orders: 32 }
  ];

  // Top Sales Representatives
  const topSalesReps = [
    { name: 'John Smith', sales: 45280.50, orders: 245, commission: 4528.05, avatar: 'JS' },
    { name: 'Sarah Johnson', sales: 38920.75, orders: 198, commission: 3892.08, avatar: 'SJ' },
    { name: 'Mike Davis', sales: 32145.60, orders: 175, commission: 3214.56, avatar: 'MD' },
    { name: 'Emily Chen', sales: 28560.40, orders: 156, commission: 2856.04, avatar: 'EC' },
    { name: 'David Wilson', sales: 24890.25, orders: 142, commission: 2489.03, avatar: 'DW' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    if (value === 'custom') {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }
  };

  const applyCustomDateRange = () => {
    console.log('Applying custom date range:', customStartDate, 'to', customEndDate);
    // API call would go here
    setShowCustomDate(false);
  };

  return (
    <div className="sales-page">
      {/* Page Header */}
      <div className="sales-header">
        <div className="sales-header-left">
          <div className="sales-icon-wrapper">
            <FaDollarSign />
          </div>
          <div>
            <h1>Sales Dashboard</h1>
            <p>Comprehensive sales analytics and performance tracking</p>
          </div>
        </div>
        <div className="sales-header-right">
          <button className="export-btn">
            <FaDownload />
            Export Report
          </button>
          <div className="date-filter-wrapper">
            <FaCalendarAlt className="filter-icon" />
            <select 
              className="date-range-select"
              value={dateRange}
              onChange={handleDateRangeChange}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomDate && (
        <div className="custom-date-modal">
          <div className="custom-date-content">
            <div className="custom-date-header">
              <h3>Select Custom Date Range</h3>
              <button onClick={() => setShowCustomDate(false)} className="close-modal-btn">×</button>
            </div>
            <div className="custom-date-inputs">
              <div className="date-input-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="custom-date-input"
                />
              </div>
              <div className="date-input-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="custom-date-input"
                />
              </div>
            </div>
            <div className="custom-date-actions">
              <button onClick={() => setShowCustomDate(false)} className="cancel-btn">Cancel</button>
              <button onClick={applyCustomDateRange} className="apply-btn">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Metrics */}
      <div className="sales-metrics-grid">
        <div className="sales-metric-card">
          <div className="metric-icon-badge total-sales">
            <FaMoneyBillWave />
          </div>
          <div className="metric-details">
            <h3>{formatCurrency(salesMetrics.totalSales.current)}</h3>
            <p>Total Sales Revenue</p>
            <div className="metric-meta">
              <span className="order-count">{formatNumber(salesMetrics.totalSales.count)} orders</span>
              <span className={`metric-change ${salesMetrics.totalSales.trend}`}>
                {salesMetrics.totalSales.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                {salesMetrics.totalSales.change}%
              </span>
            </div>
          </div>
        </div>

        <div className="sales-metric-card">
          <div className="metric-icon-badge avg-order">
            <FaShoppingCart />
          </div>
          <div className="metric-details">
            <h3>{formatCurrency(salesMetrics.averageOrderValue.current)}</h3>
            <p>Average Order Value</p>
            <div className="metric-meta">
              <span className="previous-value">Prev: {formatCurrency(salesMetrics.averageOrderValue.previous)}</span>
              <span className={`metric-change ${salesMetrics.averageOrderValue.trend}`}>
                {salesMetrics.averageOrderValue.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                {salesMetrics.averageOrderValue.change}%
              </span>
            </div>
          </div>
        </div>

        <div className="sales-metric-card">
          <div className="metric-icon-badge total-profit">
            <FaCreditCard />
          </div>
          <div className="metric-details">
            <h3>{formatCurrency(salesMetrics.totalProfit.current)}</h3>
            <p>Total Profit</p>
            <div className="metric-meta">
              <span className="previous-value">Prev: {formatCurrency(salesMetrics.totalProfit.previous)}</span>
              <span className={`metric-change ${salesMetrics.totalProfit.trend}`}>
                {salesMetrics.totalProfit.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                {salesMetrics.totalProfit.change}%
              </span>
            </div>
          </div>
        </div>

        <div className="sales-metric-card">
          <div className="metric-icon-badge profit-margin">
            <FaPercentage />
          </div>
          <div className="metric-details">
            <h3>{salesMetrics.profitMargin.current}%</h3>
            <p>Profit Margin</p>
            <div className="metric-meta">
              <span className="previous-value">Prev: {salesMetrics.profitMargin.previous}%</span>
              <span className={`metric-change ${salesMetrics.profitMargin.trend}`}>
                {salesMetrics.profitMargin.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                {Math.abs(salesMetrics.profitMargin.change)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="sales-charts-row">
        {/* Sales Comparison Chart */}
        <div className="sales-chart-card comparison-chart">
          <div className="chart-header">
            <div className="chart-title">
              <FaChartLine />
              <h3>Sales Comparison (Current vs Previous Period)</h3>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot current"></span>
                Current Period
              </span>
              <span className="legend-item">
                <span className="legend-dot previous"></span>
                Previous Period
              </span>
            </div>
          </div>
          <div className="chart-body">
            <div className="comparison-chart-container">
              {salesComparison.map((item, index) => (
                <div key={index} className="comparison-bar-group">
                  <div className="comparison-bars">
                    <div 
                      className="comparison-bar current"
                      style={{ height: `${(item.current / maxComparisonSales) * 100}%` }}
                    >
                      <span className="bar-value">{formatCurrency(item.current)}</span>
                    </div>
                    <div 
                      className="comparison-bar previous"
                      style={{ height: `${(item.previous / maxComparisonSales) * 100}%` }}
                    >
                      <span className="bar-value">{formatCurrency(item.previous)}</span>
                    </div>
                  </div>
                  <span className="comparison-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Sales Distribution */}
        <div className="sales-chart-card hourly-chart">
          <div className="chart-header">
            <div className="chart-title">
              <FaChartLine />
              <h3>Hourly Sales Distribution</h3>
            </div>
          </div>
          <div className="chart-body">
            <div className="hourly-chart-container">
              {hourlySales.map((item, index) => (
                <div key={index} className="hourly-bar-item">
                  <div 
                    className="hourly-bar"
                    style={{ height: `${(item.sales / maxHourlySales) * 100}%` }}
                  >
                    <span className="hourly-value">{formatCurrency(item.sales)}</span>
                  </div>
                  <span className="hourly-label">{item.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="sales-data-row">
        {/* Payment Methods */}
        <div className="sales-data-card">
          <div className="data-card-header">
            <div className="data-card-title">
              <FaCreditCard />
              <h3>Sales by Payment Method</h3>
            </div>
          </div>
          <div className="data-card-body">
            {paymentMethods.map((method, index) => (
              <div key={index} className="payment-method-item">
                <div className="payment-info">
                  <div className="payment-icon" style={{ background: method.color }}>
                    <FaCreditCard />
                  </div>
                  <div className="payment-details">
                    <h4>{method.method}</h4>
                    <p>{formatNumber(method.count)} transactions</p>
                  </div>
                </div>
                <div className="payment-stats">
                  <div className="payment-amount">{formatCurrency(method.amount)}</div>
                  <div className="payment-bar-container">
                    <div 
                      className="payment-bar"
                      style={{ width: `${method.percentage}%`, background: method.color }}
                    ></div>
                  </div>
                  <div className="payment-percentage">{method.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="sales-data-card">
          <div className="data-card-header">
            <div className="data-card-title">
              <FaTags />
              <h3>Top Categories by Revenue</h3>
            </div>
          </div>
          <div className="data-card-body">
            {topCategories.map((cat, index) => (
              <div key={index} className="category-sales-item">
                <div className="category-rank" style={{ background: cat.color }}>
                  #{index + 1}
                </div>
                <div className="category-sales-info">
                  <h4>{cat.category}</h4>
                  <div className="category-sales-meta">
                    <span><FaShoppingCart /> {formatNumber(cat.orders)} orders</span>
                    <span>Avg: {formatCurrency(cat.avgOrder)}</span>
                  </div>
                </div>
                <div className="category-sales-revenue">
                  {formatCurrency(cat.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="sales-bottom-row">
        {/* Sales by Region */}
        <div className="sales-data-card region-card">
          <div className="data-card-header">
            <div className="data-card-title">
              <FaBoxes />
              <h3>Sales by Region</h3>
            </div>
          </div>
          <div className="data-card-body">
            {salesByRegion.map((region, index) => (
              <div key={index} className="region-item">
                <div className="region-info">
                  <h4>{region.region}</h4>
                  <p>{formatNumber(region.orders)} orders</p>
                </div>
                <div className="region-stats">
                  <div className="region-amount">{formatCurrency(region.sales)}</div>
                  <div className="region-percentage">{region.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sales Representatives */}
        <div className="sales-data-card reps-card">
          <div className="data-card-header">
            <div className="data-card-title">
              <FaUsers />
              <h3>Top Sales Representatives</h3>
            </div>
          </div>
          <div className="data-card-body">
            {topSalesReps.map((rep, index) => (
              <div key={index} className="sales-rep-item">
                <div className="rep-rank">#{index + 1}</div>
                <div className="rep-avatar">{rep.avatar}</div>
                <div className="rep-info">
                  <h4>{rep.name}</h4>
                  <p>{formatNumber(rep.orders)} orders • Commission: {formatCurrency(rep.commission)}</p>
                </div>
                <div className="rep-sales">{formatCurrency(rep.sales)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
