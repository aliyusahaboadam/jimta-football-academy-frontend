import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/password`;

// Kicks off the forgot-password email flow: sends a reset link to the given
// email if it belongs to a registered admin account.
export const sendPasswordRequest = createAsyncThunk(
  'password/sendPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL + `/save-password-request/${email}`, {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Admin changes their own password while logged in.
// passwordResetRequest: { password }
export const sendPasswordResetAdmin = createAsyncThunk(
  'password/sendPasswordResetAdmin',
  async (passwordResetRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + `/save-reset-password-admin`,
        passwordResetRequest,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Completes a reset started via the emailed token (admin flow).
// passwordResetRequest: { resetToken, password }
export const sendPasswordReset = createAsyncThunk(
  'password/sendPasswordReset',
  async (passwordResetRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL + `/save-reset-password`, passwordResetRequest, { headers: { "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Player resets their own password while already logged in.
// passwordResetRequest: { password }
export const sendPasswordResetPlayer = createAsyncThunk(
  'password/sendPasswordResetPlayer',
  async (passwordResetRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/save-reset-password-player`, passwordResetRequest, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Coach resets their own password while already logged in.
// passwordResetRequest: { password }
export const sendPasswordResetCoach = createAsyncThunk(
  'password/sendPasswordResetCoach',
  async (passwordResetRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/save-reset-password-coach`, passwordResetRequest, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


const passwordSlice = createSlice({
    name: 'password',
    initialState: {
        savingStatus: 'idle',
        error: null,
    },
    reducers: {
      resetStatus (state) {
        state.savingStatus = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
        builder
          // Send password request (email link)

          .addCase(sendPasswordRequest.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(sendPasswordRequest.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(sendPasswordRequest.rejected, (state) => {
            state.savingStatus = 'failed';
          })


          .addCase(sendPasswordResetAdmin.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(sendPasswordResetAdmin.fulfilled, (state) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(sendPasswordResetAdmin.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // Save reset password (admin, via token)

          .addCase(sendPasswordReset.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(sendPasswordReset.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(sendPasswordReset.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // Save reset password (player, while logged in)

          .addCase(sendPasswordResetPlayer.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(sendPasswordResetPlayer.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(sendPasswordResetPlayer.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // Save reset password (coach, while logged in)

          .addCase(sendPasswordResetCoach.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(sendPasswordResetCoach.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(sendPasswordResetCoach.rejected, (state) => {
            state.savingStatus = 'failed';
          });
      },

});

export const { resetStatus } = passwordSlice.actions;
export default passwordSlice.reducer;
