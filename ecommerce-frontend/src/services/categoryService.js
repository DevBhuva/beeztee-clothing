import api from './api';
import { USE_DEMO_PRODUCTS } from '../config/demo';
import { demoCategoriesBody } from './demoCatalogService';
import { DEMO_CATEGORIES } from '../data/demoCatalog';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    if (USE_DEMO_PRODUCTS) return demoCategoriesBody();
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    if (USE_DEMO_PRODUCTS) {
      const category = DEMO_CATEGORIES.find((c) => Number(c.id) === Number(id));
      return {
        status: true,
        statusCode: 200,
        data: category || null,
      };
    }
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category with image
  createCategory: async (categoryData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== null && categoryData[key] !== undefined) {
        formData.append(key, categoryData[key]);
      }
    });

    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update category with image
  updateCategory: async (id, categoryData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== null && categoryData[key] !== undefined) {
        formData.append(key, categoryData[key]);
      }
    });

    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Toggle category status
  toggleStatus: async (id) => {
    const response = await api.patch(`/categories/status/${id}`);
    return response.data;
  }
};

export default categoryService;
