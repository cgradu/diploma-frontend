// src/redux/slices/charitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import charityService from '../services/charityService';

// Enhanced error handler
const handleError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  
  // Check different error types
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 
                   error.response.data?.error || 
                   `Server error: ${error.response.status}`;
    console.error(`Server error (${error.response.status}):`, error.response.data);
    return message;
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network error - no response received:', error.request);
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    console.error('Error setting up request:', error.message);
    return error.message || 'An unexpected error occurred';
  }
};

// Get charities with optional filtering and retry logic
export const getCharities = createAsyncThunk(
  'charities/getCharities',
  async (params = {}, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log('🔍 Fetching charities with params:', params);
      console.log('🔍 Current user state:', getState().auth.user ? 'Authenticated' : 'Not authenticated');
      
      const result = await charityService.getCharities(params);
      console.log('✅ Charities fetched successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = handleError(error, 'getCharities');
      return rejectWithValue(errorMessage);
    }
  }
);

// Get charity details by ID with caching
export const getCharityById = createAsyncThunk(
  'charities/getCharityById',
  async (id, { rejectWithValue, getState }) => {
    try {
      console.log(`🔍 Fetching charity with ID: ${id}`);
      
      // Check if we already have this charity in state
      const currentCharity = getState().charities.charity;
      if (currentCharity && currentCharity.id === parseInt(id)) {
        console.log('📦 Using cached charity data');
        return currentCharity;
      }
      
      const result = await charityService.getCharityById(id);
      console.log('✅ Charity fetched successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = handleError(error, 'getCharityById');
      return rejectWithValue(errorMessage);
    }
  }
);

// Get charity categories with fallback
export const getCategories = createAsyncThunk(
  'charities/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching charity categories');
      const result = await charityService.getCategories();
      console.log('✅ Categories fetched successfully:', result);
      return result;
    } catch (error) {
      console.warn('⚠️ Failed to fetch categories, using fallback');
      const errorMessage = handleError(error, 'getCategories');
      
      // Return default categories instead of failing completely
      const defaultCategories = [
        'EDUCATION',
        'HEALTHCARE', 
        'ENVIRONMENT',
        'HUMANITARIAN',
        'ANIMAL_WELFARE',
        'ARTS_CULTURE',
        'DISASTER_RELIEF',
        'HUMAN_RIGHTS',
        'COMMUNITY_DEVELOPMENT',
        'RELIGIOUS',
        'OTHER'
      ];
      
      console.log('📦 Using default categories:', defaultCategories);
      return defaultCategories;
    }
  }
);

// Get charity managed by the logged-in user
export const getManagerCharity = createAsyncThunk(
  'charities/getManagerCharity',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('🔍 Fetching manager charity');
      
      // Check if user is authenticated and has charity role
      const user = getState().auth.user;
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      if (user.role !== 'charity' && user.role !== 'admin') {
        return rejectWithValue('User does not have charity management permissions');
      }
      
      const result = await charityService.getManagerCharity();
      console.log('✅ Manager charity fetched successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = handleError(error, 'getManagerCharity');
      return rejectWithValue(errorMessage);
    }
  }
);

