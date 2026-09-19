import { Close as Cancel } from "@mui/icons-material";
import { Button, IconButton, Snackbar } from "@mui/material";
import MuiCard from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getAuthenticatedPlayer,
    savePlayerPhoto,
} from "../../redux/reducer/playerSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const PHOTO_BASE = "https://images-0.s3.us-west-2.amazonaws.com/";
const MAX_SIZE = 1_048_576; // 1 MB

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  overflowY: "auto",
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  borderRadius: "10px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: { maxWidth: "500px" },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#d71b3b",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cg%3E%3Ccircle fill='%23d71b3b' cx='400' cy='400' r='600'/%3E%3Ccircle fill='%23c01735' cx='400' cy='400' r='500'/%3E%3Ccircle fill='%23a9132f' cx='400' cy='400' r='400'/%3E%3Ccircle fill='%23910f29' cx='400' cy='400' r='300'/%3E%3Ccircle fill='%23780b23' cx='400' cy='400' r='200'/%3E%3Ccircle fill='%235f071d' cx='400' cy='400' r='100'/%3E%3C/g%3E%3C/svg%3E")`,
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: { padding: theme.spacing(4) },
}));

const UploadPlayerPhoto = () => {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playerState = useSelector((state) => state.players);
  const { player, uploadStatus, fetchingStatus } = playerState;

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await dispatch(getAuthenticatedPlayer()).unwrap();
        setCurrentPhoto(res?.photoUrl || null);
      } catch (err) {
        console.error("Failed to load player:", err);
      } finally {
        setIsLoading(false);
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
    if (!values.image) {
      setAlertType("error");
      setMessage("Please select a photo first");
      setOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", values.image);

      const body = await dispatch(savePlayerPhoto(formData)).unwrap();
      setAlertType("success");
      setMessage(body.message || "Photo uploaded successfully");

      // Update the preview with the new photo
      if (body.message) {
        setCurrentPhoto(body.message);
      }
    } catch (error) {
      setAlertType("error");
      setMessage(error?.message || "Upload failed");
    }

    setOpen(true);
    resetForm({ values: { image: null, imageName: "" } });
  };

  if (isLoading || fetchingStatus === "loading") return <Loading />;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* ---------- Navbar ---------- */}
        <AppBar
          position="fixed"
          sx={{ zIndex: 2, background: "white", color: "#d71b3b" }}
        >
          <Toolbar
            sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}
          >
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

        {/* ---------- Drawer ---------- */}
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
                dashboard[
                  activeChevron === "chevron-0"
                    ? "collapsible--expanded"
                    : null
                ],
              ].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg
                    className={[
                      dashboard["collapsible--icon"],
                      dashboard["icon--primary"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#dashboard"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Dashboard</p>
                </div>
                <span
                  onClick={() => toggleChevron("chevron-0")}
                  className={dashboard["icon-container"]}
                >
                  <svg
                    className={[
                      dashboard["icon"],
                      dashboard["icon--primary"],
                      dashboard["icon--white"],
                      dashboard["collapsible--chevron"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a
                  href="/player/home"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
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
                dashboard[
                  activeChevron === "chevron-1"
                    ? "collapsible--expanded"
                    : null
                ],
              ].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg
                    className={[
                      dashboard["collapsible--icon"],
                      dashboard["icon--primary"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#team"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>My Team</p>
                </div>
                <span
                  onClick={() => toggleChevron("chevron-1")}
                  className={dashboard["icon-container"]}
                >
                  <svg
                    className={[
                      dashboard["icon"],
                      dashboard["icon--primary"],
                      dashboard["icon--white"],
                      dashboard["collapsible--chevron"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a
                  href="/player/team"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Team Info
                </a>
                <a
                  href="/player/teammates"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Teammates
                </a>
              </div>
            </div>

            {/* Matches */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-2")}
              className={[
                dashboard["collapsible"],
                dashboard[
                  activeChevron === "chevron-2"
                    ? "collapsible--expanded"
                    : null
                ],
              ].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg
                    className={[
                      dashboard["collapsible--icon"],
                      dashboard["icon--primary"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#match"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Matches</p>
                </div>
                <span
                  onClick={() => toggleChevron("chevron-2")}
                  className={dashboard["icon-container"]}
                >
                  <svg
                    className={[
                      dashboard["icon"],
                      dashboard["icon--primary"],
                      dashboard["icon--white"],
                      dashboard["collapsible--chevron"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a
                  href="/player/matches"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Upcoming Matches
                </a>
                <a
                  href="/player/matches/results"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
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
                dashboard[
                  activeChevron === "chevron-3"
                    ? "collapsible--expanded"
                    : null
                ],
              ].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg
                    className={[
                      dashboard["collapsible--icon"],
                      dashboard["icon--primary"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#performance"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>
                    My Performance
                  </p>
                </div>
                <span
                  onClick={() => toggleChevron("chevron-3")}
                  className={dashboard["icon-container"]}
                >
                  <svg
                    className={[
                      dashboard["icon"],
                      dashboard["icon--primary"],
                      dashboard["icon--white"],
                      dashboard["collapsible--chevron"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a
                  href="/player/performance"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Match Stats
                </a>
                <a
                  href="/player/performance/season-totals"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Season Totals
                </a>
              </div>
            </div>

            {/* Profile — expanded */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-4")}
              className={[
                dashboard["collapsible"],
                dashboard["collapsible--expanded"],
              ].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg
                    className={[
                      dashboard["collapsible--icon"],
                      dashboard["icon--primary"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#profile"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Profile</p>
                </div>
                <span
                  onClick={() => toggleChevron("chevron-4")}
                  className={dashboard["icon-container"]}
                >
                  <svg
                    className={[
                      dashboard["icon"],
                      dashboard["icon--primary"],
                      dashboard["icon--white"],
                      dashboard["collapsible--chevron"],
                    ].join(" ")}
                  >
                    <use href="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a
                  href="/player/profile"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  My Profile
                </a>
                <a
                  href="/player/upload-photo"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Upload Photo
                </a>
                <a
                  href="/player/change-password"
                  className={dashboard["link--drawer"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  Change Password
                </a>
              </div>
            </div>
          </List>
        </Drawer>

        {/* ---------- Main ---------- */}
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
              initialValues={{ image: null, imageName: "" }}
              onSubmit={handleFormSubmit}
            >
              {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
                <Card>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  <p className={style["form-header"]}>Upload Player Photo</p>

                  {/* Current photo preview */}
                  {currentPhoto && !values.image && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <img
                        src={PHOTO_BASE + currentPhoto}
                        alt="Current"
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #d71b3b",
                        }}
                      />
                      <p
                        style={{
                          fontSize: 13,
                          color: "#9a99ac",
                          margin: 0,
                        }}
                      >
                        Current photo
                      </p>
                    </div>
                  )}

                  {/* New photo preview (before upload) */}
                  {values.image && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(values.image)}
                        alt="Preview"
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #3D52A0",
                        }}
                      />
                      <p
                        style={{
                          fontSize: 13,
                          color: "#9a99ac",
                          margin: 0,
                        }}
                      >
                        New photo preview
                      </p>
                    </div>
                  )}

                  {/* File input */}
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      padding: "1.5rem",
                      fontSize: "1.4rem",
                      width: "100%",
                      color: "#d71b3b",
                      borderColor: "#d71b3b",
                      "&:hover": {
                        borderColor: "#b8152f",
                        backgroundColor: "rgba(215, 27, 59, 0.04)",
                      },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (!file) return;
                        if (file.size > MAX_SIZE) {
                          setAlertType("error");
                          setMessage("Photo must be 1 MB or smaller");
                          setOpen(true);
                          e.target.value = "";
                          return;
                        }
                        setFieldValue("image", file);
                        setFieldValue("imageName", file.name);
                      }}
                    />
                    Click to select photo (max 1 MB)
                  </Button>

                  <TextField
                    value={values.imageName}
                    variant="standard"
                    placeholder="No file selected"
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-input": { fontSize: "1.4rem" },
                      "& fieldset": {
                        borderColor: "transparent",
                        backgroundColor: "#f5f5f5",
                        border: "none",
                      },
                      marginTop: "0.5rem",
                    }}
                  />

                  <button
                    disabled={isSubmitting || uploadStatus === "loading"}
                    type="submit"
                    onClick={handleSubmit}
                    className={[
                      style["btn"],
                      style["btn--block"],
                      style["btn--primary"],
                    ].join(" ")}
                  >
                    {isSubmitting || uploadStatus === "loading"
                      ? "Uploading..."
                      : "Upload Photo"}
                  </button>

                  <div className={style["form-link--container"]}>
                    <span className={style["form-link"]}>
                      <a
                        className={style["link__register"]}
                        href="/player/profile"
                      >
                        ← Back to Profile
                      </a>
                    </span>
                  </div>
                </Card>
              )}
            </Formik>

            <div className={style.footer__brand}>
              <img src="/images/jimta_home_logo.png" alt="" />
              <p className={style.footer__copyright}>
                (c) 2026 Jimta, All Rights Reserved
              </p>
            </div>
          </div>
        </Box>

        {/* ---------- Snackbar ---------- */}
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
              BackdropProps={{
                sx: { backgroundColor: "rgba(215, 27, 59, 0.2)" },
              }}
              sx={{
                "& .MuiDialog-paper": {
                  width: "100%",
                  borderRadius: "15px",
                },
              }}
            >
              {alertType === "success" ? (
                <div
                  style={{ width: "100%", background: "#fff" }}
                  className={dashboard["card--alert-success"]}
                >
                  <div className={dashboard["card_body"]}>
                    <span
                      className={[
                        dashboard["icon-container"],
                        dashboard["alert-close"],
                      ].join(" ")}
                    >
                      <IconButton onClick={handleClose}>
                        <Cancel sx={{ fontSize: 30 }} />
                      </IconButton>
                    </span>
                    <span className={dashboard["icon-container"]}>
                      <svg
                        className={[
                          dashboard["icon--big"],
                          dashboard["icon--success"],
                        ].join(" ")}
                      >
                        <use href="/images/sprite.svg#success-icon"></use>
                      </svg>
                    </span>
                    <p className={dashboard["alert-message"]}>{message}</p>
                  </div>
                  <p className={dashboard["card_footer"]}>success</p>
                </div>
              ) : (
                <div
                  style={{ width: "100%", background: "#fff" }}
                  className={dashboard["card--alert-error"]}
                >
                  <div className={dashboard["card_body"]}>
                    <span
                      className={[
                        dashboard["icon-container"],
                        dashboard["alert-close"],
                      ].join(" ")}
                    >
                      <IconButton onClick={handleClose}>
                        <Cancel sx={{ fontSize: 30 }} />
                      </IconButton>
                    </span>
                    <span className={dashboard["icon-container"]}>
                      <svg
                        className={[
                          dashboard["icon--big"],
                          dashboard["icon--error"],
                        ].join(" ")}
                      >
                        <use href="/images/sprite.svg#error-icon"></use>
                      </svg>
                    </span>
                    <p className={dashboard["alert-message"]}>{message}</p>
                  </div>
                  <p className={dashboard["card_footer"]}>error</p>
                </div>
              )}
            </Dialog>
          </div>
        </Snackbar>
      </Box>
    </ClickAwayListener>
  );
};

export default UploadPlayerPhoto;