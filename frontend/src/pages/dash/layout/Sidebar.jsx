import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Profile", icon: "👤",
    children: [
      { label: "Edit Profile",     path: "/dash/profile/edit" },
      { label: "Change Password",  path: "/dash/profile/password" },
    ],
  },
  {
    label: "Team", icon: "👥",
    children: [
      { label: "Direct Team", path: "/dash/team/direct" },
      { label: "All Team",    path: "/dash/team/all" },
    ],
  },
  {
    label: "Activation", icon: "⚡",
    children: [
      { label: "Activate ID", path: "/dash/activation/activate" },
      { label: "History",     path: "/dash/activation/history" },
    ],
  },
  {
    label: "Income", icon: "💰",
    children: [
      { label: "All Income",      path: "/dash/income/all" },
      { label: "Referral Income", path: "/dash/income/referral" },
    ],
  },
  {
    label: "Withdraw", icon: "🏦",
    children: [
      { label: "Withdrawal",         path: "/dash/withdraw/request" },
      { label: "Withdrawal History", path: "/dash/withdraw/history" },
    ],
  },
  {
    label: "Support", icon: "🎧",
    children: [{ label: "Support", path: "/dash/support" }],
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggle = (label) => setOpenMenu(openMenu === label ? null : label);

  const handleLogout = () => {
    localStorage.removeItem("kapiva_token");
    localStorage.removeItem("kapiva_user");
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-0 h-screen w-60 bg-gradient-to-b from-[#1a2744] to-[#1e3a5f] flex flex-col z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo & Close Button */}
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg leading-none">
            K
          </div>
          <span className="text-white text-xl font-bold tracking-wide">Kapiva</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-white/50 hover:text-white p-1"
        >
          ✕
        </button>
      </div>

      {/* User Card — dynamic from localStorage */}
      <div className="mx-3 mb-4 flex items-center gap-3 bg-orange-500/20 border border-orange-500/30 rounded-xl p-3">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {JSON.parse(localStorage.getItem("kapiva_user") || "{}")?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">
            {JSON.parse(localStorage.getItem("kapiva_user") || "{}")?.name || "User"}
          </p>
          <span className="text-orange-400 text-xs bg-orange-500/20 px-2 py-0.5 rounded-full">
            Member
          </span>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/10 mb-3" />

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2.5">
        <NavLink
          to="/dash"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-orange-500 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <span className="text-base">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        {menuItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={() => toggle(item.label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                openMenu === item.label
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              <span
                className={`text-white/40 text-lg transition-transform duration-200 ${
                  openMenu === item.label ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </button>

            {openMenu === item.label && (
              <div className="ml-8 mt-0.5 flex flex-col gap-0.5">
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "text-orange-400 font-semibold"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mx-4 h-px bg-white/10 my-3" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-5 py-3 text-white/50 hover:text-orange-400 text-sm transition-colors"
      >
        <span>⎋</span>
        <span>Logout</span>
      </button>
    </div>
  );
}