// Create charity
export const createCharity = createAsyncThunk(
  'charities/createCharity',
  async (charityData, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating charity:', charityData);
      const result = await charityService.createCharity(charityData);
      console.log('✅ Charity created successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = handleError(error, 'createCharity');
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCharity = createAsyncThunk(
  'charities/deleteCharity',
  async (charityId, { rejectWithValue, getState }) => {
    try {
      // Validate input
      if (!charityId) {
        return rejectWithValue('Charity ID is required');
      }

      console.log('🗑️ Deleting charity:', charityId);
      
      // Check if user has permission (optional check)
      const user = getState().auth.user;
      if (!user) {
        return rejectWithValue('User not authenticated');
      }

      if (user.role !== 'charity' && user.role !== 'admin') {
        return rejectWithValue('Insufficient permissions to delete charity');
      }

      const result = await charityService.deleteCharity(charityId);
      console.log('✅ Charity deleted successfully');
      
      // Return the charity ID for state updates
      return { charityId: parseInt(charityId), ...result };
    } catch (error) {
      const errorMessage = handleError(error, 'deleteCharity');
      return rejectWithValue(errorMessage);
    }
  }
);

// Update charity details
export const updateCharityDetails = createAsyncThunk(
  'charities/updateCharityDetails',
  async (charityData, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating charity details:', charityData);
      const result = await charityService.updateCharityDetails(charityData);
      console.log('✅ Charity updated successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = handleError(error, 'updateCharityDetails');
      return rejectWithValue(errorMessage);
    }
  }
);

// Retry failed requests
export const retryFailedRequest = createAsyncThunk(
  'charities/retryFailedRequest',
  async (action, { dispatch, rejectWithValue }) => {
    try {
      console.log('🔄 Retrying failed request:', action);
      
      switch (action.type) {
        case 'getCharities':
          return await dispatch(getCharities(action.params));
        case 'getCharityById':
          return await dispatch(getCharityById(action.id));
        case 'getCategories':
          return await dispatch(getCategories());
        case 'getManagerCharity':
          return await dispatch(getManagerCharity());
        default:
          throw new Error('Unknown action type for retry');
      }
    } catch (error) {
      return rejectWithValue('Retry failed');
    }
  }
);

// Add reactivate thunk
export const reactivateCharity = createAsyncThunk(
  'charities/reactivateCharity',
  async (charityId, { rejectWithValue }) => {
    try {
      console.log('🔄 Reactivating charity:', charityId);
      const result = await charityService.reactivateCharity(charityId);
      console.log('✅ Charity reactivated successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = handleError(error, 'reactivateCharity');
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchActiveCharities = createAsyncThunk(
  'charities/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const data = await charityService.getActiveCharities();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  charities: [],
  charity: null,
  managerCharity: null,
  categories: ['All Categories'],
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  lastFetch: null, // Track when data was last fetched
  retryCount: 0, // Track retry attempts
  networkError: false // Track if error is network-related
};

export const charitySlice = createSlice({
  name: 'charities',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.networkError = false;
    },
    clearCharity: (state) => {
      state.charity = null;
    },
    resetCharityState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.networkError = false;
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
      state.networkError = false;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create charity cases
      .addCase(createCharity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createCharity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        
        // Handle different response structures
        let newCharity = action.payload;
        if (action.payload?.success && action.payload?.data) {
          newCharity = action.payload.data;
        }
        
        // Set as manager charity since user just created it
        state.managerCharity = newCharity;
        
        // Add to charities array if it exists
        if (state.charities) {
          state.charities.unshift(newCharity);
        }
        
        console.log('✅ Charity created successfully:', newCharity.name);
      })
      .addCase(createCharity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        
        console.error('❌ Failed to create charity:', action.payload);
      })
      
      // Get charities cases
      .addCase(getCharities.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
        state.networkError = false;
      })
      .addCase(getCharities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.retryCount = 0;
        state.lastFetch = Date.now();
        
        console.log('📦 Processing charities response:', action.payload);
        
        // Handle different response structures
        if (action.payload?.success && action.payload?.data) {
          // Backend returns: { success: true, data: { charities: [], pagination: {} } }
          const { charities, pagination } = action.payload.data;
          state.charities = charities || [];
          state.pagination = pagination || state.pagination;
        } else if (action.payload?.charities) {
          // Direct structure: { charities: [], pagination: {} }
          state.charities = action.payload.charities;
          state.pagination = action.payload.pagination || state.pagination;
        } else if (Array.isArray(action.payload)) {
          // Direct array response
          state.charities = action.payload;
        } else {
          // Fallback
          console.warn('⚠️ Unexpected response structure:', action.payload);
          state.charities = [];
        }
        
        console.log(`✅ Loaded ${state.charities.length} charities`);
      })
      .addCase(getCharities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.retryCount += 1;
        
        // Determine if it's a network error
        state.networkError = action.payload?.includes('Network error') || 
                            action.payload?.includes('network') ||
                            action.payload?.includes('connection');
        
        // Don't clear existing charities on network errors (show stale data)
        if (!state.networkError) {
          state.charities = [];
        }
        
        console.error(`❌ Failed to fetch charities (attempt ${state.retryCount}):`, action.payload);
      })
      
      // Get charity by ID cases
      .addCase(getCharityById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getCharityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        
        // Handle different response structures
        if (action.payload?.success && action.payload?.data) {
          state.charity = action.payload.data;
        } else {
          state.charity = action.payload;
        }
        
        console.log('✅ Charity details loaded:', state.charity?.name);
      })
      .addCase(getCharityById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.charity = null;
        
        console.error('❌ Failed to fetch charity details:', action.payload);
      })
      
      // Get categories cases
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        
        // Handle categories response
        let categories = action.payload;
        if (action.payload?.success && action.payload?.data) {
          categories = action.payload.data;
        }
        
        if (Array.isArray(categories)) {
          // Add "All Categories" if not already included
          const hasAllCategories = categories.some(cat => 
            cat === 'All Categories' || cat === 'ALL'
          );
          
          if (!hasAllCategories) {
            state.categories = ['All Categories', ...categories];
          } else {
            state.categories = categories;
          }
        } else {
          console.warn('⚠️ Categories response is not an array:', categories);
          state.categories = ['All Categories'];
        }
        
        console.log('✅ Categories loaded:', state.categories);
      })
      .addCase(getCategories.rejected, (state, action) => {
        // Don't set loading false or error true since we handle this gracefully
        state.isLoading = false;
        console.warn('⚠️ Categories fetch failed, keeping defaults:', action.payload);
      })
      
      // Get Manager Charity cases
      .addCase(getManagerCharity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getManagerCharity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        
        // Handle different response structures
        if (action.payload?.success && action.payload?.data) {
          state.managerCharity = action.payload.data;
        } else {
          state.managerCharity = action.payload;
        }
        
        console.log('✅ Manager charity loaded:', state.managerCharity?.name);
      })
      .addCase(getManagerCharity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.managerCharity = null;
        
        console.error('❌ Failed to fetch manager charity:', action.payload);
      })
      // Update Charity Details cases
      .addCase(updateCharityDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateCharityDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        
        // Handle different response structures
        let updatedCharity = action.payload;
        if (action.payload?.success && action.payload?.data) {
          updatedCharity = action.payload.data;
        }
        
        state.managerCharity = updatedCharity;
        
        // If the updated charity is also the currently viewed charity, update that too
        if (state.charity && state.charity.id === updatedCharity.id) {
          state.charity = updatedCharity;
        }
        
        // Update in the charities array if present
        const index = state.charities.findIndex(charity => charity.id === updatedCharity.id);
        if (index !== -1) {
          state.charities[index] = updatedCharity;
        }
        
        console.log('✅ Charity updated successfully:', updatedCharity.name);
      })
      .addCase(updateCharityDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        
        console.error('❌ Failed to update charity:', action.payload);
      })
      .addCase(deleteCharity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteCharity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = 'Charity deleted successfully';
        
        const deletedCharityId = action.payload.charityId;
        
        // Clear manager charity if it's the one being deleted
        if (state.managerCharity && state.managerCharity.id === deletedCharityId) {
          state.managerCharity = null;
        }
        
        // Clear current charity if it's the one being deleted
        if (state.charity && state.charity.id === deletedCharityId) {
          state.charity = null;
        }
        
        // Remove from charities array
        if (state.charities && Array.isArray(state.charities)) {
          state.charities = state.charities.filter(charity => 
            charity.id !== deletedCharityId
          );
          
          // Update pagination if needed
          if (state.pagination.total > 0) {
            state.pagination.total -= 1;
          }
        }
        
        console.log('✅ Charity deleted from state');
      })
      .addCase(deleteCharity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        
        console.error('❌ Failed to delete charity:', action.payload);
      })
      // Add to extraReducers
      .addCase(reactivateCharity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = 'Charity reactivated successfully';
        
        // Update manager charity status
        if (state.managerCharity) {
          state.managerCharity.status = 'ACTIVE';
          state.managerCharity.deletedAt = null;
          state.managerCharity.canReactivate = false;
        }
        
        console.log('✅ Charity reactivated in state');
      })
      .addCase(fetchActiveCharities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCharities.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCharities = action.payload;
      })
      .addCase(fetchActiveCharities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });;
  },
});

export const { 
  reset, 
  clearCharity, 
  resetCharityState,
  clearError, 
  incrementRetryCount, 
  resetRetryCount 
} = charitySlice.actions;

export default charitySlice.reducer;