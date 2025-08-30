import axios from 'axios';

// Create axios instance for advanced features
const advancedAPI = axios.create({
  baseURL: "/api/advanced",
});

// Add auth token to all requests
advancedAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced error handling
advancedAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default advancedAPI;