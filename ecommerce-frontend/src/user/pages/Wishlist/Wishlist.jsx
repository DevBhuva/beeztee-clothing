import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Swal from 'sweetalert2';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { wishlistItems, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, navigate]);

  const handleRemove = async (wishlistItemId) => {
    const result = await Swal.fire({
      title: 'Remove from Wishlist?',
      text: 'Are you sure you want to remove this item from your wishlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await removeFromWishlist(wishlistItemId);
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product.id, 1);
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="wishlist-page">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading wishlist...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-header">
            <h1>
              <i className="fas fa-heart"></i>
              My Wishlist
            </h1>
            <p className="wishlist-count">{wishlistItems.length} items</p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <i className="far fa-heart"></i>
              <h2>Your wishlist is empty</h2>
              <p>Save your favorite items here</p>
              <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map((item) => {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                const imagePath = item.product?.images?.[0]?.imagePath || 
                                  item.product?.images?.[0]?.imageUrl || 
                                  item.product?.images?.[0]?.url;
                
                const imageUrl = imagePath 
                  ? (imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`)
                  : 'https://via.placeholder.com/300x300?text=No+Image';
                
                return (
                <div key={item.id} className="wishlist-card">
                  <button 
                    className="remove-wishlist-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>

                  <div 
                    className="wishlist-image"
                    onClick={() => navigate(`/product/${item.product.slug}`)}
                  >
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      onError={(e) => {
                        if (!e.target.src.includes('placeholder')) {
                          console.error('Image load error:', imageUrl);
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }
                      }}
                    />
                    
                    {item.product.salePrice && item.product.basePrice > item.product.salePrice && (
                      <span className="discount-badge">
                        {Math.round(((item.product.basePrice - item.product.salePrice) / item.product.basePrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="wishlist-info">
                    <h3 onClick={() => navigate(`/product/${item.product.slug}`)}>
                      {item.product.name}
                    </h3>

                    {item.product.brand && (
                      <p className="product-brand">{item.product.brand.name}</p>
                    )}

                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < Math.floor(Number(item.product.averageRating) || 0) ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <span className="rating-count">({item.product.reviewCount || 0})</span>
                    </div>

                    <div className="product-price">
                      <span className="current-price">
                        ₹{item.product.salePrice || item.product.basePrice}
                      </span>
                      {item.product.salePrice && item.product.basePrice > item.product.salePrice && (
                        <span className="original-price">₹{item.product.basePrice}</span>
                      )}
                    </div>

                    {item.product.stockQuantity > 0 ? (
                      <div className="stock-status in-stock">
                        <i className="fas fa-check-circle"></i>
                        In Stock
                      </div>
                    ) : (
                      <div className="stock-status out-of-stock">
                        <i className="fas fa-times-circle"></i>
                        Out of Stock
                      </div>
                    )}

                    <div className="wishlist-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item.product)}
                        disabled={item.product.stockQuantity === 0}
                      >
                        <i className="fas fa-shopping-cart"></i>
                        Add to Cart
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
