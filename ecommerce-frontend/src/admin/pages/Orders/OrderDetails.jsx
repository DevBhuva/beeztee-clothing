import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderDetails.css';
import { 
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaTruck,
  FaFileDownload,
  FaCheck,
  FaTimes,
  FaBox,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaShippingFast,
  FaBoxOpen
} from 'react-icons/fa';
import adminOrderService from '../../../services/admin/orderService';
import { showSuccess, showError, showConfirmDialog } from '../../../utils/toast';
import OrderStatusBadge from '../../../components/admin/OrderStatusBadge';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await adminOrderService.getOrderById(id);
      
      if (response.status) {
        setOrder(response.data);
        setOrderStatus(response.data.orderStatus);
        setPaymentStatus(response.data.paymentStatus);
        setTrackingNumber(response.data.trackingNumber || '');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      showError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleUpdateStatus = async () => {
    if (!orderStatus) {
      showError('Please select order status');
      return;
    }

    const confirmed = await showConfirmDialog(
      'Update Order Status',
      `Are you sure you want to update order status to "${orderStatus}"?`
    );

    if (confirmed) {
      try {
        setUpdating(true);
        const response = await adminOrderService.updateOrderStatus(
          id,
          orderStatus,
          trackingNumber || null
        );

        if (response.status) {
          showSuccess('Order status updated successfully');
          fetchOrderDetails();
        }
      } catch (error) {
        showError(error.message || 'Failed to update order status');
      } finally {
        setUpdating(false);
      }
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = async () => {
    if (!paymentStatus) {
      showError('Please select payment status');
      return;
    }

    const confirmed = await showConfirmDialog(
      'Update Payment Status',
      `Are you sure you want to update payment status to "${paymentStatus}"?`
    );

    if (confirmed) {
      try {
        setUpdating(true);
        const response = await adminOrderService.updatePaymentStatus(id, paymentStatus);

        if (response.status) {
          showSuccess('Payment status updated successfully');
          fetchOrderDetails();
        }
      } catch (error) {
        showError(error.message || 'Failed to update payment status');
      } finally {
        setUpdating(false);
      }
    }
  };

  // Cancel order
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      showError('Please provide a cancellation reason');
      return;
    }

    const confirmed = await showConfirmDialog(
      'Cancel Order',
      'Are you sure you want to cancel this order? Stock will be restored.'
    );

    if (confirmed) {
      try {
        setUpdating(true);
        const response = await adminOrderService.cancelOrder(id, cancelReason);

        if (response.status) {
          showSuccess('Order cancelled successfully');
          setShowCancelForm(false);
          setCancelReason('');
          fetchOrderDetails();
        }
      } catch (error) {
        showError(error.message || 'Failed to cancel order');
      } finally {
        setUpdating(false);
      }
    }
  };

  // Download invoice
  const handleDownloadInvoice = async () => {
    try {
      await adminOrderService.downloadInvoice(id);
      showSuccess('Invoice downloaded successfully');
    } catch (error) {
      showError('Failed to download invoice');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status timeline
  const getStatusTimeline = () => {
    const statuses = [
      { key: 'pending', label: 'Pending', icon: FaClock },
      { key: 'confirmed', label: 'Confirmed', icon: FaCheckCircle },
      { key: 'processing', label: 'Processing', icon: FaCog },
      { key: 'shipped', label: 'Shipped', icon: FaShippingFast },
      { key: 'delivered', label: 'Delivered', icon: FaBoxOpen }
    ];

    const currentIndex = statuses.findIndex(s => s.key === order?.orderStatus);

    if (order?.orderStatus === 'cancelled' || order?.orderStatus === 'returned') {
      return (
        <div className="timeline-cancelled">
          <FaTimes className="timeline-icon-cancelled" />
          <div className="timeline-label">
            {order.orderStatus === 'cancelled' ? 'Order Cancelled' : 'Order Returned'}
          </div>
        </div>
      );
    }

    return (
      <div className="status-timeline">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={status.key}
              className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="timeline-icon">
                <Icon />
              </div>
              <div className="timeline-label">{status.label}</div>
              {index < statuses.length - 1 && (
                <div className={`timeline-line ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="empty-state">
          <FaBox className="empty-icon" />
          <h3>Order Not Found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/admin/orders')}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const canCancel = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';
  const canUpdate = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';

  return (
    <div className="order-details-page">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/admin/orders')}>
          <FaArrowLeft />
          Back to Orders
        </button>
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Order #{order.orderNumber}</h1>
            <div className="order-meta">
              <span className="meta-item">
                <FaCalendarAlt />
                {formatDate(order.createdAt)}
              </span>
              <OrderStatusBadge status={order.orderStatus} type="order" />
              <OrderStatusBadge status={order.paymentStatus} type="payment" />
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleDownloadInvoice}>
              <FaFileDownload />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="status-timeline-container">
        <h3 className="section-title">Order Progress</h3>
        {getStatusTimeline()}
      </div>

      <div className="order-content-grid">
        {/* Left Column */}
        <div className="order-left-column">
          {/* Customer Information */}
          <div className="info-card">
            <h3 className="card-title">
              <FaUser />
              Customer Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <div className="info-value">
                  {order.user ? order.user.name : order.shippingName}
                </div>
              </div>
              <div className="info-item">
                <label>Email</label>
                <div className="info-value">
                  <FaEnvelope />
                  {order.shippingEmail}
                </div>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <div className="info-value">
                  <FaPhone />
                  {order.shippingPhone}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="info-card">
            <h3 className="card-title">
              <FaMapMarkerAlt />
              Shipping Address
            </h3>
            <div className="address-content">
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
              <p>{order.shippingCountry || 'India'}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="info-card">
            <h3 className="card-title">
              <FaCreditCard />
              Payment Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Payment Method</label>
                <div className="info-value payment-method-badge">
                  {order.paymentMethod?.toUpperCase()}
                </div>
              </div>
              <div className="info-item">
                <label>Payment Status</label>
                <div className="info-value">
                  <OrderStatusBadge status={order.paymentStatus} type="payment" />
                </div>
              </div>
              {order.paymentId && (
                <div className="info-item">
                  <label>Transaction ID</label>
                  <div className="info-value">{order.paymentId}</div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="info-card">
            <h3 className="card-title">
              <FaBox />
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="order-items-table">
              {order.items?.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="item-image">
                    {item.product?.images?.[0] ? (
                      <img
                        src={`http://localhost:3000${item.product.images[0].imagePath}`}
                        alt={item.productName}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <FaBox />
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.productName}</div>
                    <div className="item-meta">
                      <span>SKU: {item.productSku || 'N/A'}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="item-quantity">Qty: {item.quantity}</div>
                  <div className="item-price">{formatCurrency(item.price)}</div>
                  <div className="item-total">{formatCurrency(item.total)}</div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.tax > 0 && (
                <div className="summary-row">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="order-right-column">
          {/* Update Order Status */}
          {canUpdate && (
            <div className="action-card">
              <h3 className="card-title">Update Order Status</h3>
              <div className="form-group">
                <label>Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {(orderStatus === 'shipped' || order.orderStatus === 'shipped') && (
                <div className="form-group">
                  <label>Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="form-control"
                  />
                </div>
              )}

              <button
                className="btn btn-primary btn-block"
                onClick={handleUpdateStatus}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          )}

          {/* Update Payment Status */}
          <div className="action-card">
            <h3 className="card-title">Update Payment Status</h3>
            <div className="form-group">
              <label>Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="form-control"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={handleUpdatePaymentStatus}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Payment'}
            </button>
          </div>

          {/* Cancel Order */}
          {canCancel && !showCancelForm && (
            <div className="action-card">
              <h3 className="card-title">Danger Zone</h3>
              <p className="cancel-warning">
                Cancelling this order will restore product stock quantities.
              </p>
              <button
                className="btn btn-danger btn-block"
                onClick={() => setShowCancelForm(true)}
              >
                <FaTimes />
                Cancel Order
              </button>
            </div>
          )}

          {showCancelForm && (
            <div className="action-card cancel-form">
              <h3 className="card-title">Cancel Order</h3>
              <div className="form-group">
                <label>Cancellation Reason *</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation..."
                  className="form-control"
                  rows="4"
                />
              </div>
              <div className="button-group">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCancelForm(false);
                    setCancelReason('');
                  }}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleCancelOrder}
                  disabled={updating || !cancelReason.trim()}
                >
                  {updating ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="info-card">
            <h3 className="card-title">Additional Information</h3>
            <div className="info-item">
              <label>Tracking Number</label>
              <div className="info-value">
                {order.trackingNumber || 'Not assigned yet'}
              </div>
            </div>
            {order.deliveredAt && (
              <div className="info-item">
                <label>Delivered At</label>
                <div className="info-value">{formatDate(order.deliveredAt)}</div>
              </div>
            )}
            {order.cancelReason && (
              <div className="info-item">
                <label>Cancel Reason</label>
                <div className="info-value cancel-reason">{order.cancelReason}</div>
              </div>
            )}
            {order.notes && (
              <div className="info-item">
                <label>Order Notes</label>
                <div className="info-value">{order.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
