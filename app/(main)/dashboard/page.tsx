"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Flame,
  Target,
  Calendar,
  ArrowRight,
  Zap,
  Activity,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Loading from "@/app/loading";

interface DashboardData {
  user: {
    username: string;
    email: string;
  };
  stats: {
    activeHabits: number;
    completedToday: number;
    activeGoals: number;
  };
  upcomingGoals: any[];
  todaysHabits: any[];
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTip = async () => {
      try {
        const res = await fetch("/api/ai/daily-tip");
        const json = await res.json();
        if (json.tip) {
          setDailyTip(json.tip);
        }
      } catch (error) {
        console.error("Failed to fetch tip");
      }
    };

    fetchDashboard();
    fetchTip();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!data) return null;

  const progress =
    data.stats.activeHabits > 0
      ? Math.round((data.stats.completedToday / data.stats.activeHabits) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#F4B400]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* --- HEADER --- */}
        <header className="mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter">
            Hello,{" "}
            <span className="capitalize">{data.user?.username || "User"}</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
            LET'S CRUSH IT TODAY
          </p>
          {dailyTip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="relative bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] flex gap-4 items-start hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                <div className="bg-black p-3 rounded-xl border-2 border-black flex-none">
                  <Sparkles className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
                    Daily AI Insight
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                  </h3>
                  <p className="text-sm font-bold text-[#121212] leading-relaxed">
                    "{dailyTip}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </header>

        {/* --- MAIN STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Daily Progress */}
          <div className="col-span-2 bg-[#121212] text-white rounded-2xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#38BDF8] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <Activity className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">
                Daily Focus
              </h3>
              <div className="text-5xl font-black mb-1">{progress}%</div>
              <p className="text-sm font-medium text-gray-400">
                {data.stats.completedToday} of {data.stats.activeHabits} habits
                done
              </p>
              <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[#38BDF8]"
                />
              </div>
            </div>
          </div>

          {/* Active Goals */}
          <Link href="/goals" className="contents">
            <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all cursor-pointer">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 border-2 border-black">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-3xl font-black">
                {data.stats.activeGoals}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Active Goals
              </div>
            </div>
          </Link>

          {/* Streak (Placeholder) */}
          <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 border-2 border-black">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-black">
              {data.todaysHabits.reduce(
                (acc: number, h: any) => Math.max(acc, h.streak),
                0
              )}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Best Streak
            </div>
          </div>
        </div>

        {/* --- UPCOMING GOALS --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Upcoming Goals
            </h2>
            <Link
              href="/goals"
              className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.upcomingGoals.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-2xl p-8 text-center border-dashed">
              <p className="text-gray-400 font-bold uppercase text-sm">
                No upcoming deadlines
              </p>
              <Link href="/create?tab=goal">
                <button className="mt-4 text-xs font-black uppercase bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Set a Goal
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingGoals.map((goal: any) => (
                <div
                  key={goal._id}
                  className="bg-white border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_#000] flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center text-xl ${goal.color}`}
                  >
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black uppercase text-sm">
                      {goal.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded border border-black/10 bg-gray-100 text-[10px] font-black uppercase tracking-wider">
                    {goal.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- TODAY'S HABITS PREVIEW --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Today's Habits
            </h2>
            <Link
              href="/habits"
              className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.todaysHabits.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-2xl p-8 text-center border-dashed">
              <p className="text-gray-400 font-bold uppercase text-sm">
                No habits for today
              </p>
              <Link href="/create">
                <button className="mt-4 text-xs font-black uppercase bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Create Habit
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {data.todaysHabits.map((habit: any) => (
                <div
                  key={habit._id}
                  className="bg-white border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_#000] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg border-2 border-black flex items-center justify-center text-xl">
                      {habit.icon}
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-sm">
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        <span>{habit.streak} Day Streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
