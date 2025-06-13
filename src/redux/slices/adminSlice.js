// src/redux/slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../services/adminService';

const initialState = {
  // Dashboard data
  dashboardStats: null,
  analytics: null,
  systemHealth: null,
  
  // Entity data
  users: [],
  charities: [],
  projects: [],
  donations: [],
  verifications: [],
  
  // Pagination
  pagination: {
    users: { page: 1, limit: 10, total: 0, totalPages: 0 },
    charities: { page: 1, limit: 10, total: 0, totalPages: 0 },
    projects: { page: 1, limit: 10, total: 0, totalPages: 0 },
    donations: { page: 1, limit: 10, total: 0, totalPages: 0 },
    verifications: { page: 1, limit: 10, total: 0, totalPages: 0 }
  },
  
  // UI states
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  
  // Modal/dialog states
  selectedEntity: null,
  editMode: false,
  deleteConfirmOpen: false,
  bulkActions: {
    selectedIds: [],
    isOpen: false
  }
};

// Dashboard actions
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, thunkAPI) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (timeframe, thunkAPI) => {
    try {
      return await adminService.getAnalytics(timeframe);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSystemHealth = createAsyncThunk(
  'admin/getSystemHealth',
  async (_, thunkAPI) => {
    try {
      return await adminService.getSystemHealth();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// User management actions
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, thunkAPI) => {
    try {
      return await adminService.getAllUsers(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (id, thunkAPI) => {
    try {
      return await adminService.getUserById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, thunkAPI) => {
    try {
      return await adminService.createUser(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, userData }, thunkAPI) => {
    try {
      return await adminService.updateUser(id, userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async ({ id, force = false }, thunkAPI) => {
    try {
      await adminService.deleteUser(id, force);
      return { id, force };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bulkUpdateUsers = createAsyncThunk(
  'admin/bulkUpdateUsers',
  async ({ userIds, updateData }, thunkAPI) => {
    try {
      return await adminService.bulkUpdateUsers(userIds, updateData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  'admin/bulkDeleteUsers',
  async (userIds, thunkAPI) => {
    try {
      await adminService.bulkDeleteUsers(userIds);
      return { userIds };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Charity management actions
export const getAllCharitiesAdmin = createAsyncThunk(
  'admin/getAllCharitiesAdmin',
  async (params, thunkAPI) => {
    try {
      return await adminService.getAllCharitiesAdmin(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCharityAdmin = createAsyncThunk(
  'admin/updateCharityAdmin',
  async ({ id, charityData }, thunkAPI) => {
    try {
      return await adminService.updateCharityAdmin(id, charityData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteCharity = createAsyncThunk(
  'admin/deleteCharity',
  async (id, thunkAPI) => {
    try {
      await adminService.deleteCharity(id);
      return { id };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Project management actions
export const getAllProjectsAdmin = createAsyncThunk(
  'admin/getAllProjectsAdmin',
  async (params, thunkAPI) => {
    try {
      return await adminService.getAllProjectsAdmin(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProjectAdmin = createAsyncThunk(
  'admin/updateProjectAdmin',
  async ({ id, projectData }, thunkAPI) => {
    try {
      return await adminService.updateProjectAdmin(id, projectData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProjectAdmin = createAsyncThunk(
  'admin/deleteProjectAdmin',
  async (id, thunkAPI) => {
    try {
      await adminService.deleteProjectAdmin(id);
      return { id };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Donation management actions
export const getAllDonationsAdmin = createAsyncThunk(
  'admin/getAllDonationsAdmin',
  async (params, thunkAPI) => {
    try {
      return await adminService.getAllDonationsAdmin(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateDonationAdmin = createAsyncThunk(
  'admin/updateDonationAdmin',
  async ({ id, donationData }, thunkAPI) => {
    try {
      return await adminService.updateDonationAdmin(id, donationData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Blockchain verification actions
export const getAllVerificationsAdmin = createAsyncThunk(
  'admin/getAllVerificationsAdmin',
  async (params, thunkAPI) => {
    try {
      return await adminService.getAllVerificationsAdmin(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateVerificationAdmin = createAsyncThunk(
  'admin/updateVerificationAdmin',
  async ({ id, verificationData }, thunkAPI) => {
    try {
      return await adminService.updateVerificationAdmin(id, verificationData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteVerificationAdmin = createAsyncThunk(
  'admin/deleteVerificationAdmin',
  async (id, thunkAPI) => {
    try {
      await adminService.deleteVerificationAdmin(id);
      return { id };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Advanced search
export const advancedSearch = createAsyncThunk(
  'admin/advancedSearch',
  async (searchParams, thunkAPI) => {
    try {
      return await adminService.advancedSearch(searchParams);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bulkDeleteCharities = createAsyncThunk(
  'admin/bulkDeleteCharities',
  async (charityIds, thunkAPI) => {
    try {
      await adminService.bulkDeleteCharities(charityIds);
      return { charityIds };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bulkUpdateCharities = createAsyncThunk(
  'admin/bulkUpdateCharities',
  async ({ charityIds, updateData }, thunkAPI) => {
    try {
      return await adminService.bulkUpdateCharities(charityIds, updateData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Export data
export const exportData = createAsyncThunk(
  'admin/exportData',
  async (exportParams, thunkAPI) => {
    try {
      return await adminService.exportData(exportParams);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setSelectedEntity: (state, action) => {
      state.selectedEntity = action.payload;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setDeleteConfirmOpen: (state, action) => {
      state.deleteConfirmOpen = action.payload;
    },
    toggleBulkSelection: (state, action) => {
      const id = action.payload;
      const index = state.bulkActions.selectedIds.indexOf(id);
      if (index > -1) {
        state.bulkActions.selectedIds.splice(index, 1);
      } else {
        state.bulkActions.selectedIds.push(id);
      }
    },
    clearBulkSelection: (state) => {
      state.bulkActions.selectedIds = [];
    },
    setBulkActionsOpen: (state, action) => {
      state.bulkActions.isOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardStats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Analytics
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.data;
      })
      
      // System health
      .addCase(getSystemHealth.fulfilled, (state, action) => {
        state.systemHealth = action.payload.data;
      })
      
      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data.users;
        state.pagination.users = action.payload.data.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(createUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.users.unshift(action.payload.data);
        state.message = 'User created successfully';
      })
      
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.users.findIndex(user => user.id === action.payload.data.id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
        state.message = 'User updated successfully';
      })
      
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.users = state.users.filter(user => user.id !== action.payload.id);
        state.message = 'User deleted successfully';
      })
      
      .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.users = state.users.filter(user => !action.payload.userIds.includes(user.id));
        state.bulkActions.selectedIds = [];
        state.message = 'Users deleted successfully';
      })
      
      // Charities
      .addCase(getAllCharitiesAdmin.fulfilled, (state, action) => {
        state.charities = action.payload.data.charities;
        state.pagination.charities = action.payload.data.pagination;
      })
      
      .addCase(updateCharityAdmin.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.charities.findIndex(charity => charity.id === action.payload.data.id);
        if (index !== -1) {
          state.charities[index] = action.payload.data;
        }
        state.message = 'Charity updated successfully';
      })
      
      .addCase(deleteCharity.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.charities = state.charities.filter(charity => charity.id !== action.payload.id);
        state.message = 'Charity deleted successfully';
      })
      
      // Projects
      .addCase(getAllProjectsAdmin.fulfilled, (state, action) => {
        state.projects = action.payload.data.projects;
        state.pagination.projects = action.payload.data.pagination;
      })
      
      .addCase(updateProjectAdmin.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.projects.findIndex(project => project.id === action.payload.data.id);
        if (index !== -1) {
          state.projects[index] = action.payload.data;
        }
        state.message = 'Project updated successfully';
      })
      
      .addCase(deleteProjectAdmin.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.projects = state.projects.filter(project => project.id !== action.payload.id);
        state.message = 'Project deleted successfully';
      })
      
      // Donations
      .addCase(getAllDonationsAdmin.fulfilled, (state, action) => {
        state.donations = action.payload.data.donations;
        state.pagination.donations = action.payload.data.pagination;
      })
      
      .addCase(updateDonationAdmin.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.donations.findIndex(donation => donation.id === action.payload.data.id);
        if (index !== -1) {
          state.donations[index] = action.payload.data;
        }
        state.message = 'Donation updated successfully';
      })
      
      // Verifications
      .addCase(getAllVerificationsAdmin.fulfilled, (state, action) => {
        state.verifications = action.payload.data.verifications;
        state.pagination.verifications = action.payload.data.pagination;
      })
      
      .addCase(updateVerificationAdmin.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.verifications.findIndex(verification => verification.id === action.payload.data.id);
        if (index !== -1) {
          state.verifications[index] = action.payload.data;
        }
        state.message = 'Verification updated successfully';
      })
      .addCase(deleteVerificationAdmin.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.verifications = state.verifications.filter(verification => verification.id !== action.payload.id);
        state.message = 'Verification deleted successfully';
      })
      .addCase(bulkDeleteCharities.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.charities = state.charities.filter(charity => !action.payload.charityIds.includes(charity.id));
        state.bulkActions.selectedIds = [];
        state.message = 'Charities deleted successfully';
      })
      .addCase(bulkUpdateCharities.fulfilled, (state, action) => {
        state.isSuccess = true;
        // Update multiple charities in state
        action.payload.data.forEach(updatedCharity => {
          const index = state.charities.findIndex(charity => charity.id === updatedCharity.id);
          if (index !== -1) {
            state.charities[index] = updatedCharity;
          }
        });
        state.bulkActions.selectedIds = [];
        state.message = 'Charities updated successfully';
      });
  },
});

export const { 
  reset, 
  setSelectedEntity, 
  setEditMode, 
  setDeleteConfirmOpen, 
  toggleBulkSelection, 
  clearBulkSelection, 
  setBulkActionsOpen
} = adminSlice.actions;

export default adminSlice.reducer;