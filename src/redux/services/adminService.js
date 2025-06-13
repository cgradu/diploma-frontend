// src/redux/services/adminService.js
import axios from '../../utils/axiosConfig';

// Dashboard and analytics
const getDashboardStats = async () => {
  try {
    const response = await axios.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

const getAnalytics = async (timeframe = '30d') => {
  try {
    const response = await axios.get(`/admin/analytics?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

const getSystemHealth = async () => {
  try {
    const response = await axios.get('/admin/system/health');
    return response.data;
  } catch (error) {
    console.error('Error getting system health:', error);
    throw error;
  }
};

// User management
const getAllUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`/admin/users?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting user ${id}:`, error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const response = await axios.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

const deleteUser = async (id, force = false) => {
  try {
    const url = force ? 
      `/admin/users/${id}?force=true` : `/admin/users/${id}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

const bulkUpdateUsers = async (userIds, updateData) => {
  try {
    const response = await axios.put('/admin/users/bulk', { userIds, updateData });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating users:', error);
    throw error;
  }
};

const bulkDeleteUsers = async (userIds) => {
  try {
    const response = await axios.delete('/admin/users/bulk', { data: { userIds } });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    throw error;
  }
};

// Charity management
const getAllCharitiesAdmin = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`/admin/charities?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting all charities:', error);
    throw error;
  }
};

const updateCharityAdmin = async (id, charityData) => {
  try {
    const response = await axios.put(`/admin/charities/${id}`, charityData);
    return response.data;
  } catch (error) {
    console.error(`Error updating charity ${id}:`, error);
    throw error;
  }
};

const deleteCharity = async (id) => {
  try {
    const response = await axios.delete(`/admin/charities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting charity ${id}:`, error);
    throw error;
  }
};

const bulkDeleteCharities = async (charityIds) => {
  try {
    const response = await axios.delete('/admin/charities/bulk', { 
      data: { charityIds } 
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting charities:', error);
    throw error;
  }
};

const bulkUpdateCharities = async (charityIds, updateData) => {
  try {
    const response = await axios.put('/admin/charities/bulk', { 
      charityIds, 
      updateData 
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating charities:', error);
    throw error;
  }
};

const transferCharityManagement = async (charityId, newManagerId) => {
  try {
    const response = await axios.post('/admin/charities/transfer', {
      charityId,
      newManagerId
    });
    return response.data;
  } catch (error) {
    console.error('Error transferring charity management:', error);
    throw error;
  }
};

// Project management
const getAllProjectsAdmin = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`/admin/projects?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
};

const updateProjectAdmin = async (id, projectData) => {
  try {
    const response = await axios.put(`/admin/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
};

const deleteProjectAdmin = async (id) => {
  try {
    const response = await axios.delete(`/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
};

// Donation management
const getAllDonationsAdmin = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`/admin/donations?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting all donations:', error);
    throw error;
  }
};

const updateDonationAdmin = async (id, donationData) => {
  try {
    const response = await axios.put(`/admin/donations/${id}`, donationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating donation ${id}:`, error);
    throw error;
  }
};

// Blockchain verification management
const getAllVerificationsAdmin = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`/admin/verifications?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting all verifications:', error);
    throw error;
  }
};

const updateVerificationAdmin = async (id, verificationData) => {
  try {
    const response = await axios.put(`/admin/verifications/${id}`, verificationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating verification ${id}:`, error);
    throw error;
  }
};

const deleteVerificationAdmin = async (id) => {
  try {
    const response = await axios.delete(`/admin/verifications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting verification ${id}:`, error);
    throw error;
  }
};

// Advanced search
const advancedSearch = async (searchParams) => {
  try {
    const response = await axios.post('/admin/search', searchParams);
    return response.data;
  } catch (error) {
    console.error('Error performing advanced search:', error);
    throw error;
  }
};

// Export data
const exportData = async (exportParams) => {
  try {
    const response = await axios.get('/admin/export', {
      params: exportParams,
      responseType: exportParams.format === 'csv' ? 'blob' : 'json'
    });
    
    // Handle CSV download
    if (exportParams.format === 'csv') {
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportParams.entity}-export.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'CSV downloaded successfully' };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

const adminService = {
  // Dashboard
  getDashboardStats,
  getAnalytics,
  getSystemHealth,
  
  // Users
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  bulkUpdateUsers,
  bulkDeleteUsers,
  
  // Charities
  getAllCharitiesAdmin,
  updateCharityAdmin,
  deleteCharity,
  bulkDeleteCharities,
  bulkUpdateCharities,
  transferCharityManagement,
  
  // Projects
  getAllProjectsAdmin,
  updateProjectAdmin,
  deleteProjectAdmin,
  
  // Donations
  getAllDonationsAdmin,
  updateDonationAdmin,
  
  // Verifications
  getAllVerificationsAdmin,
  updateVerificationAdmin,
  deleteVerificationAdmin,
  
  // Utilities
  advancedSearch,
  exportData
};

export default adminService;