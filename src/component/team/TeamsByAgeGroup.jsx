import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllTeamsWithPlayerCount } from "../../redux/reducer/teamSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const AGE_GROUP_ORDER = ["U-10", "U-13", "U-15", "U-17", "U-20", "Senior"];

const TeamsByAgeGroup = () => {
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

  const teamState = useSelector((state) => state.teams);
  const { teams, fetchingStatus } = teamState;
  const teamList = Array.isArray(teams) ? teams : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

  useEffect(() => {
    dispatch(getAllTeamsWithPlayerCount());
  }, [dispatch, location.pathname]);

  // Group teams by ageGroup, keeping the known order first, then any extras
  const grouped = teamList.reduce((acc, team) => {
    const key = team.ageGroup || "Unassigned";
    if (!acc[key]) acc[key] = [];
    acc[key].push(team);
    return acc;
  }, {});

  const orderedGroups = [
    ...AGE_GROUP_ORDER.filter((g) => grouped[g]?.length > 0),
    ...Object.keys(grouped).filter(
      (g) => !AGE_GROUP_ORDER.includes(g) && grouped[g]?.length > 0
    ),
  ];

  return (
    <>
      {fetchingStatus === "loading" ? (
        <Loading />
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar
              position="fixed"
              sx={{ zIndex: 2, background: "white", color: "#d71b3b" }}
            >
              <Toolbar
                sx={{
                  zIndex: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {!isLargeScreen && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={toggleDrawer}
                  >
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
                    <PersonOutlineOutlinedIcon
                      sx={{ color: "white", fontSize: 25 }}
                    />
                  </IconButton>

                  <BasePopup
                    sx={{ zIndex: 2 }}
                    id={idProfile}
                    open={openProfile}
                    anchor={anchorProfile}
                  >
                    <div className={dashboard["profile--selection__container"]}>
                      <div className={dashboard["profile"]}>
                        <a
                          href="/admin/profile"
                          className={dashboard["link--profile"]}
                        >
                          Profile
                        </a>
                      </div>
                      <div className={dashboard["logout"]}>
                        <a
                          onClick={logout}
                          className={dashboard["link--profile"]}
                        >
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
                "& .MuiBackdrop-root": {
                  backgroundColor: "rgba(215, 27, 59, 0.15)",
                },
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
                  <a
                    className={[dashboard["logo__link"], dashboard["logo"]].join(
                      " "
                    )}
                    href="#"
                  >
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
             
             
             
             {/* Training */}
             <div
               style={{ cursor: "pointer" }}
               onClick={() => toggleChevron("chevron-8")}
               className={[
                 dashboard["collapsible"],
                 dashboard[activeChevron === "chevron-8" ? "collapsible--expanded" : null],
               ].join(" ")}
             >
               <header className={dashboard["collapsible__header"]}>
                 <div className={dashboard["collapsible__icon"]}>
                   <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                     <use href="/images/sprite.svg#training"></use>
                   </svg>
                   <p className={dashboard["collapsible__heading"]}>Training</p>
                 </div>
                 <span onClick={() => toggleChevron("chevron-8")} className={dashboard["icon-container"]}>
                   <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                     <use href="/images/sprite.svg#chevron"></use>
                   </svg>
                 </span>
               </header>
               <div className={dashboard["collapsible__content--drawer"]}>
                 <a href="/admin/trainings/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                   Add Training
                 </a>
                 <a href="/admin/trainings" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                   View Trainings
                 </a>
               </div>
             </div>
             
             {/* Activities */}
             <div
               style={{ cursor: "pointer" }}
               onClick={() => toggleChevron("chevron-9")}
               className={[
                 dashboard["collapsible"],
                 dashboard[activeChevron === "chevron-9" ? "collapsible--expanded" : null],
               ].join(" ")}
             >
               <header className={dashboard["collapsible__header"]}>
                 <div className={dashboard["collapsible__icon"]}>
                   <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                     <use href="/images/sprite.svg#activity"></use>
                   </svg>
                   <p className={dashboard["collapsible__heading"]}>Activities</p>
                 </div>
                 <span onClick={() => toggleChevron("chevron-9")} className={dashboard["icon-container"]}>
                   <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                     <use href="/images/sprite.svg#chevron"></use>
                   </svg>
                 </span>
               </header>
               <div className={dashboard["collapsible__content--drawer"]}>
                 <a href="/admin/activities/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                   Add Activity
                 </a>
                 <a href="/admin/activities" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                   View Activities
                 </a>
                 <a href="/admin/activities/videos" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                   Videos
                 </a>
                 <a href="/admin/activities/images" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                   Images
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
             
                             {/* Performance */}
                             <div
                               style={{ cursor: "pointer" }}
                               onClick={() => toggleChevron("chevron-5")}
                               className={[
                                 dashboard["collapsible"],
                                 dashboard[activeChevron === "chevron-5" ? "collapsible--expanded" : null],
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

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginTop: 8,
                fontSize: 23,
                overflowX: "auto",
                width: "100%",
                color: "#9a99ac",
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <div className={dashboard["secondary--container"]}>
                {teamList.length === 0 ? (
                  <div className={dashboard["empty"]}>
                    <h4 className={dashboard["empty__title"]}>No teams yet</h4>
                    <p className={dashboard["empty__text"]}>
                      Add a team first, then it will appear grouped by age group.
                    </p>
                  </div>
                ) : (
                  <>
                    {orderedGroups.map((group) => (
                      <section
                        key={group}
                        className={dashboard["agegroup__section"]}
                      >
                        <header className={dashboard["agegroup__header"]}>
                          <h2 className={dashboard["agegroup__title"]}>
                            {group}
                          </h2>
                          <span
                            className={[
                              dashboard["badge"],
                              dashboard["badge--secondary"],
                            ].join(" ")}
                          >
                            {grouped[group].length}{" "}
                            {grouped[group].length === 1 ? "team" : "teams"}
                          </span>
                        </header>

                        <div className={dashboard["grid--1x3"]}>
                          {grouped[group].map((team) => (
                            <div
                              key={team.id}
                              className={dashboard["team__card"]}
                              onClick={() =>
                                navigate(`/admin/teams/details/${team.id}`)
                              }
                            >
                              <div className={dashboard["team__body"]}>
                                <h3 className={dashboard["team__name"]}>
                                  {team.name}
                                </h3>
                                <p className={dashboard["team__division"]}>
                                  {team.division || "—"}
                                </p>
                                <div className={dashboard["team__meta"]}>
                                  <span className={dashboard["team__metaItem"]}>
                                    Coach: {team.coachName || "—"}
                                  </span>
                                  <span className={dashboard["team__metaItem"]}>
                                    Players: {team.playerCount ?? 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </>
                )}
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default TeamsByAgeGroup;