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
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

import { getAuthenticatedCoach } from "../../redux/reducer/coachSlice";
import { getTeamsByCoachId } from "../../redux/reducer/teamSlice";
import { saveTrainingAsCoach } from "../../redux/reducer/trainingSlice";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

const CoachAddTraining = () => {
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

  const schema = object({
    title: string().max(120, "Too long").required("Title is required"),
    description: string().max(1000, "Too long"),
    trainingDate: string().required("Date is required"),
    startTime: string().required("Start time is required"),
    endTime: string(),
    venue: string().max(200, "Too long").required("Venue is required"),
    teamId: string().required("Team is required"),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  const trainingState = useSelector((state) => state.trainings);
  const { savingStatus } = trainingState;

  const teamState = useSelector((state) => state.teams);
  const { teams } = teamState;
  const teamList = Array.isArray(teams) ? teams : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dispatch(getAuthenticatedCoach()).unwrap();
        if (res?.id) dispatch(getTeamsByCoachId(res.id));
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

  const handleFormSubmit = async (values, { resetForm }) => {
    const payload = {
      title: values.title,
      description: values.description || null,
      trainingDate: values.trainingDate,
      startTime: values.startTime,
      endTime: values.endTime || null,
      venue: values.venue,
      teamId: Number(values.teamId),
    };

    try {
      const result = await dispatch(saveTrainingAsCoach(payload)).unwrap();
      setAlertType("success");
      setMessage(result.message || "Training added successfully");
      setTimeout(() => navigate("/coach/trainings"), 1200);
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
              <IconButton onClick={profilePopup}
                sx={{ backgroundColor: "#d71b3b", "&:hover": { backgroundColor: "#b8152f" } }}>
                <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
              </IconButton>
              <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                <div className={dashboard["profile--selection__container"]}>
                  <div className={dashboard["profile"]}>
                    <a href="/coach/profile" className={dashboard["link--profile"]}>Profile</a>
                  </div>
                  <div className={dashboard["logout"]}>
                    <a onClick={logout} className={dashboard["link--profile"]}>Logout</a>
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
            width: 240, flexShrink: 0,
            "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
            "& .MuiBackdrop-root": { backgroundColor: "rgba(215, 27, 59, 0.15)" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
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
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-5")}
              className={[dashboard["collapsible"], dashboard["collapsible--expanded"]].join(" ")}>
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                    <use href="/images/sprite.svg#training"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Training</p>
                </div>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a href="/coach/trainings" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>My Trainings</a>
                <a href="/coach/trainings/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Add Training</a>
              </div>
            </div>
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-0")} className={dashboard["collapsible"]}>
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                    <use href="/images/sprite.svg#dashboard"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Dashboard</p>
                </div>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a href="/coach/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Home</a>
              </div>
            </div>
          </List>
        </Drawer>

        <Box component="main"
          sx={{
            flexGrow: 1, marginTop: 8, fontSize: 23, overflowX: "auto",
            width: "100%", color: "#9a99ac", transition: "margin-left 0.3s ease-in-out",
          }}
        >
          <div className={style["form-page"]}>
            <Formik
              initialValues={{
                title: "", description: "", trainingDate: "",
                startTime: "", endTime: "", venue: "", teamId: "",
              }}
              validationSchema={schema}
              onSubmit={handleFormSubmit}
            >
              {({ errors, handleChange, handleSubmit, values, isSubmitting, touched, handleBlur }) => (
                <div className={style.form}>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  <p className={style["form-header"]}>Add Training</p>

                  <TextField label="Title" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.title} name="title"
                    error={touched.title && Boolean(errors.title)} helperText={touched.title && errors.title}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <TextField label="Description" multiline rows={3} fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.description} name="description"
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <TextField label="Training Date" type="date" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.trainingDate} name="trainingDate"
                    error={touched.trainingDate && Boolean(errors.trainingDate)} helperText={touched.trainingDate && errors.trainingDate}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 }, shrink: true } }}
                  />

                  <TextField label="Start Time" type="time" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.startTime} name="startTime"
                    error={touched.startTime && Boolean(errors.startTime)} helperText={touched.startTime && errors.startTime}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 }, shrink: true } }}
                  />

                  <TextField label="End Time (optional)" type="time" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.endTime} name="endTime"
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 }, shrink: true } }}
                  />

                  <TextField label="Venue" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.venue} name="venue"
                    error={touched.venue && Boolean(errors.venue)} helperText={touched.venue && errors.venue}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <FormControl fullWidth margin="normal" error={touched.teamId && Boolean(errors.teamId)}>
                    <InputLabel sx={{ fontSize: 16 }}>Team</InputLabel>
                    <Select label="Team" name="teamId" onChange={handleChange} onBlur={handleBlur} value={values.teamId} sx={{ fontSize: 18 }}>
                      {teamList.length === 0 ? (
                        <MenuItem disabled sx={{ fontSize: 18 }} value="">No teams assigned to you</MenuItem>
                      ) : (
                        teamList.map((t) => (
                          <MenuItem key={t.id} sx={{ fontSize: 18 }} value={t.id}>
                            {t.name}{t.ageGroup ? ` (${t.ageGroup})` : ""}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>{touched.teamId && errors.teamId}</FormHelperText>
                  </FormControl>

                  <button
                    disabled={isSubmitting || savingStatus === "loading"}
                    type="submit" onClick={handleSubmit}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                  >
                    {isSubmitting || savingStatus === "loading" ? "Saving..." : "Save Training"}
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

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "center", horizontal: "center" }}>
          <div>
            <Dialog open={open} onClose={handleClose}
              BackdropProps={{ sx: { backgroundColor: "rgba(215, 27, 59, 0.2)" } }}
              sx={{ "& .MuiDialog-paper": { width: "100%", borderRadius: "15px" } }}
            >
              {alertType === "success" ? (
                <div style={{ width: "100%", background: "#fff" }} className={dashboard["card--alert-success"]}>
                  <div className={dashboard["card_body"]}>
                    <span className={[dashboard["icon-container"], dashboard["alert-close"]].join(" ")}>
                      <IconButton onClick={handleClose}><CloseIcon sx={{ fontSize: 30, color: "#d71b3b" }} /></IconButton>
                    </span>
                    <Typography sx={{ fontSize: 21 }}><p className={dashboard["alert-message"]}>{message}</p></Typography>
                  </div>
                </div>
              ) : (
                <div style={{ width: "100%", background: "#fff" }} className={dashboard["card--alert-error"]}>
                  <div className={dashboard["card_body"]}>
                    <span className={[dashboard["icon-container"], dashboard["alert-close"]].join(" ")}>
                      <IconButton onClick={handleClose}><CloseIcon sx={{ fontSize: 30 }} /></IconButton>
                    </span>
                    <Typography sx={{ fontSize: 21 }}><p className={dashboard["alert-message"]}>{message}</p></Typography>
                  </div>
                </div>
              )}
            </Dialog>
          </div>
        </Snackbar>
      </Box>
    </ClickAwayListener>
  );
};

export default CoachAddTraining;