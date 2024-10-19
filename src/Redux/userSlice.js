import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user data
  isAuthenticated: false, // Boolean to track if the user is logged in
  access_token: null, // JWT Access Token
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // Action payload will contain user data and access token
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.access_token = action.payload.access_token;
    },
    logout: (state) => {
      // Reset user data on logout
      state.user = null;
      state.isAuthenticated = false;
      state.access_token = null;
    },
    refreshAccessToken: (state, action) => {
      // Update access token when refreshed
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, refreshAccessToken, setUser } =
  userSlice.actions;

export default userSlice.reducer;
