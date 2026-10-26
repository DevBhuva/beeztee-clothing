import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import FilterChips from '../../components/Filters/FilterChips';
import MobileFilters from '../../components/Filters/MobileFilters';
import { FilterProvider, useFilters } from '../../../context/FilterContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import productService from '../../../services/productService';
import filterService from '../../../services/filterService';
import { getPrimaryProductImage } from '../../../utils/productImage';
import { toast } from 'react-toastify';
import './Shop.css';

const ShopContent = () => {
  const {
    filters,
    availableFilters,
    setAvailableFilters,
    setSorting,
    setPage,
    toggleFilter,
    getActiveFilterCount,
  } = useFilters();
  const activeFilterCount = getActiveFilterCount();
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
  const getProductImageUrl = (product) => getPrimaryProductImage(product);

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
      <div className="shop-page-wrapper bh-page">
        <section className="bh-page-banner">
          <div className="bh-page-banner__inner">
            <p className="bh-page-banner__eyebrow">Collection</p>
            <h1 className="bh-page-banner__title">Vault</h1>
            <p className="bh-page-banner__text">
              Explore curated pieces designed for modern elegance and everyday polish.
            </p>
          </div>
        </section>

        {/* Main Shop Section */}
        <section className="shop-main-section" id="shop">
          <div className="shop-container">
            <div className="shop-content">
                <div className="shop-toolbar">
                  <div className="shop-toolbar-left">
                    <button
                      type="button"
                      className="shop-filter-btn"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <i className="fas fa-sliders-h"></i>
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="shop-filter-count">{activeFilterCount}</span>
                      )}
                    </button>

                    <div className="shop-category-chips">
                      {availableFilters.categories?.map((category) => {
                        const id = category.id.toString();
                        const active = filters.categories.includes(id);
                        return (
                          <button
                            key={category.id}
                            type="button"
                            className={`shop-cat-chip${active ? ' active' : ''}`}
                            onClick={() => toggleFilter('categories', id)}
                          >
                            {category.name === 'Men' ? 'Him' : category.name === 'Women' ? 'Her' : category.name}
                          </button>
                        );
                      })}
                    </div>

                    {!loading && (
                      <span className="product-count">
                        {pagination.total || 0} Product{pagination.total !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="shop-toolbar-right">
                    <label htmlFor="sortSelect" className="sort-label">Sort by</label>
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

                <FilterChips />

                {/* Loading State */}
                {loading && (
                  <div className="bh-loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading products...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="bh-empty-state">
                    <i className="fas fa-exclamation-circle"></i>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                  <div className="bh-empty-state">
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
                                    -{discount}%
                                  </div>
                                )}
                                <img 
                                  src={getProductImageUrl(product)} 
                                  alt={product.name} 
                                  className="product-image"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://images.unsplash.com/photo-1523381216130-8b3f99a87a6d?auto=format&fit=crop&w=800&q=80&sig=${product.id}`;
                                  }}
                                />
                                <button 
                                  type="button"
                                  className="product-action-btn product-wishlist-btn"
                                  onClick={(e) => handleWishlistToggle(e, product)}
                                  title={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                  <i className={`${productInWishlist ? 'fas' : 'far'} fa-heart`}></i>
                                </button>
                                <div className="product-overlay">
                                  <button 
                                    className="product-quick-view add-to-cart"
                                    onClick={(e) => handleAddToCart(e, product)}
                                  >
                                    Bag it
                                  </button>
                                </div>
                              </div>
                            </Link>
                            <div className="product-info">
                              <div className="product-meta">
                                <div className="product-category">
                                  {product.category?.name || product.Category?.name || 'Fashion'}
                                </div>
                              </div>
                              <Link to={`/product/${product.slug}`}>
                                <h3 className="product-name">{product.name}</h3>
                              </Link>
                              <div className="product-price">
                                <span className="price-current">{settings?.currencySymbol || '₹'}{product.salePrice || product.basePrice}</span>
                                {product.salePrice && product.salePrice < product.basePrice && (
                                  <span className="price-original">{settings?.currencySymbol || '₹'}{product.basePrice}</span>
                                )}
                              </div>
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
                            const showPage = pageNum === 1 || 
                                           pageNum === pagination.totalPages || 
                                           Math.abs(pageNum - filters.page) <= 1;
                            
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
        </section>

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
