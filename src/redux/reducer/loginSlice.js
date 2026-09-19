import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';
// import api from 'api';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api`;


export const loginRequest = createAsyncThunk(
  'login/loginRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL + '/login', requestData, {headers: {"Content-Type":"application/json"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// FIXED: was posting to /login-verifier/{resetToken}, which doesn't exist in
// LoginController. Pointed at /is-valid/{token} instead - the only matching
// backend endpoint, which checks whether a JWT is still valid for the
// current authenticated principal (a session-validity check, not a
// password-reset-link check - if you need the latter, it belongs in
// passwordSlice.js against ForgotPasswordController instead).
export const getVerificationStatus = createAsyncThunk(
  'login/getVerificationStatus',
  async (token, { rejectWithValue }) => {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/is-valid/${token}`, {}, { headers: {"Authorization":`Bearer ${JSON.parse(storedToken)}`, "Content-Type":"application/json"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const logout = createAsyncThunk(
  'login/logout',
  async (_, { thunkAPI }) => {
    localStorage.removeItem("token");
    return true;
  }
);


const loginSlice = createSlice({
    name: 'login',
    initialState: {
        login: [],
        loginStatus: 'idle',
        error: null,
        isAuthenticated: !! localStorage.getItem("token"),
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(loginRequest.pending, (state) => {
            state.loginStatus = 'loading';
          })
          .addCase(loginRequest.fulfilled, (state, action) => {
            state.loginStatus = 'succeeded';
          })
          .addCase(loginRequest.rejected, (state) => {
            state.loginStatus = 'failed';
          })


          .addCase(getVerificationStatus.pending, (state) => {
            state.loginStatus = 'loading';
          })
          .addCase(getVerificationStatus.fulfilled, (state, action) => {
            state.loginStatus = 'succeeded';
          })
          .addCase(getVerificationStatus.rejected, (state) => {
            state.loginStatus = 'failed';
          })


          
          .addCase(logout.pending, (state) => {
            state.loginStatus = 'loading';
          })
          .addCase(logout.fulfilled, (state, action) => {
            state.loginStatus = 'succeeded';
            state.isAuthenticated = false;
          })
          .addCase(logout.rejected, (state) => {
            state.loginStatus = 'failed';
          })
      },
});


export default loginSlice.reducer;
