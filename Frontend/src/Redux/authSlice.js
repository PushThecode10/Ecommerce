import { createSlice } from '@reduxjs/toolkit';

// 🔥 Load from localStorage
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      return {
        user: JSON.parse(userStr),
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // ✅ Save BOTH user + token
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };

      // ✅ Keep localStorage in sync
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;