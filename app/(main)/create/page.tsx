"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Zap,
  BookOpen,
  Dumbbell,
  Droplets,
  Moon,
  Sun,
  Briefcase,
  Music,
  Heart,
  Star,
  Flame,
  Check,
  Loader2,
} from "lucide-react";

const CreatePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"habit" | "goal">("habit");

  // Form State
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("⚡");
  const [selectedColor, setSelectedColor] = useState("bg-[#38BDF8]");

  const icons = [
    "⚡",
    "💧",
    "📚",
    "🧘",
    "🏋️",
    "🏃",
    "💤",
    "🚫",
    "🥗",
    "💰",
    "💻",
    "🎨",
    "🎵",
    "🧹",
    "💊",
  ];

  const colors = [
    { bg: "bg-[#38BDF8]", border: "border-[#38BDF8]" }, // Blue
    { bg: "bg-[#F4B400]", border: "border-[#F4B400]" }, // Yellow
    { bg: "bg-[#E94235]", border: "border-[#E94235]" }, // Red
    { bg: "bg-[#0F9D58]", border: "border-[#0F9D58]" }, // Green
    { bg: "bg-[#8B5CF6]", border: "border-[#8B5CF6]" }, // Purple
    { bg: "bg-[#EC4899]", border: "border-[#EC4899]" }, // Pink
    { bg: "bg-[#121212]", border: "border-[#121212]" }, // Black
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);

    try {
      if (activeTab === "habit") {
        const res = await fetch("/api/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            icon: selectedIcon,
            color: selectedColor,
          }),
        });

        if (res.ok) {
          router.push("/habits");
          router.refresh();
        } else {
          console.error("Failed to create habit");
        }
      } else {
        // Goal creation logic would go here
        alert("Goal creation coming soon!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#F4B400]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* --- HEADER --- */}
        <header className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">
            Create New
          </h1>
        </header>

        {/* --- TABS --- */}
        <div className="flex p-1 bg-gray-200 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab("habit")}
            className={`flex-1 py-3 rounded-lg font-black uppercase tracking-wider text-sm transition-all ${
              activeTab === "habit"
                ? "bg-white shadow-sm text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Habit
          </button>
          <button
            onClick={() => setActiveTab("goal")}
            className={`flex-1 py-3 rounded-lg font-black uppercase tracking-wider text-sm transition-all ${
              activeTab === "goal"
                ? "bg-white shadow-sm text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Goal
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* --- NAME INPUT --- */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {activeTab === "habit" ? "Habit Name" : "Goal Title"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  activeTab === "habit"
                    ? "e.g. Drink Water"
                    : "e.g. Run Marathon"
                }
                className="w-full bg-white border-2 border-black rounded-xl p-4 text-lg font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/20 transition-all shadow-[4px_4px_0px_0px_#000]"
                autoFocus
              />
            </div>

            {/* --- ICON PICKER --- */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Choose Icon
              </label>
              <div className="grid grid-cols-5 gap-3">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-2xl border-2 transition-all
                      ${
                        selectedIcon === icon
                          ? "bg-black border-black text-white shadow-[2px_2px_0px_0px_#38BDF8] -translate-y-1"
                          : "bg-white border-gray-200 hover:border-black hover:bg-gray-50"
                      }
                    `}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* --- COLOR PICKER --- */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Theme Color
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {colors.map((c) => (
                  <button
                    key={c.bg}
                    type="button"
                    onClick={() => setSelectedColor(c.bg)}
                    className={`
                      w-12 h-12 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center
                      ${c.bg} ${c.border}
                      ${
                        selectedColor === c.bg
                          ? "ring-4 ring-gray-200 scale-110"
                          : "hover:scale-105"
                      }
                    `}
                  >
                    {selectedColor === c.bg && (
                      <Check className="text-white w-6 h-6" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* --- PREVIEW CARD --- */}
            <div className="pt-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                Preview
              </label>
              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center text-2xl bg-white`}
                >
                  {selectedIcon}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">
                    {name ||
                      (activeTab === "habit" ? "Habit Name" : "Goal Title")}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-gray-500">
                      0 Day Streak
                    </span>
                  </div>
                </div>
                <div
                  className={`ml-auto w-8 h-8 rounded-full ${selectedColor} border-2 border-black`}
                />
              </div>
            </div>

            {/* --- SUBMIT BUTTON --- */}
            <button
              type="submit"
              disabled={loading || !name}
              className="w-full bg-[#121212] text-white rounded-xl p-5 font-black uppercase tracking-widest border-2 border-transparent hover:border-black hover:bg-[#2a2a2a] shadow-[4px_4px_0px_0px_#38BDF8] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  <span>Create {activeTab}</span>
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePage;
