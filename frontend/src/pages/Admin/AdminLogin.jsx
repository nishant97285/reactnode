import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminService.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await adminLogin(form);
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-white text-black font-black text-xl px-4 py-2 tracking-widest rounded mb-3">
            KAPIVA
          </div>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "email",    type: "email",    placeholder: "Admin Email" },
            { name: "password", type: "password", placeholder: "Password" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
              name={field.name}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-green-500 transition-colors placeholder-gray-500"
            />
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;