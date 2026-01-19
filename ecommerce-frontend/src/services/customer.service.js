import axios from 'axios';

const API_URL = 'http://localhost:3000/api/customers';

// Get all customers with filters
export const getCustomers = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single customer by ID
export const getCustomer = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(API_URL, customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update customer status
export const updateCustomerStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get customer statistics
export const getCustomerStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
