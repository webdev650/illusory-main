"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMSettings() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    email: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_token");
    const savedUser = localStorage.getItem("illusory_user");

    if (!savedToken || !savedUser) {
      router.push("/packages/employee/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setToken(savedToken);
    setCurrentUser(parsedUser);

    setProfileForm({
      fullName: parsedUser.name || "",
      phone: parsedUser.phone || "",
      email: parsedUser.email || ""
    });
  }, [router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !currentUser) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await packageAPI.updateEmployee(currentUser.id, {
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        email: profileForm.email
      }, token);

      if (response.success) {
        // Update local storage
        const updatedUser = {
          ...currentUser,
          name: response.employee.fullName,
          phone: response.employee.phone,
          email: response.employee.email
        };
        localStorage.setItem("illusory_user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setSuccessMsg("Profile details updated successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !currentUser) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await packageAPI.updateEmployee(currentUser.id, {
        password: passwordForm.newPassword
      }, token);

      if (response.success) {
        setSuccessMsg("Password updated successfully!");
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in font-jakartaSans text-white">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your employee profile details, contact info, and security credentials.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <form onSubmit={handleProfileSubmit} className="bg-zinc-950/40 border border-white/10 p-8 rounded-3xl space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Profile Settings</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Employee ID</label>
              <input
                type="text"
                disabled
                value={currentUser?.employeeId || ""}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Role Tier</label>
              <input
                type="text"
                disabled
                value={(currentUser?.role || "").toUpperCase()}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={profileForm.fullName}
              onChange={(e) => setProfileForm(p => ({ ...p, fullName: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Work Email Address *</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 text-xs shadow-lg shadow-pink-500/10"
          >
            {loading ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>

        {/* Change Password Card */}
        <form onSubmit={handlePasswordSubmit} className="bg-zinc-950/40 border border-white/10 p-8 rounded-3xl space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Update Credentials</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">New Password *</label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Confirm New Password *</label>
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 text-xs shadow-lg shadow-pink-500/10"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
