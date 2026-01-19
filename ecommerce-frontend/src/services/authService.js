import api from './api';

// Admin Authentication
export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login/admin', { email, password });
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user, token };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.',
    };
  }
};

// Customer Authentication
export const customerRegister = async (name, email, phone) => {
  try {
    const response = await api.post('/auth/register/customer', { name, email, phone });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.',
    };
  }
};

export const sendOTP = async (phone) => {
  try {
    const response = await api.post('/auth/login/customer/send-otp', { phone });
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
    };
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    const response = await api.post('/auth/login/customer/verify-otp', { phone, otp });
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user, token };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'OTP verification failed. Please try again.',
    };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ADMIN';
};

// Check if user is customer
export const isCustomer = () => {
  const user = getCurrentUser();
  return user && user.role === 'CUSTOMER';
};
