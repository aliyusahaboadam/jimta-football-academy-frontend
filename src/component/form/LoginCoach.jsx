import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Alert, IconButton, InputAdornment, Snackbar } from "@mui/material";
import MuiCard from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { loginRequest } from "../../redux/reducer/loginSlice";
import style from "../style/GlobalForm.module.css";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  overflowY: "auto", // Enables vertical scrolling
  "&::-webkit-scrollbar": {
    display: "none",
  },
  // Hide scrollbar for Firefox
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE and Edge
  borderRadius: "10px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
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
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

const LoginAdmin = () => {
  const loginSchema = object({
    username: string()
      .max(35, "ID must not exceed 35 characters")
      .required("ID is required"),

    password: string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const [visibility, setVisibility] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [open, setOpen] = useState(false); // Controls the Snackbar state
  const [alertType, setAlertType] = useState(""); // "success" or "error"
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Prevent closing if the user clicks away
    }
    setOpen(false); // Close the Snackbar
  };

  const togglePasswordVisibility = () => {
    setVisibility(!visibility);
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };



 const handleFormSubmit = async (values, { resetForm }) => {
  try {
    const body = await dispatch(loginRequest(values)).unwrap();
    console.log("Login response body:", body);

    // Accept any of the common field names the backend might use
    const receivedToken = body?.jwt ?? body?.token ?? body?.accessToken;

    if (!receivedToken || typeof receivedToken !== "string") {
      console.error("No valid JWT in login response:", body);
      setAlertType("error");
      setMessage("Login succeeded but no token was returned");
      setOpen(true);
      return;   // ← stop here, don't store garbage
    }

    localStorage.setItem("token", JSON.stringify(receivedToken));
    console.log("Token stored:", localStorage.getItem("token"));

    setAlertType("success");
    setMessage("Login Successfully");

    if (body.redirectUrl && body.redirectUrl !== "error") {
      navigate(body.redirectUrl);
    }
  } catch (error) {
    setAlertType("error");
    setMessage(error?.message || "Login failed");
  }

  setOpen(true);
  resetForm();
};

  return (
    <SignInContainer>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={loginSchema}
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
          setFieldValue
        }) => (
          <Card>
            {/*Card Image*/}

            <section className={style.container__brand}>
              <img src="/images/jimta_home_logo.png" alt="Logo" />
            </section>

            {/*Card Header*/}
            <p className={style["form-header"]}>Login Coach</p>


            {/* Text Fields*/}
            <TextField
              label={"Coach ID"}
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              name="username"
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              slotProps={{
                formHelperText: {
                  sx: { fontSize: 15 }, // Increase font size of helper text
                },
                input: {
                  style: { fontSize: 18 }, // font size for input text
                },
                inputLabel: {
                  style: { fontSize: 16 }, // font size for label text
                },
              }}
            />

            <TextField
              type={inputType}
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              name="password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              slotProps={{
                formHelperText: {
                  sx: { fontSize: 15 }, // Increase font size of helper text
                },
                inputLabel: {
                  style: { fontSize: 16 }, // font size for label text
                },
                input: {
                  style: { fontSize: 18 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {visibility ? (
                          <VisibilityIcon
                            sx={{ fontSize: 22, color: "#d71b3b" }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            sx={{ fontSize: 22, color: "#d71b3b" }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />



            {/* {BUTTON } */}

            <button
              disabled={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={[
                style["btn"],
                style["btn--block"],
                style["btn--primary"],
              ].join(" ")}
            >
              {isSubmitting ? "Wait..." : "Login"}
            </button>

            <div className={style["form-link--container"]}>
              <span className={style["form-link"]}>
                {" "}
           
              </span>
            </div>
          </Card>
        )}
      </Formik>

      <div className={style.footer__brand}>
        <img src="/images/jimta_home_logo.png" alt="" />
        <p className={style.footer__copyright}>
          {" "}
          (c) 2026 Jimta, All Rights Reserved
        </p>
      </div>

      <Snackbar
        open={open}
        autoHideDuration={3000} // Automatically hide after 1 second
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
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

export default LoginAdmin;
