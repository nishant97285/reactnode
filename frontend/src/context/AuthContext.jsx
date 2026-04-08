import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App open hone par token check
  useEffect(() => {
    const token = localStorage.getItem("kapiva_token");
    const savedUser = localStorage.getItem("kapiva_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      getProfile()
        .then((data) => {
          setUser(data);
          localStorage.setItem("kapiva_user", JSON.stringify(data));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("kapiva_token", data.token);
    localStorage.setItem("kapiva_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password, referral_code) => {
    const data = await registerUser({ username, email, password, referral_code });
    localStorage.setItem("kapiva_token", data.token);
    localStorage.setItem("kapiva_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("kapiva_token");
    localStorage.removeItem("kapiva_user");
    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem("kapiva_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};