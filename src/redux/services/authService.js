import axios from '../../utils/axiosConfig';

// Register user
const register = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post('/api/auth/login', userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Get user profile
const getProfile = async () => {
  const response = await axios.get('/api/auth/profile');
  return response.data.user;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  getProfile,
  logout,
};

export default authService;