// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import charityReducer from './slices/charitySlice';
import donationReducer from './slices/donationSlice';
import projectReducer from './slices/projectSlice';
import adminReducer from './slices/adminSlice'; // Add admin reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    charities: charityReducer,
    donations: donationReducer,
    projects: projectReducer,
    admin: adminReducer, // Add admin reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;