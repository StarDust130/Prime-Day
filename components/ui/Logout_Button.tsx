"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Clear local data
        localStorage.removeItem("primeDayUserId");
        localStorage.removeItem("primeDayHasOnboarded");
        localStorage.removeItem("primeDayUsername");

        // Hard redirect to clear memory and trigger middleware
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
