import { useState, useEffect } from "react";
import { getCoins } from "../../services/userService.js";

const Coins = () => {
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch coins + transaction history from backend
    getCoins()
      .then((data) => {
        setCoins(data.coins);
        setHistory(data.history);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Kapiva Coins</h1>

      {/* Balance Card */}
      <div className="bg-black rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-green-500/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full bg-green-500/5 pointer-events-none" />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Total Balance</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-white">{coins}</span>
          <span className="text-green-400 font-bold text-lg mb-1">Coins</span>
        </div>
        <p className="text-gray-400 text-xs mt-2">≈ ₹{coins} discount on your next order</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: "🛒", title: "Buy Products",  desc: "Earn 5% coins on every order" },
          { icon: "🪙", title: "Accumulate",    desc: "Coins never expire" },
          { icon: "💰", title: "Redeem",        desc: "Use coins as discount at checkout" },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-xs font-bold text-gray-900">{item.title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Transaction History — from API */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Transaction History</h2>
        </div>
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No transactions yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tx.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(tx.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-base font-black ${tx.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                  {tx.type === "earned" ? "+" : "-"}{tx.coins} 🪙
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coins;