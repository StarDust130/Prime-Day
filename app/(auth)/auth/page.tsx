"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Calendar, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", birthday: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Clear local storage on load to ensure clean slate if they logged out
  useEffect(() => {
    localStorage.removeItem("primeDayUserId");
    localStorage.removeItem("primeDayHasOnboarded");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // Success!
      setSuccessMsg(data.message); // "Welcome back!" or "Profile created!"

      // Save to LocalStorage for Client-Side logic
      localStorage.setItem("primeDayUserId", data.userId);
      localStorage.setItem("primeDayUsername", formData.username);
      localStorage.setItem("primeDayHasOnboarded", String(data.hasOnboarded));

      // Small delay to let user read the "Welcome" message
      setTimeout(() => {
        if (data.hasOnboarded) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-[#121212]">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-2 bg-black z-10" />
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-2 border-dashed border-gray-300 rounded-full opacity-50 animate-spin-slow pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-20"
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-2">
            Prime Day.
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Identity & Origins
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg font-bold outline-none transition-all focus:border-black focus:shadow-[4px_4px_0px_0px_#38BDF8]"
                placeholder="Unique ID"
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
              Birthday (Security Key)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                required
                value={formData.birthday}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg font-bold outline-none transition-all focus:border-black focus:shadow-[4px_4px_0px_0px_#38BDF8]"
              />
            </div>
          </div>

          {/* STATUS MESSAGES */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 font-bold text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 font-black text-center justify-center uppercase tracking-wide"
            >
              {successMsg}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#121212] text-white font-black text-lg py-5 rounded-xl border-2 border-black flex items-center justify-center gap-3 transition-all hover:bg-[#2a2a2a] disabled:opacity-70 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_#38BDF8] active:translate-y-[2px] active:shadow-none"
          >
            {loading ? "Processing..." : "ENTER PRIME"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
