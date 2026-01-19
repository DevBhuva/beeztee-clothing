import api from './api';

const brandService = {
  // Get all brands
  getAllBrands: async (params = {}) => {
    const response = await api.get('/brands', { params });
    return response.data;
  },

  // Get brand by ID
  getBrandById: async (id) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Get brand by slug
  getBrandBySlug: async (slug) => {
    const response = await api.get(`/brands/slug/${slug}`);
    return response.data;
  },

  // Create brand with logo
  createBrand: async (brandData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(brandData).forEach(key => {
      if (brandData[key] !== null && brandData[key] !== undefined) {
        formData.append(key, brandData[key]);
      }
    });

    const response = await api.post('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update brand with logo
  updateBrand: async (id, brandData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(brandData).forEach(key => {
      if (brandData[key] !== null && brandData[key] !== undefined) {
        formData.append(key, brandData[key]);
      }
    });

    const response = await api.put(`/brands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },

  // Toggle brand status
  toggleBrandStatus: async (id) => {
    const response = await api.patch(`/brands/status/${id}`);
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await api.patch(`/brands/featured/${id}`);
    return response.data;
  }
};

export default brandService;
