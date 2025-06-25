// redux/slices/donationHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base API URL - adjust according to your setup
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4700';

// Helper function to get auth headers
const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Async thunks for API calls
export const fetchDonationHistory = createAsyncThunk(
  'donationHistory/fetchHistory',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'all',
        charityId,
        projectId,
        startDate,
        endDate,
        verified,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        sortBy,
        sortOrder
      });

      if (charityId) queryParams.append('charityId', charityId.toString());
      if (projectId) queryParams.append('projectId', projectId.toString());
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (verified !== undefined) queryParams.append('verified', verified.toString());

      const response = await fetch(`${API_BASE_URL}/donation/stats?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch donation history');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDonorImpactStats = createAsyncThunk(
  'donationHistory/fetchImpactStats',
  async (timeframe = 'all', { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/impact/stats?timeframe=${timeframe}`, {
        method: 'GET',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch impact statistics');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBlockchainInsights = createAsyncThunk(
  'donationHistory/fetchBlockchainInsights',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/blockchain/insights`, {
        method: 'GET',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch blockchain insights');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDonationDetails = createAsyncThunk(
  'donationHistory/fetchDonationDetails',
  async (donationId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
        method: 'GET',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch donation details');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyDonationOnBlockchain = createAsyncThunk(
  'donationHistory/verifyDonation',
  async (donationId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify donation');
      }

      const data = await response.json();
      return { donationId, verification: data.verification };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVerificationStatus = createAsyncThunk(
  'donationHistory/fetchVerificationStatus',
  async (donationId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}/verification`, {
        method: 'GET',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch verification status');
      }

      const data = await response.json();
      return { donationId, status: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Donation history
  donations: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  
  // Impact statistics
  impactStats: {
    overview: null,
    charityImpact: [],
    categoryImpact: [],
    projectImpact: [],
    timeline: [],
    achievements: []
  },
  
  // Blockchain insights
  blockchainInsights: {
    summary: null,
    transactions: [],
    charityBreakdown: [],
    verificationStatus: null
  },
  
  // Selected donation details
  selectedDonation: null,
  
  // Loading states
  loading: {
    history: false,
    impactStats: false,
    blockchainInsights: false,
    donationDetails: false,
    verification: false
  },
  
  // Error states
  errors: {
    history: null,
    impactStats: null,
    blockchainInsights: null,
    donationDetails: null,
    verification: null
  },
  
  // Filters and preferences
  filters: {
    status: 'all',
    charityId: null,
    projectId: null,
    startDate: null,
    endDate: null,
    verified: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  // UI state
  activeTimeframe: 'all',
  refreshTrigger: 0
};

// Create the slice
const donationHistorySlice = createSlice({
  name: 'donationHistory',
  initialState,
  reducers: {
    // Filter and sorting actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        charityId: null,
        projectId: null,
        startDate: null,
        endDate: null,
        verified: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
    },
    
    setTimeframe: (state, action) => {
      state.activeTimeframe = action.payload;
    },
    
    // Clear selected donation
    clearSelectedDonation: (state) => {
      state.selectedDonation = null;
      state.errors.donationDetails = null;
    },
    
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },
    
    clearAllErrors: (state) => {
      state.errors = {
        history: null,
        impactStats: null,
        blockchainInsights: null,
        donationDetails: null,
        verification: null
      };
    },
    
    // Trigger refresh
    triggerRefresh: (state) => {
      state.refreshTrigger += 1;
    },
    
    // Update donation verification status locally
    updateDonationVerification: (state, action) => {
      const { donationId, verification } = action.payload;
      
      // Update in donations list
      const donationIndex = state.donations.findIndex(d => d.id === donationId);
      if (donationIndex !== -1) {
        state.donations[donationIndex].blockchainVerification = verification;
        state.donations[donationIndex].verificationStatus = verification.verified ? 'VERIFIED' : 'PENDING';
      }
      
      // Update selected donation if it matches
      if (state.selectedDonation && state.selectedDonation.id === donationId) {
        state.selectedDonation.blockchainVerification = verification;
        state.selectedDonation.verificationStatus = verification.verified ? 'VERIFIED' : 'PENDING';
      }
    }
  },
  
  extraReducers: (builder) => {
    // Fetch donation history
    builder
      .addCase(fetchDonationHistory.pending, (state) => {
        state.loading.history = true;
        state.errors.history = null;
      })
      .addCase(fetchDonationHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.donations = action.payload.donations;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDonationHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.errors.history = action.payload;
      });
    
    // Fetch impact statistics
    builder
      .addCase(fetchDonorImpactStats.pending, (state) => {
        state.loading.impactStats = true;
        state.errors.impactStats = null;
      })
      .addCase(fetchDonorImpactStats.fulfilled, (state, action) => {
        state.loading.impactStats = false;
        state.impactStats = action.payload;
      })
      .addCase(fetchDonorImpactStats.rejected, (state, action) => {
        state.loading.impactStats = false;
        state.errors.impactStats = action.payload;
      });
    
    // Fetch blockchain insights
    builder
      .addCase(fetchBlockchainInsights.pending, (state) => {
        state.loading.blockchainInsights = true;
        state.errors.blockchainInsights = null;
      })
      .addCase(fetchBlockchainInsights.fulfilled, (state, action) => {
        state.loading.blockchainInsights = false;
        state.blockchainInsights = action.payload;
      })
      .addCase(fetchBlockchainInsights.rejected, (state, action) => {
        state.loading.blockchainInsights = false;
        state.errors.blockchainInsights = action.payload;
      });
    
    // Fetch donation details
    builder
      .addCase(fetchDonationDetails.pending, (state) => {
        state.loading.donationDetails = true;
        state.errors.donationDetails = null;
      })
      .addCase(fetchDonationDetails.fulfilled, (state, action) => {
        state.loading.donationDetails = false;
        state.selectedDonation = action.payload;
      })
      .addCase(fetchDonationDetails.rejected, (state, action) => {
        state.loading.donationDetails = false;
        state.errors.donationDetails = action.payload;
      });
    
    // Verify donation on blockchain
    builder
      .addCase(verifyDonationOnBlockchain.pending, (state) => {
        state.loading.verification = true;
        state.errors.verification = null;
      })
      .addCase(verifyDonationOnBlockchain.fulfilled, (state, action) => {
        state.loading.verification = false;
        const { donationId, verification } = action.payload;
        
        // Update the donation in the list
        const donationIndex = state.donations.findIndex(d => d.id === donationId);
        if (donationIndex !== -1) {
          state.donations[donationIndex].blockchainVerification = verification;
          state.donations[donationIndex].verificationStatus = verification.verified ? 'VERIFIED' : 'PENDING';
        }
        
        // Update selected donation if it matches
        if (state.selectedDonation && state.selectedDonation.id === donationId) {
          state.selectedDonation.blockchainVerification = verification;
        }
      })
      .addCase(verifyDonationOnBlockchain.rejected, (state, action) => {
        state.loading.verification = false;
        state.errors.verification = action.payload;
      });
    
    // Fetch verification status
    builder
      .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
        const { donationId, status } = action.payload;
        
        // Update donation verification status
        const donationIndex = state.donations.findIndex(d => d.id === donationId);
        if (donationIndex !== -1) {
          state.donations[donationIndex].verificationStatus = status.status;
          if (status.transactionHash) {
            state.donations[donationIndex].blockchainVerification = {
              ...state.donations[donationIndex].blockchainVerification,
              transactionHash: status.transactionHash,
              verified: status.verified,
              explorerUrl: status.explorerUrl
            };
          }
        }
      });
  }
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setTimeframe,
  clearSelectedDonation,
  clearError,
  clearAllErrors,
  triggerRefresh,
  updateDonationVerification
} = donationHistorySlice.actions;

