// src/redux/slices/charitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import charityService from '../services/charityService';

// Get charities with optional filtering
export const getCharities = createAsyncThunk(
  'charities/getCharities',
  async (params = {}, thunkAPI) => {
    try {
      console.log('Fetching charities with params:', params);
      return await charityService.getCharities(params);
    } catch (error) {
      console.error('Error fetching charities:', error);
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get charity details by ID
export const getCharityById = createAsyncThunk(
  'charities/getCharityById',
  async (id, thunkAPI) => {
    try {
      return await charityService.getCharityById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get charity categories
export const getCategories = createAsyncThunk(
  'charities/getCategories',
  async (_, thunkAPI) => {
    try {
      return await charityService.getCategories();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  charities: [],
  charity: null,
  categories: ['All Categories'], // Default to include "All Categories"
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
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
    },
    clearCharity: (state) => {
      state.charity = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get charities cases
      .addCase(getCharities.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCharities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Check the structure of the response
        console.log('Charities response:', action.payload);
        
        if (action.payload && action.payload.charities) {
          // Handle response structure from service: { charities: [], pagination: {} }
          state.charities = action.payload.charities;
          state.pagination = action.payload.pagination;
        } else {
          // Fallback in case the response structure is different
          state.charities = action.payload || [];
          // Preserve pagination if possible
          if (action.payload && action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        }
      })
      .addCase(getCharities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // Clear charities when error occurs to avoid showing stale data
        state.charities = [];
      })
      
      // Get charity by ID cases
      .addCase(getCharityById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCharityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.charity = action.payload;
      })
      .addCase(getCharityById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.charity = null;
      })
      
      // Get categories cases
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Handle categories
        if (action.payload && Array.isArray(action.payload)) {
          // Add "All Categories" if not already included
          if (!action.payload.includes('All Categories')) {
            state.categories = ['All Categories', ...action.payload];
          } else {
            state.categories = action.payload;
          }
        }
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCharity } = charitySlice.actions;
export default charitySlice.reducer;