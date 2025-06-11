// src/redux/slices/donationSlice.js
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import donationService from '../services/donationService';

// Create a payment intent
export const createPaymentIntent = createAsyncThunk(
  'donation/createPaymentIntent',
  async (donationData, thunkAPI) => {
    try {
      const response = await donationService.createPaymentIntent(donationData);
      console.log('Payment intent created:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error creating payment intent:', error); // Debug log
      const message = 
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to create payment intent';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Confirm a payment
export const confirmPayment = createAsyncThunk(
  'donation/confirmPayment',
  async (paymentData, thunkAPI) => {
    try {
      return await donationService.confirmPayment(paymentData);
    } catch (error) {
      const message = 
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to confirm payment';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get blockchain verification
export const getBlockchainVerification = createAsyncThunk(
  'donation/getBlockchainVerification',
  async (donationId, thunkAPI) => {
    try {
      return await donationService.getBlockchainVerification(donationId);
    } catch (error) {
      const message = 
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to get blockchain verification';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get donation history
export const getDonationHistory = createAsyncThunk(
  'donation/getDonationHistory',
  async (_, thunkAPI) => {
    try {
      return await donationService.getDonationHistory();
    } catch (error) {
      const message = 
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to get donation history';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get donation details
export const getDonationDetails = createAsyncThunk(
  'donation/getDonationDetails',
  async (donationId, thunkAPI) => {
    try {
      return await donationService.getDonationDetails(donationId);
    } catch (error) {
      const message = 
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to get donation details';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Action to get donor dashboard stats
export const getDonorDashboardStats = createAsyncThunk(
  'donations/getDonorDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await donationService.getDonorDashboardStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch donor stats');
    }
  }
);

// Get charity donation statistics
export const getCharityDonationStats = createAsyncThunk(
  'donation/getCharityDonationStats',
  async (charityId, thunkAPI) => {
    try {
      return await donationService.getCharityDonationStats(charityId);
    } catch (error) {
      const message = 
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to get charity donation statistics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  currentDonation: null,
  donationHistory: [],
  selectedDonation: null,
  clientSecret: null,
  donationId: null,
  donorStats: null,
  paymentIntentId: null,
  blockchainVerification: null,
  charityStats: null,
  isLoading: false,
  isLoadingDonorStats: false,
  isRendering: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Create the donation slice
const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    resetDonationState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentDonation: (state) => {
      state.currentDonation = null;
      state.clientSecret = null;
      state.donationId = null;
      state.paymentIntentId = null;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setRendering: (state, action) => {
    state.isRendering = action.payload;
  }
  },
  extraReducers: (builder) => {   
    builder
      // Create payment intent cases
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        console.log('Payment intent response:', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.clientSecret = action.payload.clientSecret;
        state.donationId = action.payload.donationId;
        state.paymentIntentId = action.payload.paymentIntentId;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Confirm payment cases
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.currentDonation = action.payload.donation;
        state.message = action.payload.message;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false; 
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get blockchain verification cases
      .addCase(getBlockchainVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlockchainVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blockchainVerification = action.payload;
      })
      .addCase(getBlockchainVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      
      // Get donation history cases
      .addCase(getDonationHistory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getDonationHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.donationHistory = action.payload;
      })
      .addCase(getDonationHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get donation details cases
      .addCase(getDonationDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getDonationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.selectedDonation = action.payload;
      })
      .addCase(getDonationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get charity donation statistics cases
      .addCase(getCharityDonationStats.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getCharityDonationStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.charityStats = action.payload;
      })
      .addCase(getCharityDonationStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })      .addCase(getDonorDashboardStats.pending, (state) => {
        state.isLoadingDonorStats = true;
        state.error = null;
      })
      .addCase(getDonorDashboardStats.fulfilled, (state, action) => {
        state.isLoadingDonorStats = false;
        state.donorStats = action.payload;
      })
      .addCase(getDonorDashboardStats.rejected, (state, action) => {
        state.isLoadingDonorStats = false;
        state.error = action.payload;
      });
  }
});

export const { resetDonationState, clearCurrentDonation, setLoading } = donationSlice.actions;
export default donationSlice.reducer;