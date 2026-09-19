import { Alert, Snackbar } from "@mui/material";
import MuiCard from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { object, string } from "yup";
import { sendPasswordRequest } from "../../redux/reducer/passwordSlice";
import style from "../style/GlobalForm.module.css";

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
  [theme.breakpoints.up("sm")]: { maxWidth: "450px" },
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

const PasswordRequest = () => {
  const schema = object({
    email: string().email("Invalid email").required("Email required"),
  });

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const body = await dispatch(sendPasswordRequest(values.email)).unwrap();
      setAlertType("success");
      setMessage(body.message || "Reset link sent to your email");
    } catch (error) {
      setAlertType("error");
      setMessage(error?.message || String(error) || "Something went wrong");
    }
    setOpen(true);
    resetForm();
  };

  return (
    <SignInContainer>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={schema}
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
          <Card>
            <section className={style.container__brand}>
              <img src="/images/jimta_home_logo.png" alt="Logo" />
            </section>

            <p className={style["form-header"]}>Password Request</p>

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              name="email"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            <button
              disabled={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={[style["btn"], style["btn--block"], style["btn--primary"]].join(" ")}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <div className={style["form-link--container"]}>
              <span className={style["form-link"]}>
                <a className={style["link__register"]} href="/login-admin">
                  ← Back to Login
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

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{
            width: "100%",
            fontSize: "2rem",
            padding: "16px",
            textAlign: "center",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SignInContainer>
  );
};

export default PasswordRequest;