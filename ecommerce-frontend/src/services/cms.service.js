import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cms';

// Get all pages (Admin)
export const getAllPages = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
};

// Get active pages (Public)
export const getActivePages = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active pages:', error);
    throw error;
  }
};

// Get footer links (Public)
export const getFooterLinks = async () => {
  try {
    const response = await axios.get(`${API_URL}/footer-links`);
    return response.data;
  } catch (error) {
    console.error('Error fetching footer links:', error);
    throw error;
  }
};

// Get header links (Public)
export const getHeaderLinks = async () => {
  try {
    const response = await axios.get(`${API_URL}/header-links`);
    return response.data;
  } catch (error) {
    console.error('Error fetching header links:', error);
    throw error;
  }
};

// Get page by ID (Admin)
export const getPageById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
};

// Get page by slug (Public)
export const getPageBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
};

// Create page (Admin)
export const createPage = async (pageData) => {
  try {
    const response = await axios.post(API_URL, pageData);
    return response.data;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

// Update page (Admin)
export const updatePage = async (id, pageData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, pageData);
    return response.data;
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

// Delete page (Admin)
export const deletePage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

// Toggle page status (Admin)
export const togglePageStatus = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling page status:', error);
    throw error;
  }
};

export default {
  getAllPages,
  getActivePages,
  getFooterLinks,
  getHeaderLinks,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  togglePageStatus
};
