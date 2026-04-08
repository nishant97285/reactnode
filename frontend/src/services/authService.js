import api from "./api.js";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};