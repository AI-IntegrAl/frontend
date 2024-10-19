import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // Import the user slice

// Configure the store with the user slice
const store = configureStore({
  reducer: {
    user: userReducer,  // Add the user slice to the store
  },
});

export default store;
