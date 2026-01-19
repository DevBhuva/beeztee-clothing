import axios from 'axios';

const API_URL = 'http://localhost:3000/api/site-settings';

// Get site settings
export const getSettings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update site settings
export const updateSettings = async (settingsData) => {
  try {
    const response = await axios.put(API_URL, settingsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reset settings to default
export const resetSettings = async () => {
  try {
    const response = await axios.post(`${API_URL}/reset`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
