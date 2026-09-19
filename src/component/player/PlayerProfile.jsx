import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedPlayer } from "../../redux/reducer/playerSlice";
import { getProfileByPlayerId } from "../../redux/reducer/profileSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const PHOTO_BASE = "https://images-0.s3.us-west-2.amazonaws.com/";

const PlayerProfile = () => {
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

  const playerState = useSelector((state) => state.players);
  const { player, fetchingStatus } = playerState;

  const profileState = useSelector((state) => state.profiles);
  const { profile } = profileState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAuthenticatedPlayer()).then((res) => {
      const id = res?.payload?.id;
      if (id) dispatch(getProfileByPlayerId(id));
    });
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

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
                          href="/player/profile"
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
                               <a href="/player/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
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
                               <a href="/player/team" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 Team Info
                               </a>
                               <a href="/player/teammates" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 Teammates
                               </a>
                             </div>
                           </div>
           
                             
                             {/* Training */}
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
                   <use href="/images/sprite.svg#training"></use>
                 </svg>
                 <p className={dashboard["collapsible__heading"]}>Training</p>
               </div>
               <span onClick={() => toggleChevron("chevron-5")} className={dashboard["icon-container"]}>
                 <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                   <use href="/images/sprite.svg#chevron"></use>
                 </svg>
               </span>
             </header>
             <div className={dashboard["collapsible__content--drawer"]}>
               <a href="/player/trainings" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                 My Trainings
               </a>
             </div>
           </div>
           
           {/* Activities */}
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
                   <use href="/images/sprite.svg#activity"></use>
                 </svg>
                 <p className={dashboard["collapsible__heading"]}>Activities</p>
               </div>
               <span onClick={() => toggleChevron("chevron-6")} className={dashboard["icon-container"]}>
                 <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                   <use href="/images/sprite.svg#chevron"></use>
                 </svg>
               </span>
             </header>
             <div className={dashboard["collapsible__content--drawer"]}>
               <a href="/player/activities" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                 View Activities
               </a>
               <a href="/player/activities/videos" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                 Videos
               </a>
               <a href="/player/activities/images" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                 Images
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
                               <a href="/player/matches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 Upcoming Matches
                               </a>
                               <a href="/player/matches/results" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 Match Results
                               </a>
                             </div>
                           </div>
           
                           {/* My Performance */}
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
                                 <p className={dashboard["collapsible__heading"]}>My Performance</p>
                               </div>
                               <span onClick={() => toggleChevron("chevron-3")} className={dashboard["icon-container"]}>
                                 <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                                   <use href="/images/sprite.svg#chevron"></use>
                                 </svg>
                               </span>
                             </header>
                             <div className={dashboard["collapsible__content--drawer"]}>
                               <a href="/player/performance" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 Match Stats
                               </a>
                               <a href="/player/performance/season-totals" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 Season Totals
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
                               <a href="/player/profile" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                 My Profile
                               </a>
                               <a href="/player/change-password" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
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
                <div className={dashboard["card--details__wrapper"]}>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  {/* Photo */}
                  {player?.photoUrl && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.8rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <img
                        src={PHOTO_BASE + player.photoUrl}
                        alt="My photo"
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #d71b3b",
                        }}
                      />
                      <button
                        onClick={() => navigate("/player/upload-photo")}
                        className={[
                          style["btn"],
                          style["btn--primary"],
                        ].join(" ")}
                        style={{
                          fontSize: "1.3rem",
                          padding: "0.6rem 1.4rem",
                          margin: 0,
                        }}
                      >
                        Change Photo
                      </button>
                    </div>
                  )}

                  {!player?.photoUrl && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.8rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          backgroundColor: "#f3f3f3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                          color: "#9a99ac",
                        }}
                      >
                        No photo
                      </div>
                      <button
                        onClick={() => navigate("/player/upload-photo")}
                        className={[
                          style["btn"],
                          style["btn--primary"],
                        ].join(" ")}
                        style={{
                          fontSize: "1.3rem",
                          padding: "0.6rem 1.4rem",
                          margin: 0,
                        }}
                      >
                        Upload Photo
                      </button>
                    </div>
                  )}

                  <p className={style["form-header"]}>Player Profile</p>

                  <div className={dashboard["card--details"]}>
                    <span>Firstname:</span>{" "}
                    {profile?.firstname || player?.firstname || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Surname:</span>{" "}
                    {profile?.surname || player?.surname || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Lastname:</span>{" "}
                    {profile?.lastname || player?.lastname || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Phone:</span> {profile?.phoneNumber || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Date of Birth:</span> {profile?.dateOfBirth || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Gender:</span> {profile?.gender || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Position:</span> {player?.position || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Jersey Number:</span> {player?.jerseyNumber ?? "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Nationality:</span> {player?.nationality || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Preferred Foot:</span> {player?.preferredFoot || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Previous Club:</span> {player?.previousClub || "—"}
                  </div>

                  <button
                    onClick={() => navigate("/player/change-password")}
                    className={[
                      style["btn"],
                      style["btn--block"],
                      style["btn--primary"],
                    ].join(" ")}
                    style={{ marginTop: "1.5rem" }}
                  >
                    Change Password
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

export default PlayerProfile;