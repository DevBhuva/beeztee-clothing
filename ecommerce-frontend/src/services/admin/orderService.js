import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin/orders';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

/**
 * Get all orders with pagination, search, and filters
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      ...getAuthHeaders(),
      params
    });
    return response.data;
  } catch (error) {
    console.error('Get all orders error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Get order by ID error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, orderStatus, trackingNumber = null) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderId}/status`,
      { orderStatus, trackingNumber },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (orderId, paymentStatus, paymentId = null) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderId}/payment-status`,
      { paymentStatus, paymentId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Update payment status error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId, cancelReason) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderId}/cancel`,
      { cancelReason },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Cancel order error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Download invoice PDF
 */
export const downloadInvoice = async (orderId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/${orderId}/invoice`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { status: true, message: 'Invoice downloaded successfully' };
  } catch (error) {
    console.error('Download invoice error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (period = '30') => {
  try {
    const response = await axios.get(`${API_URL}/stats`, {
      ...getAuthHeaders(),
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Get order stats error:', error);
    throw error.response?.data || error;
  }
};

const adminOrderService = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  downloadInvoice,
  getOrderStats
};

export default adminOrderService;
