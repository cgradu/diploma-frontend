// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service methods
const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;