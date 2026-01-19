import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const orderService = {
  // Create order from cart
  createOrder: async (shippingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/create`,
        shippingData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get user's orders
  getMyOrders: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/my-orders?page=${page}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${orderId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  // Cancel order
  cancelOrder: async (orderId, cancelReason) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        { cancelReason },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  },

  // Admin: Get all orders
  getAllOrders: async (page = 1, limit = 20, status = null) => {
    try {
      let url = `${API_BASE_URL}/orders/admin/all?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      
      const response = await axios.get(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, updateData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/admin/${orderId}/status`,
        updateData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order' };
    }
  }
};

export default orderService;
