import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddAdmin from "./component/admin/AddAdmin";
import AdminChangePassword from "./component/admin/AdminChangePassword";
import AdminDetails from "./component/admin/AdminDetails";
import AdminProfile from "./component/admin/AdminProfile";
import UpdateAdmin from "./component/admin/UpdateAdmin";
import ViewAdmins from "./component/admin/ViewAdmins";
import AddCoach from "./component/coach/AddCoach";
import CoachChangePassword from "./component/coach/CoachChangePassword";
import CoachDetails from "./component/coach/CoachDetails";
import CoachMatchResults from "./component/coach/CoachMatchResults";
import CoachMyPlayers from "./component/coach/CoachMyPlayers";
import CoachMyTeam from "./component/coach/CoachMyTeam";
import CoachPerformanceReports from "./component/coach/CoachPerformanceReports";
import CoachProfile from "./component/coach/CoachProfile";
import CoachRecordPerformance from "./component/coach/CoachRecordPerformance";
import CoachUpcomingMatches from "./component/coach/CoachUpcomingMatches";
import UpdateCoach from "./component/coach/UpdateCoach";
import ViewCoaches from "./component/coach/ViewCoaches";
import AdminDashboard from "./component/dashboards/AdminDashboard";
import CoachDashboard from "./component/dashboards/CoachDashboard";
import PlayerDashboard from "./component/dashboards/PlayerDashboard";
import LoginAdmin from "./component/form/LoginAdmin";
import LoginCoach from "./component/form/LoginCoach";
import LoginPlayer from "./component/form/LoginPlayer";
import Home from "./component/home/Home";
import MatchDetails from "./component/match/MatchDetails";
import MatchesByStatus from "./component/match/MatchesByStatus";
import ScheduleMatch from "./component/match/ScheduleMatch";
import UpdateMatch from "./component/match/UpdateMatch";
import ViewMatches from "./component/match/ViewMatches";
import PasswordRequest from "./component/password/PasswordRequest";
import ResetPassword from "./component/password/ResetPassword";
import MatchPerformanceDetails from "./component/performance/MatchPerformanceDetails";
import PerformanceByMatch from "./component/performance/PerformanceByMatch";
import RecordPerformance from "./component/performance/RecordPerformance";
import SeasonTotals from "./component/performance/SeasonTotals";
import AddPlayer from "./component/player/AddPlayer";
import PlayerChangePassword from "./component/player/PlayerChangePassword";
import PlayerDetails from "./component/player/PlayerDetails";
import PlayerGallery from "./component/player/PlayerGallery";
import PlayerMatchResults from "./component/player/PlayerMatchResults";
import PlayerMyTeam from "./component/player/PlayerMyTeam";
import PlayerPerformance from "./component/player/PlayerPerformance";
import PlayerProfile from "./component/player/PlayerProfile";
import PlayerSeasonTotals from "./component/player/PlayerSeasonTotals";
import PlayerTeammates from "./component/player/PlayerTeammates";
import PlayerUpcomingMatches from "./component/player/PlayerUpcomingMatches";
import UpdatePlayer from "./component/player/UpdatePlayer";
import UploadPlayerPhoto from "./component/player/UploadPlayerPhoto";
import ViewPlayers from "./component/player/ViewPlayers";
import AddTeam from "./component/team/AddTeam";
import TeamDetails from "./component/team/TeamDetails";
import TeamsByAgeGroup from "./component/team/TeamsByAgeGroup";
import UpdateTeam from "./component/team/UpdateTeam";
import ViewTeams from "./component/team/ViewTeams";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin — Players */}
        <Route path="/admin/home" element={<AdminDashboard />} />
        <Route path="/admin/players/add" element={<AddPlayer />} />
        <Route path="/admin/players" element={<ViewPlayers />} />
        <Route path="/admin/players/gallery" element={<PlayerGallery />} />
        <Route path="/admin/players/update/:id" element={<UpdatePlayer />} />
        <Route path="/admin/players/details/:id" element={<PlayerDetails />} />

        {/* Admin — Coaches */}
        <Route path="/admin/coaches/add" element={<AddCoach />} />
        <Route path="/admin/coaches" element={<ViewCoaches />} />
        <Route path="/admin/coaches/update/:id" element={<UpdateCoach />} />
        <Route path="/admin/coaches/details/:id" element={<CoachDetails />} />

        {/* Admin — Teams */}
        <Route path="/admin/teams/add" element={<AddTeam />} />
        <Route path="/admin/teams" element={<ViewTeams />} />
        <Route path="/admin/teams/by-age-group" element={<TeamsByAgeGroup />} />
        <Route path="/admin/teams/update/:id" element={<UpdateTeam />} />
        <Route path="/admin/teams/details/:id" element={<TeamDetails />} />

        {/* Admin — Matches */}
        <Route path="/admin/matches/add" element={<ScheduleMatch />} />
        <Route path="/admin/matches" element={<ViewMatches />} />
        <Route path="/admin/matches/by-status" element={<MatchesByStatus />} />
        <Route path="/admin/matches/update/:id" element={<UpdateMatch />} />
        <Route path="/admin/matches/details/:id" element={<MatchDetails />} />

        {/* Admin — Performance */}
        <Route path="/admin/performance/add" element={<RecordPerformance />} />
        <Route path="/admin/performance/by-match" element={<PerformanceByMatch />} />
        <Route path="/admin/performance/match/:matchId" element={<MatchPerformanceDetails />} />
        <Route path="/admin/performance/season-totals" element={<SeasonTotals />} />

        {/* Admin — Admins */}
        <Route path="/admin/admins/add" element={<AddAdmin />} />
        <Route path="/admin/admins" element={<ViewAdmins />} />
        <Route path="/admin/admins/update/:id" element={<UpdateAdmin />} />
        <Route path="/admin/admins/details/:id" element={<AdminDetails />} />

        {/* Admin — Profile */}
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/change-password" element={<AdminChangePassword />} />

        {/* Coach */}
        <Route path="/coach/home" element={<CoachDashboard />} />
        <Route path="/coach/team" element={<CoachMyTeam />} />
        <Route path="/coach/players" element={<CoachMyPlayers />} />
        <Route path="/coach/matches" element={<CoachUpcomingMatches />} />
        <Route path="/coach/matches/results" element={<CoachMatchResults />} />
        <Route path="/coach/performance/add" element={<CoachRecordPerformance />} />
        <Route path="/coach/performance" element={<CoachPerformanceReports />} />
        <Route path="/coach/profile" element={<CoachProfile />} />
        <Route path="/coach/change-password" element={<CoachChangePassword />} />

            {/* Player */}
        <Route path="/player/home" element={<PlayerDashboard />} />
        <Route path="/player/team" element={<PlayerMyTeam />} />
        <Route path="/player/teammates" element={<PlayerTeammates />} />
        <Route path="/player/matches" element={<PlayerUpcomingMatches />} />
        <Route path="/player/matches/results" element={<PlayerMatchResults />} />
        <Route path="/player/performance" element={<PlayerPerformance />} />
        <Route path="/player/performance/season-totals" element={<PlayerSeasonTotals />} />
        <Route path="/player/profile" element={<PlayerProfile />} />
        <Route path="/player/upload-photo" element={<UploadPlayerPhoto />} />
        <Route path="/player/change-password" element={<PlayerChangePassword />} />


        {/* Password flow (unauthenticated) */}
        <Route path="/password/password-request-admin" element={<PasswordRequest />} />
        <Route path="/password/password-reset" element={<ResetPassword />} />

        {/* Login */}
        <Route path="/login-coach" element={<LoginCoach />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-player" element={<LoginPlayer />} />
        <Route path="/login" element={<LoginPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;