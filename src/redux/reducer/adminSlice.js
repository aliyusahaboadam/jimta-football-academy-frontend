import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/admin`;

export const saveAdmin = createAsyncThunk(
  'admin/saveAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL + '/add', adminData, { headers: {"Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getAllAdmins = createAsyncThunk(
  'admin/getAllAdmins',
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


export const getAdminById = createAsyncThunk(
  'admin/getAdminById',
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


export const getAuthenticatedAdmin = createAsyncThunk(
  'admin/getAuthenticatedAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-authenticated-admin`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const existsByEmail = createAsyncThunk(
  'admin/existsByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL + `/exists-by-email/${email}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const deleteAdminById = createAsyncThunk(
  'admin/deleteAdminById',
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


export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ id, adminData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, adminData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getWelcomeMessage = createAsyncThunk(
  'admin/getWelcomeMessage',
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


const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        admins: [],
        admin: null,
        emailExists: false,
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
          .addCase(saveAdmin.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveAdmin.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(saveAdmin.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // get All Admins

          .addCase(getAllAdmins.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllAdmins.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.admins = action.payload;
          })
          .addCase(getAllAdmins.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Admin By Id

          .addCase(getAdminById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAdminById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.admin = action.payload;
          })
          .addCase(getAdminById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Authenticated Admin

          .addCase(getAuthenticatedAdmin.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAuthenticatedAdmin.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.admin = action.payload;
          })
          .addCase(getAuthenticatedAdmin.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Exists By Email

          .addCase(existsByEmail.pending, (state) => {
            state.existsStatus = 'loading';
          })
          .addCase(existsByEmail.fulfilled, (state, action) => {
            state.existsStatus = 'succeeded';
            state.emailExists = action.payload;
          })
          .addCase(existsByEmail.rejected, (state) => {
            state.existsStatus = 'failed';
          })

          // Delete Admin By Id

          .addCase(deleteAdminById.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deleteAdminById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.admins = state.admins.filter(admin => admin.id !== action.payload.id);
          })
          .addCase(deleteAdminById.rejected, (state) => {
            state.deletingStatus = 'failed';
          })

          // Update Admin

          .addCase(updateAdmin.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(updateAdmin.fulfilled, (state) => {
            state.updateStatus = 'succeeded';
          })
          .addCase(updateAdmin.rejected, (state) => {
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

export const { resetStatus } = adminSlice.actions;
export default adminSlice.reducer;