import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trending.css';
import productService from '../../../services/productService';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const Trending = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const response = await productService.getTrendingProducts(20);
        
        if (response?.data?.status && Array.isArray(response?.data?.data?.products)) {
          setProducts(response.data.data.products);
        } else if (response?.data?.status && Array.isArray(response?.data?.data)) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Auto-slide carousel every 4 seconds
  useEffect(() => {
    if (products.length === 0) return;

    const totalSlides = Math.ceil(products.length / 5);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length]);

  const getProductImage = (product) => {
    const baseURL = 'http://localhost:3000';
    
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return `${baseURL}${primaryImage.imagePath || primaryImage.imageUrl}`;
    }
    
    if (product.ProductImages && product.ProductImages.length > 0) {
      const primaryImage = product.ProductImages.find(img => img.isPrimary) || product.ProductImages[0];
      return `${baseURL}${primaryImage.imagePath || primaryImage.imageUrl}`;
    }
    
    return 'https://via.placeholder.com/300x400?text=Trending';
  };

  // Handle add to cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    await addToCart(product.id, 1);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    await toggleWishlist(product.id);
  };

  const nextSlide = () => {
    const totalSlides = Math.ceil(products.length / 5);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(products.length / 5);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleViewAll = () => {
    const bestSellersSection = document.getElementById('shop');
    if (bestSellersSection) {
      bestSellersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug}`);
  };

  const totalSlides = Math.ceil(products.length / 5);

  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-header">
          <div className="header-content">
            <h2 className="trending-title">TRENDING NOW</h2>
            <p className="trending-subtitle">Most popular products this week</p>
          </div>
          {/* <button className="view-all-btn" onClick={handleViewAll}>
            View All <i className="fas fa-arrow-right"></i>
          </button> */}
        </div>

        {loading ? (
          <div className="trending-loading">Loading trending products...</div>
        ) : products.length === 0 ? (
          <div className="trending-empty">No trending products at the moment</div>
        ) : (
          <div className="trending-carousel-wrapper">
            <button className="trending-carousel-btn prev-btn" onClick={prevSlide}>
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="trending-carousel">
              <div 
                className="trending-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="trending-slide">
                    {products.slice(slideIndex * 5, slideIndex * 5 + 5).map((product) => (
                      <div 
                        key={product.id}
                        className="trending-card"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="trending-image-container">
                          <img 
                            src={getProductImage(product)} 
                            alt={product.name} 
                            className="trending-image"
                          />
                          <div className="trending-badge">
                            <i className="fas fa-fire"></i> TRENDING
                          </div>
                          <div className="trending-overlay">
                            <button 
                              className="quick-shop-btn"
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              <i className="fas fa-shopping-bag"></i> Add to Cart
                            </button>
                            <button 
                              className="trending-wishlist-btn"
                              onClick={(e) => handleWishlistToggle(e, product)}
                              title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                            </button>
                          </div>
                        </div>
                        <div className="trending-info">
                          <h3 className="trending-name">{product.name}</h3>
                          <p className="trending-category">
                            {product.category?.name || product.Category?.name || 'Hot Item'}
                          </p>
                          <div className="trending-price">
                            <span className="current-price">₹{product.salePrice || product.basePrice}</span>
                            {product.salePrice && product.salePrice < product.basePrice && (
                              <span className="original-price">₹{product.basePrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button className="trending-carousel-btn next-btn" onClick={nextSlide}>
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Carousel Indicators */}
            <div className="trending-indicators">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;
