import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import orderService from '../../../services/orderService';
import { toast } from 'react-toastify';
import $ from 'jquery';
import 'parsleyjs';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { cartItems, cartSummary, loading: cartLoading } = useCart();
  const { settings } = useSiteSettings();
  
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    shippingName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'India',
    paymentMethod: 'online',
    notes: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cartLoading && cartItems.length === 0) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }

    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        shippingName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        shippingEmail: user.email || '',
        shippingPhone: user.phone || ''
      }));
    }
  }, [isAuthenticated, authLoading, cartItems, cartLoading, navigate, user]);

  useEffect(() => {
    if (formRef.current) {
      $(formRef.current).parsley();
    }
  }, []);

  // Auto-switch to online payment if COD is disabled (total < 1000)
  useEffect(() => {
    const shippingCost = cartSummary.subtotal >= 1000 ? 0 : 50;
    const finalTotal = parseFloat(cartSummary.subtotal) + parseFloat(cartSummary.tax) + shippingCost;
    
    if (finalTotal < 1000 && formData.paymentMethod === 'cod') {
      setFormData(prev => ({ ...prev, paymentMethod: 'online' }));
    }
  }, [cartSummary, formData.paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsleyForm = $(formRef.current).parsley();
    if (!parsleyForm.isValid()) {
      parsleyForm.validate();
      toast.error('Please fill all required fields correctly');
      return;
    }

    setSubmitting(true);

    try {
      const response = await orderService.createOrder(formData);
      
      if (response.status) {
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${response.data.order.id}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const shippingCost = cartSummary.subtotal >= 1000 ? 0 : 50;
  const finalTotal = parseFloat(cartSummary.subtotal) + parseFloat(cartSummary.tax) + shippingCost;
  const isCODEnabled = finalTotal >= 1000;

  if (authLoading || cartLoading) {
    return (
      <>
        <Header />
        <div className="checkout-page">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading checkout...</p>
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
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <div className="checkout-steps">
              <div className="step active">
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
              </div>
              <div className="step-line"></div>
              <div className="step active">
                <i className="fas fa-shipping-fast"></i>
                <span>Shipping</span>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <i className="fas fa-check-circle"></i>
                <span>Confirmation</span>
              </div>
            </div>
          </div>

          <div className="checkout-content">
            <div className="checkout-form-section">
              <form ref={formRef} onSubmit={handleSubmit} data-parsley-validate>
                <div className="form-section">
                  <h2>Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="shippingName">Full Name *</label>
                      <input
                        type="text"
                        id="shippingName"
                        name="shippingName"
                        value={formData.shippingName}
                        onChange={handleChange}
                        required
                        data-parsley-required-message="Full name is required"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="shippingEmail">Email *</label>
                      <input
                        type="email"
                        id="shippingEmail"
                        name="shippingEmail"
                        value={formData.shippingEmail}
                        onChange={handleChange}
                        required
                        data-parsley-type="email"
                        data-parsley-required-message="Email is required"
                        data-parsley-type-message="Please enter a valid email address"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="shippingPhone">Phone Number *</label>
                      <input
                        type="tel"
                        id="shippingPhone"
                        name="shippingPhone"
                        value={formData.shippingPhone}
                        onChange={handleChange}
                        placeholder="10 digit mobile number"
                        required
                        data-parsley-type="digits"
                        data-parsley-length="[10, 10]"
                        data-parsley-required-message="Phone number is required"
                        data-parsley-type-message="Phone must contain only digits"
                        data-parsley-length-message="Phone must be exactly 10 digits"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingAddress">Address *</label>
                    <textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      rows="3"
                      placeholder="House No., Building Name, Road, Area"
                      required
                      data-parsley-required-message="Address is required"
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="shippingCity">City *</label>
                      <input
                        type="text"
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleChange}
                        required
                        data-parsley-required-message="City is required"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="shippingState">State *</label>
                      <input
                        type="text"
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleChange}
                        required
                        data-parsley-required-message="State is required"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="shippingZipCode">ZIP Code *</label>
                      <input
                        type="text"
                        id="shippingZipCode"
                        name="shippingZipCode"
                        value={formData.shippingZipCode}
                        onChange={handleChange}
                        placeholder="6 digit PIN code"
                        maxLength="6"
                        required
                        data-parsley-type="digits"
                        data-parsley-length="[6, 6]"
                        data-parsley-required-message="ZIP code is required"
                        data-parsley-type-message="ZIP code must contain only digits"
                        data-parsley-length-message="ZIP code must be exactly 6 digits"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="shippingCountry">Country</label>
                      <input
                        type="text"
                        id="shippingCountry"
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        readOnly
                        className="readonly"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Payment Method</h2>
                  
                  <div className="payment-methods">
                    <label className={`payment-option ${!isCODEnabled ? 'disabled' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        disabled={!isCODEnabled}
                      />
                      <div className="payment-option-content">
                        <i className="fas fa-money-bill-wave"></i>
                        <div>
                          <strong>Cash on Delivery</strong>
                          <p>{isCODEnabled ? 'Pay when you receive your order' : 'Available for orders ≥ ₹1000'}</p>
                        </div>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleChange}
                      />
                      <div className="payment-option-content">
                        <i className="fas fa-credit-card"></i>
                        <div>
                          <strong>Online Payment</strong>
                          <p>Card/UPI/Net Banking - Coming Soon</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Additional Notes (Optional)</h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions for delivery..."
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate('/cart')}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Cart
                  </button>
                  
                  <button
                    type="submit"
                    className="btn-place-order"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i> Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="order-summary-section">
              <div className="order-summary-sticky">
                <h2>Order Summary</h2>
                
                <div className="summary-items">
                  {cartItems.map((item) => {
                    const imagePath = item.product?.images?.[0]?.imagePath;
                    const imageUrl = imagePath 
                      ? `http://localhost:3000${imagePath}`
                      : 'https://via.placeholder.com/80x80?text=No+Image';

                    return (
                      <div key={item.id} className="summary-item">
                        <img src={imageUrl} alt={item.product?.name} />
                        <div className="summary-item-details">
                          <h4>{item.product?.name}</h4>
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                          <p>Qty: {item.quantity}</p>
                        </div>
                        <div className="summary-item-price">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartSummary.subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (18%)</span>
                    <span>₹{cartSummary.tax}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  {cartSummary.subtotal >= 1000 && (
                    <div className="free-shipping-badge">
                      <i className="fas fa-truck"></i> Free shipping applied!
                    </div>
                  )}
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
