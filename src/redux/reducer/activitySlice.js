import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/activity`;

// ---------- Admin CRUD ----------
export const saveActivity = createAsyncThunk(
  'activity/saveActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', activityData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getAllActivities = createAsyncThunk(
  'activity/getAllActivities',
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

export const getActivityById = createAsyncThunk(
  'activity/getActivityById',
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

export const updateActivity = createAsyncThunk(
  'activity/updateActivity',
  async ({ id, activityData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, activityData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const deleteActivityById = createAsyncThunk(
  'activity/deleteActivityById',
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

// ---------- Filtered views ----------
export const getVideoActivities = createAsyncThunk(
  'activity/getVideoActivities',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-videos', {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getImageOnlyActivities = createAsyncThunk(
  'activity/getImageOnlyActivities',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-images', {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ---------- Team-scoped (coach / player) ----------
export const getActivitiesByTeamId = createAsyncThunk(
  'activity/getActivitiesByTeamId',
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

export const getVideoActivitiesByTeamId = createAsyncThunk(
  'activity/getVideoActivitiesByTeamId',
  async (teamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-videos-by-team/${teamId}`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getImageActivitiesByTeamId = createAsyncThunk(
  'activity/getImageActivitiesByTeamId',
  async (teamId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-images-by-team/${teamId}`, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

// ---------- Photo upload ----------
export const uploadActivityPhoto = createAsyncThunk(
  'activity/uploadActivityPhoto',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/upload-photo', formData, {
        headers: { "Authorization": `Bearer ${JSON.parse(token)}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Upload failed" });
    }
  }
);


const activitySlice = createSlice({
    name: 'activity',
    initialState: {
        activities: [],
        activity: null,
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
        updateStatus: 'idle',
        uploadStatus: 'idle',
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
          .addCase(saveActivity.pending, (state) => { state.savingStatus = 'loading'; })
          .addCase(saveActivity.fulfilled, (state) => { state.savingStatus = 'succeeded'; })
          .addCase(saveActivity.rejected, (state) => { state.savingStatus = 'failed'; })

          .addCase(getAllActivities.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getAllActivities.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activities = action.payload;
          })
          .addCase(getAllActivities.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(getActivityById.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getActivityById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activity = action.payload;
          })
          .addCase(getActivityById.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(updateActivity.pending, (state) => { state.updateStatus = 'loading'; })
          .addCase(updateActivity.fulfilled, (state) => { state.updateStatus = 'succeeded'; })
          .addCase(updateActivity.rejected, (state) => { state.updateStatus = 'failed'; })

          .addCase(deleteActivityById.pending, (state) => { state.deletingStatus = 'loading'; })
          .addCase(deleteActivityById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.activities = state.activities.filter(a => a.id !== action.payload.id);
          })
          .addCase(deleteActivityById.rejected, (state) => { state.deletingStatus = 'failed'; })

          .addCase(getVideoActivities.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getVideoActivities.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activities = action.payload;
          })
          .addCase(getVideoActivities.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(getImageOnlyActivities.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getImageOnlyActivities.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activities = action.payload;
          })
          .addCase(getImageOnlyActivities.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(getActivitiesByTeamId.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getActivitiesByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activities = action.payload;
          })
          .addCase(getActivitiesByTeamId.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(getVideoActivitiesByTeamId.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getVideoActivitiesByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activities = action.payload;
          })
          .addCase(getVideoActivitiesByTeamId.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(getImageActivitiesByTeamId.pending, (state) => { state.fetchingStatus = 'loading'; })
          .addCase(getImageActivitiesByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.activities = action.payload;
          })
          .addCase(getImageActivitiesByTeamId.rejected, (state) => { state.fetchingStatus = 'failed'; })

          .addCase(uploadActivityPhoto.pending, (state) => { state.uploadStatus = 'loading'; })
          .addCase(uploadActivityPhoto.fulfilled, (state) => { state.uploadStatus = 'succeeded'; })
          .addCase(uploadActivityPhoto.rejected, (state) => { state.uploadStatus = 'failed'; });
      },
});

export const { resetStatus } = activitySlice.actions;
export default activitySlice.reducer;