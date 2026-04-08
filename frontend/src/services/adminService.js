import api from "./api.js";

export const adminLogin = async (data) => {
  const res = await api.post("/admin/login", data);
  return res.data;
};

export const getUsers = async (page = 1, limit = 10, search = "") => {
  const res = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const impersonateUser = async (id) => {
  const res = await api.post(`/admin/users/${id}/impersonate`);
  return res.data;
};

export const getUserTeam = async (id) => {
  const res = await api.get(`/admin/users/${id}/team`);
  return res.data;
};

export const getUserWallet = async (id, page = 1) => {
  const res = await api.get(`/admin/users/${id}/wallet?page=${page}`);
  return res.data;
};

export const updateWallet = async (data) => {
  const res = await api.post("/admin/wallet/update", data);
  return res.data;
};