// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import charityReducer from './slices/charitySlice';
import donationReducer from './slices/donationSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    charities: charityReducer,
    donations: donationReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;