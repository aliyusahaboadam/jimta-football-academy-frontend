import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/user`;

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-id/${id}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getAuthenticatedUser = createAsyncThunk(
  'user/getAuthenticatedUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-authenticated-user`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getUserByUsername = createAsyncThunk(
  'user/getUserByUsername',
  async (username, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-username/${username}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getUserByRole = createAsyncThunk(
  'user/getUserByRole',
  async (role, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-role/${role}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        fetchingStatus: 'idle',
        error: null,
    },
    reducers: {
      resetStatus (state) {
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
        builder
          // Get User By Id

          .addCase(getUserById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getUserById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.user = action.payload;
          })
          .addCase(getUserById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Authenticated User

          .addCase(getAuthenticatedUser.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAuthenticatedUser.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.user = action.payload;
          })
          .addCase(getAuthenticatedUser.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get User By Username

          .addCase(getUserByUsername.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getUserByUsername.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.user = action.payload;
          })
          .addCase(getUserByUsername.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get User By Role

          .addCase(getUserByRole.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getUserByRole.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.user = action.payload;
          })
          .addCase(getUserByRole.rejected, (state) => {
            state.fetchingStatus = 'failed';
          });
      },

});

export const { resetStatus } = userSlice.actions;
export default userSlice.reducer;
