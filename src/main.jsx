import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store/store";
import reportWebVitals from "./reportWebVitals.js";

window.Buffer = Buffer;

const theme = createTheme({
  palette: {
    primary: { main: "#0e387a" },
    secondary: { main: "#3D52A0" },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();