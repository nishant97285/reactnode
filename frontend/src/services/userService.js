import api from "./api.js";

export const getUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await api.put("/user/profile", data);
  return res.data;
};

export const getCoins = async () => {
  const res = await api.get("/user/coins");
  return res.data;
};

export const getAddresses = async () => {
  const res = await api.get("/user/addresses");
  return res.data;
};

export const addAddress = async (data) => {
  const res = await api.post("/user/addresses", data);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/user/addresses/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id) => {
  const res = await api.put(`/user/addresses/${id}/default`);
  return res.data;
};

export const getWishlist = async () => {
  const res = await api.get("/user/wishlist");
  return res.data;
};

export const addToWishlist = async (data) => {
  const res = await api.post("/user/wishlist", data);
  return res.data;
};

export const getMyWallet = async () => {
  const res = await api.get("/user/wallet");
  return res.data;
};

export const removeFromWishlist = async (id) => {
  const res = await api.delete(`/user/wishlist/${id}`);
  return res.data;
};