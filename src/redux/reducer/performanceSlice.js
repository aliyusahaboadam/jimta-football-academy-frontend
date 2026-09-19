import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/performance`;

export const savePerformance = createAsyncThunk(
  'performance/savePerformance',
  async (performanceData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', performanceData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getPerformancesByMatchId = createAsyncThunk(
  'performance/getPerformancesByMatchId',
  async (matchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-match/${matchId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getPerformancesByPlayerId = createAsyncThunk(
  'performance/getPerformancesByPlayerId',
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


export const getPerformanceByPlayerAndMatch = createAsyncThunk(
  'performance/getPerformanceByPlayerAndMatch',
  async ({ playerId, matchId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-player-and-match?playerId=${playerId}&matchId=${matchId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSeasonTotals = createAsyncThunk(
  'performance/getSeasonTotals',
  async (playerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-season-totals/${playerId}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const performanceSlice = createSlice({
    name: 'performance',
    initialState: {
        performances: [],
        performance: null,
        seasonTotals: null,
        savingStatus: 'idle',
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
          .addCase(savePerformance.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(savePerformance.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(savePerformance.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // get performances by match id

          .addCase(getPerformancesByMatchId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPerformancesByMatchId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.performances = action.payload;
          })
          .addCase(getPerformancesByMatchId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get performances by player id

          .addCase(getPerformancesByPlayerId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPerformancesByPlayerId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.performances = action.payload;
          })
          .addCase(getPerformancesByPlayerId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get performance by player and match

          .addCase(getPerformanceByPlayerAndMatch.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPerformanceByPlayerAndMatch.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.performance = action.payload;
          })
          .addCase(getPerformanceByPlayerAndMatch.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get season totals

          .addCase(getSeasonTotals.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getSeasonTotals.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.seasonTotals = action.payload;
          })
          .addCase(getSeasonTotals.rejected, (state) => {
            state.fetchingStatus = 'failed';
          });
      },

});

export const { resetStatus } = performanceSlice.actions;
export default performanceSlice.reducer;
