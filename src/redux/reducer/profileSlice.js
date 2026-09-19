import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/profile`;

export const getProfileByPlayerId = createAsyncThunk(
  'profile/getProfileByPlayerId',
  async (playerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-player/${playerId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getProfileByCoachId = createAsyncThunk(
  'profile/getProfileByCoachId',
  async (coachId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-coach/${coachId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getProfileByAdminId = createAsyncThunk(
  'profile/getProfileByAdminId',
  async (adminId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-admin/${adminId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
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
          // get profile by player id

          .addCase(getProfileByPlayerId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getProfileByPlayerId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.profile = action.payload;
          })
          .addCase(getProfileByPlayerId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get profile by coach id

          .addCase(getProfileByCoachId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getProfileByCoachId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.profile = action.payload;
          })
          .addCase(getProfileByCoachId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get profile by admin id

          .addCase(getProfileByAdminId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getProfileByAdminId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.profile = action.payload;
          })
          .addCase(getProfileByAdminId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          });
      },

});

export const { resetStatus } = profileSlice.actions;
export default profileSlice.reducer;
