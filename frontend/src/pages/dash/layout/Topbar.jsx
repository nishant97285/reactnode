import { useAuth } from "../../../context/AuthContext.jsx";

// Topbar — search + notification + user avatar

export default function Topbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-7 py-4">
      {/* Menu Toggle + Referral Code */}
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg text-xl"
        >
          ☰
        </button>

        {user?.referral_code && (
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 shadow-sm">
            <span className="hidden xs:inline text-[9px] uppercase tracking-wider text-orange-400 font-bold leading-none">ID:</span>
            <span className="text-sm font-black text-orange-600 italic leading-none">
              {user.referral_code}
            </span>
          </div>
        )}

        {/* <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-72">
          <span className="text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-600 w-full placeholder:text-slate-400"
          />
        </div> */}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="hidden xs:flex w-9 h-9 bg-slate-100 rounded-xl items-center justify-center text-base hover:bg-slate-200 transition-colors">
          🔔
        </button>
        <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-base hover:bg-slate-200 transition-colors">
          🌙
        </button>
        <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter">
          {user?.name?.slice(0, 2) || "VK"}
        </div>
      </div>
    </div>
  );
}