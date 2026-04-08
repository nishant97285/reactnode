import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-7 py-4">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-72">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-slate-600 w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-base hover:bg-slate-200 transition-colors">
              🔔
            </button>
            <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-base hover:bg-slate-200 transition-colors">
              🌙
            </button>
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              VK
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}