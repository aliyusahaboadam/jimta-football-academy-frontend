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
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteMatchById, getAllMatches } from "../../redux/reducer/matchSlice";
import Loading from "../Chunks/loading";
import dashboard from "../style/Dashboard.module.css";
import MatchActionMenu from "../utility/MatchActionMenu";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, CssBaseline } from "@mui/material";
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

const statusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "badge--success";
    case "IN_PROGRESS":
      return "badge--secondary";
    case "CANCELLED":
      return "badge--primary";
    default:
      return "badge--secondary";
  }
};

const homeName = (m) => m.homeTeamName || m.homeTeam?.name || "—";
const awayName = (m) => m.awayTeamName || m.awayTeam?.name || "—";
const scoreText = (m) =>
  m.homeScore != null && m.awayScore != null
    ? `${m.homeScore} – ${m.awayScore}`
    : "—";


    

const MatchesByStatus = () => {


  


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

  const matchState = useSelector((state) => state.matches);
  const { matches, fetchingStatus } = matchState;
  const rows = Array.isArray(matches) ? matches : [];

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
    dispatch(getAllMatches());
  }, [dispatch, location.pathname]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMatchById(id)).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (id) => navigate(`/admin/matches/update/${id}`);
  const handleViewDetails = (id) => navigate(`/admin/matches/details/${id}`);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const [statusFilter, setStatusFilter] = useState("SCHEDULED");

  const filtered = rows.filter(
    (m) => (m.status || "").toUpperCase() === statusFilter
  );

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = rows.filter((m) => (m.status || "").toUpperCase() === s).length;
    return acc;
  }, {});

  return (
      <>
      {fetchingStatus === "loading" ? (
        <Loading />
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* ...same Navbar + Drawer as ViewMatches... */}

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
                {/* Status chips */}
                <div className={dashboard["status__chips"]}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={[
                        dashboard["status__chip"],
                        statusFilter === s ? dashboard["status__chip--active"] : "",
                      ].join(" ")}
                    >
                      {s}
                      <span className={dashboard["status__chipCount"]}>
                        {counts[s]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Table */}
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table sx={{ minWidth: 750 }} aria-label="matches by status table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">Home vs Away</StyledTableCell>
                        <StyledTableCell align="left">Date</StyledTableCell>
                        <StyledTableCell align="left">Venue</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="left">Score</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filtered.map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell component="th" scope="row">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell component="th" align="left">
                            {homeName(row)} <strong>vs</strong> {awayName(row)}
                          </StyledTableCell>
                          <StyledTableCell align="left">{row.matchDate || "—"}</StyledTableCell>
                          <StyledTableCell align="left">{row.venue || "—"}</StyledTableCell>
                          <StyledTableCell align="left">
                            <span className={[dashboard["badge"], dashboard[statusClass(row.status)]].join(" ")}>
                              {row.status || "—"}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell align="left">{scoreText(row)}</StyledTableCell>
                          <StyledTableCell align="right">
                            <MatchActionMenu
                              row={row}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                              onView={handleViewDetails}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                      {filtered.length === 0 && (
                        <StyledTableRow>
                          <StyledTableCell colSpan={7} align="center">
                            No {statusFilter.toLowerCase().replace("_", " ")} matches.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
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

export default MatchesByStatus;

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
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon sx={{ fontSize: 30 }} /> : <FirstPageIcon sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight sx={{ fontSize: 30 }} /> : <KeyboardArrowLeft sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft sx={{ fontSize: 30 }} /> : <KeyboardArrowRight sx={{ fontSize: 30 }} />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon sx={{ fontSize: 30 }} /> : <LastPageIcon sx={{ fontSize: 30 }} />}
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

const STATUS_OPTIONS = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];