import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/email';

export const sendTestStatusEmail = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/status`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Unknown error occurred';
    console.error('Email API Error:', error);
    throw new Error(errorMessage);
  }
};

export const sendTestCompletionEmail = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/completion`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Unknown error occurred';
    console.error('Email API Error:', error);
    throw new Error(errorMessage);
  }
};
