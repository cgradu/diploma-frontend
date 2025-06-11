// axiosConfig.js
import axios from 'axios';

const baseURL = process.env.EXPRESS_APP_API_URL || 'http://localhost:4700';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add token if not already present
    if (!config.headers.Authorization) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    
    // Add request ID to track duplicate requests in development
    if (process.env.NODE_ENV === 'development') {
      config.metadata = { startTime: new Date() };
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development' && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }
    
    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);
    }
    
    // Only handle 401 errors if they're not from the login endpoint
    // and prevent infinite loops
    if (
      error.response && 
      error.response.status === 401 && 
      !error.config.url.includes('/auth/login') &&
      !error.config._retry // Prevent infinite retry loop
    ) {
      // Mark this request as retried
      error.config._retry = true;
      
      // Clear user data
      localStorage.removeItem('user');
      
      // Dispatch custom event for auth error
      const event = new CustomEvent('authError', { 
        detail: { 
          error: error.response,
          message: 'Your session has expired. Please log in again.'
        } 
      });
      window.dispatchEvent(event);
      
      // Redirect to login after a short delay to avoid immediate redirect
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 1000);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;