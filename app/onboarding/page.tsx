"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- DATA ---
const steps = [
  {
    question: "How's your energy lately?",
    emoji: "⚡",
    options: [
      { label: "Unstoppable", sub: "Ready to crush it", icon: "🔥" },
      { label: "Ups and Downs", sub: "Need more consistency", icon: "🌊" },
      { label: "Running on Empty", sub: "Burned out", icon: "🪫" },
    ],
  },
  {
    question: "What's the main focus?",
    emoji: "🎯",
    options: [
      { label: "Deep Work", sub: "Stop procrastinating", icon: "🧠" },
      { label: "Healthy Habits", sub: "Sleep & routine", icon: "💤" },
      { label: "Mental Clarity", sub: "Reduce overwhelm", icon: "🧘" },
    ],
  },
  {
    question: "Current Grind?",
    emoji: "💼",
    options: [
      { label: "Student / Exams", sub: "Study mode", icon: "📚" },
      { label: "Founder / Hustle", sub: "Building mode", icon: "🚀" },
      { label: "9-5 Professional", sub: "Career mode", icon: "🏢" },
    ],
  },
  {
    question: "Time commitment daily?",
    emoji: "⏱️",
    options: [
      { label: "Quick Start", sub: "10-15 mins", icon: "👟" },
      { label: "Solid Effort", sub: "30-45 mins", icon: "💪" },
      { label: "All In", sub: "1 hour+", icon: "🏔️" },
    ],
  },
];

// --- LOADING TEXTS SEQUENCE ---
const loadingMessages = [
  "Analyzing your routine...",
  "Calibrating difficulty...",
  "Selecting the best habits...",
  "Finalizing your PrimeDay...",
];

// --- ANIMATION CONFIG ---
const contentVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }, // Snappy Apple-like feel
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [isSelecting, setIsSelecting] = useState<number | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const isFinished = step >= steps.length;

  // Handle Selection
  const handleSelect = (idx: number) => {
    if (isSelecting !== null) return;
    setIsSelecting(idx);

    // Wait 400ms for the visual splash, then switch
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setIsSelecting(null);
    }, 400);
  };

  // Final Loading Screen Logic
  useEffect(() => {
    if (isFinished) {
      // Cycle through messages every 1.2s
      const msgInterval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);

      // Redirect after 5s
      const redirectTimer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 5000);

      return () => {
        clearInterval(msgInterval);
        clearTimeout(redirectTimer);
      };
    }
  }, [isFinished]);

  return (
    <div className="relative w-full h-[100dvh] bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-indigo-500/30">
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-indigo-800/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[100px] opacity-30" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- PROGRESS BAR (Top) --- */}
      {!isFinished && (
        <div className="absolute top-0 w-full px-6 pt-8 z-30 flex gap-2 max-w-lg">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{
                  width: i < step ? "100%" : i === step ? "100%" : "0%",
                  opacity: i === step ? 1 : i < step ? 0.5 : 0,
                }}
                className="h-full bg-white shadow-[0_0_10px_white]"
              />
            </div>
          ))}
        </div>
      )}

      {/* --- MAIN CARD --- */}
      <div className="relative z-20 w-full max-w-md px-4">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            // === QUESTION STEP ===
            <motion.div
              key={step}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <span className="inline-block p-4 rounded-3xl bg-white/5 border border-white/5 text-4xl shadow-2xl mb-6">
                  {steps[step].emoji}
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  {steps[step].question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {steps[step].options.map((opt, idx) => {
                  const isActive = isSelecting === idx;

                  return (
                    <motion.button
                      key={opt.label}
                      onClick={() => handleSelect(idx)}
                      disabled={isSelecting !== null}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        group relative w-full p-4 rounded-2xl border flex items-center gap-4 text-left
                        transition-all duration-300
                        ${
                          isActive
                            ? "bg-white/20 border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]" // Active: Glassy White
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" // Default: Dark Glass
                        }
                      `}
                    >
                      {/* Icon */}
                      <span
                        className={`text-2xl transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                      >
                        {opt.icon}
                      </span>

                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">
                          {opt.label}
                        </h3>
                        <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                          {opt.sub}
                        </p>
                      </div>

                      {/* Arrow / Check */}
                      <div
                        className={`
                         w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
                         ${
                           isActive
                             ? "border-white bg-white text-black"
                             : "border-white/20 text-transparent"
                         }
                      `}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={4}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // === LOADING / MASCOT END SCREEN ===
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              {/* Glow Behind Mascot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />

              {/* Mascot Floating */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="relative w-80 h-80 mb-8 z-10"
              >
                <Image
                  src="/anime-girl-2.png"
                  alt="Mascot"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Dynamic Loading Text */}
              <div className="h-12 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={loadingMsgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
                  >
                    {loadingMessages[loadingMsgIndex]}
                  </motion.h3>
                </AnimatePresence>
              </div>

              {/* Spinner */}
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: dot * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
