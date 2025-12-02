"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Smile,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Loading from "@/app/loading";

const CreatePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [activeTab, setActiveTab] = useState<"habit" | "goal">("habit");

  // Form State
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("⚡");
  const [customIcon, setCustomIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-[#38BDF8]");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [showCustomEmoji, setShowCustomEmoji] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiCategory, setAiCategory] = useState("General");
  const [showAiCategoryDropdown, setShowAiCategoryDropdown] = useState(false);

  const aiCategories = [
    "General",
    "Health & Fitness",
    "Productivity",
    "Mindfulness",
    "Learning",
    "Finance",
    "Social",
  ];

  const fetchAiSuggestions = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch(
        `/api/ai/suggest-habits?category=${encodeURIComponent(aiCategory)}`
      );
      const json = await res.json();
      if (json.suggestions) {
        setAiSuggestions(json.suggestions);
      }
    } catch (error) {
      console.error("Failed to get suggestions");
    } finally {
      setLoadingAi(false);
    }
  };

  // Goal State
  const [description, setDescription] = useState("");
  const [goalType, setGoalType] = useState<"short" | "medium" | "long">(
    "short"
  );
  const [deadline, setDeadline] = useState("");

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

  // Fetch existing habit if editing
  useEffect(() => {
    if (editId) {
      const fetchHabit = async () => {
        try {
          const res = await fetch("/api/habits");
          const data = await res.json();
          if (data.success) {
            const habit = data.data.find((h: any) => h._id === editId);
            if (habit) {
              setName(habit.name);
              setSelectedIcon(habit.icon);
              setSelectedColor(habit.color);
              setPriority(habit.priority || "medium");
              if (!icons.includes(habit.icon)) {
                setShowCustomEmoji(true);
                setCustomIcon(habit.icon);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch habit details");
        } finally {
          // setFetching(false);
        }
      };
      fetchHabit();
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    const finalIcon = showCustomEmoji && customIcon ? customIcon : selectedIcon;

    try {
      if (activeTab === "habit") {
        const url = editId ? `/api/habits/${editId}` : "/api/habits";
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            icon: finalIcon,
            color: selectedColor,
            priority,
          }),
        });

        if (res.ok) {
          router.push("/habits");
          router.refresh();
        } else {
          console.error("Failed to save habit");
        }
      } else {
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: name,
            description,
            type: goalType,
            deadline,
            icon: finalIcon,
            color: selectedColor,
          }),
        });

        if (res.ok) {
          router.push("/goals");
          router.refresh();
        } else {
          console.error("Failed to create goal");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    // return <Loading />;
  }

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
            {editId ? "Edit Habit" : "Create New"}
          </h1>
        </header>

        {/* --- TABS --- */}
        {!editId && (
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
        )}

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
            <div className="space-y-3 relative">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {activeTab === "habit" ? "Habit Name" : "Goal Title"}
                </label>
                {activeTab === "habit" && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAiCategoryDropdown(!showAiCategoryDropdown)
                    }
                    className="text-[10px] font-black uppercase tracking-wider bg-black text-[#38BDF8] px-3 py-1 rounded-lg hover:bg-[#38BDF8] hover:text-black transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI Suggestion
                  </button>
                )}
              </div>

              {/* AI POPUP CARD */}
              <AnimatePresence>
                {showAiCategoryDropdown && activeTab === "habit" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="relative w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] p-4 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black uppercase tracking-widest">
                        AI Suggestions
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAiCategoryDropdown(false)}
                        className="text-gray-400 hover:text-black"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <select
                          value={aiCategory}
                          onChange={(e) => setAiCategory(e.target.value)}
                          className="w-full appearance-none bg-gray-50 border-2 border-black rounded-lg px-3 py-2 text-xs font-bold focus:outline-none"
                        >
                          {aiCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={fetchAiSuggestions}
                        disabled={loadingAi}
                        className="bg-[#38BDF8] border-2 border-black rounded-lg px-3 py-2 text-xs font-bold hover:shadow-[2px_2px_0px_0px_#000] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
                      >
                        {loadingAi ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Zap className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {aiSuggestions.length > 0 ? (
                        aiSuggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setName(s.name);
                              setSelectedIcon(s.icon);
                              setShowAiCategoryDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 border-2 border-transparent hover:border-black transition-all text-left group"
                          >
                            <span className="text-xl bg-white border-2 border-gray-200 group-hover:border-black rounded-md w-8 h-8 flex items-center justify-center">
                              {s.icon}
                            </span>
                            <span className="text-xs font-bold group-hover:text-[#38BDF8]">
                              {s.name}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                          Select category & hit zap
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

            {/* --- GOAL SPECIFIC FIELDS --- */}
            {activeTab === "goal" && (
              <>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your goal..."
                    className="w-full bg-white border-2 border-black rounded-xl p-4 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/20 transition-all shadow-[4px_4px_0px_0px_#000] resize-none h-24"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Goal Type
                  </label>
                  <div className="flex gap-2">
                    {(["short", "medium", "long"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setGoalType(t)}
                        className={`
                          flex-1 py-3 rounded-xl font-bold uppercase text-xs border-2 transition-all
                          ${
                            goalType === t
                              ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_#38BDF8] -translate-y-1"
                              : "bg-white text-gray-500 border-gray-200 hover:border-black"
                          }
                        `}
                      >
                        {t} Term
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-xl p-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/20 transition-all shadow-[4px_4px_0px_0px_#000]"
                  />
                </div>
              </>
            )}

            {/* --- PRIORITY (HABIT ONLY) --- */}
            {activeTab === "habit" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`
                        flex-1 py-3 rounded-xl font-bold uppercase text-xs border-2 transition-all
                        ${
                          priority === p
                            ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_#38BDF8] -translate-y-1"
                            : "bg-white text-gray-500 border-gray-200 hover:border-black"
                        }
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- ICON PICKER --- */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Choose Icon
                </label>
                <button
                  type="button"
                  onClick={() => setShowCustomEmoji(!showCustomEmoji)}
                  className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  <Smile className="w-3 h-3" />
                  {showCustomEmoji ? "Pick from list" : "Custom Emoji"}
                </button>
              </div>

              {showCustomEmoji ? (
                <div className="flex justify-center w-full">
                  <div className="w-full border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                    <EmojiPicker
                      onEmojiClick={(emojiData: EmojiClickData) => {
                        setCustomIcon(emojiData.emoji);
                        setSelectedIcon(emojiData.emoji);
                      }}
                      width="100%"
                      height={350}
                      previewConfig={{ showPreview: false }}
                      skinTonesDisabled
                    />
                  </div>
                </div>
              ) : (
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
              )}
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
                  {showCustomEmoji && customIcon ? customIcon : selectedIcon}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">
                    {name ||
                      (activeTab === "habit" ? "Habit Name" : "Goal Title")}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span className="text-xs font-bold text-gray-500">
                        0 Day Streak
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-black/10 uppercase ${
                        priority === "high"
                          ? "bg-red-100 text-red-700"
                          : priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {priority}
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
                  <span>{editId ? "Save Changes" : `Create ${activeTab}`}</span>
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

const CreatePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePageContent />
    </Suspense>
  );
};

export default CreatePage;
