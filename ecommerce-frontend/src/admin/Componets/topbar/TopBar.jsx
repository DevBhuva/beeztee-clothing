import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";
import { 
  FaSearch, 
  FaBell, 
  FaCog, 
  FaUserCircle, 
  FaChevronDown, 
  FaSignOutAlt,
  FaShoppingBag,
  FaUsers,
  FaDollarSign,
  FaBars,
  FaStore,
  FaBox,
  FaTags,
  FaTimes,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import productService from '../../../services/productService';
import brandService from '../../../services/brandService';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], brands: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const notifications = [
    { id: 1, message: 'New order received #1234', time: '5 mins ago', unread: true, icon: FaShoppingBag, type: 'success' },
    { id: 2, message: 'Product stock is low', time: '1 hour ago', unread: true, icon: FaShoppingBag, type: 'warning' },
    { id: 3, message: 'New customer registered', time: '2 hours ago', unread: false, icon: FaUsers, type: 'info' },
    { id: 4, message: 'Payment received ₹500', time: '3 hours ago', unread: false, icon: FaDollarSign, type: 'success' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Search functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults({ products: [], brands: [] });
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const [productsRes, brandsRes] = await Promise.all([
        productService.getAllProducts({ search: query, limit: 5 }),
        brandService.getAllBrands({ search: query })
      ]);

      setSearchResults({
        products: productsRes.data?.products || [],
        brands: brandsRes.data?.brands?.slice(0, 5) || []
      });
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults({ products: [], brands: [] });
    setShowSearchResults(false);
  };

  const handleQuickNavigate = (type, id) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (type === 'product') {
      navigate(`/admin/products/${id}/view`);
    } else if (type === 'brand') {
      navigate(`/admin/brands?id=${id}`);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-wrapper">
        <div className="topbar-left">
          <button className="menu-toggle" onClick={onMenuClick}>
            <FaBars />
          </button>
          <div className="logo-brand">
            <div className="logo-text">
              <h1>Beestee</h1>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>
        
        <div className="topbar-center">
          <div className="search-container" ref={searchRef}>
            <FaSearch className="search-icon" />
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Search products, brands..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                >
                  <FaTimes />
                </button>
              )}
            </form>
            <kbd className="search-shortcut">Ctrl K</kbd>

            {/* Search Results Dropdown */}
            {showSearchResults && (searchResults.products.length > 0 || searchResults.brands.length > 0) && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-loading">
                    <div className="search-spinner"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <>
                    {searchResults.products.length > 0 && (
                      <div className="search-section">
                        <div className="search-section-header">
                          <FaBox /> Products
                        </div>
                        {searchResults.products.map(product => (
                          <div 
                            key={product.id} 
                            className="search-result-item"
                            onClick={() => handleQuickNavigate('product', product.id)}
                          >
                            <div className="search-result-image">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={`${import.meta.env.VITE_API_URL}/uploads/products/${product.images[0].imageUrl}`}
                                  alt={product.name}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="search-result-no-image" style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
                                <FaBox />
                              </div>
                            </div>
                            <div className="search-result-info">
                              <span className="search-result-name">{product.name}</span>
                              <span className="search-result-meta">SKU: {product.sku}</span>
                            </div>
                            <div className="search-result-price">
                              ₹{product.salePrice || product.basePrice}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.brands.length > 0 && (
                      <div className="search-section">
                        <div className="search-section-header">
                          <FaTags /> Brands
                        </div>
                        {searchResults.brands.map(brand => (
                          <div 
                            key={brand.id} 
                            className="search-result-item"
                            onClick={() => handleQuickNavigate('brand', brand.id)}
                          >
                            <div className="search-result-image">
                              {brand.logo ? (
                                <img 
                                  src={`${import.meta.env.VITE_API_URL}/uploads/brands/${brand.logo}`}
                                  alt={brand.name}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="search-result-no-image" style={{ display: brand.logo ? 'none' : 'flex' }}>
                                <FaTags />
                              </div>
                            </div>
                            <div className="search-result-info">
                              <span className="search-result-name">{brand.name}</span>
                              <span className="search-result-meta">Brand</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="search-footer">
                      <button 
                        className="view-all-search-btn"
                        onClick={handleSearchSubmit}
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="topbar-right">
          <button className="topbar-btn theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

        

          <div className="topbar-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            
            {showNotifications && (
              <div className="dropdown notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="mark-read-btn">Mark all as read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notif => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                        <div className={`notification-icon ${notif.type}`}>
                          <Icon />
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">{notif.message}</p>
                          <span className="notification-time">{notif.time}</span>
                        </div>
                        {notif.unread && <div className="unread-indicator"></div>}
                      </div>
                    );
                  })}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-btn">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-menu" onClick={() => setShowProfile(!showProfile)}>
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="profile-details">
              <span className="profile-name">{user?.name || 'Admin User'}</span>
              <span className="profile-role">Administrator</span>
            </div>
            <FaChevronDown className="profile-arrow" />

            {showProfile && (
              <div className="dropdown profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="profile-dropdown-name">{user?.name || 'Admin User'}</p>
                    <p className="profile-dropdown-email">{user?.email || 'admin@beetes.com'}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <FaUserCircle />
                  <span>My Profile</span>
                </button>
               
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


