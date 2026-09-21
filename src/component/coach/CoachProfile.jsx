import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedCoach } from "../../redux/reducer/coachSlice";
import { getProfileByCoachId } from "../../redux/reducer/profileSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import style from "../style/GlobalForm.module.css";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const CoachProfile = () => {
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

  const profileState = useSelector((state) => state.profiles);
  const { profile } = profileState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAuthenticatedCoach()).then((res) => {
      const id = res?.payload?.id;
      if (id) dispatch(getProfileByCoachId(id));
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

            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#d71b3b" }}>
              <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
           
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
                  <p className={style["form-header"]}>Coach Profile</p>

                  <div className={dashboard["card--details"]}>
                    <span>Firstname:</span> {profile?.firstname || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Surname:</span> {profile?.surname || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Lastname:</span> {profile?.lastname || "—"}
                  </div>

                  <div className={dashboard["card--details"]}>
                    <span>Username:</span> {profile?.username || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Email:</span> {profile?.email || "—"}
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
                    <span>License No:</span> {coach?.licenseNo || "—"}
                  </div>
                  <div className={dashboard["card--details"]}>
                    <span>Specialization:</span> {coach?.specialization || "—"}
                  </div>

                  <button
                    onClick={() => navigate("/coach/change-password")}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
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

export default CoachProfile;