
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate Axios instance prevents refresh requests from
// triggering the same response interceptor.
const refreshClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

const clearAuthentication = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.dispatchEvent(new Event("auth:logout"));
};

// Attach the latest access token to every API request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // Do not attempt refresh for login, registration,
    // or the refresh endpoint itself.
    if (
      requestUrl.includes("/auth/login/") ||
      requestUrl.includes("/auth/register/") ||
      requestUrl.includes("/auth/token/refresh/")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      clearAuthentication();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Reuse one refresh request when multiple API calls
      // fail at approximately the same time.
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/token/refresh/", {
            refresh: refreshToken,
          })
          .then((response) => {
            const newAccess = response.data.access;
            const newRefresh =
              response.data.refresh || refreshToken;

            if (!newAccess) {
              throw new Error("Access token missing in refresh response.");
            }

            localStorage.setItem("access_token", newAccess);
            localStorage.setItem("refresh_token", newRefresh);

            window.dispatchEvent(
              new CustomEvent("auth:token-refreshed", {
                detail: {
                  access: newAccess,
                  refresh: newRefresh,
                },
              })
            );

            return newAccess;
          })
          .catch((refreshError) => {
            clearAuthentication();
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original API request.
      return api(originalRequest);

    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
