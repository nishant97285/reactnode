import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateUserProfile } from "../../services/userService.js";

const Profile = () => {
  const { user, updateUser } = useAuth(); // user from AuthContext
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "", gender: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Pre-fill form with current user data from AuthContext
    if (user) {
      setForm({
        name:   user.name   || "",
        email:  user.email  || "",
        phone:  user.phone  || "",
        dob:    user.dob    ? user.dob.substring(0, 10) : "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
    setError("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // API call to update profile
      await updateUserProfile({ name: form.name, phone: form.phone, dob: form.dob, gender: form.gender });
      // Update AuthContext so Navbar/Sidebar also reflects new name
      updateUser({ name: form.name, phone: form.phone, dob: form.dob, gender: form.gender });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Edit Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-xl">
        {/* Avatar — first letter of name */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-2xl font-black text-white">
            {form.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-bold text-gray-900">{form.name}</p>
            <p className="text-xs text-gray-400">{form.email}</p>
            {user?.referral_code && (
              <p className="text-xs text-green-600 font-bold mt-0.5">
                Referral Code: {user.referral_code}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: "Full Name",      name: "name",  type: "text",  disabled: false },
            { label: "Email Address",  name: "email", type: "email", disabled: true },  // email change not allowed
            { label: "Phone Number",   name: "phone", type: "tel",   disabled: false },
            { label: "Date of Birth",  name: "dob",   type: "date",  disabled: false },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors
                  ${field.disabled
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                    : "border-gray-300 focus:border-green-500"
                  }`}
              />
            </div>
          ))}

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Gender
            </label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  onClick={() => { setForm({ ...form, gender: g }); setSaved(false); }}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all
                    ${form.gender === g
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-500"
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60
            ${saved
              ? "bg-green-500 text-white"
              : "bg-black text-white hover:bg-gray-800"
            }`}
        >
          {loading ? "Saving..." : saved ? "✓ Changes Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;