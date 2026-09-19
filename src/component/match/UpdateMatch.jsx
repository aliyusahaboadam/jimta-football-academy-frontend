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
import { number, object, string } from "yup";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, CssBaseline } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

import { getMatchById, saveMatch } from "../../redux/reducer/matchSlice";
import Loading from "../Chunks/loading";
import style from "../style/GlobalForm.module.css";

const STATUS_OPTIONS = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const UpdateMatch = () => {
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

  const matchSchema = object({
    matchDate: string().required("Match date is required"),
    venue: string().max(60, "Too long").required("Venue is required"),
    status: string().required("Status is required"),
    homeScore: number()
      .typeError("Must be a number")
      .integer("Whole numbers only")
      .min(0, "Cannot be negative")
      .nullable(),
    awayScore: number()
      .typeError("Must be a number")
      .integer("Whole numbers only")
      .min(0, "Cannot be negative")
      .nullable(),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    matchDate: "",
    venue: "",
    status: "",
    homeScore: "",
    awayScore: "",
  });

  const matchState = useSelector((state) => state.matches);
  const { match, savingStatus, fetchingStatus } = matchState;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    localStorage.setItem("authenticated", JSON.stringify(false));
  };

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getMatchById(id)).unwrap();
        setInitialValues({
          matchDate: result.matchDate || "",
          venue: result.venue || "",
          status: result.status || "SCHEDULED",
          homeScore: result.homeScore ?? "",
          awayScore: result.awayScore ?? "",
        });
      } catch (error) {
        setAlertType("error");
        setMessage(error?.message || "Failed to load match");
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [dispatch, id, location.pathname]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const payload = {
      matchDate: values.matchDate,
      venue: values.venue,
      status: values.status,
      homeScore:
        values.status === "COMPLETED" && values.homeScore !== ""
          ? Number(values.homeScore)
          : null,
      awayScore:
        values.status === "COMPLETED" && values.awayScore !== ""
          ? Number(values.awayScore)
          : null,
    };

    try {
      const result = await dispatch(saveMatch({ ...payload, id: Number(id) })).unwrap();
      setAlertType("success");
      setMessage(result.message || "Match updated successfully");
      navigate("/admin/matches");
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

        {/* Navbar + Drawer identical to ScheduleMatch — copy that block */}

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
              validationSchema={matchSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                errors,
                handleChange,
                handleSubmit,
                values,
                isSubmitting,
                touched,
                handleBlur,
              }) => (
                <div className={style.form}>
                  <section className={style.container__brand}>
                    <img src="/images/jimta_home_logo.png" alt="Logo" />
                  </section>

                  <p className={style["form-header"]}>Update Match</p>

                  <h3 className={style["form-section"]}>Match details</h3>

                  <TextField
                    label="Match Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.matchDate}
                    name="matchDate"
                    error={touched.matchDate && Boolean(errors.matchDate)}
                    helperText={touched.matchDate && errors.matchDate}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 }, shrink: true },
                    }}
                  />

                  <TextField
                    label="Venue"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.venue}
                    name="venue"
                    error={touched.venue && Boolean(errors.venue)}
                    helperText={touched.venue && errors.venue}
                    slotProps={{
                      formHelperText: { sx: { fontSize: 15 } },
                      input: { style: { fontSize: 18 } },
                      inputLabel: { style: { fontSize: 16 } },
                    }}
                  />

                  <FormControl
                    fullWidth
                    margin="normal"
                    error={touched.status && Boolean(errors.status)}
                  >
                    <InputLabel sx={{ fontSize: 16 }}>Status</InputLabel>
                    <Select
                      label="Status"
                      name="status"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.status}
                      sx={{ fontSize: 18 }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} sx={{ fontSize: 18 }} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ fontSize: 15 }}>
                      {touched.status && errors.status}
                    </FormHelperText>
                  </FormControl>

                  {values.status === "COMPLETED" && (
                    <>
                      <h3 className={style["form-section"]}>Final Score</h3>

                      <TextField
                        label="Home Score"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.homeScore}
                        name="homeScore"
                        error={touched.homeScore && Boolean(errors.homeScore)}
                        helperText={touched.homeScore && errors.homeScore}
                        slotProps={{
                          formHelperText: { sx: { fontSize: 15 } },
                          input: { style: { fontSize: 18 } },
                          inputLabel: { style: { fontSize: 16 } },
                        }}
                      />

                      <TextField
                        label="Away Score"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.awayScore}
                        name="awayScore"
                        error={touched.awayScore && Boolean(errors.awayScore)}
                        helperText={touched.awayScore && errors.awayScore}
                        slotProps={{
                          formHelperText: { sx: { fontSize: 15 } },
                          input: { style: { fontSize: 18 } },
                          inputLabel: { style: { fontSize: 16 } },
                        }}
                      />
                    </>
                  )}

                  <button
                    disabled={isSubmitting || savingStatus === "loading"}
                    type="submit"
                    onClick={handleSubmit}
                    className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
                  >
                    {isSubmitting || savingStatus === "loading" ? "Saving..." : "Update Match"}
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

        {/* Snackbar — copy from ScheduleMatch */}
      </Box>
    </ClickAwayListener>
  );
};

export default UpdateMatch;