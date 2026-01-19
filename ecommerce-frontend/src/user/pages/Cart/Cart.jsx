import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Swal from 'sweetalert2';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, cartSummary, loading, updateCartItem, removeFromCart, clearCart, fetchCart } = useCart();
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, navigate]);

  const handleUpdateQuantity = async (cartItemId, newQuantity, stockQuantity) => {
    if (newQuantity > stockQuantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit Reached',
        text: `Only ${stockQuantity} items available in stock`,
        confirmButtonColor: '#e91e63',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    if (newQuantity < 1) {
      return;
    }
    
    await updateCartItem(cartItemId, newQuantity);
  };

  const handleRemove = async (cartItemId) => {
    const result = await Swal.fire({
      title: 'Remove Item?',
      text: 'Are you sure you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await removeFromCart(cartItemId);
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: 'Clear Cart?',
      text: 'Are you sure you want to remove all items from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="cart-page">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading cart...</p>
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
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            {cartItems.length > 0 && (
              <button className="clear-cart-btn" onClick={handleClearCart}>
                <i className="fas fa-trash"></i>
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h2>Your cart is empty</h2>
              <p>Add items to your cart to see them here</p>
              <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => {
                  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                  const imagePath = item.product?.images?.[0]?.imagePath || 
                                    item.product?.images?.[0]?.imageUrl || 
                                    item.product?.images?.[0]?.url;
                  
                  const imageUrl = imagePath 
                    ? (imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`)
                    : 'https://via.placeholder.com/300x300?text=No+Image';
                  
                  const stockQuantity = item.variant?.stockQuantity || item.product?.stockQuantity || 0;
                  const isStockLimited = item.quantity >= stockQuantity;
                  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;
                  const isOutOfStock = stockQuantity === 0;
                  
                  return (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                        onError={(e) => {
                          if (!e.target.src.includes('placeholder')) {
                            console.error('Image load error:', imageUrl);
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }
                        }}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h3 onClick={() => navigate(`/product/${item.product.slug}`)}>
                        {item.product.name}
                      </h3>
                      
                      {item.variant && (
                        <div className="item-variant">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      )}
                      
                      <div className="item-price">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </div>
                      
                      {stockQuantity > 0 && (
                        <div className={`stock-info ${isLowStock ? 'low-stock' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}>
                          <i className="fas fa-box"></i>
                          {isLowStock ? `Only ${stockQuantity} left in stock!` : `${stockQuantity} in stock`}
                        </div>
                      )}
                    </div>
                    
                    <div className="item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, stockQuantity)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, stockQuantity)}
                        disabled={isStockLimited}
                        title={isStockLimited ? `Only ${stockQuantity} items available` : ''}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                    
                    <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal ({cartSummary.totalQuantity} items)</span>
                  <span>₹{cartSummary.subtotal}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (18%)</span>
                  <span>₹{cartSummary.tax}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{cartSummary.grandTotal}</span>
                </div>
                
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                
                <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
