"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  MoreVertical,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Goal {
  _id: string;
  title: string;
  description: string;
  type: "short" | "medium" | "long";
  deadline: string;
  status: "active" | "completed" | "archived";
  progress: number;
  icon: string;
  color: string;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "short" | "medium" | "long">(
    "all"
  );

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (data.success) {
        setGoals(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch goals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const deleteGoal = async (id: string) => {
    if (!confirm("Delete this goal?")) return;
    setGoals((prev) => prev.filter((g) => g._id !== id));
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
    } catch (error) {
      fetchGoals();
    }
  };

  const filteredGoals =
    filter === "all" ? goals : goals.filter((g) => g.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#F4B400]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* --- HEADER --- */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-2">
              My Goals
            </h1>
            <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
              VISION BOARD & MILESTONES
            </p>
          </div>

          <Link href="/create?tab=goal">
            <button className="bg-[#121212] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs border-2 border-transparent hover:border-black hover:bg-[#2a2a2a] shadow-[4px_4px_0px_0px_#38BDF8] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Goal
            </button>
          </Link>
        </header>

        {/* --- FILTERS --- */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["all", "short", "medium", "long"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-lg font-bold border-2 border-black text-xs uppercase whitespace-nowrap transition-all shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:shadow-none
                ${
                  filter === f
                    ? "bg-[#38BDF8] text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }
              `}
            >
              {f === "all" ? "All Goals" : `${f} Term`}
            </button>
          ))}
        </div>

        {/* --- GOALS GRID --- */}
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl">
            <div className="relative w-48 h-48 mb-4 opacity-50">
              <Target className="w-full h-full text-gray-200" />
            </div>
            <h3 className="text-xl font-black uppercase mb-2 text-gray-800">
              No Goals Set
            </h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto mb-6">
              "A goal without a plan is just a wish." Start planning your future
              today.
            </p>
            <Link href="/create?tab=goal">
              <button className="bg-[#38BDF8] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all">
                Set First Goal
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGoals.map((goal) => (
                <motion.div
                  key={goal._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] relative group hover:translate-y-[-4px] transition-all"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-2xl ${goal.color}`}
                    >
                      {goal.icon}
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded border border-black/10 bg-gray-100 text-[10px] font-black uppercase tracking-wider">
                        {goal.type} Term
                      </span>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2 leading-tight">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4 h-10">
                    {goal.description || "No description provided."}
                  </p>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {goal.deadline
                          ? new Date(goal.deadline).toLocaleDateString()
                          : "No Deadline"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#38BDF8]">
                      <Flag className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
