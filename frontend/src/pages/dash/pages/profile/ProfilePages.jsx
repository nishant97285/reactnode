import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import api from "../../../../services/api";
import { PageWrapper, FormField, SaveBtn, inputCls } from "../../components/DashComponents.jsx";

export function EditProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put("/user/profile", formData);
      alert(res.data.message || "Profile updated successfully!");
      updateUser(formData); // Update context
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Edit Profile" subtitle="Update your personal information">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField label="Full Name">
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter full name"
            className={inputCls} 
          />
        </FormField>
        <FormField label="Email (Read Only)">
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            disabled 
            className={`${inputCls} opacity-60 bg-slate-50 cursor-not-allowed`} 
          />
        </FormField>
        <FormField label="Phone">
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Enter phone number"
            className={inputCls} 
          />
        </FormField>
        <FormField label="City">
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            placeholder="Enter city"
            className={inputCls} 
          />
        </FormField>
        <FormField label="State">
          <input 
            type="text" 
            name="state" 
            value={formData.state} 
            onChange={handleChange} 
            placeholder="Enter state"
            className={inputCls} 
          />
        </FormField>
        <FormField label="Pincode">
          <input 
            type="text" 
            name="pincode" 
            value={formData.pincode} 
            onChange={handleChange} 
            placeholder="Enter pincode"
            className={inputCls} 
          />
        </FormField>
      </div>
      <div className="flex justify-end mt-4">
        <SaveBtn onClick={handleSave} loading={loading} />
      </div>
    </PageWrapper>
  );
}

export function ChangePassword() {
  const [pwData, setPwData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPwData({ ...pwData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!pwData.current_password || !pwData.new_password) {
      alert("Please fill all fields");
      return;
    }
    if (pwData.new_password !== pwData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/dash/profile/password", {
        current_password: pwData.current_password,
        new_password: pwData.new_password,
      });
      alert(res.data.message || "Password updated successfully!");
      setPwData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Change Password" subtitle="Keep your account secure">
      <div className="max-w-md flex flex-col gap-5">
        <FormField label="Old / Current Password">
          <input 
            type="password" 
            name="current_password" 
            value={pwData.current_password} 
            onChange={handleChange} 
            placeholder="Enter old password" 
            className={inputCls} 
          />
        </FormField>
        <FormField label="New Password">
          <input 
            type="password" 
            name="new_password" 
            value={pwData.new_password} 
            onChange={handleChange} 
            placeholder="Enter new password" 
            className={inputCls} 
          />
        </FormField>
        <FormField label="Confirm New Password">
          <input 
            type="password" 
            name="confirm_password" 
            value={pwData.confirm_password} 
            onChange={handleChange} 
            placeholder="Confirm new password" 
            className={inputCls} 
          />
        </FormField>
        <SaveBtn 
          label={loading ? "Updating..." : "Update Password"} 
          onClick={handleUpdate} 
          loading={loading} 
        />
      </div>
    </PageWrapper>
  );
}