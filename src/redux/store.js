// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import charityReducer from './slices/charitySlice';
import donationReducer from './slices/donationSlice';
import donationHistorySlice from './slices/donationHistorySlice';
import projectReducer from './slices/projectSlice';
import adminReducer from './slices/adminSlice'; // Add admin reducer
import statsReducer from './slices/statsSlice'; // Import stats reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    charities: charityReducer,
    donations: donationReducer,
    donationsHistory: donationHistorySlice,
    projects: projectReducer,
    admin: adminReducer, // Add admin reducer
    stats: statsReducer, // Add stats reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;