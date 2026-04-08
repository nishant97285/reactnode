import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.referral_code) {
      setError("Sab fields required hain.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords match nahi kar rahe.");
      return;
    }
    try {
      setLoading(true);
      const data = await register(form.username, form.email, form.password, form.referral_code);
      setSuccess(`Registered! Your referral code: ${data.referral_code}`);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username",        type: "text",     placeholder: "Username",         icon: "👤" },
    { name: "email",           type: "email",    placeholder: "Email Address",    icon: "✉️" },
    { name: "password",        type: "password", placeholder: "Password",         icon: "🔒" },
    { name: "confirmPassword", type: "password", placeholder: "Confirm Password", icon: "🔒" },
    { name: "referral_code",   type: "text",     placeholder: "Referral Code",    icon: "🎟️" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f5] font-sans">

      {/* Back Button */}
      <div className="flex items-center px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Green Arc Section */}
      <div
        className="bg-[#b5c98a] flex justify-center items-start px-5 pt-4 pb-20"
        style={{ borderRadius: "0 0 50% 50% / 0 0 80px 80px" }}
      >
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 w-full max-w-md text-center mt-2">
          <h2 className="text-[#e07b2a] font-bold text-base mb-2">Join Kapiva!</h2>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            Create your account with a referral code.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-3 text-left">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-3 text-left">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.name}
                className="flex items-center border border-[#c8d8a0] rounded-lg px-4 h-12 focus-within:border-[#7aaa3b] transition-colors"
              >
                <span className="text-[#7aaa3b] mr-3 text-lg">{field.icon}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
            ))}

            {/* Arrow Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: 52, height: 52 }}
              className="bg-[#5a7a2e] hover:bg-[#4a6724] text-white rounded-full flex items-center justify-center mx-auto mt-5 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-5">
            Pehle se account hai? {" "}
            <Link to="/login" className="text-[#5a7a2e] font-semibold hover:underline">
             Login 
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Section — same as Login */}
      <div className="flex flex-wrap justify-center max-w-4xl mx-auto px-5 pt-14 pb-10 gap-0">

        {/* App Promo */}
        <div className="flex-1 min-w-[260px] max-w-sm flex flex-col items-center text-center pr-10 border-r border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e8f5c8] to-[#f9e4c8] flex items-center justify-center text-4xl shadow-md mb-4">
            🌿
          </div>
          <p className="text-sm text-gray-700 mb-1">
            Kapiva app is <span className="text-[#e07b2a] font-extrabold">LIVE!</span>
          </p>
          <p className="text-xs text-gray-500 mb-5">
            Download &amp; Signup, to get <strong className="text-gray-800">Rs. 200</strong> instant cashback
          </p>

          <a href="#" className="flex items-center gap-3 bg-black text-white rounded-lg px-4 py-2.5 w-48 mb-2.5 hover:bg-gray-800 transition-colors">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 shrink-0">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] opacity-75">Download on the</span>
              <span className="text-sm font-bold">App Store</span>
            </div>
          </a>

          <a href="#" className="flex items-center gap-3 bg-black text-white rounded-lg px-4 py-2.5 w-48 hover:bg-gray-800 transition-colors">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 shrink-0">
              <path d="M3.18 23.76c.3.17.64.24.99.19l13.5-11.7-2.96-2.96-11.53 14.47zM.5 1.4C.19 1.75 0 2.28 0 2.96v18.08c0 .68.19 1.21.51 1.56l.08.08 10.12-10.12v-.24L.58 1.32.5 1.4zM22.29 10.63l-2.89-1.65-3.24 3.24 3.24 3.24 2.91-1.66c.83-.47.83-1.24-.02-1.17zM3.18.24L16.71 11.95l-2.96 2.96L.19.43C.49-.15.85-.04 1.19.08L3.18.24z"/>
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] opacity-75">GET IT ON</span>
              <span className="text-sm font-bold">Google Play</span>
            </div>
          </a>
        </div>

        {/* Features */}
        <div className="flex-1 min-w-[260px] max-w-sm pl-10 pt-1">
          <h3 className="text-base font-bold text-gray-800 mb-1">What makes the Kapiva App special?</h3>
          <p className="text-xs text-gray-400 mb-7">Download the app and avail exclusive offers curated for you.</p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "🏆", label: "Exclusive Rewards" },
              { icon: "⚡", label: "Faster Checkout" },
              { icon: "🚚", label: "Instant Tracking" },
              { icon: "🧭", label: "Easy Navigation" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl bg-gray-50 mb-2">
                  {f.icon}
                </div>
                <span className="text-xs font-semibold text-gray-600">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;