import api from './api';

/**
 * Admin Statistics Service
 * Handles API calls for admin dashboard statistics
 */

/**
 * Get comprehensive dashboard statistics
 * @returns {Promise} Promise with stats data
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get quick stats (lightweight, for frequent polling)
 * @returns {Promise} Promise with quick stats data
 */
export const getQuickStats = async () => {
  try {
    const response = await api.get('/admin/stats/quick');
    return response.data;
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getQuickStats
};
