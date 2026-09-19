import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/match`;

export const saveMatch = createAsyncThunk(
  'match/saveMatch',
  async (matchData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', matchData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getMatchById = createAsyncThunk(
  'match/getMatchById',
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


export const getAllMatches = createAsyncThunk(
  'match/getAllMatches',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getMatchesByStatus = createAsyncThunk(
  'match/getMatchesByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-status/${status}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getMatchesByTeamId = createAsyncThunk(
  'match/getMatchesByTeamId',
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


export const deleteMatchById = createAsyncThunk(
  'match/deleteMatchById',
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


export const updateMatch = createAsyncThunk(
  'match/updateMatch',
  async ({ id, matchData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, matchData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const matchSlice = createSlice({
    name: 'match',
    initialState: {
        matches: [],
        match: null,
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
          .addCase(saveMatch.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveMatch.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(saveMatch.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // get match by id

          .addCase(getMatchById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getMatchById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.match = action.payload;
          })
          .addCase(getMatchById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get all matches

          .addCase(getAllMatches.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllMatches.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.matches = action.payload;
          })
          .addCase(getAllMatches.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get matches by status

          .addCase(getMatchesByStatus.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getMatchesByStatus.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.matches = action.payload;
          })
          .addCase(getMatchesByStatus.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get matches by team id

          .addCase(getMatchesByTeamId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getMatchesByTeamId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.matches = action.payload;
          })
          .addCase(getMatchesByTeamId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // delete match by id

          .addCase(deleteMatchById.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deleteMatchById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.matches = state.matches.filter(match => match.id !== action.payload.id);
          })
          .addCase(deleteMatchById.rejected, (state) => {
            state.deletingStatus = 'failed';
          })

          // update match

          .addCase(updateMatch.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(updateMatch.fulfilled, (state) => {
            state.updateStatus = 'succeeded';
          })
          .addCase(updateMatch.rejected, (state) => {
            state.updateStatus = 'failed';
          });
      },

});

export const { resetStatus } = matchSlice.actions;
export default matchSlice.reducer;