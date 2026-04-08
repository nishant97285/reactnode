import api from "./api.js";

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const placeOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};