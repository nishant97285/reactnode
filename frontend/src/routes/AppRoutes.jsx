// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "../pages/Home.jsx";
// import Login from "../components/Login";
// import Register from "../pages/Register.jsx";
// // import Dashboard from "../pages/Dashboard/index.jsx";
// // import Overview from "../pages/Dashboard/Overview.jsx";
// // import Orders from "../pages/Dashboard/Orders.jsx";
// // import Wishlist from "../pages/Dashboard/Wishlist.jsx";
// // import Addresses from "../pages/Dashboard/Addresses.jsx";
// // import Coins from "../pages/Dashboard/Coins.jsx";
// // import Profile from "../pages/Dashboard/Profile.jsx";
// // import ProtectedRoute from "../components/ProtectedRoute.jsx";

// // Admin pages
// // import AdminLogin from "../pages/Admin/AdminLogin.jsx";
// // import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
// // import UserTeam from "../pages/Admin/UserTeam.jsx";
// // import UserWallet from "../pages/Admin/UserWallet.jsx";

// // Admin protected wrapper
// const AdminRoute = ({ children }) => {
//   const token = localStorage.getItem("admin_token");
//   if (!token) return <Navigate to="/admin/login" replace />;
//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* User Dashboard — protected */}
//       {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
//         <Route index element={<Overview />} />
//         <Route path="orders" element={<Orders />} />
//         <Route path="wishlist" element={<Wishlist />} />
//         <Route path="addresses" element={<Addresses />} />
//         <Route path="coins" element={<Coins />} />
//         <Route path="profile" element={<Profile />} />
//       </Route> */}

//       {/* Admin routes */}
//       {/* <Route path="/admin/login" element={<AdminLogin />} />
//       <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//       <Route path="/admin/users/:id/team" element={<AdminRoute><UserTeam /></AdminRoute>} />
//       <Route path="/admin/users/:id/wallet" element={<AdminRoute><UserWallet /></AdminRoute>} /> */}
//     </Routes>
//   );
// };

// export default AppRoutes;







// AllPages
// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "../pages/Home.jsx";
// import Login from "../components/Login";
// import Register from "../pages/Register.jsx";
// // import Dashboard from "../pages/Dashboard/index.jsx";
// // import Overview from "../pages/Dashboard/Overview.jsx";
// // import Orders from "../pages/Dashboard/Orders.jsx";
// // import Wishlist from "../pages/Dashboard/Wishlist.jsx";
// // import Addresses from "../pages/Dashboard/Addresses.jsx";
// // import Coins from "../pages/Dashboard/Coins.jsx";
// // import Profile from "../pages/Dashboard/Profile.jsx";
// // import ProtectedRoute from "../components/ProtectedRoute.jsx";

// // Admin pages
// // import AdminLogin from "../pages/Admin/AdminLogin.jsx";
// // import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
// // import UserTeam from "../pages/Admin/UserTeam.jsx";
// // import UserWallet from "../pages/Admin/UserWallet.jsx";

// // MLM Dashboard pages
// import DashboardLayout from "../pages/dash/Dashboardlayout.jsx";
// import DashboardHome from "../pages/dash/Dashboardhome.jsx";
// import {
//   EditProfile,
//   ChangePassword,
//   DirectTeam,
//   AllTeam,
//   ActivateId,
//   ActivationHistory,
//   AllIncome,
//   ReferralIncome,
//   Withdrawal,
//   WithdrawalHistory,
//   Support,
// } from "../pages/dash/Allpages.jsx";

// // Admin protected wrapper
// const AdminRoute = ({ children }) => {
//   const token = localStorage.getItem("admin_token");
//   if (!token) return <Navigate to="/admin/login" replace />;
//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* User Dashboard — protected */}
//       {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
//         <Route index element={<Overview />} />
//         <Route path="orders" element={<Orders />} />
//         <Route path="wishlist" element={<Wishlist />} />
//         <Route path="addresses" element={<Addresses />} />
//         <Route path="coins" element={<Coins />} />
//         <Route path="profile" element={<Profile />} />
//       </Route> */}

