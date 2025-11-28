"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

// --- Configuration ---
const steps = [
  {
    question: "How's your energy?",
    emoji: "⚡",
    options: [
      { label: "Unstoppable", sub: "Ready to crush it", icon: "🔥" },
      { label: "Ups and Downs", sub: "Need consistency", icon: "🌊" },
      { label: "Running on Empty", sub: "Burned out", icon: "🪫" },
    ],
  },
  {
    question: "Main focus today?",
    emoji: "🎯",
    options: [
      { label: "Deep Work", sub: "Kill procrastination", icon: "🧠" },
      { label: "Healthy Habits", sub: "Fix sleep & routine", icon: "💤" },
      { label: "Mental Clarity", sub: "Reduce overwhelm", icon: "🧘" },
    ],
  },
  {
    question: "Current Status?",
    emoji: "💼",
    options: [
      { label: "Student", sub: "Study / Exams", icon: "📚" },
      { label: "Founder", sub: "Building Empire", icon: "🚀" },
      { label: "Professional", sub: "9-5 Grind", icon: "🏢" },
    ],
  },
  {
    question: "Time commitment?",
    emoji: "⏱️",
    options: [
      { label: "Quick Start", sub: "10-15 mins", icon: "👟" },
      { label: "Solid Effort", sub: "30-45 mins", icon: "💪" },
      { label: "All In", sub: "1 hour+", icon: "🏔️" },
    ],
  },
];

const loadingMessages = [
  "Calibrating your profile...",
  "Designing your routine...",
  "Finalizing dashboard...",
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: number]: number }>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  // Auto-Advance Logic
  const handleSelect = (index: number) => {
    setSelections((prev) => ({ ...prev, [currentStep]: index }));
    // 400ms delay for visual feedback
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsCompleting(true);
      }
    }, 400);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // End Screen Logic
  useEffect(() => {
    if (isCompleting) {
      // Cycle messages slower (every 1.5s)
      const msgInterval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);

      const redirectTimeout = setTimeout(() => {
        router.push("/dashboard");
      }, 5000);

      return () => {
        clearInterval(msgInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [isCompleting, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden selection:bg-cyan-500/30">
      {/* --- Optimized Background --- */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black z-0" />
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#334155 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto h-screen flex flex-col p-6">
        <AnimatePresence mode="wait">
          {!isCompleting ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              {/* --- TOP HEADER --- */}
              <div className="flex items-center justify-between mb-6 pt-2">
                <div className="w-10">
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  {steps.map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        width: idx === currentStep ? 24 : 8,
                        backgroundColor:
                          idx <= currentStep ? "#38bdf8" : "#1e293b",
                      }}
                      className="h-1.5 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>
                <div className="w-10" />
              </div>

              {/* --- HERO SECTION --- */}
              <div className="flex flex-col items-center justify-center mb-8">
                <motion.div
                  key={`emoji-${currentStep}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl mb-6 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                >
                  {steps[currentStep].emoji}
                </motion.div>

                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black text-center leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-100 to-blue-300"
                >
                  {steps[currentStep].question}
                </motion.h2>
              </div>

              {/* --- OPTIONS --- */}
              <div className="flex-1 space-y-3 pb-8">
                {steps[currentStep].options.map((option, idx) => {
                  const isSelected = selections[currentStep] === idx;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelect(idx)}
                      className={`group w-full relative p-5 rounded-2xl border transition-all duration-200 flex items-center gap-5 text-left overflow-hidden
                              ${
                                isSelected
                                  ? "border-cyan-500 bg-blue-900/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                                  : "border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700"
                              }
                          `}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-x-12"
                        />
                      )}

                      <div
                        className={`text-2xl transition-transform duration-200 ${
                          isSelected ? "scale-110" : "group-hover:scale-105"
                        }`}
                      >
                        {option.icon}
                      </div>

                      <div className="relative z-10 flex-1">
                        <h3
                          className={`font-bold text-lg transition-colors ${
                            isSelected ? "text-cyan-50" : "text-slate-200"
                          }`}
                        >
                          {option.label}
                        </h3>
                        <p
                          className={`text-sm transition-colors ${
                            isSelected ? "text-cyan-200" : "text-slate-500"
                          }`}
                        >
                          {option.sub}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-cyan-500 border-cyan-500 scale-100"
                                  : "border-slate-700 scale-0 opacity-0"
                              }`}
                      >
                        <CheckCircle2
                          size={14}
                          className="text-black font-bold"
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // --- CLEAN "HUD" END SCREEN ---
            <motion.div
              key="creating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center h-full relative"
            >
              {/* 1. HUD Visuals (Replacing the messy particles/beam) */}
              <div className="relative w-full h-[60vh] flex items-center justify-center mb-6">
                {/* Outer Ring - Slow Rotate */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-[340px] h-[340px] border border-dashed border-slate-700 rounded-full opacity-50"
                />

                {/* Inner Ring - Medium Rotate */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-[300px] h-[300px] border border-dotted border-cyan-900 rounded-full opacity-60"
                />

                {/* Pulsing Core Glow */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-[250px] h-[250px] bg-cyan-500/10 rounded-full blur-[40px]"
                />

                {/* Character */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full z-10 p-8"
                >
                  <Image
                    src="/anime-girl-2.png"
                    alt="Success"
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                    priority
                  />
                </motion.div>
              </div>

              {/* 2. Clean Typography & Loading */}
              <div className="relative z-20 w-full max-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={msgIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xl font-bold text-white mb-2"
                  >
                    {loadingMessages[msgIndex]}
                  </motion.h3>
                </AnimatePresence>

                {/* 3. Smooth Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
