import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/training`;

// ---------- ADMIN ----------
export const saveTraining = createAsyncThunk(
  'training/saveTraining',
  async (trainingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', trainingData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getAllTrainings = createAsyncThunk(
  'training/getAllTrainings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-all', {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getTrainingById = createAsyncThunk(
  'training/getTrainingById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-id/${id}`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const updateTraining = createAsyncThunk(
  'training/updateTraining',
  async ({ id, trainingData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, trainingData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const deleteTrainingById = createAsyncThunk(
  'training/deleteTrainingById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ---------- COACH ----------
export const saveTrainingAsCoach = createAsyncThunk(
  'training/saveTrainingAsCoach',
  async (trainingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/coach/add', trainingData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const updateTrainingAsCoach = createAsyncThunk(
  'training/updateTrainingAsCoach',
  async ({ id, trainingData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/coach/update/${id}`, trainingData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const deleteTrainingAsCoach = createAsyncThunk(
  'training/deleteTrainingAsCoach',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/coach/delete/${id}`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ---------- SHARED ----------
export const getTrainingsForCoach = createAsyncThunk(
  'training/getTrainingsForCoach',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-authenticated-coach`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getTrainingsByTeamId = createAsyncThunk(
  'training/getTrainingsByTeamId',
  async (teamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-team/${teamId}`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);


const trainingSlice = createSlice({
    name: 'training',
    initialState: {
        trainings: [],
        training: null,
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
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
          // Admin save
          .addCase(saveTraining.pending, (state) => { state.savingStatus = 'loading'; })
          .addCase(saveTraining.fulfilled, (state) => { state.savingStatus = 'succeeded'; })
          .addCase(saveTraining.rejected, (state) => { state.savingStatus = 'failed'; })

          // Admin get all
          .addCase(getAllTrainings.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getAllTrainings.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.trainings = action.payload;
          })
          .addCase(getAllTrainings.rejected, (state) => { state.fetchingStatus = 'failed'; })

          // Get by id
          .addCase(getTrainingById.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getTrainingById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.training = action.payload;
          })
          .addCase(getTrainingById.rejected, (state) => { state.fetchingStatus = 'failed'; })

          // Admin update
          .addCase(updateTraining.pending, (state) => { state.updateStatus = 'loading'; })
          .addCase(updateTraining.fulfilled, (state) => { state.updateStatus = 'succeeded'; })
          .addCase(updateTraining.rejected, (state) => { state.updateStatus = 'failed'; })

          // Admin delete
          .addCase(deleteTrainingById.pending, (state) => { state.deletingStatus = 'loading'; })
          .addCase(deleteTrainingById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.trainings = state.trainings.filter(t => t.id !== action.payload.id);
          })
          .addCase(deleteTrainingById.rejected, (state) => { state.deletingStatus = 'failed'; })

          // Coach save
          .addCase(saveTrainingAsCoach.pending, (state) => { state.savingStatus = 'loading'; })
          .addCase(saveTrainingAsCoach.fulfilled, (state) => { state.savingStatus = 'succeeded'; })
          .addCase(saveTrainingAsCoach.rejected, (state) => { state.savingStatus = 'failed'; })

          // Coach update
          .addCase(updateTrainingAsCoach.pending, (state) => { state.updateStatus = 'loading'; })
          .addCase(updateTrainingAsCoach.fulfilled, (state) => { state.updateStatus = 'succeeded'; })
          .addCase(updateTrainingAsCoach.rejected, (state) => { state.updateStatus = 'failed'; })

          // Coach delete
          .addCase(deleteTrainingAsCoach.pending, (state) => { state.deletingStatus = 'loading'; })
          .addCase(deleteTrainingAsCoach.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.trainings = state.trainings.filter(t => t.id !== action.payload.id);
          })
          .addCase(deleteTrainingAsCoach.rejected, (state) => { state.deletingStatus = 'failed'; })

          // Coach list
          .addCase(getTrainingsForCoach.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getTrainingsForCoach.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.trainings = action.payload;
          })
          .addCase(getTrainingsForCoach.rejected, (state) => { state.fetchingStatus = 'failed'; })

          // By team
          .addCase(getTrainingsByTeamId.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getTrainingsByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.trainings = action.payload;
          })
          .addCase(getTrainingsByTeamId.rejected, (state) => { state.fetchingStatus = 'failed'; });
      },
});

export const { resetStatus } = trainingSlice.actions;
export default trainingSlice.reducer;