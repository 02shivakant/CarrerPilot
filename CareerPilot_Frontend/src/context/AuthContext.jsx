
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token")
  );

  const [user, setUser] = useState(null);

  const isAuthenticated = Boolean(accessToken);

  const login = (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleTokenRefresh = (event) => {
      const { access, refresh } = event.detail;

      setAccessToken(access);

      if (refresh) {
        setRefreshToken(refresh);
      }
    };

    const handleLogout = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    };

    window.addEventListener(
      "auth:token-refreshed",
      handleTokenRefresh
    );

    window.addEventListener(
      "auth:logout",
      handleLogout
    );

    return () => {
      window.removeEventListener(
        "auth:token-refreshed",
        handleTokenRefresh
      );

      window.removeEventListener(
        "auth:logout",
        handleLogout
      );
    };
  }, []);

  const value = {
    user,
    setUser,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
