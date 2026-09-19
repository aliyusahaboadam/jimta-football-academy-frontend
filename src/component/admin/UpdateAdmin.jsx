import { IconButton, Snackbar, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
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

import { getAdminById, updateAdmin } from "../../redux/reducer/adminSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

const UpdateAdmin = () => {
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
    firstname: string().max(30, "Too long").required("Firstname is required"),
    surname: string().max(30, "Too long").required("Surname is required"),
    lastname: string().max(30, "Too long"),
    phoneNumber: string().max(15, "Too long"),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    firstname: "",
    surname: "",
    lastname: "",
    phoneNumber: "",
  });

  const adminState = useSelector((state) => state.admins);
  const { updateStatus } = adminState;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getAdminById(id)).unwrap();
        setInitialValues({
          firstname: result.firstname || "",
          surname: result.surname || "",
          lastname: result.lastname || "",
          phoneNumber: result.phoneNumber || "",
        });
      } catch (error) {
        setAlertType("error");
        setMessage(error?.message || "Failed to load admin");
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
        updateAdmin({
          id: Number(id),
          adminData: {
            firstname: values.firstname,
            surname: values.surname,
            lastname: values.lastname || null,
            phoneNumber: values.phoneNumber || null,
          },
        })
      ).unwrap();
      setAlertType("success");
      setMessage(result.message || "Admin updated successfully");
      setTimeout(() => navigate("/admin/admins"), 1200);
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
              onClick={() => toggleChevron("chevron-6")}
              className={[dashboard["collapsible"], dashboard["collapsible--expanded"]].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                    <use href="/images/sprite.svg#admin"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Admins</p>
                </div>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a href="/admin/admins/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>Add Admin</a>
                <a href="/admin/admins" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>View Admins</a>
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

                  <p className={style["form-header"]}>Update Admin</p>

                  <TextField
                    label="Firstname"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstname}
                    name="firstname"
                    error={touched.firstname && Boolean(errors.firstname)}
                    helperText={touched.firstname && errors.firstname}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Surname"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.surname}
                    name="surname"
                    error={touched.surname && Boolean(errors.surname)}
                    helperText={touched.surname && errors.surname}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Lastname"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastname}
                    name="lastname"
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <TextField
                    label="Phone Number"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phoneNumber}
                    name="phoneNumber"
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <button
                    disabled={isSubmitting || updateStatus === "loading"}
                    type="submit"
                    onClick={handleSubmit}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                  >
                    {isSubmitting || updateStatus === "loading" ? "Saving..." : "Update Admin"}
                  </button>

                  <div className={style["form-link--container"]}>
                    <span className={style["form-link"]}>
                      <a className={style["link__register"]} href="/admin/admins">← Back to Admins</a>
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

export default UpdateAdmin;