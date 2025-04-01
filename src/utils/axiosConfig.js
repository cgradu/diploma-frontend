// axiosConfig.js
import axios from 'axios';

const baseURL = process.env.EXPRESS_APP_API_URL || 'http://localhost:4700';
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle 401 errors if they're not from the login endpoint
    if (
      error.response && 
      error.response.status === 401 && 
      !error.config.url.includes('/auth/login')
    ) {
      // Instead of redirecting, dispatch a custom event that your app can listen for
      const event = new CustomEvent('authError', { detail: error.response });
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
