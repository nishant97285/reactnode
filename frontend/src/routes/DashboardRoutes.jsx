import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/index";
import Overview from "../pages/Dashboard/Overview";
import Orders from "../pages/Dashboard/Orders";
import Wishlist from "../pages/Dashboard/Wishlist";
import Addresses from "../pages/Dashboard/Addresses";
import Coins from "../pages/Dashboard/Coins";
import Profile from "../pages/Dashboard/Profile";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="coins" element={<Coins />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;