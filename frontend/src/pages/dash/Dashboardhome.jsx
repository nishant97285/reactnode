import React from "react";

const stats = [
  { label: "Total Sales", value: "$278m", change: "+50% Incomes", icon: "📈", color: "text-orange-500", bg: "bg-orange-100" },
  { label: "Daily Sales", value: "$421k", change: "-13% Sales", icon: "🛒", color: "text-blue-500", bg: "bg-blue-100" },
  { label: "Daily Users", value: "4215", change: "+48% New User", icon: "👥", color: "text-emerald-500", bg: "bg-emerald-100" },
  { label: "Products", value: "548", change: "+25% New Product", icon: "📦", color: "text-slate-700", bg: "bg-slate-200" },
  { label: "Expenses", value: "$219.0", change: "Target Expenses", icon: "💳", color: "text-amber-500", bg: "bg-amber-100" },
];

const recentOrders = [
  { name: "Rahul Sharma", date: "22 Mar 2026", amount: "₹1,476", type: "Referral Income", status: "Paid" },
  { name: "Priya Mehta", date: "21 Mar 2026", amount: "₹980", type: "Direct Income", status: "Paid" },
  { name: "Amit Singh", date: "20 Mar 2026", amount: "₹2,200", type: "Level Bonus", status: "Pending" },
  { name: "Sneha Patel", date: "19 Mar 2026", amount: "₹560", type: "Referral Income", status: "Paid" },
  { name: "Vikas Rao", date: "18 Mar 2026", amount: "₹1,100", type: "Direct Income", status: "Processing" },
];

const statusStyle = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
};

export default function DashboardHome() {
  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-11 h-11 ${s.bg} rounded-full flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_280px] gap-5">

        {/* Left Column */}
        <div className="space-y-5">

          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">Summary Sales</h3>
              <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 outline-none">
                <option>Month</option>
                <option>Week</option>
                <option>Year</option>
              </select>
            </div>
            <svg viewBox="0 0 700 180" className="w-full h-44" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                d="M0,140 C50,130 80,110 120,100 C160,90 180,120 220,90 C260,60 280,80 320,50 C360,20 380,60 420,55 C460,50 480,70 520,60 C560,50 600,65 640,55 C670,48 690,52 700,50 L700,180 L0,180 Z"
                fill="url(#cg)"
              />
              <path
                d="M0,140 C50,130 80,110 120,100 C160,90 180,120 220,90 C260,60 280,80 320,50 C360,20 380,60 420,55 C460,50 480,70 520,60 C560,50 600,65 640,55 C670,48 690,52 700,50"
                fill="none" stroke="#f97316" strokeWidth="2.5"
              />
              <circle cx="320" cy="50" r="6" fill="#f97316" />
              <rect x="295" y="28" width="50" height="20" rx="5" fill="#f97316" />
              <text x="320" y="42" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">45k</text>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                <text key={m} x={i * 58 + 8} y="175" fontSize="10" fill="#94a3b8">{m}</text>
              ))}
            </svg>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-800">Last Orders</h3>
              <button className="border border-slate-200 rounded-lg px-4 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition-colors">
                Filter
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a2744] text-white text-xs">
                  <th className="py-3 px-4 text-left font-medium rounded-l-lg">Member</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Amount</th>
                  <th className="py-3 px-4 text-left font-medium">Type</th>
                  <th className="py-3 px-4 text-left font-medium rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {row.name.charAt(0)}
                        </div>
                        <span className="text-slate-700">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{row.date}</td>
                    <td className="py-3 px-4 font-semibold text-orange-500">{row.amount}</td>
                    <td className="py-3 px-4 text-slate-500">{row.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
            <p className="text-xs text-white/80 mb-1">Active Balance</p>
            <h2 className="text-3xl font-bold mb-4">$ 9,470</h2>
            <div className="space-y-2 mb-4">
              {[
                { label: "+ Incomes", val: "$ 1699.0", neg: false },
                { label: "- Expenses", val: "$ -799.0", neg: true },
                { label: "- Taxes", val: "$ -199.0", neg: true },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-xs bg-white/15 rounded-lg px-3 py-2">
                  <span>{r.label}</span>
                  <span className={r.neg ? "text-orange-200" : ""}>{r.val}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-white text-orange-500 font-bold text-sm py-2.5 rounded-xl hover:bg-orange-50 transition-colors">
              Add Virtual Card ▶
            </button>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Upcoming Payments</h3>
            <div className="space-y-3">
              {[
                { name: "Easy Pay Way.", amount: "$62258.23", dot: "bg-emerald-500", color: "text-emerald-600" },
                { name: "Payonner.", amount: "$61486.69", dot: "bg-amber-400", color: "text-amber-600" },
                { name: "FastSpring.", amount: "$4210.38", dot: "bg-red-500", color: "text-red-500" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />
                  <span className="flex-1 text-slate-600">{p.name}</span>
                  <span className={`font-semibold ${p.color}`}>{p.amount}</span>
                </div>
              ))}
            </div>
            <button className="text-orange-500 text-xs font-semibold mt-3 hover:underline">More</button>
          </div>

          {/* Expenses Status */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Expenses Status</h3>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                On Track
              </span>
            </div>
            <svg viewBox="0 0 260 80" className="w-full h-20">
              <defs>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,60 C40,55 60,30 100,40 C140,50 160,20 200,30 C230,38 250,25 260,20 L260,80 L0,80 Z" fill="url(#eg)" />
              <path d="M0,60 C40,55 60,30 100,40 C140,50 160,20 200,30 C230,38 250,25 260,20" fill="none" stroke="#f97316" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}