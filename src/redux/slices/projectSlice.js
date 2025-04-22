// frontend/src/redux/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../services/projectService';

// Initial state
const initialState = {
    projects: [],
    project: null,
    statuses: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  };

// Get all projects
export const getAllProjects = createAsyncThunk(
  'projects/getAll',
  async ({ page, limit, filters }, thunkAPI) => {
    try {
      return await projectService.getAllProjects(page, limit, filters);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch projects';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project by ID
export const getProjectById = createAsyncThunk(
  'projects/getById',
  async (id, thunkAPI) => {
    try {
      return await projectService.getProjectById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get projects by charity ID
export const getProjectsByCharityId = createAsyncThunk(
  'projects/getByCharityId',
  async ({ charityId, status }, thunkAPI) => {
    try {
      const response = await projectService.getProjectsByCharityId(charityId, status);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch charity projects';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, thunkAPI) => {
    try {
      return await projectService.createProject(projectData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update a project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, projectData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, thunkAPI) => {
    try {
      return await projectService.deleteProject(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete project';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project statuses
export const getProjectStatuses = createAsyncThunk(
  'projects/getStatuses', 
  async (_, thunkAPI) => {
    try {
      return await projectService.getProjectStatuses();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch project statuses';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Project slice
export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearProject: (state) => {
      state.project = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all projects
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Handle API response structure appropriately
        if (action.payload && action.payload.data) {
          if (action.payload.data.projects) {
            state.projects = action.payload.data.projects;
          }
          if (action.payload.data.pagination) {
            state.pagination = action.payload.data.pagination;
          }
        }
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get project by ID
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Handle API response structure
        if (action.payload && action.payload.data) {
          state.project = action.payload.data;
        }
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get projects by charity ID
      .addCase(getProjectsByCharityId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getProjectsByCharityId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Handle various API response structures
        if (action.payload) {
          if (action.payload.data) {
            // If the API returns { data: [...] }
            state.projects = Array.isArray(action.payload.data) 
              ? action.payload.data 
              : [];
          } else if (Array.isArray(action.payload)) {
            // If the API returns the array directly
            state.projects = action.payload;
            console.log('Received projects:', state.projects);
          } else {
            // Fallback
            state.projects = [];
          }
        } else {
          state.projects = [];
        }
      })
      .addCase(getProjectsByCharityId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create a new project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Add the new project to the projects array
        if (action.payload && action.payload.data) {
          state.projects.unshift(action.payload.data);
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update a project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload && action.payload.data) {
          state.project = action.payload.data;
          
          // Update project in the projects array if it exists
          const index = state.projects.findIndex(p => p.id === action.payload.data.id);
          if (index !== -1) {
            state.projects[index] = action.payload.data;
          }
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete a project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        if (action.payload && action.payload.data) {
          // Remove the deleted project from the projects array
          state.projects = state.projects.filter(
            project => project.id !== action.payload.data.id
          );
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get project statuses
      .addCase(getProjectStatuses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Handle API response structure
        if (action.payload && action.payload.data) {
          state.statuses = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.statuses = action.payload;
        } else {
          state.statuses = [];
        }
      })
      .addCase(getProjectStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearProject } = projectSlice.actions;
export default projectSlice.reducer;