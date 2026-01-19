import api from "./api";

const subcategoryService = {
  // Get all subcategories
  getAllSubcategories: async () => {
    const response = await api.get("/sub-categories");
    return response.data;
  },

  // Get subcategory by ID
  getSubcategoryById: async (id) => {
    const response = await api.get(`/sub-categories/${id}`);
    return response.data;
  },

  // Get subcategories by category ID
  getSubcategoriesByCategoryId: async (categoryId) => {
    const response = await api.get(`/sub-categories/category/${categoryId}`);
    return response.data;
  },

  // Create new subcategory
  createSubcategory: async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description || "");
    formData.append("displayOrder", data.displayOrder || 0);
    formData.append("isActive", data.isActive);
    formData.append("isFeatured", data.isFeatured);

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post("/sub-categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update subcategory
  updateSubcategory: async (id, data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description || "");
    formData.append("displayOrder", data.displayOrder || 0);
    formData.append("isActive", data.isActive);
    formData.append("isFeatured", data.isFeatured);

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.put(`/sub-categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete subcategory
  deleteSubcategory: async (id) => {
    const response = await api.delete(`/sub-categories/${id}`);
    return response.data;
  },

  // Toggle subcategory status
  toggleStatus: async (id) => {
    const response = await api.patch(`/sub-categories/status/${id}`);
    return response.data;
  },
};

export default subcategoryService;
