import React from 'react';
import './OrderStatusBadge.css';

const OrderStatusBadge = ({ status, type = 'order' }) => {
  const getOrderStatusClass = (status) => {
    const statusMap = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
      returned: 'status-returned'
    };
    return statusMap[status] || 'status-default';
  };

  const getPaymentStatusClass = (status) => {
    const statusMap = {
      pending: 'payment-pending',
      paid: 'payment-paid',
      failed: 'payment-failed',
      refunded: 'payment-refunded'
    };
    return statusMap[status] || 'payment-default';
  };

  const formatLabel = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const className = type === 'payment' 
    ? `order-status-badge ${getPaymentStatusClass(status)}`
    : `order-status-badge ${getOrderStatusClass(status)}`;

  return (
    <span className={className}>
      {formatLabel(status)}
    </span>
  );
};

export default OrderStatusBadge;
