import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/team`;

export const saveTeam = createAsyncThunk(
  'team/saveTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', teamData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getTeamById = createAsyncThunk(
  'team/getTeamById',
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


export const getAllTeams = createAsyncThunk(
  'team/getAllTeams',
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


export const getAllTeamsWithPlayerCount = createAsyncThunk(
  'team/getAllTeamsWithPlayerCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-with-player-count`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getTeamsByCoachId = createAsyncThunk(
  'team/getTeamsByCoachId',
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


export const getTeamsByAgeGroup = createAsyncThunk(
  'team/getTeamsByAgeGroup',
  async (ageGroup, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-age-group/${ageGroup}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const deleteTeamById = createAsyncThunk(
  'team/deleteTeamById',
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


export const updateTeam = createAsyncThunk(
  'team/updateTeam',
  async ({ id, teamData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, teamData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const teamSlice = createSlice({
    name: 'team',
    initialState: {
        teams: [],
        team: null,
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
          .addCase(saveTeam.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveTeam.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(saveTeam.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // get Team by id

          .addCase(getTeamById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getTeamById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.team = action.payload;
          })
          .addCase(getTeamById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get all teams

          .addCase(getAllTeams.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllTeams.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.teams = action.payload;
          })
          .addCase(getAllTeams.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get all teams with player count

          .addCase(getAllTeamsWithPlayerCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllTeamsWithPlayerCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.teams = action.payload;
          })
          .addCase(getAllTeamsWithPlayerCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get teams by coach id

          .addCase(getTeamsByCoachId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getTeamsByCoachId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.teams = action.payload;
          })
          .addCase(getTeamsByCoachId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // get teams by age group

          .addCase(getTeamsByAgeGroup.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getTeamsByAgeGroup.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.teams = action.payload;
          })
          .addCase(getTeamsByAgeGroup.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

          // delete team by id

          .addCase(deleteTeamById.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deleteTeamById.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.teams = state.teams.filter(team => team.id !== action.payload.id);
          })
          .addCase(deleteTeamById.rejected, (state) => {
            state.deletingStatus = 'failed';
          })

          // update team

          .addCase(updateTeam.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(updateTeam.fulfilled, (state) => {
            state.updateStatus = 'succeeded';
          })
          .addCase(updateTeam.rejected, (state) => {
            state.updateStatus = 'failed';
          });
      },

});

export const { resetStatus } = teamSlice.actions;
export default teamSlice.reducer;