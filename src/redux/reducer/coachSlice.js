import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/coach`;

export const saveCoach = createAsyncThunk(
  'coach/saveCoach',
  async (coachData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', coachData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getAllCoaches = createAsyncThunk(
  'coach/getAllCoaches',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-all', { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getCoachById = createAsyncThunk(
  'coach/getCoachById',
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


export const getAuthenticatedCoach = createAsyncThunk(
  'coach/getAuthenticatedCoach',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-authenticated-coach`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getCoachByLicenseNo = createAsyncThunk(
  'coach/getCoachByLicenseNo',
  async (licenseNo, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-license/${licenseNo}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getCoachByTeamId = createAsyncThunk(
  'coach/getCoachByTeamId',
  async (teamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-team/${teamId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const deleteCoachById = createAsyncThunk(
  'coach/deleteCoachById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const updateCoach = createAsyncThunk(
  'coach/updateCoach',
  async ({ id, coachData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, coachData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getWelcomeMessage = createAsyncThunk(
  'coach/getWelcomeMessage',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/welcome`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const coachSlice = createSlice({
    name: 'coach',
    initialState: {
        coaches: [],
        coach: null,
        welcomeMessage: '',
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
        existsStatus: 'idle',
        updateStatus: 'idle',
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
          .addCase(saveCoach.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveCoach.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(saveCoach.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // get All Coaches

          .addCase(getAllCoaches.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllCoaches.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.coaches = action.payload;
          })
          .addCase(getAllCoaches.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Coach By Id

          .addCase(getCoachById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getCoachById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.coach = action.payload;
          })
          .addCase(getCoachById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Authenticated Coach

          .addCase(getAuthenticatedCoach.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAuthenticatedCoach.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.coach = action.payload;
          })
          .addCase(getAuthenticatedCoach.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Coach By License No

          .addCase(getCoachByLicenseNo.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getCoachByLicenseNo.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.coach = action.payload;
          })
          .addCase(getCoachByLicenseNo.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Coach By Team Id

          .addCase(getCoachByTeamId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getCoachByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.coach = action.payload;
          })
          .addCase(getCoachByTeamId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Delete Coach By Id

          .addCase(deleteCoachById.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deleteCoachById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.coaches = state.coaches.filter(coach => coach.id !== action.payload.id);
          })
          .addCase(deleteCoachById.rejected, (state) => {
            state.deletingStatus = 'failed';
          })

          // Update Coach

          .addCase(updateCoach.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(updateCoach.fulfilled, (state) => {
            state.updateStatus = 'succeeded';
          })
          .addCase(updateCoach.rejected, (state) => {
            state.updateStatus = 'failed';
          })

          // Welcome message

          .addCase(getWelcomeMessage.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getWelcomeMessage.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.welcomeMessage = action.payload;
          })
          .addCase(getWelcomeMessage.rejected, (state) => {
            state.fetchingStatus = 'failed';
          });
      },

});

export const { resetStatus } = coachSlice.actions;
export default coachSlice.reducer;