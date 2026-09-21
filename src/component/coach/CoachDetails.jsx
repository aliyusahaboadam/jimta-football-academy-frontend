import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCoachById } from "../../redux/reducer/coachSlice";
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

const CoachDetails = () => {
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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getCoachById(id)).unwrap();
        setData(result);
        const profile = await dispatch(getProfileByCoachId(id)).unwrap();
        setProfileData(profile);
      } catch (err) {
        console.error(err);
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

  if (loading) return <Loading />;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#d71b3b" }}>
          <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
        
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

              <p className={style["form-header"]}>Coach Details</p>

              <h3 className={style["form-section"]}>Personal</h3>
              <div className={dashboard["card--details"]}>
                <span>Firstname:</span> {profileData?.firstname || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Surname:</span> {profileData?.surname || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Lastname:</span> {profileData?.lastname || "—"}
              </div>


                            <div className={dashboard["card--details"]}>
                <span>Username:</span> {profileData?.username || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Email:</span> {profileData?.email || "—"}
              </div>
                  <div className={dashboard["card--details"]}>
                <span>Date of Birth:</span> {profileData?.dateOfBirth || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Gender:</span> {profileData?.gender || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Phone:</span> {profileData?.phoneNumber || "—"}
              </div>

              <h3 className={style["form-section"]}>Coaching</h3>
              <div className={dashboard["card--details"]}>
                <span>License No:</span> {data?.licenseNo || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Specialization:</span> {data?.specialization || "—"}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  onClick={() => navigate(`/admin/coaches/update/${id}`)}
                  className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate("/admin/coaches")}
                  className={[style["btn"], style["btn--block"], style["btn--outline"]].join(" ")}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default CoachDetails;