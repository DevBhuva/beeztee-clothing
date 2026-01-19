import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import FilterSidebar from '../../components/Filters/FilterSidebar';
import FilterChips from '../../components/Filters/FilterChips';
import MobileFilters from '../../components/Filters/MobileFilters';
import { FilterProvider, useFilters } from '../../../context/FilterContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import productService from '../../../services/productService';
import filterService from '../../../services/filterService';
import { toast } from 'react-toastify';
import './Shop.css';

const ShopContent = () => {
  const { filters, setAvailableFilters, setSorting, setPage } = useFilters();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch available filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await filterService.getFilterOptions();
        if (response.status && response.data) {
          setAvailableFilters(response.data);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchFilterOptions();
  }, [setAvailableFilters]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await filterService.getFilteredProducts(filters);
        
        if (response.status && response.data) {
          setProducts(response.data.products || []);
          setPagination(response.data.pagination || {});
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Scroll to top on filter/page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  // Add to cart handler
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    await addToCart(product.id, 1);
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    await toggleWishlist(product.id);
  };

  // Get product image URL
  const getProductImageUrl = (product) => {
    if (product.ProductImages && product.ProductImages.length > 0) {
      const primaryImage = product.ProductImages.find(img => img.isPrimary) || product.ProductImages[0];
      return `http://localhost:3000${primaryImage.imagePath}`;
    }
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return `http://localhost:3000${primaryImage.imagePath}`;
    }
    return `https://picsum.photos/seed/${product.id}/400/500.jpg`;
  };

  // Calculate discount percentage
  const calculateDiscount = (basePrice, salePrice) => {
    if (!salePrice || salePrice >= basePrice) return 0;
    return Math.round(((basePrice - salePrice) / basePrice) * 100);
  };

  // Sort options
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'DESC' },
    { value: 'price_low', label: 'Price: Low to High', order: 'ASC' },
    { value: 'price_high', label: 'Price: High to Low', order: 'DESC' },
    { value: 'popularity', label: 'Most Popular', order: 'DESC' },
    { value: 'rating', label: 'Highest Rated', order: 'DESC' },
    { value: 'discount', label: 'Best Discount', order: 'DESC' }
  ];

  return (
    <>
      <Header />
      <div className="shop-page-wrapper">
        
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="fashion-element fashion-element-1"></div>
          <div className="fashion-element fashion-element-2"></div>
          <div className="fashion-element fashion-element-3"></div>
          <div className="hero-text">
            <h1 className="hero-title">Elevate Your Style</h1>
            <p className="hero-subtitle">Discover our exclusive collection of premium fashion pieces designed to make you stand out</p>
            <a href="#shop" className="hero-btn">Shop Now</a>
          </div>
        </section>

        {/* Main Shop Section */}
        <section className="shop-main-section" id="shop">
          <div className="shop-container">
            <div className="shop-layout">
              
              {/* Desktop Filter Sidebar */}
              <aside className="shop-sidebar">
                <FilterSidebar />
              </aside>

              {/* Products Section */}
              <div className="shop-content">
                
                {/* Filter Chips */}
                <FilterChips />

                {/* Toolbar */}
                <div className="shop-toolbar">
                  <div className="shop-toolbar-left">
                    {/* Mobile Filter Button */}
                    <button 
                      className="mobile-filter-btn"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <i className="fas fa-filter"></i>
                      Filters
                    </button>
                    
                    {/* Product Count */}
                    {!loading && (
                      <span className="product-count">
                        {pagination.total || 0} Product{pagination.total !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="shop-toolbar-right">
                    <label htmlFor="sortSelect" className="sort-label">Sort by:</label>
                    <select 
                      id="sortSelect"
                      className="sort-select"
                      value={filters.sortBy || 'createdAt'}
                      onChange={(e) => {
                        const option = sortOptions.find(opt => opt.value === e.target.value);
                        setSorting(option.value, option.order);
                      }}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading products...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="error-state">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                  <div className="empty-state">
                    <i className="fas fa-shopping-bag"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters to see more results</p>
                  </div>
                )}

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
                  <>
                    <div className="product-grid">
                      {products.map((product) => {
                        const discount = calculateDiscount(product.basePrice, product.salePrice);
                        const productInWishlist = isInWishlist(product.id);
                        
                        return (
                          <div className="product-card" key={product.id}>
                            <Link to={`/product/${product.slug}`} className="product-link">
                              <div className="product-image-container">
                                {discount > 0 && (
                                  <div className="product-badge discount-badge">
                                    {discount}% OFF
                                  </div>
                                )}
                                <img 
                                  src={getProductImageUrl(product)} 
                                  alt={product.name} 
                                  className="product-image" 
                                />
                                <div className="product-overlay">
                                  <div className="product-actions">
                                    <button 
                                      className="product-action-btn"
                                      onClick={(e) => handleWishlistToggle(e, product)}
                                      title={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                      <i className={`${productInWishlist ? 'fas' : 'far'} fa-heart`}></i>
                                    </button>
                                    <button className="product-action-btn" title="Quick view">
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </div>
                                  <button 
                                    className="product-quick-view add-to-cart"
                                    onClick={(e) => handleAddToCart(e, product)}
                                  >
                                    <i className="fas fa-shopping-cart"></i>
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </Link>
                            <div className="product-info">
                              <div className="product-meta">
                                <div className="product-category">
                                  {product.category?.name || product.Category?.name || 'Fashion'}
                                </div>
                                {product.brand?.name || product.Brand?.name ? (
                                  <div className="product-brand">
                                    {product.brand?.name || product.Brand?.name}
                                  </div>
                                ) : null}
                                {product.isNewArrival && (
                                  <span className="product-badge new-badge">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <Link to={`/product/${product.slug}`}>
                                <h3 className="product-name">{product.name}</h3>
                              </Link>
                              <div className="product-price">
                                <span className="price-current">{settings?.currencySymbol || '₹'}{product.salePrice || product.basePrice}</span>
                                {product.salePrice && product.salePrice < product.basePrice && (
                                  <>
                                    <span className="price-original">{settings?.currencySymbol || '₹'}{product.basePrice}</span>
                                  </>
                                )}
                              </div>
                              {product.averageRating > 0 && (
                                <div className="product-rating">
                                  <div className="rating-stars">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(product.averageRating) ? 'filled' : ''}`}
                                      ></i>
                                    ))}
                                  </div>
                                  <span className="rating-count">({product.reviewCount || 0})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="shop-pagination">
                        <button
                          className="pagination-btn"
                          onClick={() => setPage(filters.page - 1)}
                          disabled={filters.page <= 1}
                        >
                          <i className="fas fa-chevron-left"></i>
                          Previous
                        </button>

                        <div className="pagination-pages">
                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => {
                            // Show first page, last page, current page, and pages around current
                            const showPage = pageNum === 1 || 
                                           pageNum === pagination.totalPages || 
                                           Math.abs(pageNum - filters.page) <= 1;
                            
                            // Show ellipsis
                            if (!showPage && (pageNum === filters.page - 2 || pageNum === filters.page + 2)) {
                              return <span key={pageNum} className="pagination-ellipsis">...</span>;
                            }
                            
                            if (!showPage) return null;

                            return (
                              <button
                                key={pageNum}
                                className={`pagination-page ${filters.page === pageNum ? 'active' : ''}`}
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          className="pagination-btn"
                          onClick={() => setPage(filters.page + 1)}
                          disabled={filters.page >= pagination.totalPages}
                        >
                          Next
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Filters */}
        <MobileFilters 
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />
      </div>
      <Footer />
    </>
  );
};

const Shop = () => {
  return (
    <FilterProvider>
      <ShopContent />
    </FilterProvider>
  );
};

export default Shop;
