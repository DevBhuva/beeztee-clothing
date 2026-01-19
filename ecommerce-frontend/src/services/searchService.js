import api from './api';

const searchService = {
  // Global search for products and brands
  globalSearch: async (query, filters = {}) => {
    try {
      const response = await api.get('/search', {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Search products only
  searchProducts: async (query, params = {}) => {
    try {
      const response = await api.get('/products', {
        params: {
          search: query,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Product search error:', error);
      throw error;
    }
  },

  // Search brands only
  searchBrands: async (query, params = {}) => {
    try {
      const response = await api.get('/brands', {
        params: {
          search: query,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Brand search error:', error);
      throw error;
    }
  }
};

export default searchService;
