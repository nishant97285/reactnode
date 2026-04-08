import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, impersonateUser } from "../../services/adminService.js";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [impersonating, setImpersonating] = useState(null);

  // Debounced search — waits 500ms after typing
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers(page, 10, search);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

useEffect(() => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    navigate("/admin/login");
    return;
  }
  const timer = setTimeout(fetchUsers, 400);
  return () => clearTimeout(timer);
}, [fetchUsers]);

  // Admin login as user (impersonation)
  const handleImpersonate = async (userId, userName) => {
    if (!window.confirm(`Login as ${userName}?`)) return;
    try {
      setImpersonating(userId);
      const data = await impersonateUser(userId);
      // Store impersonation flag so we can show "Exit" button
      localStorage.setItem("kapiva_token", data.token);
      localStorage.setItem("kapiva_user", JSON.stringify(data.user));
      localStorage.setItem("impersonating", "true");
      localStorage.setItem("admin_token_backup", localStorage.getItem("admin_token"));
      navigate("/dash");
    } catch (err) {
      alert(err.response?.data?.message || "Impersonation failed.");
    } finally {
      setImpersonating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black font-black text-sm px-3 py-1 tracking-widest rounded">KAPIVA</div>
          <span className="text-gray-400 text-sm">Admin Panel</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-full hover:bg-red-500/10 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Users</h1>
          <span className="text-sm text-gray-400">{pagination.total || 0} total users</span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email or referral code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-green-500 transition-colors placeholder-gray-600"
          />
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["ID", "Name", "Email", "Referral Code", "Topup", "Commission", "Growth", "Coins", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400">#{user.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-black">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-black text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                          {user.referral_code}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-100">₹{parseFloat(user.topup_wallet || 0).toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm text-slate-100">₹{parseFloat(user.commission_wallet || 0).toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm text-slate-100">₹{parseFloat(user.growth_wallet || 0).toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm text-yellow-400 font-bold">🪙 {user.coins}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* Login as user */}
                          <button
                            onClick={() => handleImpersonate(user.id, user.name)}
                            disabled={impersonating === user.id}
                            className="text-xs font-bold text-blue-400 border border-blue-400/30 px-2.5 py-1 rounded-full hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                          >
                            {impersonating === user.id ? "..." : "Login as"}
                          </button>
                          {/* View team */}
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}/team`)}
                            className="text-xs font-bold text-purple-400 border border-purple-400/30 px-2.5 py-1 rounded-full hover:bg-purple-500/10 transition-colors"
                          >
                            Team
                          </button>
                          {/* Wallet */}
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}/wallet`)}
                            className="text-xs font-bold text-yellow-400 border border-yellow-400/30 px-2.5 py-1 rounded-full hover:bg-yellow-500/10 transition-colors"
                          >
                            Wallet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
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

export default AdminDashboard;