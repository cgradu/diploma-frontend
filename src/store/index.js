// client/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { testReducer } from '../components/test/ReduxTest';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    test: testReducer,
    // Other reducers...
  },
});