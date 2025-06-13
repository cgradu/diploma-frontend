// frontend/src/store/slices/statsSlice.js - NEW FILE
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig'; // Your existing API service

// Async thunks for API calls
export const fetchHomepageStats = createAsyncThunk(
    'stats/fetchHomepageStats',
    async (_, { rejectWithValue }) => {
        try {
            console.log('📊 Redux: Fetching homepage stats...');
            const response = await api.get('/api/stats/homepage');
            console.log('✅ Redux: Homepage stats fetched successfully');
            return response.data.data; // Extract the data from success response
        } catch (error) {
            console.error('❌ Redux: Homepage stats error:', error);
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to fetch homepage stats'
            );
        }
    }
);

export const fetchDonorStats = createAsyncThunk(
    'stats/fetchDonorStats',
    async (donorId, { rejectWithValue }) => {
        try {
            console.log(`👤 Redux: Fetching donor stats for ${donorId}...`);
            const response = await api.get(`/api/stats/donor/${donorId}`);
            console.log('✅ Redux: Donor stats fetched successfully');
            return response.data.data;
        } catch (error) {
            console.error('❌ Redux: Donor stats error:', error);
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to fetch donor stats'
            );
        }
    }
);

export const fetchCharityStats = createAsyncThunk(
    'stats/fetchCharityStats',
    async (charityId, { rejectWithValue }) => {
        try {
            console.log(`🏢 Redux: Fetching charity stats for ${charityId}...`);
            const response = await api.get(`/api/stats/charity/${charityId}`);
            console.log('✅ Redux: Charity stats fetched successfully');
            return response.data.data;
        } catch (error) {
            console.error('❌ Redux: Charity stats error:', error);
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to fetch charity stats'
            );
        }
    }
);

export const fetchBlockchainStats = createAsyncThunk(
    'stats/fetchBlockchainStats',
    async (_, { rejectWithValue }) => {
        try {
            console.log('⛓️ Redux: Fetching blockchain stats...');
            const response = await api.get('/api/stats/blockchain');
            console.log('✅ Redux: Blockchain stats fetched successfully');
            return response.data.data;
        } catch (error) {
            console.error('❌ Redux: Blockchain stats error:', error);
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to fetch blockchain stats'
            );
        }
    }
);

export const fetchVerificationStatus = createAsyncThunk(
    'stats/fetchVerificationStatus',
    async (donationId, { rejectWithValue }) => {
        try {
            console.log(`🔍 Redux: Fetching verification status for donation ${donationId}...`);
            const response = await api.get(`/api/stats/verification/${donationId}`);
            console.log('✅ Redux: Verification status fetched successfully');
            return {
                donationId,
                status: response.data.data
            };
        } catch (error) {
            console.error('❌ Redux: Verification status error:', error);
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to fetch verification status'
            );
        }
    }
);

const initialState = {
    homepage: {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null
    },
    donor: {
        data: null,
        loading: false,
        error: null,
        currentDonorId: null
    },
    charity: {
        data: null,
        loading: false,
        error: null,
        currentCharityId: null
    },
    blockchain: {
        data: null,
        loading: false,
        error: null
    },
    verifications: {
        // Store verification status by donation ID
        data: {},
        loading: {},
        error: null
    }
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        // Clear all stats
        clearStats: (state) => {
            return initialState;
        },
        
        // Clear specific stats
        clearDonorStats: (state) => {
            state.donor = initialState.donor;
        },
        
        clearCharityStats: (state) => {
            state.charity = initialState.charity;
        },
        
        // Update cache timestamp
        updateHomepageCache: (state, action) => {
            state.homepage.lastUpdated = action.payload;
        },
        
        // Clear errors
        clearError: (state, action) => {
            const section = action.payload; // 'homepage', 'donor', 'charity', etc.
            if (state[section]) {
                state[section].error = null;
            }
        }
    },
    extraReducers: (builder) => {
        // Homepage Stats
        builder
            .addCase(fetchHomepageStats.pending, (state) => {
                state.homepage.loading = true;
                state.homepage.error = null;
            })
            .addCase(fetchHomepageStats.fulfilled, (state, action) => {
                state.homepage.loading = false;
                state.homepage.data = action.payload;
                state.homepage.lastUpdated = new Date().toISOString();
                state.homepage.error = null;
            })
            .addCase(fetchHomepageStats.rejected, (state, action) => {
                state.homepage.loading = false;
                state.homepage.error = action.payload;
            });

        // Donor Stats
        builder
            .addCase(fetchDonorStats.pending, (state, action) => {
                state.donor.loading = true;
                state.donor.error = null;
                state.donor.currentDonorId = action.meta.arg; // Store the donorId being fetched
            })
            .addCase(fetchDonorStats.fulfilled, (state, action) => {
                state.donor.loading = false;
                state.donor.data = action.payload;
                state.donor.error = null;
            })
            .addCase(fetchDonorStats.rejected, (state, action) => {
                state.donor.loading = false;
                state.donor.error = action.payload;
            });

        // Charity Stats
        builder
            .addCase(fetchCharityStats.pending, (state, action) => {
                state.charity.loading = true;
                state.charity.error = null;
                state.charity.currentCharityId = action.meta.arg; // Store the charityId being fetched
            })
            .addCase(fetchCharityStats.fulfilled, (state, action) => {
                state.charity.loading = false;
                state.charity.data = action.payload;
                state.charity.error = null;
            })
            .addCase(fetchCharityStats.rejected, (state, action) => {
                state.charity.loading = false;
                state.charity.error = action.payload;
            });

        // Blockchain Stats
        builder
            .addCase(fetchBlockchainStats.pending, (state) => {
                state.blockchain.loading = true;
                state.blockchain.error = null;
            })
            .addCase(fetchBlockchainStats.fulfilled, (state, action) => {
                state.blockchain.loading = false;
                state.blockchain.data = action.payload;
                state.blockchain.error = null;
            })
            .addCase(fetchBlockchainStats.rejected, (state, action) => {
                state.blockchain.loading = false;
                state.blockchain.error = action.payload;
            });

        // Verification Status
        builder
            .addCase(fetchVerificationStatus.pending, (state, action) => {
                const donationId = action.meta.arg;
                state.verifications.loading[donationId] = true;
                state.verifications.error = null;
            })
            .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
                const { donationId, status } = action.payload;
                state.verifications.loading[donationId] = false;
                state.verifications.data[donationId] = status;
            })
            .addCase(fetchVerificationStatus.rejected, (state, action) => {
                const donationId = action.meta.arg;
                state.verifications.loading[donationId] = false;
                state.verifications.error = action.payload;
            });
    }
});

// Export actions
export const { 
    clearStats, 
    clearDonorStats, 
    clearCharityStats, 
    updateHomepageCache,
    clearError 
} = statsSlice.actions;

// Export selectors
export const selectHomepageStats = (state) => state.stats.homepage;
export const selectDonorStats = (state) => state.stats.donor;
export const selectCharityStats = (state) => state.stats.charity;
export const selectBlockchainStats = (state) => state.stats.blockchain;
export const selectVerificationStatus = (donationId) => (state) => 
    state.stats.verifications.data[donationId];

// Export reducer
export default statsSlice.reducer;