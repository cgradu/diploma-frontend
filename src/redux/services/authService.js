// src/redux/services/authService.js
import axios from '../../utils/axiosConfig';

// Register user
const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Get user profile
const getProfile = async () => {
  const response = await axios.get('/auth/profile');
  return response.data.user;
};

// Update user profile general information
const updateProfile = async (profileData) => {
  const response = await axios.put('/auth/profile', profileData);
  
  // Update local storage with new user data while preserving the token
  if (response.data) { 
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...currentUser,
      ...response.data.user,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  return response.data.user;
};

// Update user profile details (charity or donor specific)
const updateProfileDetails = async (detailsData) => {
  const response = await axios.put('/auth/profile/details', detailsData);
  
  // Update local storage with new user data while preserving the token
  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...currentUser,
      ...response.data.user,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  return response.data.user;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await axios.put('/auth/password', passwordData);
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileDetails,
  changePassword,
  logout,
};

export default authService;