import { createContext , useState , useEffect } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('access_token')
    );

    const [refreshToken, setrefreshToken] = useState(
        localStorage.getItem('refresh_token')
    );

    const [user , setUser] = useState(null);

    const isAuthenticated = Boolean(accessToken);

    const login = (access , refresh) =>{
        localStorage.setItem('access_token' , access);
        localStorage.setItem('refresh_token' , refresh);

        setAccessToken(access);
        setrefreshToken(refresh);

    };

     const logout = () =>{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        setAccessToken(null);
        setrefreshToken(null);
        setUser(null);
    };

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
  )
};