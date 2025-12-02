"use client";

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
// Removed Image import as we are using abstract geometry now
import {
  ArrowRight,
  ArrowLeft,
  Moon,
  Sun,
  Target,
  Smartphone,
  Zap,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Brain,
  Layers,
} from "lucide-react";

// --- Configuration ---

// The new professional Sky Blue
const SKY_BLUE = "#38BDF8";

const questions = [
  {
    id: "focus",
    title: "What are your main goals?",
    subtitle: "Select all that apply",
    multi: true,
    options: [
      { id: "work", label: "Deep Work & Focus", icon: <Target /> },
      { id: "health", label: "Fitness & Health", icon: <Zap /> },
      { id: "mindset", label: "Mental Clarity", icon: <Sun /> },
      { id: "learning", label: "Learning New Skills", icon: <Brain /> },
    ],
  },
  {
    id: "sleep",
    title: "How is your sleep schedule?",
    subtitle: "Be honest, we won't judge.",
    multi: false,
    options: [
      { id: "bad", label: "Chaotic (< 6 hrs)", icon: <XCircle /> },
      { id: "okay", label: "Average (6-7 hrs)", icon: <Moon /> },
      { id: "good", label: "Optimized (8+ hrs)", icon: <CheckCircle2 /> },
    ],
  },
  {
    id: "obstacles",
    title: "What kills your productivity?",
    subtitle: "Select your enemies.",
    multi: true,
    options: [
      { id: "phone", label: "Social Media / Phone", icon: <Smartphone /> },
      { id: "procrastination", label: "Procrastination", icon: <LayoutGrid /> },
      { id: "fatigue", label: "Low Energy", icon: <Moon /> },
    ],
  },
];

// --- Components ---

