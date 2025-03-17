// client/src/components/test/ReduxTest.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

// Create a test slice
const testSlice = createSlice({
  name: 'test',
  initialState: {
    count: 0,
    status: 'idle'
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    }
  }
});

// Export actions and reducer
export const { increment, decrement } = testSlice.actions;
export const testReducer = testSlice.reducer;

// Test component
const ReduxTest = () => {
  // Add the reducer to your store first
  const count = useSelector((state) => state.test?.count ?? 'Redux not working');
  const dispatch = useDispatch();
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Redux Test Component</h2>
      <p>Count: {count}</p>
      <div>
        <button 
          onClick={() => dispatch(increment())}
          style={{ margin: '5px', padding: '5px 10px' }}
        >
          Increment
        </button>
        <button 
          onClick={() => dispatch(decrement())}
          style={{ margin: '5px', padding: '5px 10px' }}
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default ReduxTest;