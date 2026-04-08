import { useEffect, useState } from "react";
import { StatCard } from "../components/DashComponents.jsx";
import { getMyWallet } from "../../../services/userService.js";

const statusStyle = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
};

export default function DashboardHome() {
  const [wallet, setWallet] = useState({
    topup_wallet: 0,
    commission_wallet: 0,
    growth_wallet: 0,
    total_balance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyWallet()
      .then((data) => {
        const topup = parseFloat(data.topup_wallet || 0);
        const commission = parseFloat(data.commission_wallet || 0);
        const growth = parseFloat(data.growth_wallet || 0);
        setWallet({
          topup_wallet: topup,
          commission_wallet: commission,
          growth_wallet: growth,
          total_balance: data.total_balance || (topup + commission + growth),
        });
        setTransactions(data.transactions || []);
      })
      .catch((err) => {
        console.error("Dashboard data fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const dynamicStats = [
    {
      label: "Roi Incomes",
      value: `₹${wallet.growth_wallet.toFixed(2)}`,
      change: "Growth Wallet",
      icon: "💰",
      color: "text-orange-500",
      bg: "bg-orange-100"
    },
    {
      label: "Level Income",
      value: `₹${wallet.commission_wallet.toFixed(2)}`,
      change: "Commission Wallet",
      icon: "🤝",
      color: "text-blue-500",
      bg: "bg-blue-100"
    },
    {
      label: "Topup Balance",
      value: `₹${wallet.topup_wallet.toFixed(2)}`,
      change: "Available to use",
      icon: "📊",
      color: "text-emerald-500",
      bg: "bg-emerald-100"
    },
    {
      label: "Total Earned",
      value: `₹${(wallet.growth_wallet + wallet.commission_wallet).toFixed(2)}`,
      change: "Net Achievement",
      icon: "🏆",
      color: "text-slate-700",
      bg: "bg-slate-200"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
          <p className="text-xs text-white/80 mb-1 uppercase tracking-wider font-semibold">Total Wallet Balance</p>
          <h2 className="text-4xl font-bold mb-6">
            {loading ? "..." : `₹${wallet.total_balance.toFixed(2)}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Topup", val: `₹${wallet.topup_wallet.toFixed(2)}` },
              { label: "Commission", val: `₹${wallet.commission_wallet.toFixed(2)}` },
              { label: "Growth", val: `₹${wallet.growth_wallet.toFixed(2)}` },
            ].map((r) => (
              <div key={r.label} className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                <p className="text-[10px] text-white/60 uppercase mb-1">{r.label}</p>
                <p className="text-sm font-bold">{r.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info / CTA could go here */}
        <div className="hidden lg:flex bg-white rounded-2xl p-6 shadow-sm flex-col justify-center border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Welcome back!</h3>
          <p className="text-sm text-slate-500">Your network is growing. Check your recent commissions and team updates in the sidebar.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Reward List Table */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-800">Recent Transactions</h3>
          <button className="text-xs text-orange-500 font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest">
                <th className="py-3 px-4 text-left font-bold rounded-l-lg">ID</th>
                <th className="py-3 px-4 text-left font-bold">Type</th>
                <th className="py-3 px-4 text-left font-bold">Amount</th>
                <th className="py-3 px-4 text-left font-bold">Status</th>
                <th className="py-3 px-4 text-left font-bold rounded-r-lg">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">Loading transactions...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">No transactions found</td></tr>
              ) : (
                transactions.map((tr, i) => (
                  <tr key={tr.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-400 text-xs">#{tr.id}</td>
                    <td className="py-4 px-4">
                      <span className="text-slate-700 font-medium capitalize">{tr.type}</span>
                      <p className="text-[10px] text-slate-400">{tr.note || "System Generated"}</p>
                    </td>
                    <td className={`py-4 px-4 font-bold ${tr.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tr.type === 'credit' ? '+' : '-'} ₹{parseFloat(tr.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase">Completed</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(tr.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}