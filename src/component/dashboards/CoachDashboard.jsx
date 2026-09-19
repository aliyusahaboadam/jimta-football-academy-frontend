import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedCoach } from "../../redux/reducer/coachSlice";
import { getMatchesByTeamId } from "../../redux/reducer/matchSlice";
import { getPlayersByTeamId } from "../../redux/reducer/playerSlice";
import { getTeamsByCoachId } from "../../redux/reducer/teamSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import DashboardCharts from "./DashboardCharts";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const CoachDashboard = () => {
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

  const coachState = useSelector((state) => state.coaches);
  const { coach, fetchingStatus } = coachState;

  const teamState = useSelector((state) => state.teams);
  const { teams } = teamState;
  const teamList = Array.isArray(teams) ? teams : [];

  const matchState = useSelector((state) => state.matches);
  const { matches } = matchState;
  const matchList = Array.isArray(matches) ? matches : [];

  const playerState = useSelector((state) => state.players);
  const { players } = playerState;
  const playerList = Array.isArray(players) ? players : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dispatch(getAuthenticatedCoach()).unwrap();
        if (res?.id) {
          const teamRes = await dispatch(getTeamsByCoachId(res.id)).unwrap();
          const firstTeam = Array.isArray(teamRes) ? teamRes[0] : null;
          if (firstTeam?.id) {
            dispatch(getMatchesByTeamId(firstTeam.id));
            dispatch(getPlayersByTeamId(firstTeam.id));
          }
        }
      } catch (err) {
        console.error("Coach dashboard fetch failed:", err);
      }
    };
    fetch();
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

  const primaryTeam = teamList[0];
  const upcomingCount = matchList.filter((m) => m.status === "SCHEDULED").length;
  const completedCount = matchList.filter((m) => m.status === "COMPLETED").length;

  return (
    <>
      {fetchingStatus === "loading" ? (
        <Loading />
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

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
                        <a href="/coach/profile" className={dashboard["link--profile"]}>
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
                    <a href="/coach/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Home
                    </a>
                  </div>
                </div>

                {/* My Team */}
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
                        <use href="/images/sprite.svg#team"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>My Team</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-1")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/coach/team" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Team Overview
                    </a>
                    <a href="/coach/players" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      My Players
                    </a>
                  </div>
                </div>

                {/* Matches */}
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
                        <use href="/images/sprite.svg#match"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Matches</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-2")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/coach/matches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Upcoming Matches
                    </a>
                    <a href="/coach/matches/results" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Match Results
                    </a>
                  </div>
                </div>

                {/* Performance */}
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
                        <use href="/images/sprite.svg#performance"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Performance</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-3")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/coach/performance/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Record Performance
                    </a>
                    <a href="/coach/performance" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Performance Reports
                    </a>
                  </div>
                </div>

                {/* Profile */}
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
                        <use href="/images/sprite.svg#profile"></use>
                      </svg>
                      <p className={dashboard["collapsible__heading"]}>Profile</p>
                    </div>
                    <span onClick={() => toggleChevron("chevron-4")} className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                        <use href="/images/sprite.svg#chevron"></use>
                      </svg>
                    </span>
                  </header>
                  <div className={dashboard["collapsible__content--drawer"]}>
                    <a href="/coach/profile" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      My Profile
                    </a>
                    <a href="/coach/change-password" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                      Change Password
                    </a>
                  </div>
                </div>
              </List>
            </Drawer>

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
                {/* Welcome */}
                <div className={[dashboard["card--add"], dashboard["card--primary"]].join(" ")}>
                  <div className={dashboard["card_body"]}>
                    <div className={dashboard["card--small-head"]}>
                      Welcome{coach?.firstname ? `, ${coach.firstname}` : ""}
                    </div>
                    <p style={{ fontSize: 14, margin: "0.5rem 0", color: "#9a99ac" }}>
                      {primaryTeam ? `You manage ${primaryTeam.name}` : "No team assigned yet"}
                    </p>
                  </div>
                </div>

                {/* Real stat cards */}
                <div className={[dashboard["grid"], dashboard["grid--1x3"]].join(" ")} style={{ marginTop: "2rem" }}>
                  <div className={[dashboard["card--count"], dashboard["card--primary"]].join(" ")}>
                    <div className={dashboard["card_body"]}>
                      <div className={dashboard["card_button_and_icon"]}>
                        <span className={dashboard["icon-container"]}>
                          <svg className={[dashboard["icon--big"], dashboard["icon--primary"]].join(" ")}>
                            <use href="/images/sprite.svg#player"></use>
                          </svg>
                        </span>
                        <span className={dashboard["badge"]}>{playerList.length}</span>
                      </div>
                      Players in My Team
                    </div>
                  </div>

                  <div className={[dashboard["card--count"], dashboard["card--primary"]].join(" ")}>
                    <div className={dashboard["card_body"]}>
                      <div className={dashboard["card_button_and_icon"]}>
                        <span className={dashboard["icon-container"]}>
                          <svg className={[dashboard["icon--big"], dashboard["icon--primary"]].join(" ")}>
                            <use href="/images/sprite.svg#match"></use>
                          </svg>
                        </span>
                        <span className={dashboard["badge"]}>{upcomingCount}</span>
                      </div>
                      Upcoming Matches
                    </div>
                  </div>

                  <div className={[dashboard["card--count"], dashboard["card--primary"]].join(" ")}>
                    <div className={dashboard["card_body"]}>
                      <div className={dashboard["card_button_and_icon"]}>
                        <span className={dashboard["icon-container"]}>
                          <svg className={[dashboard["icon--big"], dashboard["icon--primary"]].join(" ")}>
                            <use href="/images/sprite.svg#match"></use>
                          </svg>
                        </span>
                        <span className={dashboard["badge"]}>{completedCount}</span>
                      </div>
                      Completed Matches
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className={[dashboard["grid"], dashboard["grid--1x3"]].join(" ")} style={{ marginTop: "1.5rem" }}>
                  <div
                    className={[dashboard["card--count"], dashboard["card--primary"]].join(" ")}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/coach/players")}
                  >
                    <div className={dashboard["card_body"]}>
                      <div className={dashboard["card--small-head"]}>My Players</div>
                      <div className={dashboard["card_footer"]}>View →</div>
                    </div>
                  </div>

                  <div
                    className={[dashboard["card--count"], dashboard["card--secondary"]].join(" ")}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/coach/matches")}
                  >
                    <div className={dashboard["card_body"]}>
                      <div className={dashboard["card--small-head"]}>Upcoming Matches</div>
                      <div className={dashboard["card_footer"]}>View →</div>
                    </div>
                  </div>

                  <div
                    className={[dashboard["card--count"], dashboard["card--primary"]].join(" ")}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/coach/performance/add")}
                  >
                    <div className={dashboard["card_body"]}>
                      <div className={dashboard["card--small-head"]}>Record Performance</div>
                      <div className={dashboard["card_footer"]}>Open →</div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <DashboardCharts role="coach" />
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default CoachDashboard;