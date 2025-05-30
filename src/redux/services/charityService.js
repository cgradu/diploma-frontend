// src/redux/services/charityService.js
import axios from '../../utils/axiosConfig';

// Get all charities with optional filtering and pagination
// Get all charities with optional filtering and pagination
const getCharities = async (params = {}) => {
  try {
    const { page, limit, search = '', category = '', all = false } = params;
    
    // Build the query string with only defined parameters
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);
    if (category && category !== 'All Categories') queryParams.append('category', category);
    if (all) queryParams.append('all', 'true');
    
    const queryString = queryParams.toString();
    const url = `/charities${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching charities with URL:', url);
    
    const response = await axios.get(url);
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

// Get charity managed by the logged-in user
const getManagerCharity = async () => {
  try {
    const response = await axios.get('/charities/managed');
    return response.data.data;
  } catch (error) {
    console.error('Error getting managed charity:', error);
    throw error;
  }
};

// Get charity categories
const getCategories = async () => {
  try {
    // Note this endpoint is now /charities/categories
    const response = await axios.get('/charities/categories');
    console.log('Charity categories received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error getting charity categories:', error);
    throw error;
  }
};

// Get charity projects
const getCharityProjects = async (charityId) => {
  try {
    const response = await axios.get(`/projects?charityId=${charityId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting projects for charity ${charityId}:`, error);
    throw error;
  }
};

// Create new charity (for charity managers)
const createCharity = async (charityData) => {
  try {
    const response = await axios.post('/charities', charityData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating charity:', error);
    throw error;
  }
};

// Update charity information
const updateCharity = async (id, charityData) => {
  try {
    const response = await axios.put(`/charities/${id}`, charityData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating charity ${id}:`, error);
    throw error;
  }
};

// Update charity details directly with charity data
const updateCharityDetails = async (charityData) => {
  try {
    const response = await axios.put(`/charities/${charityData.id}`, charityData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating charity ${charityData.id}:`, error);
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
    
    const response = await axios.get(`/donations?charityId=${charityId}&${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting donation history for charity ${charityId}:`, error);
    throw error;
  }
};


// Verify blockchain transaction for a donation
const verifyBlockchainTransaction = async (transactionHash) => {
  try {
    const response = await axios.get(`/blockchain/verify/${transactionHash}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error verifying blockchain transaction ${transactionHash}:`, error);
    throw error;
  }
};

// Get blockchain verification details for a donation
const getBlockchainVerification = async (donationId) => {
  try {
    const response = await axios.get(`/blockchain/donation/${donationId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting blockchain verification for donation ${donationId}:`, error);
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
  getManagerCharity,
  getCategories,
  getCharityProjects,
  getDonationHistory,
  addToFavorites,
  removeFromFavorites,
  checkFavorite,
  createCharity,
  updateCharity,
  updateCharityDetails,
  verifyBlockchainTransaction,
  getBlockchainVerification
};

export default charityService;