//       {/* MLM Dashboard */}
//       <Route path="/dash" element={<DashboardLayout />}>
//         <Route index element={<DashboardHome />} />

//         {/* Profile */}
//         <Route path="profile/edit" element={<EditProfile />} />
//         <Route path="profile/password" element={<ChangePassword />} />

//         {/* Team */}
//         <Route path="team/direct" element={<DirectTeam />} />
//         <Route path="team/all" element={<AllTeam />} />

//         {/* Activation */}
//         <Route path="activation/activate" element={<ActivateId />} />
//         <Route path="activation/history" element={<ActivationHistory />} />

//         {/* Income */}
//         <Route path="income/all" element={<AllIncome />} />
//         <Route path="income/referral" element={<ReferralIncome />} />

//         {/* Withdraw */}
//         <Route path="withdraw/request" element={<Withdrawal />} />
//         <Route path="withdraw/history" element={<WithdrawalHistory />} />

//         {/* Support */}
//         <Route path="support" element={<Support />} />
//       </Route>

//       {/* Admin routes */}
//       {/* <Route path="/admin/login" element={<AdminLogin />} />
//       <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//       <Route path="/admin/users/:id/team" element={<AdminRoute><UserTeam /></AdminRoute>} />
//       <Route path="/admin/users/:id/wallet" element={<AdminRoute><UserWallet /></AdminRoute>} /> */}
//     </Routes>
//   );
// };

// export default AppRoutes;





import { Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "../components/Login.jsx";
import Register from "../pages/Register.jsx";
import Home from "../pages/Home.jsx";

// Dashboard layout
import DashboardLayout from "../pages/dash/layout/DashboardLayout.jsx";
import DashboardHome from "../pages/dash/pages/DashboardHome.jsx";

// Profile
import { EditProfile, ChangePassword } from "../pages/dash/pages/profile/ProfilePages.jsx";

// Team
import { DirectTeam, AllTeam } from "../pages/dash/pages/team/TeamPages.jsx";

// Activation
import { ActivateId, ActivationHistory } from "../pages/dash/pages/activation/ActivationPages.jsx";

// Income
import { AllIncome, ReferralIncome } from "../pages/dash/pages/income/IncomePages.jsx";

// Withdraw
import { Withdrawal, WithdrawalHistory } from "../pages/dash/pages/withdraw/WithdrawPages.jsx";

// Support
import { Support } from "../pages/dash/pages/support/SupportPage.jsx";

// Protected route (user)
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Admin
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import AdminLogin from "../pages/Admin/AdminLogin.jsx";
import UserTeam from "../pages/Admin/UserTeam.jsx";
import UserWallet from "../pages/Admin/UserWallet.jsx";


// 🔥 Admin Protected Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  return token ? children : <Navigate to="/admin/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Dashboard — protected */}
      <Route
        path="/dash"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="profile/password" element={<ChangePassword />} />
        <Route path="team/direct" element={<DirectTeam />} />
        <Route path="team/all" element={<AllTeam />} />
        <Route path="activation/activate" element={<ActivateId />} />
        <Route path="activation/history" element={<ActivationHistory />} />
        <Route path="income/all" element={<AllIncome />} />
        <Route path="income/referral" element={<ReferralIncome />} />
        <Route path="withdraw/request" element={<Withdrawal />} />
        <Route path="withdraw/history" element={<WithdrawalHistory />} />
        <Route path="support" element={<Support />} />
      </Route>

     {/* Admin Routes */}
       <Route path="/admin/login" element={<AdminLogin />} />
       <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
       <Route path="/admin/users/:id/team" element={<AdminRoute><UserTeam /></AdminRoute>} />
       <Route path="/admin/users/:id/wallet" element={<AdminRoute><UserWallet /></AdminRoute>} />

      {/* Optional fallback */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
};

export default AppRoutes;
