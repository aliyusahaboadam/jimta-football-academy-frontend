import { IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getMatchById } from "../../redux/reducer/matchSlice";
import { getPerformancesByMatchId } from "../../redux/reducer/performanceSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import PerformanceActionMenu from "../utility/PerformanceActionMenu";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d71b3b",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 18 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

const MatchPerformanceDetails = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const [activeChevron, setActiveChevron] = useState(null);

  const toggleChevron = (chevronId) =>
    setActiveChevron((prev) => (prev === chevronId ? null : chevronId));
  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (event) =>
    setAnchorProfile(anchorProfile ? null : event.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? "simple-popper" : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const side = (searchParams.get("side") || "home").toLowerCase();

  const matchState = useSelector((state) => state.matches);
  const { match, fetchingStatus: matchFetchingStatus } = matchState;

  const performanceState = useSelector((state) => state.performances);
  const { performances, fetchingStatus: perfFetchingStatus } = performanceState;
  const allPerf = Array.isArray(performances) ? performances : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getMatchById(matchId));
    dispatch(getPerformancesByMatchId(matchId));
  }, [dispatch, matchId, location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

  // Determine the target team id for this side
  const targetTeamId =
    side === "home"
      ? match?.homeTeamId ?? match?.homeTeam?.id
      : match?.awayTeamId ?? match?.awayTeam?.id;

  // Filter performances by teamId if the DTO provides it; otherwise show all
  const filteredPerf = allPerf.filter((p) => {
    if (!targetTeamId) return true;
    if (p.teamId != null) return String(p.teamId) === String(targetTeamId);
    return true;
  });

  const homeTeamName = match?.homeTeamName || match?.homeTeam?.name || "Home Team";
  const awayTeamName = match?.awayTeamName || match?.awayTeam?.name || "Away Team";
  const sideTeamName = side === "home" ? homeTeamName : awayTeamName;

  const handleDelete = () => {
    // No delete endpoint for performance yet — placeholder
    console.warn("Delete performance not implemented");
  };

  const handleView = () => {
    // No detail page yet — placeholder
    console.warn("View performance details not implemented");
  };

  const loading = matchFetchingStatus === "loading" || perfFetchingStatus === "loading";

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* Navbar */}
            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#d71b3b" }}>
              <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
                {!isLargeScreen && (
                  <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
                  </IconButton>
                )}

                <div>
                  <IconButton
                    onClick={profilePopup}
                    sx={{
                      backgroundColor: "#d71b3b",
                      "&:hover": { backgroundColor: "#b8152f" },
                    }}
                  >
                    <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
                  </IconButton>

                  <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                    <div className={dashboard["profile--selection__container"]}>
                      <div className={dashboard["profile"]}>
                        <a href="/admin/profile" className={dashboard["link--profile"]}>
                          Profile
                        </a>
                      </div>
                      <div className={dashboard["logout"]}>
                        <a onClick={logout} className={dashboard["link--profile"]}>
                          Logout
                        </a>
                      </div>
                    </div>
                  </BasePopup>
                </div>
              </Toolbar>
            </AppBar>

            {/* Drawer — same as PerformanceByMatch */}
            <Drawer
              variant={isLargeScreen ? "persistent" : "temporary"}
              open={isLargeScreen || isDrawerOpen}
              onClose={!isLargeScreen ? toggleDrawer : undefined}
              sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
                "& .MuiBackdrop-root": { backgroundColor: "rgba(215, 27, 59, 0.15)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                }}
              >
                <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                  <a className={[dashboard["logo__link"], dashboard["logo"]].join(" ")} href="#">
                    <img src="/images/jimta_home_logo.png" alt="Jimta logo" />
                  </a>
                </Box>

                {!isLargeScreen && (
                  <IconButton onClick={toggleDrawer}>
                    <Cancel sx={{ color: "#d71b3b", fontSize: 30 }} />
                  </IconButton>
                )}
              </Box>

              <List>
                {/* Dashboard */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-0")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-0" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#dashboard"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Dashboard</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-0")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Home
                    </a>
                  </div>
                </div>

                {/* Players */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-1")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-1" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#player"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Players</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-1")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/players/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Add Player
                    </a>
                    <a href="/admin/players" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      View Players
                    </a>
                    <a href="/admin/players/gallery" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Gallery
                    </a>
                  </div>
                </div>

                {/* Coaches */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-2")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-2" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#coach"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Coaches</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-2")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/coaches/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Add Coach
                    </a>
                    <a href="/admin/coaches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      View Coaches
                    </a>
                  </div>
                </div>

                {/* Teams */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-3")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-3" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#team"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Teams</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-3")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/teams/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Add Team
                    </a>
                    <a href="/admin/teams" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      View Teams
                    </a>
                    <a href="/admin/teams/by-age-group" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Teams By Age Group
                    </a>
                  </div>
                </div>

                {/* Matches */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-4")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-4" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#match"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Matches</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-4")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/matches/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Schedule Match
                    </a>
                    <a href="/admin/matches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      View Matches
                    </a>
                    <a href="/admin/matches/by-status" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Matches By Status
                    </a>
                  </div>
                </div>

                {/* Performance — expanded */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-5")}
                  className={[
                    dashboard["collapsible"],
                    dashboard["collapsible--expanded"],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#performance"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Performance</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-5")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/performance/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Record Performance
                    </a>
                    <a href="/admin/performance/by-match" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      By Match
                    </a>
                    <a href="/admin/performance/season-totals" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Season Totals
                    </a>
                  </div>
                </div>

                {/* Admins */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-6")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-6" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#admin"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Admins</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-6")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/admins/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Add Admin
                    </a>
                    <a href="/admin/admins" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      View Admins
                    </a>
                  </div>
                </div>

                {/* Profile */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleChevron("chevron-7")}
                  className={[
                    dashboard["collapsible"],
                    dashboard[activeChevron === "chevron-7" ? "collapsible--expanded" : null],
                  ].join(" ")}
                >
                  <header className={dashboard["collapsible__header"]}>
                    <div className={dashboard["collapsible__icon"]}>
                      <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                        <use href="/images/sprite.svg#profile"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Profile</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-7")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/admin/profile" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      My Profile
                    </a>
                    <a href="/admin/change-password" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Change Password
                    </a>
                  </div>
                </div>
              </List>
            </Drawer>

            {/* Main */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginTop: 8,
                fontSize: 18,
                overflowX: "auto",
                width: "100%",
                color: "#9a99ac",
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <div className={dashboard["secondary--container"]}>
                {/* Match header card */}
                <div className={[dashboard["card--add"], dashboard["card--primary"]].join(" ")}>
                  <div className={dashboard["card_body"]}>
                    <div className={dashboard["card--small-head"]}>
                      {homeTeamName} <span style={{ color: "#9a99ac" }}>vs</span> {awayTeamName}
                    </div>
                    <p style={{ fontSize: 14, margin: "0.5rem 0", color: "#9a99ac" }}>
                      {side === "home" ? "Home" : "Away"} Players Performance — {sideTeamName}
                      {match?.matchDate ? ` · ${match.matchDate}` : ""}
                      {match?.venue ? ` · ${match.venue}` : ""}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/admin/performance/add?matchId=${matchId}&side=${side}`)
                      }
                      className={[dashboard["btn"], dashboard["btn--block"], dashboard["btn--primary"]].join(" ")}
                    >
                      + Record Performance
                    </button>
                  </div>
                </div>

                {/* Performance table */}
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table sx={{ minWidth: 800 }} aria-label="performance table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">Player</StyledTableCell>
                        <StyledTableCell align="left">Goals</StyledTableCell>
                        <StyledTableCell align="left">Assists</StyledTableCell>
                        <StyledTableCell align="left">Yellow</StyledTableCell>
                        <StyledTableCell align="left">Red</StyledTableCell>
                        <StyledTableCell align="left">Minutes</StyledTableCell>
                        <StyledTableCell align="left">Started</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPerf.length === 0 ? (
                        <StyledTableRow>
                          <StyledTableCell colSpan={9} align="center">
                            No performances recorded yet for{" "}
                            {side === "home" ? "home" : "away"} players.
                          </StyledTableCell>
                        </StyledTableRow>
                      ) : (
                        filteredPerf.map((row, index) => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {[row.firstname, row.surname].filter(Boolean).join(" ") || "—"}
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.goals ?? 0}</StyledTableCell>
                            <StyledTableCell align="left">{row.assists ?? 0}</StyledTableCell>
                            <StyledTableCell align="left">{row.yellowCards ?? 0}</StyledTableCell>
                            <StyledTableCell align="left">{row.redCards ?? 0}</StyledTableCell>
                            <StyledTableCell align="left">{row.minutesPlayed ?? 0}</StyledTableCell>
                            <StyledTableCell align="left">{row.started ? "Yes" : "No"}</StyledTableCell>
                            <StyledTableCell align="right">
                              <PerformanceActionMenu
                                row={row}
                                onDelete={handleDelete}
                                onView={handleView}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Back button */}
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <button
                    onClick={() => navigate("/admin/performance/by-match")}
                    className={[dashboard["btn"], dashboard["btn--primary"]].join(" ")}
                  >
                    ← Back to Matches
                  </button>
                </div>
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default MatchPerformanceDetails;