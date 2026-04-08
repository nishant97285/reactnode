import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔥 Dashboard route change → scroll top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", 
    });
    // Close sidebar on navigation on mobile
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-all animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "lg:ml-60" : "lg:ml-60"}`}>
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="p-4 md:p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}