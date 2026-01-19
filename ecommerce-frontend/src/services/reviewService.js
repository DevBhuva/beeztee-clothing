import api from './api';

const reviewService = {
  // Add new review
  addReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update own review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete own review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's review for product
  getUserReviewForProduct: async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${productId}/user`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check if user can review product
  canUserReview: async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${productId}/can-review`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all reviews
  getAllReviews: async (params = {}) => {
    try {
      const response = await api.get('/reviews/admin/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Update review status
  updateReviewStatus: async (reviewId, status) => {
    try {
      const response = await api.patch(`/reviews/admin/${reviewId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Add response to review
  addAdminResponse: async (reviewId, response) => {
    try {
      const result = await api.post(`/reviews/admin/${reviewId}/response`, { response });
      return result.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Delete review
  deleteReviewAdmin: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/admin/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default reviewService;