// Selectors
export const selectDonations = (state) => state.donationHistory.donations;
export const selectPagination = (state) => state.donationHistory.pagination;
export const selectImpactStats = (state) => state.donationHistory.impactStats;
export const selectBlockchainInsights = (state) => state.donationHistory.blockchainInsights;
export const selectSelectedDonation = (state) => state.donationHistory.selectedDonation;
export const selectLoading = (state) => state.donationHistory.loading;
export const selectErrors = (state) => state.donationHistory.errors;
export const selectFilters = (state) => state.donationHistory.filters;
export const selectActiveTimeframe = (state) => state.donationHistory.activeTimeframe;

// Complex selectors
export const selectVerifiedDonations = (state) => 
  state.donationHistory.donations.filter(d => d.verificationStatus === 'VERIFIED');

export const selectPendingVerifications = (state) => 
  state.donationHistory.donations.filter(d => d.verificationStatus === 'PENDING');

export const selectUnverifiedDonations = (state) => 
  state.donationHistory.donations.filter(d => d.verificationStatus === 'NOT_VERIFIED');

export const selectTransparencyScore = (state) => {
  const donations = state.donationHistory.donations;
  if (donations.length === 0) return 0;
  
  const verifiedCount = donations.filter(d => d.verificationStatus === 'VERIFIED').length;
  return Math.round((verifiedCount / donations.length) * 100);
};

export const selectTotalDonated = (state) => 
  state.donationHistory.donations.reduce((total, donation) => total + donation.amount, 0);

export const selectCharitiesSupported = (state) => {
  const charityIds = new Set(state.donationHistory.donations.map(d => d.charity.id));
  return charityIds.size;
};

// Export reducer
export default donationHistorySlice.reducer;