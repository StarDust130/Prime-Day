"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flame,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Habit {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  completedDates: string[];
  streak: number;
}

const HabitsPage = () => {
  const [today, setToday] = useState(new Date());

  // Calculate current week dates
  const getWeekDates = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDates = getWeekDates(today);
  const currentDayIndex = (today.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  // State
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Habits
  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      if (data.success) {
        setHabits(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch habits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Check if a habit is completed on a specific date
  const isHabitCompleted = (habit: Habit, date: Date) => {
    const dateStr = date.toISOString(); // The backend stores ISO strings set to 00:00:00
    // We need to match the backend's storage format.
    // The backend does: targetDate.setHours(0, 0, 0, 0); const targetISO = targetDate.toISOString();

    // Ensure the date passed in is also set to start of day
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const checkISO = checkDate.toISOString();

    return habit.completedDates.includes(checkISO);
  };

  // Toggle habit completion logic
  const toggleHabit = async (habitId: string, date: Date) => {
    // Optimistic Update
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetISO = targetDate.toISOString();

    setHabits((prev) =>
      prev.map((h) => {
        if (h._id === habitId) {
          const exists = h.completedDates.includes(targetISO);
          let newDates;
          let newStreak = h.streak;

          if (exists) {
            newDates = h.completedDates.filter((d) => d !== targetISO);
            // Simple streak adjustment (not perfect without full recalc but good for optimistic)
            if (targetDate.toDateString() === new Date().toDateString()) {
              newStreak = Math.max(0, h.streak - 1);
            }
          } else {
            newDates = [...h.completedDates, targetISO];
            if (targetDate.toDateString() === new Date().toDateString()) {
              newStreak = h.streak + 1;
            }
          }

          return { ...h, completedDates: newDates, streak: newStreak };
        }
        return h;
      })
    );

    try {
      const res = await fetch("/api/habits/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: targetDate.toISOString() }),
      });

      const data = await res.json();
      if (!data.success) {
        // Revert on failure (could be improved by refetching)
        fetchHabits();
      } else {
        // Update with actual streak from server
        setHabits((prev) =>
          prev.map((h) =>
            h._id === habitId ? { ...h, streak: data.streak } : h
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle habit", error);
      fetchHabits(); // Revert
    }
  };

  // Filter Logic
  const visibleHabits = hideCompleted
    ? habits.filter((h) => !isHabitCompleted(h, today))
    : habits;

  // Calculate Daily Progress
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) =>
    isHabitCompleted(h, today)
  ).length;
  const progressPercentage =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#38BDF8]/10 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#F4B400]/10 rounded-full blur-[80px]"
        />
      </div>

      <div className="relative z-10">
        {/* --- HEADER --- */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-2">
              My Rituals
            </h1>
            <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
              BUILDING THE PRIME VERSION OF YOU
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress Pill Widget */}
            <div className="bg-white/80 backdrop-blur-sm border-2 border-black rounded-full px-4 py-2 flex items-center gap-3 shadow-[4px_4px_0px_0px_#000]">
              <div className="relative w-6 h-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#38BDF8"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="62.8"
                    strokeDashoffset={62.8 - (62.8 * progressPercentage) / 100}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
              </div>
              <span className="font-black text-sm">
                {completedToday}/{totalHabits} DONE
              </span>
            </div>
          </div>
        </header>

        {/* --- DATE & CONTROLS --- */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Date Navigator */}
          <div className="flex items-center justify-between bg-white border-2 border-black p-1 rounded-xl shadow-[4px_4px_0px_0px_#000]">
            <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors active:scale-90">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Current Week
              </h2>
              <p className="text-[10px] font-bold text-gray-400 font-mono">
                {weekDates[0].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {weekDates[6].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors active:scale-90">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View & Hide Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("day")}
                className={`px-4 py-2 rounded-lg font-bold border-2 border-black text-xs uppercase flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:shadow-none ${
                  viewMode === "day"
                    ? "bg-[#38BDF8] text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" /> Day
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-lg font-bold border-2 border-black text-xs uppercase flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:shadow-none ${
                  viewMode === "week"
                    ? "bg-[#38BDF8] text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Week
              </button>
            </div>

            <button
              onClick={() => setHideCompleted(!hideCompleted)}
              className={`px-4 py-2 rounded-lg font-bold border-2 border-black text-xs uppercase flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:shadow-none ${
                hideCompleted
                  ? "bg-[#121212] text-white"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {hideCompleted ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {hideCompleted ? "Hidden" : "Hide Done"}
            </button>
          </div>
        </div>

        {/* --- HABITS LIST --- */}
        <div className="space-y-5">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src="/anime-girl-2.png"
                  alt="No habits"
                  fill
                  className="object-contain opacity-80"
                />
              </div>
              <h3 className="text-xl font-black uppercase mb-2 text-gray-800">
                No Habits Yet
              </h3>
              <p className="text-gray-500 font-medium max-w-xs mx-auto">
                Your journey to greatness starts with a single step. Add your
                first habit below!
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "day" ? (
                /* --- DAY VIEW (FOCUSED CHECKLIST) --- */
                <motion.div
                  key="day-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {visibleHabits.map((habit) => {
                    const isCompleted = isHabitCompleted(habit, today);
                    return (
                      <motion.div
                        key={habit._id}
                        layout
                        className={`
                                    relative flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]
                                    ${isCompleted ? "bg-gray-50/80" : ""}
                                `}
                      >
                        {/* Left: Info */}
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center text-2xl ${
                              isCompleted ? "bg-gray-200 grayscale" : "bg-white"
                            }`}
                          >
                            {habit.icon}
                          </div>
                          <div>
                            <h3
                              className={`text-lg font-black uppercase tracking-tight ${
                                isCompleted
                                  ? "text-gray-400 line-through decoration-2"
                                  : "text-black"
                              }`}
                            >
                              {habit.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Flame
                                className={`w-3 h-3 ${
                                  isCompleted
                                    ? "text-gray-400"
                                    : "text-orange-500 fill-orange-500"
                                }`}
                              />
                              <span className="text-xs font-bold text-gray-500">
                                {habit.streak} Day Streak
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Big Check Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleHabit(habit._id, today)}
                          className={`
                                        w-14 h-14 rounded-xl border-2 border-black flex items-center justify-center transition-all duration-200
                                        ${
                                          isCompleted
                                            ? `${habit.color} shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]`
                                            : "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_#000]"
                                        }
                                    `}
                        >
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                              >
                                <Check
                                  className={`w-8 h-8 ${
                                    habit.color === "bg-[#121212]"
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                  strokeWidth={4}
                                />
                              </motion.div>
                            ) : (
                              <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </motion.div>
                    );
                  })}

                  {visibleHabits.length === 0 && hideCompleted && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 font-bold uppercase">
                        All Daily Tasks Complete
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* --- WEEK VIEW (SLEEK CARDS) --- */
                <motion.div
                  key="week-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {visibleHabits.map((habit) => (
                    <motion.div
                      key={habit._id}
                      layout
                      className="bg-white/90 backdrop-blur-sm border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] relative hover:translate-y-[-2px] transition-all"
                    >
                      {/* Decorative Corner */}
                      <div
                        className={`absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-black rounded-bl-xl ${habit.color}`}
                      />

                      <div className="flex justify-between items-start mb-6 pr-8">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl bg-gray-50 border-2 border-black rounded-md w-10 h-10 flex items-center justify-center shadow-sm">
                            {habit.icon}
                          </span>
                          <div>
                            <h3 className="font-black uppercase text-lg tracking-tight leading-none">
                              {habit.name}
                            </h3>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1 border border-gray-200">
                              {habit.streak} DAY STREAK
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-1">
                        {weekDays.map((d, i) => {
                          const dateForDay = weekDates[i];
                          const isCompleted = isHabitCompleted(
                            habit,
                            dateForDay
                          );
                          const isToday = i === currentDayIndex;
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-2 flex-1"
                            >
                              <span
                                className={`text-[10px] font-black ${
                                  isToday ? "text-[#38BDF8]" : "text-gray-400"
                                }`}
                              >
                                {d}
                              </span>

                              <button
                                onClick={() =>
                                  toggleHabit(habit._id, dateForDay)
                                }
                                className={`
                                                    w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center transition-all
                                                    ${
                                                      isCompleted
                                                        ? `${habit.color} shadow-[2px_2px_0px_0px_#000]`
                                                        : "bg-white hover:bg-gray-50"
                                                    }
                                                    ${
                                                      isToday && !isCompleted
                                                        ? "ring-2 ring-[#38BDF8] ring-offset-2"
                                                        : ""
                                                    }
                                                `}
                              >
                                {isCompleted && (
                                  <Check
                                    className={`w-4 h-4 ${
                                      habit.color === "bg-[#121212]"
                                        ? "text-white"
                                        : "text-black"
                                    }`}
                                    strokeWidth={3}
                                  />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* --- ADD BUTTON --- */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mt-8 bg-[#121212] text-white rounded-xl p-5 font-black uppercase tracking-widest border-2 border-transparent hover:border-black hover:bg-[#2a2a2a] shadow-[4px_4px_0px_0px_#38BDF8] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          <span>Add New Habit</span>
        </motion.button>
      </div>
    </div>
  );
};

export default HabitsPage;
