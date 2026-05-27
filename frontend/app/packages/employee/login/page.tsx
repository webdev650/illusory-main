"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeLoginPage() {
  const router = useRouter();

  // Authentication fields
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password flow states
  // "login" | "forgot" | "reset"
  const [flow, setFlow] = useState<"login" | "forgot" | "reset">("login");
  const [resetEmailOrId, setResetEmailOrId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("illusory_token");
    if (token) {
      router.push("/packages/employee");
    }
  }, [router]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await packageAPI.employeeLogin({
        email: emailOrId,
        password: password,
      });

      if (response.success) {
        localStorage.setItem("illusory_token", response.token);
        localStorage.setItem("illusory_user", JSON.stringify(response.employee));
        setSuccessMsg("Access authorized! Redirecting to command center...");
        setTimeout(() => {
          router.push("/packages/employee");
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please verify your Email/ID and Password.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Request OTP (Forgot Password)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailOrId) {
      setErrorMsg("Please input your Email or Employee ID.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await packageAPI.employeeForgotPassword(resetEmailOrId);
      if (response.success) {
        setSuccessMsg("Verification code dispatched! Please check your mailbox.");
        setTimeout(() => {
          setFlow("reset");
          setSuccessMsg("");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate recovery. Ensure your account is active.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password with OTP
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await packageAPI.employeeResetPassword(resetEmailOrId, otpCode, newPassword);
      if (response.success) {
        setSuccessMsg("Password reset successfully! Redirecting back to login...");
        setTimeout(() => {
          setFlow("login");
          setPassword("");
          setErrorMsg("");
          setSuccessMsg("");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-jakartaSans text-white relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-r from-pink-500/10 to-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-zinc-950/80 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl z-10">
        
        {/* LOGO TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-500">
            Illusory Portal
          </h2>
          <p className="text-gray-400 text-sm mt-1.5 font-medium">
            {flow === "login" && "Secure CRM Command Center Access"}
            {flow === "forgot" && "Employee Account Recovery"}
            {flow === "reset" && "Verify Reset Code"}
          </p>
        </div>

        {/* FEEDBACK LABELS */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-xs">
            {successMsg}
          </div>
        )}

        {/* VIEW A: LOGIN CARD */}
        {flow === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Employee ID / Email Address
              </label>
              <input
                type="text"
                required
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-all text-sm"
                placeholder="E.g. IDS003 or employee1@illusory.design"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-2 text-sm shadow-lg shadow-pink-500/10"
            >
              {loading ? "Authenticating Worker..." : "Login"}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setFlow("forgot");
                  setErrorMsg("");
                  setSuccessMsg("");
                  setResetEmailOrId(emailOrId);
                }}
                className="text-xs text-gray-400 hover:text-pink-400 hover:underline transition-colors font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {/* VIEW B: FORGOT PASSWORD */}
        {flow === "forgot" && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <p className="text-xs text-gray-400 leading-relaxed mb-2 font-medium">
              Provide your work email address or Employee ID. We will generate and email a 6-digit verification code to reset your credentials.
            </p>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Employee ID / Email Address
              </label>
              <input
                type="text"
                required
                value={resetEmailOrId}
                onChange={(e) => setResetEmailOrId(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-all text-sm"
                placeholder="E.g. IDS003 or employee1@illusory.design"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFlow("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Request Reset OTP"}
              </button>
            </div>
          </form>
        )}

        {/* VIEW C: VERIFY OTP & RESET PASSWORD */}
        {flow === "reset" && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              We emailed your verification code to the address registered under <span className="text-pink-400 font-bold">{resetEmailOrId}</span>.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                6-Digit Verification OTP *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 tracking-[0.5em] text-center font-bold text-lg"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                New Password *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 text-sm"
                placeholder="New Password"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 text-sm"
                placeholder="Confirm Password"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFlow("forgot");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 text-xs transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
