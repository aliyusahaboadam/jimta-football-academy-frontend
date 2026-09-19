import { configureStore } from '@reduxjs/toolkit';
import activityReducer from './reducer/activitySlice';
import adminReducer from './reducer/adminSlice';
import coachReducer from './reducer/coachSlice';
import loginReducer from './reducer/loginSlice';
import matchReducer from './reducer/matchSlice';
import passwordReducer from './reducer/passwordSlice';
import performanceReducer from './reducer/performanceSlice';
import playerReducer from './reducer/playerSlice';
import profileReducer from './reducer/profileSlice';
import teamReducer from './reducer/teamSlice';
import trainingReducer from './reducer/trainingSlice';
import userReducer from './reducer/userSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    admins: adminReducer,
    coaches: coachReducer,
    players: playerReducer,
    teams: teamReducer,
    matches: matchReducer,
    performances: performanceReducer,
    profiles: profileReducer,
    passwords: passwordReducer,
    users: userReducer,
    trainings: trainingReducer,
    activities: activityReducer,
  },
});

export default store;