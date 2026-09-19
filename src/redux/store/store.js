import { composeWithDevTools } from '@redux-devtools/extension';
import { configureStore } from '@reduxjs/toolkit';

import adminSlice from '../reducer/adminSlice';
import coachSlice from '../reducer/coachSlice';
import matchSlice from '../reducer/matchSlice';
import passwordSlice from '../reducer/passwordSlice';
import performanceSlice from '../reducer/performanceSlice';
import playerSlice from '../reducer/playerSlice';
import profileSlice from '../reducer/profileSlice';
import teamSlice from '../reducer/teamSlice';
import userSlice from '../reducer/userSlice';

const store = configureStore({
    reducer: {
        admins: adminSlice,
        coaches: coachSlice,
        matches: matchSlice,
        passwords: passwordSlice,
        performances: performanceSlice,
        players: playerSlice,
        profiles: profileSlice,
        teams: teamSlice,
        users: userSlice,
    },

    devTools: composeWithDevTools(),
});

export default store;