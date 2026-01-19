import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import orderService from '../../../services/orderService';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        if (response.status) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="order-confirmation-page">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="order-confirmation-page">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <h2>Order Not Found</h2>
              <button onClick={() => navigate('/orders')} className="btn-primary">
                View My Orders
              </button>
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
      <div className="order-confirmation-page">
        <div className="container">
          <div className="confirmation-success">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your order. We've received your order and will begin processing it soon.
            </p>
          </div>

          <div className="order-details-card">
            <div className="order-header">
              <div>
                <h2>Order Details</h2>
                <p className="order-number">Order #{order.orderNumber}</p>
              </div>
              <div className="order-status">
                <span className={`status-badge ${order.orderStatus}`}>
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-info-grid">
              <div className="info-section">
                <h3><i className="fas fa-calendar"></i> Order Date</h3>
                <p>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>

              <div className="info-section">
                <h3><i className="fas fa-credit-card"></i> Payment Method</h3>
                <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</p>
              </div>

              <div className="info-section">
                <h3><i className="fas fa-money-bill"></i> Payment Status</h3>
                <p className="capitalize">{order.paymentStatus}</p>
              </div>

              <div className="info-section">
                <h3><i className="fas fa-rupee-sign"></i> Total Amount</h3>
                <p className="amount">₹{order.grandTotal}</p>
              </div>
            </div>

            <div className="shipping-info">
              <h3><i className="fas fa-shipping-fast"></i> Shipping Address</h3>
              <div className="address-box">
                <p><strong>{order.shippingName}</strong></p>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingState} - {order.shippingZipCode}</p>
                <p>{order.shippingCountry}</p>
                <p>Phone: {order.shippingPhone}</p>
                <p>Email: {order.shippingEmail}</p>
              </div>
            </div>

            <div className="order-items">
              <h3><i className="fas fa-box"></i> Order Items</h3>
              <div className="items-list">
                {order.items.map((item) => {
                  const imagePath = item.product?.images?.[0]?.imagePath;
                  const imageUrl = imagePath 
                    ? `http://localhost:3000${imagePath}`
                    : 'https://via.placeholder.com/100x100?text=No+Image';

                  return (
                    <div key={item.id} className="order-item">
                      <img src={imageUrl} alt={item.productName} />
                      <div className="item-details">
                        <h4>{item.productName}</h4>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ₹{item.total}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{order.shippingCost === '0.00' ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{order.grandTotal}</span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={() => navigate('/orders')} className="btn-secondary">
              <i className="fas fa-list"></i> View All Orders
            </button>
            <button onClick={() => navigate('/')} className="btn-primary">
              <i className="fas fa-home"></i> Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