const OptionCard = ({ option, isSelected, onClick }: any) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      // Using dynamic style for the selected background color to use our new SKY_BLUE variable
      style={{ backgroundColor: isSelected ? SKY_BLUE : "white" }}
      className={`
        relative w-full p-5 text-left transition-all duration-200 
        border-2 border-black rounded-xl flex items-center gap-4 group
        ${
          isSelected
            ? `text-black shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]`
            : "text-gray-800 shadow-[6px_6px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] hover:bg-gray-50"
        }
      `}
    >
      {/* Icon Box */}
      <div
        className={`p-3 border-2 border-black rounded-lg transition-colors ${
          isSelected ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {option.icon}
      </div>

      {/* Text */}
      <span className="font-bold text-lg">{option.label}</span>

      {/* Checkmark Indicator */}
      <div
        className={`absolute right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isSelected ? "bg-black scale-100" : "scale-0"
        }`}
      >
        {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
      </div>
    </motion.button>
  );
};

// --- NEW PROFESSIONAL ENDING SCREEN ---
const ProfessionalOverlay = () => {
  const [textIndex, setTextIndex] = useState(0);
  // More professional texts
  const texts = [
    "Synthesizing your profile...",
    "Calibrating daily targets...",
    "Finalizing Prime Day Dashboard.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-[#121212] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Abstract Geometric Centerpiece instead of mascot */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Rotating outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[4px] border-dashed border-gray-700 rounded-full"
        />

        {/* Bauhaus Shapes constructing together */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="relative z-10 grid grid-cols-2 gap-2"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#38BDF8]"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="w-16 h-16 bg-[#38BDF8] border-2 border-black rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            className="w-16 h-16 bg-black border-2 border-[#38BDF8]"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center"
          >
            <Layers className="text-black" />
          </motion.div>
        </motion.div>

        {/* Glow */}
        <div className="absolute inset-0 bg-[#38BDF8]/20 blur-[80px] rounded-full animate-pulse" />
      </div>

      {/* Dynamic Text */}
      <div className="z-10 h-12 text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={textIndex}
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            className="text-xl font-bold text-white tracking-wider uppercase font-mono"
          >
            {texts[textIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Loading Bar using SKY_BLUE */}
      <div className="w-64 h-1 bg-gray-800 mt-8 overflow-hidden z-10">
        <motion.div
          className="h-full"
          style={{ backgroundColor: SKY_BLUE }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

// --- Main Page ---

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showProOverlay, setShowProOverlay] = useState(false);

  const currentQ = questions[step];
  const totalSteps = questions.length;

  const handleSelect = (optionId: string) => {
    const currentSelections = answers[currentQ.id] || [];
    if (currentQ.multi) {
      if (currentSelections.includes(optionId)) {
        setAnswers({
          ...answers,
          [currentQ.id]: currentSelections.filter((id) => id !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQ.id]: [...currentSelections, optionId],
        });
      }
    } else {
      setAnswers({ ...answers, [currentQ.id]: [optionId] });
    }
  };

  const hasSelection = (answers[currentQ.id]?.length || 0) > 0;


  useEffect(() => {
    if (showProOverlay) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [showProOverlay, router]);

  const slideVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

React.useEffect(() => {
  const userId = localStorage.getItem("primeDayUserId");
  const hasOnboarded = localStorage.getItem("primeDayHasOnboarded");

  // 1. If not logged in -> Go to Auth
  if (!userId) {
    router.replace("/auth");
    return;
  }

  // 2. If already onboarded -> Go to Dashboard
  if (hasOnboarded === "true") {
    router.replace("/dashboard");
    return;
  }
}, [router]);

const saveOnboardingData = async () => {
  try {
    const userId = localStorage.getItem("primeDayUserId"); // Or get from cookie if you prefer, but localstorage is fine here

    if (!userId) {
      console.error("No user ID found! Redirecting...");
      router.push("/auth");
      return;
    }

    // --- FIX: DEFINE PAYLOAD HERE ---
    const payload = {
      userId,
      focus: answers["focus"],
      sleep: answers["sleep"] ? answers["sleep"][0] : null, // Handle single select array
      obstacles: answers["obstacles"],
    };
    // -------------------------------

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // Now payload exists!
    });

    if (!res.ok) throw new Error("Failed to save");

    // Mark as complete so middleware knows
    // Note: Middleware checks cookies, but this helps client-side logic if needed
    localStorage.setItem("primeDayHasOnboarded", "true");
    console.log("Onboarding saved successfully");
  } catch (error) {
    console.error("Save Error:", error);
  }
};

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // 1. Show the overlay immediately (User sees animation)
      setShowProOverlay(true);

      // 2. Save data in background while animation plays
      await saveOnboardingData();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#121212] font-sans overflow-hidden relative flex flex-col">
      {showProOverlay && <ProfessionalOverlay />}

      {/* Top bar accent */}
      <div className="absolute top-0 left-0 w-full h-3 bg-black z-50" />

      {/* --- Header --- */}
      <div className="px-6 pt-12 pb-6 z-10 bg-[#F8FAFC]">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-black text-3xl tracking-tighter uppercase italic flex items-center gap-2">
              <div
                className="w-4 h-4 bg-black"
                style={{ backgroundColor: SKY_BLUE }}
              ></div>
              Prime Day.
            </h1>
          </div>
          <span className="font-mono font-bold text-xs text-gray-500">
            STEP {step + 1} / {totalSteps}
          </span>
        </div>
        {/* Progress Line using SKY_BLUE */}
        <div className="h-[4px] w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: SKY_BLUE }}
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* --- Question Area --- */}
      <div className="flex-1 px-6 relative z-10 flex flex-col pt-4 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="mb-10">
              <h2 className="text-4xl font-black mb-3 leading-[0.95] tracking-tight">
                {currentQ.title}
              </h2>
              <p className="text-lg font-medium text-gray-500">
                {currentQ.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQ.options.map((opt) => {
                const isSelected = (answers[currentQ.id] || []).includes(
                  opt.id
                );
                return (
                  <OptionCard
                    key={opt.id}
                    option={opt}
                    isSelected={isSelected}
                    onClick={() => handleSelect(opt.id)}
                  />
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Footer Nav --- */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#F8FAFC]/80 backdrop-blur-md border-t-2 border-gray-200 flex items-center justify-between z-20 safe-area-inset-bottom">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className={`p-4 rounded-xl border-2 border-gray-300 transition-all ${
            step === 0
              ? "opacity-30 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 active:scale-95 hover:border-black"
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={!hasSelection}
          // Using inline style for shadow color to match SKY_BLUE
          style={{
            boxShadow: hasSelection ? `4px 4px 0px 0px ${SKY_BLUE}` : "none",
            backgroundColor: hasSelection ? "#121212" : "#E5E7EB",
          }}
          className={`flex-1 ml-4 flex items-center justify-center gap-3 py-4 rounded-xl font-black text-lg border-2 border-black transition-all duration-200 ${
            !hasSelection
              ? "opacity-50 text-gray-500 cursor-not-allowed border-gray-300"
              : "text-white active:translate-y-[2px] active:shadow-none hover:bg-[#2a2a2a]"
          }`}
        >
          {step === totalSteps - 1 ? "COMPLETE SETUP" : "CONTINUE"}
          <ArrowRight
            className={`w-5 h-5 ${hasSelection ? "animate-pulse" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}