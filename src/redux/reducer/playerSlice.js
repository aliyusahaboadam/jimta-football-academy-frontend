import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/player`;

export const savePlayer = createAsyncThunk(
  'player/savePlayer',
  async (playerData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', playerData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getAllPlayers = createAsyncThunk(
  'player/getAllPlayers',
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


export const getPlayerById = createAsyncThunk(
  'player/getPlayerById',
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


export const getAuthenticatedPlayer = createAsyncThunk(
  'player/getAuthenticatedPlayer',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-authenticated-player`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getPlayerProfileById = createAsyncThunk(
  'player/getPlayerProfileById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-profile/${id}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getPlayersByTeamId = createAsyncThunk(
  'player/getPlayersByTeamId',
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


export const getPlayerByJerseyAndTeam = createAsyncThunk(
  'player/getPlayerByJerseyAndTeam',
  async ({ jerseyNumber, teamId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-jersey?jerseyNumber=${jerseyNumber}&teamId=${teamId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const updatePlayer = createAsyncThunk(
  'player/updatePlayer',
  async ({ id, playerData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, playerData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const deletePlayerById = createAsyncThunk(
  'player/deletePlayerById',
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


// NEW — admin uploads a photo and receives the stored filename.
// Does not touch any player record — the caller includes the returned
// filename in the Add/Update Player payload as photoUrl.
export const uploadPlayerPhoto = createAsyncThunk(
  'player/uploadPlayerPhoto',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + '/upload-photo',
        formData,
        { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;   // { id?, message: "1712345678_name.png" }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Upload failed" });
    }
  }
);


// NEW — a logged-in player replaces their own photo.
// Uses the /save-photo endpoint which updates the authenticated player's row.
export const savePlayerPhoto = createAsyncThunk(
  'player/savePlayerPhoto',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + '/save-photo',
        formData,
        { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Upload failed" });
    }
  }
);


export const getWelcomeMessage = createAsyncThunk(
  'player/getWelcomeMessage',
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


const playerSlice = createSlice({
    name: 'player',
    initialState: {
        players: [],
        player: null,
        welcomeMessage: '',
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
        updateStatus: 'idle',
        uploadStatus: 'idle',
        existsStatus: 'idle',
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
          .addCase(savePlayer.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(savePlayer.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(savePlayer.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // get All Players

          .addCase(getAllPlayers.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllPlayers.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.players = action.payload;
          })
          .addCase(getAllPlayers.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Player By Id

          .addCase(getPlayerById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPlayerById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.player = action.payload;
          })
          .addCase(getPlayerById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Authenticated Player

          .addCase(getAuthenticatedPlayer.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAuthenticatedPlayer.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.player = action.payload;
          })
          .addCase(getAuthenticatedPlayer.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Player Profile By Id

          .addCase(getPlayerProfileById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPlayerProfileById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.player = action.payload;
          })
          .addCase(getPlayerProfileById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Players By Team Id

          .addCase(getPlayersByTeamId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPlayersByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.players = action.payload;
          })
          .addCase(getPlayersByTeamId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Get Player By Jersey And Team

          .addCase(getPlayerByJerseyAndTeam.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPlayerByJerseyAndTeam.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.player = action.payload;
          })
          .addCase(getPlayerByJerseyAndTeam.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // Update Player

          .addCase(updatePlayer.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(updatePlayer.fulfilled, (state, action) => {
            state.updateStatus = 'succeeded';
          })
          .addCase(updatePlayer.rejected, (state) => {
            state.updateStatus = 'failed';
          })

          // Delete Player By Id

          .addCase(deletePlayerById.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deletePlayerById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.players = state.players.filter(player => player.id !== action.payload.id);
          })
          .addCase(deletePlayerById.rejected, (state) => {
            state.deletingStatus = 'failed';
          })

          // Upload Player Photo (admin flow)

          .addCase(uploadPlayerPhoto.pending, (state) => {
            state.uploadStatus = 'loading';
          })
          .addCase(uploadPlayerPhoto.fulfilled, (state) => {
            state.uploadStatus = 'succeeded';
          })
          .addCase(uploadPlayerPhoto.rejected, (state) => {
            state.uploadStatus = 'failed';
          })

          // Save Player Photo (self-service)

          .addCase(savePlayerPhoto.pending, (state) => {
            state.uploadStatus = 'loading';
          })
          .addCase(savePlayerPhoto.fulfilled, (state) => {
            state.uploadStatus = 'succeeded';
          })
          .addCase(savePlayerPhoto.rejected, (state) => {
            state.uploadStatus = 'failed';
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

export const { resetStatus } = playerSlice.actions;
export default playerSlice.reducer;