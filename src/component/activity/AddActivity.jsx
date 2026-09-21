import { Button, IconButton, Snackbar, Typography } from "@mui/material";
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

import { Delete } from "@mui/icons-material";
import { saveActivity, uploadActivityPhoto } from "../../redux/reducer/activitySlice";
import { getAllTeams } from "../../redux/reducer/teamSlice";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

const PHOTO_BASE = "https://images-0.s3.us-west-2.amazonaws.com/";
const MAX_PHOTO_SIZE = 1_048_576; // 1 MB
const MAX_PHOTOS = 4;

const AddActivity = () => {
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
    description: string().max(2000, "Too long"),
    activityDate: string().required("Date is required"),
    location: string().max(200, "Too long").required("Location is required"),
    teamId: string().required("Team is required"),
    facebookUrl: string().url("Must be a valid URL").nullable(),
    instagramUrl: string().url("Must be a valid URL").nullable(),
    tiktokUrl: string().url("Must be a valid URL").nullable(),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState([]);   // array of { file, previewUrl, name }

  const activityState = useSelector((state) => state.activities);
  const { savingStatus, uploadStatus } = activityState;

  const teamState = useSelector((state) => state.teams);
  const { teams } = teamState;
  const teamList = Array.isArray(teams) ? teams : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllTeams());
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

  const addPhoto = (file) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE) {
      setAlertType("error");
      setMessage("Each photo must be 1 MB or smaller");
      setOpen(true);
      return;
    }
    if (photos.length >= MAX_PHOTOS) {
      setAlertType("error");
      setMessage(`Maximum ${MAX_PHOTOS} photos per activity`);
      setOpen(true);
      return;
    }
    setPhotos((prev) => [
      ...prev,
      { file, previewUrl: URL.createObjectURL(file), name: file.name },
    ]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    if (photos.length === 0) {
      setAlertType("error");
      setMessage("Please add at least one photo");
      setOpen(true);
      return;
    }

    try {
      // 1) Upload all photos and gather S3 keys
      const photoKeys = [];
      for (const p of photos) {
        const fd = new FormData();
        fd.append("image", p.file);
        const uploadRes = await dispatch(uploadActivityPhoto(fd)).unwrap();
        photoKeys.push(uploadRes.message);
      }

      // 2) Create the activity
      const payload = {
        title: values.title,
        description: values.description || null,
        activityDate: values.activityDate,
        location: values.location,
        photoUrls: photoKeys,
        facebookUrl: values.facebookUrl || null,
        instagramUrl: values.instagramUrl || null,
        tiktokUrl: values.tiktokUrl || null,
        teamId: Number(values.teamId),
      };

      const result = await dispatch(saveActivity(payload)).unwrap();
      setAlertType("success");
      setMessage(result.message || "Activity added successfully");

      // Clean up preview URLs
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPhotos([]);

      setTimeout(() => navigate("/admin/activities"), 1200);
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
            {/* Dashboard */}
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-0")}
              className={[dashboard["collapsible"], dashboard[activeChevron === "chevron-0" ? "collapsible--expanded" : null]].join(" ")}>
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
                <a href="/admin/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Home</a>
              </div>
            </div>

            {/* Training */}
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-8")}
              className={[dashboard["collapsible"], dashboard[activeChevron === "chevron-8" ? "collapsible--expanded" : null]].join(" ")}>
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
                <a href="/admin/trainings/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Add Training</a>
                <a href="/admin/trainings" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>View Trainings</a>
              </div>
            </div>

            {/* Activities — expanded */}
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-9")}
              className={[dashboard["collapsible"], dashboard["collapsible--expanded"]].join(" ")}>
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
                <a href="/admin/activities/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Add Activity</a>
                <a href="/admin/activities" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>View Activities</a>
                <a href="/admin/activities/videos" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Videos</a>
                <a href="/admin/activities/images" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Images</a>
              </div>
            </div>

            {/* Matches */}
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-4")}
              className={[dashboard["collapsible"], dashboard[activeChevron === "chevron-4" ? "collapsible--expanded" : null]].join(" ")}>
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
                <a href="/admin/matches/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Schedule Match</a>
                <a href="/admin/matches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>View Matches</a>
              </div>
            </div>

            {/* Profile */}
            <div style={{ cursor: "pointer" }} onClick={() => toggleChevron("chevron-7")}
              className={[dashboard["collapsible"], dashboard[activeChevron === "chevron-7" ? "collapsible--expanded" : null]].join(" ")}>
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
                <a href="/admin/profile" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>My Profile</a>
                <a href="/admin/change-password" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Change Password</a>
              </div>
            </div>
          </List>
        </Drawer>

        <Box component="main"
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
                title: "", description: "", activityDate: "", location: "",
                teamId: "", facebookUrl: "", instagramUrl: "", tiktokUrl: "",
              }}
              validationSchema={schema}
              onSubmit={handleFormSubmit}
            >
              {({ errors, handleChange, handleSubmit, values, isSubmitting, touched, handleBlur }) => (
                <div className={style.form}>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  <p className={style["form-header"]}>Add Activity</p>

                  <h3 className={style["form-section"]}>Details</h3>

                  <TextField
                    label="Title" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.title} name="title"
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <TextField
                    label="Description" multiline rows={3} fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.description} name="description"
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <TextField
                    label="Date" type="date" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.activityDate} name="activityDate"
                    error={touched.activityDate && Boolean(errors.activityDate)}
                    helperText={touched.activityDate && errors.activityDate}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 }, shrink: true } }}
                  />

                  <TextField
                    label="Location" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.location} name="location"
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <FormControl fullWidth margin="normal" error={touched.teamId && Boolean(errors.teamId)}>
                    <InputLabel sx={{ fontSize: 16 }}>Team</InputLabel>
                    <Select label="Team" name="teamId" onChange={handleChange} onBlur={handleBlur} value={values.teamId} sx={{ fontSize: 18 }}>
                      {teamList.length === 0 ? (
                        <MenuItem disabled sx={{ fontSize: 18 }} value="">No teams available</MenuItem>
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

                  <h3 className={style["form-section"]}>
                    Photos ({photos.length}/{MAX_PHOTOS})
                  </h3>

                  <Button variant="outlined" component="label"
                    sx={{
                      padding: "1.2rem", fontSize: "1.3rem", width: "100%",
                      color: "#d71b3b", borderColor: "#d71b3b",
                      "&:hover": { borderColor: "#b8152f", backgroundColor: "rgba(215, 27, 59, 0.04)" },
                    }}>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        addPhoto(file);
                        e.target.value = "";
                      }}
                    />
                    Click to add a photo (max 1 MB each)
                  </Button>

                  {photos.length > 0 && (
                    <div className={dashboard["photo__grid"]}>
                      {photos.map((p, i) => (
                        <div key={i} className={dashboard["photo__tile"]}>
                          <img src={p.previewUrl} alt={p.name} />
                          <IconButton
                            className={dashboard["photo__remove"]}
                            size="small"
                            onClick={() => removePhoto(i)}
                          >
                            <Delete sx={{ fontSize: 18, color: "#fff" }} />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 className={style["form-section"]}>Videos (optional)</h3>

                  <TextField
                    label="Facebook Video URL" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.facebookUrl} name="facebookUrl"
                    error={touched.facebookUrl && Boolean(errors.facebookUrl)}
                    helperText={touched.facebookUrl && errors.facebookUrl}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <TextField
                    label="Instagram Video URL" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.instagramUrl} name="instagramUrl"
                    error={touched.instagramUrl && Boolean(errors.instagramUrl)}
                    helperText={touched.instagramUrl && errors.instagramUrl}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <TextField
                    label="TikTok Video URL" fullWidth margin="normal"
                    onChange={handleChange} onBlur={handleBlur}
                    value={values.tiktokUrl} name="tiktokUrl"
                    error={touched.tiktokUrl && Boolean(errors.tiktokUrl)}
                    helperText={touched.tiktokUrl && errors.tiktokUrl}
                    slotProps={{ formHelperText: { sx: { fontSize: 15 } }, input: { style: { fontSize: 18 } }, inputLabel: { style: { fontSize: 16 } } }}
                  />

                  <button
                    disabled={isSubmitting || savingStatus === "loading" || uploadStatus === "loading"}
                    type="submit" onClick={handleSubmit}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                  >
                    {isSubmitting || savingStatus === "loading" || uploadStatus === "loading"
                      ? "Saving..." : "Save Activity"}
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
              sx={{ "& .MuiDialog-paper": { width: "100%", borderRadius: "15px" } }}>
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

export default AddActivity;