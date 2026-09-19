import { IconButton, Snackbar, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { number, object, string } from "yup";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

import { getAuthenticatedCoach } from "../../redux/reducer/coachSlice";
import { getMatchesByTeamId } from "../../redux/reducer/matchSlice";
import { savePerformance } from "../../redux/reducer/performanceSlice";
import { getPlayersByTeamId } from "../../redux/reducer/playerSlice";
import { getTeamsByCoachId } from "../../redux/reducer/teamSlice";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

const CoachRecordPerformance = () => {
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

  const [searchParams] = useSearchParams();
  const prefilledMatchId = searchParams.get("matchId") || "";

  const perfSchema = object({
    matchId: string().required("Match is required"),
    playerId: string().required("Player is required"),
    goals: number().typeError("Must be a number").integer().min(0).nullable(),
    assists: number().typeError("Must be a number").integer().min(0).nullable(),
    yellowCards: number().typeError("Must be a number").integer().min(0).nullable(),
    redCards: number().typeError("Must be a number").integer().min(0).nullable(),
    minutesPlayed: number().typeError("Must be a number").integer().min(0).nullable(),
    started: string().required("Started is required"),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  const perfState = useSelector((state) => state.performances);
  const { savingStatus } = perfState;

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
        const coachRes = await dispatch(getAuthenticatedCoach()).unwrap();
        if (coachRes?.id) {
          const teamRes = await dispatch(getTeamsByCoachId(coachRes.id)).unwrap();
          const firstTeam = Array.isArray(teamRes) ? teamRes[0] : null;
          if (firstTeam?.id) {
            dispatch(getMatchesByTeamId(firstTeam.id));
            dispatch(getPlayersByTeamId(firstTeam.id));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const playerName = (p) =>
    [p?.firstname, p?.surname, p?.lastname].filter(Boolean).join(" ") ||
    p?.profile?.firstname ||
    `Player #${p?.id}`;

  const matchLabel = (m) => {
    const h = m.homeTeamName || m.homeTeam?.name || "Home";
    const a = m.awayTeamName || m.awayTeam?.name || "Away";
    return `${h} vs ${a}${m.matchDate ? ` — ${m.matchDate}` : ""}`;
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const payload = {
      matchId: Number(values.matchId),
      playerId: Number(values.playerId),
      goals: values.goals ? Number(values.goals) : 0,
      assists: values.assists ? Number(values.assists) : 0,
      yellowCards: values.yellowCards ? Number(values.yellowCards) : 0,
      redCards: values.redCards ? Number(values.redCards) : 0,
      minutesPlayed: values.minutesPlayed ? Number(values.minutesPlayed) : 0,
      started: values.started === "true",
    };

    try {
      const result = await dispatch(savePerformance(payload)).unwrap();
      setAlertType("success");
      setMessage(result.message || "Performance recorded successfully");
    } catch (error) {
      setAlertType("error");
      setMessage(error?.message || String(error) || "Something went wrong");
    }

    setOpen(true);
    resetForm();
  };

  return (
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

            {/* Performance — expanded */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-3")}
              className={[dashboard["collapsible"], dashboard["collapsible--expanded"]].join(" ")}
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
            fontSize: 23,
            overflowX: "auto",
            width: "100%",
            color: "#9a99ac",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          <div className={style["form-page"]}>
            <Formik
              initialValues={{
                matchId: prefilledMatchId,
                playerId: "",
                goals: "",
                assists: "",
                yellowCards: "",
                redCards: "",
                minutesPlayed: "",
                started: "true",
              }}
              validationSchema={perfSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                errors,
                handleChange,
                handleSubmit,
                values,
                isSubmitting,
                touched,
                handleBlur,
              }) => (
                <div className={style.form}>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  <p className={style["form-header"]}>Record Performance</p>

                  <h3 className={style["form-section"]}>Match & Player</h3>

                  <FormControl fullWidth margin="normal" error={touched.matchId && Boolean(errors.matchId)}>
                    <InputLabel sx={{ fontSize: 16 }}>Match</InputLabel>
                    <Select
                      label="Match"
                      name="matchId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.matchId}
                      sx={{ fontSize: 18 }}
                    >
                      {matchList.length === 0 ? (
                        <MenuItem disabled sx={{ fontSize: 18 }} value="">
                          No matches available
                        </MenuItem>
                      ) : (
                        matchList.map((m) => (
                          <MenuItem key={m.id} sx={{ fontSize: 18 }} value={m.id}>
                            {matchLabel(m)}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>
                      {touched.matchId && errors.matchId}
                    </FormHelperText>
                  </FormControl>

                  <FormControl fullWidth margin="normal" error={touched.playerId && Boolean(errors.playerId)}>
                    <InputLabel sx={{ fontSize: 16 }}>Player</InputLabel>
                    <Select
                      label="Player"
                      name="playerId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.playerId}
                      sx={{ fontSize: 18 }}
                    >
                      {playerList.length === 0 ? (
                        <MenuItem disabled sx={{ fontSize: 18 }} value="">
                          No players available
                        </MenuItem>
                      ) : (
                        playerList.map((p) => (
                          <MenuItem key={p.id} sx={{ fontSize: 18 }} value={p.id}>
                            {playerName(p)}
                            {p.jerseyNumber != null ? ` — #${p.jerseyNumber}` : ""}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>
                      {touched.playerId && errors.playerId}
                    </FormHelperText>
                  </FormControl>

                  <h3 className={style["form-section"]}>Stats</h3>

                  <TextField
                    label="Goals"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.goals}
                    name="goals"
                    error={touched.goals && Boolean(errors.goals)}
                    helperText={touched.goals && errors.goals}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Assists"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.assists}
                    name="assists"
                    error={touched.assists && Boolean(errors.assists)}
                    helperText={touched.assists && errors.assists}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Yellow Cards"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.yellowCards}
                    name="yellowCards"
                    error={touched.yellowCards && Boolean(errors.yellowCards)}
                    helperText={touched.yellowCards && errors.yellowCards}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Red Cards"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.redCards}
                    name="redCards"
                    error={touched.redCards && Boolean(errors.redCards)}
                    helperText={touched.redCards && errors.redCards}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Minutes Played"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.minutesPlayed}
                    name="minutesPlayed"
                    error={touched.minutesPlayed && Boolean(errors.minutesPlayed)}
                    helperText={touched.minutesPlayed && errors.minutesPlayed}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <FormControl fullWidth margin="normal" error={touched.started && Boolean(errors.started)}>
                    <InputLabel sx={{ fontSize: 16 }}>Started</InputLabel>
                    <Select
                      label="Started"
                      name="started"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.started}
                      sx={{ fontSize: 18 }}
                    >
                      <MenuItem sx={{ fontSize: 18 }} value="true">Yes</MenuItem>
                      <MenuItem sx={{ fontSize: 18 }} value="false">No</MenuItem>
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>
                      {touched.started && errors.started}
                    </FormHelperText>
                  </FormControl>

                  <button
                    disabled={isSubmitting || savingStatus === "loading"}
                    type="submit"
                    onClick={handleSubmit}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                  >
                    {isSubmitting || savingStatus === "loading" ? "Saving..." : "Record Performance"}
                  </button>
                </div>
              )}
            </Formik>

            <div className={style.footer__brand}>
              <img src="/images/jimta_home_logo.png" alt="Jimta" />
              <p className={style.footer__copyright}>(c) 2026 Jimta, All Rights Reserved</p>
            </div>
          </div>
        </Box>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
        >
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              BackdropProps={{ sx: { backgroundColor: "rgba(215, 27, 59, 0.2)" } }}
              sx={{ "& .MuiDialog-paper": { width: "100%", borderRadius: "15px" } }}
            >
              {alertType === "success" ? (
                <div style={{ width: "100%", background: "#fff" }} className={dashboard["card--alert-success"]}>
                  <div className={dashboard["card_body"]}>
                    <span className={[dashboard["icon-container"], dashboard["alert-close"]].join(" ")}>
                      <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: 30, color: "#d71b3b" }} />
                      </IconButton>
                    </span>
                    <span className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon--big"], dashboard["icon--success"]].join(" ")}>
                        <use href="/images/sprite.svg#success-icon"></use>
                      </svg>
                    </span>
                    <Typography sx={{ fontSize: 21 }}>
                      <p className={dashboard["alert-message"]}>{message}</p>
                    </Typography>
                  </div>
                  <Typography sx={{ fontSize: 20 }}>
                    <p className={dashboard["card_footer"]}>success</p>
                  </Typography>
                </div>
              ) : (
                <div style={{ width: "100%", background: "#fff" }} className={dashboard["card--alert-error"]}>
                  <div className={dashboard["card_body"]}>
                    <span className={[dashboard["icon-container"], dashboard["alert-close"]].join(" ")}>
                      <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </span>
                    <span className={dashboard["icon-container"]}>
                      <svg className={[dashboard["icon--big"], dashboard["icon--error"]].join(" ")}>
                        <use href="/images/sprite.svg#error-icon"></use>
                      </svg>
                    </span>
                    <Typography sx={{ fontSize: 21 }}>
                      <p className={dashboard["alert-message"]}>{message}</p>
                    </Typography>
                  </div>
                  <Typography sx={{ fontSize: 20 }}>
                    <p className={dashboard["card_footer"]}>error</p>
                  </Typography>
                </div>
              )}
            </Dialog>
          </div>
        </Snackbar>
      </Box>
    </ClickAwayListener>
  );
};

export default CoachRecordPerformance;