import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPlayerById } from "../../redux/reducer/playerSlice";
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

const PlayerDetails = () => {
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
        const result = await dispatch(getPlayerById(id)).unwrap();
        setData(result);
        const profile = await dispatch(getProfileByPlayerId(id)).unwrap();
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

  const fullName =
    [profileData?.firstname, profileData?.surname, profileData?.lastname]
      .filter(Boolean)
      .join(" ") ||
    [data?.firstname, data?.surname, data?.lastname].filter(Boolean).join(" ") ||
    "Player";

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
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-1")}
              className={[dashboard["collapsible"], dashboard["collapsible--expanded"]].join(" ")}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                    <use href="/images/sprite.svg#player"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Players</p>
                </div>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a href="/admin/players/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  Add Player
                </a>
                <a href="/admin/players" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  View Players
                </a>
              </div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-0")}
              className={dashboard["collapsible"]}
            >
              <header className={dashboard["collapsible__header"]}>
                <div className={dashboard["collapsible__icon"]}>
                  <svg className={[dashboard["collapsible--icon"], dashboard["icon--primary"]].join(" ")}>
                    <use href="/images/sprite.svg#dashboard"></use>
                  </svg>
                  <p className={dashboard["collapsible__heading"]}>Dashboard</p>
                </div>
              </header>
              <div className={dashboard["collapsible__content--drawer"]}>
                <a href="/admin/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  Home
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

              <p className={style["form-header"]}>{fullName}</p>

              <h3 className={style["form-section"]}>Personal</h3>
              <div className={dashboard["card--details"]}>
                <span>Firstname:</span> {profileData?.firstname || data?.firstname || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Surname:</span> {profileData?.surname || data?.surname || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Lastname:</span> {profileData?.lastname || data?.lastname || "—"}
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

              <h3 className={style["form-section"]}>Football</h3>
              <div className={dashboard["card--details"]}>
                <span>Position:</span> {data?.position || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Jersey Number:</span> {data?.jerseyNumber ?? "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Player Number:</span> {data?.playerNumber ?? "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Nationality:</span> {data?.nationality || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Preferred Foot:</span> {data?.preferredFoot || "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Height (cm):</span> {data?.heightCm ?? "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Weight (kg):</span> {data?.weightKg ?? "—"}
              </div>
              <div className={dashboard["card--details"]}>
                <span>Previous Club:</span> {data?.previousClub || "—"}
              </div>

              {data?.photoUrl && (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <img
                    src={data.photoUrl}
                    alt={fullName}
                    style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "3px solid #d71b3b" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  onClick={() => navigate(`/admin/players/update/${id}`)}
                  className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate("/admin/players")}
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

export default PlayerDetails;