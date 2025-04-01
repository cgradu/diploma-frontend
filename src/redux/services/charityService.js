// src/redux/services/charityService.js
import axios from '../../utils/axiosConfig';

// Get all charities with optional filtering
const getCharities = async (params = {}) => {
  try {
    const { page = 1, limit = 6, search = '', category = '' } = params;
    
    // Build the query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);
    if (category && category !== 'All Categories') queryParams.append('category', category);
    
    console.log('Fetching charities with URL:', `/charities?${queryParams.toString()}`);
    
    const response = await axios.get(`/charities?${queryParams.toString()}`);
    console.log('Charity data received:', response.data);
    
    return response.data.data;
  } catch (error) {
    console.error('Error in getCharities service:', error);
    throw error;
  }
};

// Get charity by ID
const getCharityById = async (id) => {
  try {
    const response = await axios.get(`/charities/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting charity with ID ${id}:`, error);
    throw error;
  }
};

// Get charity categories
const getCategories = async () => {
  try {
    // Note this endpoint is now /charities/categories
    const response = await axios.get('/charities/categories');
    return response.data.data;
  } catch (error) {
    console.error('Error getting charity categories:', error);
    throw error;
  }
};

// Get charity projects
const getCharityProjects = async (charityId) => {
  try {
    const response = await axios.get(`/charities/${charityId}/projects`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting projects for charity ${charityId}:`, error);
    throw error;
  }
};

// Get charity donation history (for transparency visualization)
const getDonationHistory = async (charityId, params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    const response = await axios.get(`/charities/${charityId}/donations?${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting donation history for charity ${charityId}:`, error);
    throw error;
  }
};

// Add charity to favorites (for authenticated donors)
const addToFavorites = async (charityId) => {
  try {
    const response = await axios.post(`/donors/favorites/${charityId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error adding charity ${charityId} to favorites:`, error);
    throw error;
  }
};

// Remove charity from favorites
const removeFromFavorites = async (charityId) => {
  try {
    const response = await axios.delete(`/donors/favorites/${charityId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error removing charity ${charityId} from favorites:`, error);
    throw error;
  }
};

// Check if a charity is in user's favorites
const checkFavorite = async (charityId) => {
  try {
    const response = await axios.get(`/donors/favorites/check/${charityId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error checking if charity ${charityId} is favorited:`, error);
    throw error;
  }
};

const charityService = {
  getCharities,
  getCharityById,
  getCategories,
  getCharityProjects,
  getDonationHistory,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
};

export default charityService;