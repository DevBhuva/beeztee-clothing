import api from './api';

// Admin Authentication
export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login/admin', { email, password });
    const { token, user } = response.data;
    
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

// Customer Join — step 1: send email OTP
export const sendRegisterOTP = async (name, email, phone) => {
  try {
    const response = await api.post('/auth/register/customer/send-otp', {
      name,
      email,
      phone,
    });
    return { success: true, message: response.data.message, email: response.data.email };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
    };
  }
};

// Customer Join — step 2: verify email OTP (account activates only if OTP matches)
export const verifyRegisterOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/register/customer/verify-otp', { email, otp });
    const { token, user } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { success: true, user, token, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'OTP verification failed. Please try again.',
    };
  }
};

/** @deprecated Direct register without OTP — storefront uses sendRegisterOTP + verifyRegisterOTP */
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

// Customer Login — email OTP only
export const sendOTP = async (email) => {
  try {
    const response = await api.post('/auth/login/customer/send-otp', { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
    };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/login/customer/verify-otp', { email, otp });
    const { token, user } = response.data;
    
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

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

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

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ADMIN';
};

export const isCustomer = () => {
  const user = getCurrentUser();
  return user && user.role === 'CUSTOMER';
};
