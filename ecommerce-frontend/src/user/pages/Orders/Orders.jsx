import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import orderService from '../../../services/orderService';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders(page, 10);
      if (response.status) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, navigate, page]);

  const handleCancelOrder = async (orderId, orderNumber) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: `Are you sure you want to cancel order #${orderNumber}?`,
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Reason for cancellation (optional)',
      inputPlaceholder: 'Please tell us why you\'re cancelling...',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await orderService.cancelOrder(orderId, result.value || 'Cancelled by customer');
        toast.success('Order cancelled successfully');
        fetchOrders();
      } catch (error) {
        toast.error(error.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f57c00',
      confirmed: '#1976d2',
      processing: '#7b1fa2',
      shipped: '#388e3c',
      delivered: '#2e7d32',
      cancelled: '#d32f2f',
      returned: '#c62828'
    };
    return colors[status] || '#666';
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="orders-page">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading orders...</p>
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
      <div className="orders-page">
        <div className="container">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p>View and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <i className="fas fa-box-open"></i>
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet</p>
              <button onClick={() => navigate('/shop')} className="btn-shop-now">
                <i className="fas fa-shopping-bag"></i> Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-info">
                        <h3>Order #{order.orderNumber}</h3>
                        <p className="order-date">
                          <i className="fas fa-calendar"></i>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                        {order.orderStatus.toUpperCase()}
                      </div>
                    </div>

                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item) => {
                        const imagePath = item.product?.images?.[0]?.imagePath;
                        const imageUrl = imagePath 
                          ? `http://localhost:3000${imagePath}`
                          : 'https://via.placeholder.com/60x60?text=No+Image';

                        return (
                          <div key={item.id} className="item-preview">
                            <img src={imageUrl} alt={item.productName} />
                            <div className="item-info">
                              <h4>{item.productName}</h4>
                              <p>Qty: {item.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <span className="amount">₹{order.grandTotal}</span>
                      </div>
                      <div className="order-actions">
                        <button
                          onClick={() => navigate(`/order-confirmation/${order.id}`)}
                          className="btn-view"
                        >
                          <i className="fas fa-eye"></i> View Details
                        </button>
                        {['pending', 'confirmed'].includes(order.orderStatus) && (
                          <button
                            onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                            className="btn-cancel"
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  
                  <span className="page-info">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="pagination-btn"
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
