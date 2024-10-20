import { createContext, useContext, useMemo, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');
  const value = useMemo(
    () => ({
      accessToken,
    }),
    [accessToken]
  );
  return <AuthContext.Provider value={accessToken}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};