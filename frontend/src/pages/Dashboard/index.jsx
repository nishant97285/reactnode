import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getMyWallet } from "../../services/userService.js";

const navItems = [
  { path: "/dashboard",           label: "Overview",     icon: "⊞", end: true },
  { path: "/dashboard/orders",    label: "My Orders",    icon: "📦" },
  { path: "/dashboard/wishlist",  label: "Wishlist",     icon: "♡" },
  { path: "/dashboard/addresses", label: "Addresses",    icon: "📍" },
  { path: "/dashboard/coins",     label: "Kapiva Coins", icon: "🪙" },
  { path: "/dashboard/profile",   label: "Edit Profile", icon: "👤" },
];

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch wallet balance on sidebar load
    getMyWallet()
      .then((data) => setWalletBalance(data.balance))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-16 font-sans">

      <button
        className="md:hidden fixed top-[68px] left-3 z-50 bg-black text-white w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
        onClick={() => setDrawerOpen(true)}
      >
        ☰
      </button>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-black text-white z-40 flex flex-col transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* User Info */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-2xl font-black mb-3">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="font-bold text-base tracking-wide">{user?.name || "User"}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>

          {/* Coins + Wallet — both in sidebar */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 px-2.5 py-1 rounded-full w-fit">
              <span className="text-xs">🪙</span>
              <span className="text-xs font-bold text-green-400">{user?.coins || 0} Coins</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-2.5 py-1 rounded-full w-fit">
              <span className="text-xs">💰</span>
              <span className="text-xs font-bold text-yellow-400">₹{parseFloat(walletBalance).toFixed(2)} Wallet</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <main className="md:ml-64 px-4 sm:px-6 py-6 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
