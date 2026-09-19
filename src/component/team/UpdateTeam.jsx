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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { object, string } from "yup";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

import { getAllCoaches } from "../../redux/reducer/coachSlice";
import { getTeamById, updateTeam } from "../../redux/reducer/teamSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

const AGE_GROUPS = ["U-10", "U-13", "U-15", "U-17", "U-20", "Senior"];
const DIVISIONS = ["Division A", "Division B", "Division C", "Youth League"];

const UpdateTeam = () => {
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

  const { id } = useParams();

  const schema = object({
    name: string().max(30, "Too long").required("Team name is required"),
    ageGroup: string().required("Age group is required"),
    division: string().required("Division is required"),
    coachId: string().required("Coach is required"),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name: "",
    ageGroup: "",
    division: "",
    coachId: "",
  });

  const teamState = useSelector((state) => state.teams);
  const { updateStatus } = teamState;

  const coachState = useSelector((state) => state.coaches);
  const { coaches } = coachState;
  const coachList = Array.isArray(coaches) ? coaches : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getTeamById(id)).unwrap();
        setInitialValues({
          name: result.name || "",
          ageGroup: result.ageGroup || "",
          division: result.division || "",
          coachId: result.coachId ?? "",
        });
      } catch (error) {
        setAlertType("error");
        setMessage(error?.message || "Failed to load team");
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    dispatch(getAllCoaches());
  }, [dispatch, id, location.pathname]);

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
    try {
      const result = await dispatch(
        updateTeam({
          id: Number(id),
          teamData: {
            name: values.name,
            ageGroup: values.ageGroup,
            division: values.division,
            coachId: Number(values.coachId),
          },
        })
      ).unwrap();
      setAlertType("success");
      setMessage(result.message || "Team updated successfully");
      setTimeout(() => navigate("/admin/teams"), 1200);
    } catch (error) {
      setAlertType("error");
      setMessage(error?.message || String(error) || "Something went wrong");
    }
    setOpen(true);
    resetForm();
  };

  if (loading) return <Loading />;

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
                sx={{ backgroundColor: "#d71b3b", "&:hover": { backgroundColor: "#b8152f" } }}
              >
                <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
              </IconButton>
              <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                <div className={dashboard["profile--selection__container"]}>
                  <div className={dashboard["profile"]}>
                    <a href="/admin/profile" className={dashboard["link--profile"]}>Profile</a>
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
            width: 240,
            flexShrink: 0,
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
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-3")}
              className={[dashboard["collapsible"], dashboard["collapsible--expanded"]].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                    <use href="/images/sprite.svg#team"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Teams</p>
                </div>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a href="/admin/teams/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Add Team</a>
                <a href="/admin/teams" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>View Teams</a>
                <a href="/admin/teams/by-age-group" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>By Age Group</a>
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
                <a href="/admin/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Home</a>
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
              initialValues={initialValues}
              enableReinitialize
              validationSchema={schema}
              onSubmit={handleFormSubmit}
            >
              {({ errors, handleChange, handleSubmit, values, isSubmitting, touched, handleBlur }) => (
                <div className={style.form}>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  <p className={style["form-header"]}>Update Team</p>

                  <TextField
                    label="Team Name"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <FormControl fullWidth margin="normal" error={touched.ageGroup && Boolean(errors.ageGroup)}>
                    <InputLabel sx={{ fontSize: 16 }}>Age Group</InputLabel>
                    <Select
                      label="Age Group"
                      name="ageGroup"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ageGroup}
                      sx={{ fontSize: 18 }}
                    >
                      {AGE_GROUPS.map((ag) => (
                        <MenuItem key={ag} sx={{ fontSize: 18 }} value={ag}>{ag}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>{touched.ageGroup && errors.ageGroup}</FormHelperText>
                  </FormControl>

                  <FormControl fullWidth margin="normal" error={touched.division && Boolean(errors.division)}>
                    <InputLabel sx={{ fontSize: 16 }}>Division</InputLabel>
                    <Select
                      label="Division"
                      name="division"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.division}
                      sx={{ fontSize: 18 }}
                    >
                      {DIVISIONS.map((d) => (
                        <MenuItem key={d} sx={{ fontSize: 18 }} value={d}>{d}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>{touched.division && errors.division}</FormHelperText>
                  </FormControl>

                  <FormControl fullWidth margin="normal" error={touched.coachId && Boolean(errors.coachId)}>
                    <InputLabel sx={{ fontSize: 16 }}>Coach</InputLabel>
                    <Select
                      label="Coach"
                      name="coachId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.coachId}
                      sx={{ fontSize: 18 }}
                    >
                      {coachList.length === 0 ? (
                        <MenuItem disabled sx={{ fontSize: 18 }} value="">No coaches available</MenuItem>
                      ) : (
                        coachList.map((coach) => (
                          <MenuItem key={coach.id} sx={{ fontSize: 18 }} value={coach.id}>
                            {[coach.firstname, coach.surname].filter(Boolean).join(" ") || `Coach #${coach.id}`}
                            {coach.licenseNo ? ` — ${coach.licenseNo}` : ""}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>{touched.coachId && errors.coachId}</FormHelperText>
                  </FormControl>

                  <button
                    disabled={isSubmitting || updateStatus === "loading"}
                    type="submit"
                    onClick={handleSubmit}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                  >
                    {isSubmitting || updateStatus === "loading" ? "Saving..." : "Update Team"}
                  </button>

                  <div className={style["form-link--container"]}>
                    <span className={style["form-link"]}>
                      <a className={style["link__register"]} href="/admin/teams">← Back to Teams</a>
                    </span>
                  </div>
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
                    <Typography sx={{ fontSize: 21 }}>
                      <p className={dashboard["alert-message"]}>{message}</p>
                    </Typography>
                  </div>
                </div>
              ) : (
                <div style={{ width: "100%", background: "#fff" }} className={dashboard["card--alert-error"]}>
                  <div className={dashboard["card_body"]}>
                    <span className={[dashboard["icon-container"], dashboard["alert-close"]].join(" ")}>
                      <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </span>
                    <Typography sx={{ fontSize: 21 }}>
                      <p className={dashboard["alert-message"]}>{message}</p>
                    </Typography>
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

export default UpdateTeam;