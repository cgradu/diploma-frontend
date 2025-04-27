// frontend/src/redux/services/projectService.js
import axios from '../../utils/axiosConfig';

// Get all projects with optional filtering
const getAllProjects = async (page = 1, limit = 10, filters = {}) => {
  try {
    // Build query params
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    // Add any filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await axios.get(`/projects?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
};

// Get a project by ID
const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`/projects/${projectId}`);
    console.log('Project response:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};

// Get projects for a specific charity - using the route: /charity/:charityId
const getProjectsByCharityId = async (charityId, status) => {
  try {
    // Build the URL based on the API route you provided
    let url = `/projects/charity/${charityId}`;
    
    // Add status filter as a query parameter if provided
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await axios.get(url);
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching charity projects:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Create a new project
const createProject = async (projectData) => {
  try {
    const response = await axios.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update an existing project
const updateProject = async (projectId, projectData) => {
  try {
    const response = await axios.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Get all possible project statuses
const getProjectStatuses = async () => {
  try {
    const response = await axios.get('/projects/statuses');
    return response.data;
  } catch (error) {
    console.error('Error fetching project statuses:', error);
    throw error;
  }
};

const projectService = {
  getAllProjects,
  getProjectById,
  getProjectsByCharityId,
  createProject,
  updateProject,
  deleteProject,
  getProjectStatuses
};

export default projectService;