import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserWallet, updateWallet, getUserById } from "../../services/adminService.js";

const UserWallet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ user_id: id, type: "credit", amount: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchWallet = async (p = 1) => {
    try {
      setLoading(true);
      const [userData, walletData] = await Promise.all([
        getUserById(id),
        getUserWallet(id, p),
      ]);
      setUser(userData);
      setBalance(walletData.balance);
      setTransactions(walletData.transactions);
      setPagination(walletData.pagination);
    } catch (err) {
      console.error("Wallet fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet(page);
  }, [page]);

  const handleUpdate = async () => {
    if (!form.amount || form.amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const data = await updateWallet({ ...form, user_id: parseInt(id) });
      setSuccess(`Wallet ${form.type}ed! New balance: ₹${data.new_balance}`);
      setBalance(data.new_balance);
      setForm({ user_id: id, type: "credit", amount: "", note: "" });
      fetchWallet(1); // Refresh transactions
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/admin/dashboard")} className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Back
        </button>
        <div>
          <h1 className="font-black">{user?.name}'s Wallet</h1>
          <p className="text-xs text-gray-500">{user?.email} · {user?.referral_code}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Balance Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Wallet Balance</p>
          <p className="text-4xl font-black text-white">₹{parseFloat(balance).toFixed(2)}</p>
        </div>

        {/* Update Wallet Form */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-bold text-white mb-5">Update Wallet</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Type</label>
              <div className="flex gap-2">
                {["credit", "debit"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors
                      ${form.type === t
                        ? t === "credit"
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : "bg-red-500/20 border-red-500 text-red-400"
                        : "border-gray-700 text-gray-500 hover:border-gray-600"
                      }`}
                  >
                    {t === "credit" ? "+ Credit" : "- Debit"}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-green-500 transition-colors placeholder-gray-600"
              />
            </div>

            {/* Note */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Note (optional)</label>
              <input
                type="text"
                placeholder="Reason for transaction"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-green-500 transition-colors placeholder-gray-600"
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-5 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {saving ? "Processing..." : "Update Wallet"}
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white">Transaction History</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">No transactions yet</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{tx.note || "—"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      By {tx.admin_name} · {new Date(tx.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`text-base font-black ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 hover:border-gray-500 disabled:opacity-30 transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 hover:border-gray-500 disabled:opacity-30 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserWallet;