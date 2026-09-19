import axios from "axios";

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL // ✅ https://api.miqwii.com
});

// Public URLs that should never trigger auth redirect
const publicUrls = [
  "/v1/api/login",
  "/v1/api/password"
];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || "";
    const isPublic = publicUrls.some(url => requestUrl.includes(url));
    const status = err.response?.status;

    if (!isPublic && (status === 401 || status === 403)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;