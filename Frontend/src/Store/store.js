import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Redux/authSlice.js';
import cartReducer from '../Redux/createSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;