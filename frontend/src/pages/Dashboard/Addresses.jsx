import { useState, useEffect } from "react";
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from "../../services/userService.js";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", name: "", phone: "", line1: "", city: "", state: "", pincode: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch addresses from backend
    getAddresses()
      .then(setAddresses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id); // API call
      setAddresses((prev) => prev.filter((a) => a.id !== id)); // Update UI
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id); // API call
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id ? 1 : 0 }))); // Update UI
    } catch (err) {
      console.error("Set default error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.line1 || !form.city || !form.pincode) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      setSaving(true);
      await addAddress(form); // API call
      // Refetch addresses to get updated list with new ID
      const updated = await getAddresses();
      setAddresses(updated);
      setForm({ label: "Home", name: "", phone: "", line1: "", city: "", state: "", pincode: "" });
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add address.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Saved Addresses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          + Add New
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <h2 className="font-bold text-gray-900 mb-4">New Address</h2>
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "name",    placeholder: "Full Name" },
              { key: "phone",   placeholder: "Phone Number" },
              { key: "line1",   placeholder: "House / Street Address" },
              { key: "city",    placeholder: "City" },
              { key: "state",   placeholder: "State" },
              { key: "pincode", placeholder: "Pincode" },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="col-span-2 sm:col-span-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
              />
            ))}
            <div className="col-span-2 flex gap-2">
              {["Home", "Work", "Other"].map((l) => (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, label: l })}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors
                    ${form.label === l ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-gray-500"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-green-500 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="border border-gray-300 text-gray-600 text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div className="space-y-3">
        {addresses.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No addresses saved yet</div>
        )}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-2xl border p-5 transition-all duration-200 ${addr.is_default ? "border-green-400 shadow-sm" : "border-gray-200"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{addr.label}</span>
                  {addr.is_default === 1 && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {addr.name} &nbsp;·&nbsp; <span className="font-medium text-gray-500">{addr.phone}</span>
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-bold text-green-600 border border-green-400 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs font-bold text-red-500 border border-red-300 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;