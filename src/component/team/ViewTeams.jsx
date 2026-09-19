import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteTeamById, getAllTeamsWithPlayerCount } from "../../redux/reducer/teamSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import TeamActionMenu from "../utility/TeamActionMenu";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AppBar, Box, CssBaseline, Drawer, List, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d71b3b",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 18 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

const ViewTeams = () => {
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

  const teamState = useSelector((state) => state.teams);
  const { teams, fetchingStatus } = teamState;
  const rows = Array.isArray(teams) ? teams : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

  useEffect(() => {
    dispatch(getAllTeamsWithPlayerCount());
  }, [dispatch, location.pathname]);

  const handleEdit = (id) => navigate(`/admin/teams/update/${id}`);
  const handleViewDetails = (id) => navigate(`/admin/teams/details/${id}`);
 const handleDelete = async (id) => {
  try {
    await dispatch(deleteTeamById(id)).unwrap();
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                          href="/admin/profile"
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
                                <a href="/admin/home" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Home
                                </a>
                              </div>
                            </div>
            
                            {/* Players */}
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
                                    <use href="/images/sprite.svg#player"></use>
                                  </svg>
                                  <p className={dashboard["collapsible__heading"]}>Players</p>
                                </div>
                                <span onClick={() => toggleChevron("chevron-1")} className={dashboard["icon-container"]}>
                                  <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                                    <use href="/images/sprite.svg#chevron"></use>
                                  </svg>
                                </span>
                              </header>
                              <div className={dashboard["collapsible__content--drawer"]}>
                                <a href="/admin/players/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Add Player
                                </a>
                                <a href="/admin/players" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  View Players
                                </a>
                                <a href="/admin/players/gallery" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Gallery
                                </a>
                              </div>
                            </div>
            
                            {/* Coaches */}
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
                                    <use href="/images/sprite.svg#coach"></use>
                                  </svg>
                                  <p className={dashboard["collapsible__heading"]}>Coaches</p>
                                </div>
                                <span onClick={() => toggleChevron("chevron-2")} className={dashboard["icon-container"]}>
                                  <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                                    <use href="/images/sprite.svg#chevron"></use>
                                  </svg>
                                </span>
                              </header>
                              <div className={dashboard["collapsible__content--drawer"]}>
                                <a href="/admin/coaches/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Add Coach
                                </a>
                                <a href="/admin/coaches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  View Coaches
                                </a>
                              </div>
                            </div>
            
                            {/* Teams */}
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
                                    <use href="/images/sprite.svg#team"></use>
                                  </svg>
                                  <p className={dashboard["collapsible__heading"]}>Teams</p>
                                </div>
                                <span onClick={() => toggleChevron("chevron-3")} className={dashboard["icon-container"]}>
                                  <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                                    <use href="/images/sprite.svg#chevron"></use>
                                  </svg>
                                </span>
                              </header>
                              <div className={dashboard["collapsible__content--drawer"]}>
                                <a href="/admin/teams/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Add Team
                                </a>
                                <a href="/admin/teams" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  View Teams
                                </a>
                                <a href="/admin/teams/by-age-group" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Teams By Age Group
                                </a>
                              </div>
                            </div>
            
            
            
            {/* Training */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-8")}
              className={[
                dashboard["collapsible"],
                dashboard[activeChevron === "chevron-8" ? "collapsible--expanded" : null],
              ].join(" ")}
            >
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
                <a href="/admin/trainings/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  Add Training
                </a>
                <a href="/admin/trainings" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  View Trainings
                </a>
              </div>
            </div>
            
            {/* Activities */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleChevron("chevron-9")}
              className={[
                dashboard["collapsible"],
                dashboard[activeChevron === "chevron-9" ? "collapsible--expanded" : null],
              ].join(" ")}
            >
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
                <a href="/admin/activities/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  Add Activity
                </a>
                <a href="/admin/activities" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  View Activities
                </a>
                <a href="/admin/activities/videos" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  Videos
                </a>
                <a href="/admin/activities/images" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                  Images
                </a>
              </div>
            </div>
            
            
            
            
            
            
                            {/* Matches */}
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
                                <a href="/admin/matches/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Schedule Match
                                </a>
                                <a href="/admin/matches" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  View Matches
                                </a>
                                <a href="/admin/matches/by-status" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Matches By Status
                                </a>
                              </div>
                            </div>
            
                            {/* Performance */}
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
                                    <use href="/images/sprite.svg#performance"></use>
                                  </svg>
                                  <p className={dashboard["collapsible__heading"]}>Performance</p>
                                </div>
                                <span onClick={() => toggleChevron("chevron-5")} className={dashboard["icon-container"]}>
                                  <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                                    <use href="/images/sprite.svg#chevron"></use>
                                  </svg>
                                </span>
                              </header>
                              <div className={dashboard["collapsible__content--drawer"]}>
                                <a href="/admin/performance/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Record Performance
                                </a>
                                <a href="/admin/performance/by-match" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  By Match
                                </a>
                                <a href="/admin/performance/season-totals" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Season Totals
                                </a>
                              </div>
                            </div>
            
                            {/* Admins */}
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
                                    <use href="/images/sprite.svg#admin"></use>
                                  </svg>
                                  <p className={dashboard["collapsible__heading"]}>Admins</p>
                                </div>
                                <span onClick={() => toggleChevron("chevron-6")} className={dashboard["icon-container"]}>
                                  <svg className={[dashboard["icon"], dashboard["icon--primary"], dashboard["icon--white"], dashboard["collapsible--chevron"]].join(" ")}>
                                    <use href="/images/sprite.svg#chevron"></use>
                                  </svg>
                                </span>
                              </header>
                              <div className={dashboard["collapsible__content--drawer"]}>
                                <a href="/admin/admins/add" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  Add Admin
                                </a>
                                <a href="/admin/admins" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  View Admins
                                </a>
                              </div>
                            </div>
            
                            {/* Profile */}
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => toggleChevron("chevron-7")}
                              className={[
                                dashboard["collapsible"],
                                dashboard[activeChevron === "chevron-7" ? "collapsible--expanded" : null],
                              ].join(" ")}
                            >
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
                                <a href="/admin/profile" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
                                  My Profile
                                </a>
                                <a href="/admin/change-password" className={dashboard["link--drawer"]} onClick={(e) => e.stopPropagation()}>
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
              <div className={dashboard["secondary--container"]}>
                <div
                  className={[
                    dashboard["card--add"],
                    dashboard["card--primary"],
                  ].join(" ")}
                >
                  <div className={dashboard["card_body"]}>
                    <div className={dashboard["card--small-head"]}>
                      All Teams
                    </div>
                    <button
                      onClick={() => navigate("/admin/teams/add")}
                      className={[
                        dashboard["btn"],
                        dashboard["btn--block"],
                        dashboard["btn--primary"],
                      ].join(" ")}
                    >
                      + Add New Team
                    </button>
                  </div>
                </div>

                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="teams table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">Name</StyledTableCell>
                        <StyledTableCell align="left">Age Group</StyledTableCell>
                        <StyledTableCell align="left">Division</StyledTableCell>
                        <StyledTableCell align="left">Coach</StyledTableCell>
                        <StyledTableCell align="left">Players</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : rows
                      ).map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell component="th" scope="row">
                            {page * rowsPerPage + index + 1}
                          </StyledTableCell>
                          <StyledTableCell component="th" align="left">
                            {row.name || "—"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.ageGroup || "—"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.division || "—"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.coachName || "—"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.playerCount ?? 0}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <TeamActionMenu
                              row={row}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                              onView={handleViewDetails}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                      {rows.length === 0 && (
                        <StyledTableRow>
                          <StyledTableCell colSpan={7} align="center">
                            No teams yet. Click "Add New Team" to create one.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                      {emptyRows > 0 && rows.length > 0 && (
                        <StyledTableRow style={{ height: 53 * emptyRows }}>
                          <StyledTableCell colSpan={7} />
                        </StyledTableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[
                            100,
                            200,
                            300,
                            { label: "All", value: -1 },
                          ]}
                          colSpan={7}
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                            select: {
                              inputProps: { "aria-label": "rows per page" },
                              native: true,
                            },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                          sx={{
                            "& .MuiTablePagination-toolbar": { fontSize: 18 },
                            "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                            "& .MuiTablePagination-input": { fontSize: 18 },
                            "& .MuiTablePagination-displayedRows": {
                              fontSize: 14,
                            },
                          }}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default ViewTeams;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? (
          <LastPageIcon sx={{ fontSize: 30 }} />
        ) : (
          <FirstPageIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight sx={{ fontSize: 30 }} />
        ) : (
          <KeyboardArrowLeft sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft sx={{ fontSize: 30 }} />
        ) : (
          <KeyboardArrowRight sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? (
          <FirstPageIcon sx={{ fontSize: 30 }} />
        ) : (
          <LastPageIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};