"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// New Component: Upward floating energy particles (Dust/Sparks)
const FloatingDust = ({ delay, size, xPos, duration }: { delay: number; size: number; xPos: number; duration: number }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: -150, opacity: [0, 0.8, 0] }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
    style={{ left: `${xPos}%`, width: size, height: size }}
    className="absolute bottom-0 bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_10px_white]"
  />
);

export default function Home() {
  return (
    <div className="relative w-full bg-[#4F4FD9] text-white overflow-hidden font-sans selection:bg-white/20">
      {/* ===== BACKGROUND LAYERS ===== */}

      {/* Deep noise texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

      {/* Main gradient base */}
      <div className="absolute inset-0 bg-linear-to-br from-[#6e6eff] via-[#4a4ad9] to-[#242485]" />

      {/* Tech Grid with radial mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_80%_at_50%_20%,#000_60%,transparent_100%)] pointer-events-none mix-blend-overlay" />
      {/* Scanner Sweep Effect */}
      <motion.div
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-[20vh] bg-linear-to-b from-transparent via-white/5 to-transparent pointer-events-none blur-xl"
      />

      {/* Top Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-300/30 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* ======= MAIN LAYOUT ======= */}
      <div className="relative z-10 h-dvh md:h-screen grid md:grid-cols-2 items-center md:container md:mx-auto md:max-w-7xl md:px-12 pb-10 md:pb-0">
        {/* LEFT CONTENT SECTION */}
        <div className="flex flex-col h-full px-6 md:px-0 md:justify-center pt-14 md:pt-0 relative">
          {/* Header Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left z-20 relative"
          >
            <h1 className="text-[3rem] md:text-[4.8rem] font-extrabold leading-[1.05] tracking-tight drop-shadow-xl">
              Turn your day
              <br />
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-linear-to-r from-white via-indigo-100 to-indigo-300">
                into progress.
              </span>
            </h1>

            <p className="hidden md:block text-lg text-indigo-100 mt-6 max-w-lg leading-relaxed font-medium">
              PrimeDay tracks everything you do, summarizes your day with AI,
              and turns your habits into personalized improvement.
            </p>
          </motion.div>

          {/* === MOBILE VISUAL HERO (UPDATED: Clean Light Beam, No Circles) === */}
          <div className="flex-1 w-full flex items-end justify-center md:hidden relative my-4 min-h-[40vh]">
            {/* 1. The Light Beam (Vertical Gradient) */}
            <div className="absolute bottom-0 w-[200px] h-[120%] bg-linear-to-t from-white/10 via-white/5 to-transparent blur-xl" />

            {/* 2. Floating Dust Particles (Magical Effect) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <FloatingDust delay={0} duration={4} size={4} xPos={40} />
              <FloatingDust delay={1} duration={6} size={3} xPos={60} />
              <FloatingDust delay={2.5} duration={5} size={2} xPos={30} />
              <FloatingDust delay={0.5} duration={7} size={5} xPos={70} />
            </div>

            {/* 3. The Mascot */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -10, 0], opacity: 1 }}
              transition={{
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                opacity: { duration: 0.7 },
              }}
              className="relative w-full max-w-[360px] h-full z-10 flex items-end justify-center"
            >
              <Image
                src="/anime-girl-5.png"
                alt="Mascot"
                fill
                className="object-contain object-bottom drop-shadow-2xl contrast-110"
                priority
              />
            </motion.div>

            {/* 4. Floor Glow (Grounding) */}
            <div className="absolute bottom-0 w-[80%] h-10 bg-white/20 blur-2xl rounded-full" />
          </div>
          {/* ============================================ */}

          {/* Action Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center md:items-start gap-5 z-30"
          >
            <Link href="/auth">
              <Button className="group relative font-bold md:mt-8 w-90 md:w-64 h-14 bg-white text-[#4F4FD9] hover:bg-indigo-50 text-lg  rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 active:scale-95 overflow-hidden cursor-pointer">
                {/* Button Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/50 to-transparent z-10" />
                <span className="relative z-20 font-bold">
                  Start improving today
                </span>
              </Button>
            </Link>

            <div className="flex flex-col items-center md:items-start gap-1">
              <Link href="/auth">
                <Button
                  variant="link"
                  className="text-white/90 text-sm font-semibold hover:text-white p-0 cursor-pointer h-auto"
                >
                  Already using PrimeDay?
                </Button>
              </Link>
            </div>

            <p className="text-xs text-white/70 text-center md:text-left mt-2">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-white">
                Terms and Conditions
              </Link>
              .
            </p>
          </motion.div>
        </div>

        {/* RIGHT PC MASCOT SECTION (UPDATED: Clean Light, No Circles) */}
        <div className="hidden md:flex justify-center items-center relative h-full">
          {/* Large Static Ambient Glow (Replaces Rotating Rings) */}
          <div className="absolute w-[650px] h-[650px] bg-white/5 rounded-full blur-[100px]" />

          {/* Floating Particles for PC */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <FloatingDust delay={0} duration={10} size={4} xPos={30} />
            <FloatingDust delay={3} duration={12} size={6} xPos={70} />
            <FloatingDust delay={1.5} duration={8} size={3} xPos={50} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-[550px] h-[550px] lg:w-[700px] lg:h-[700px] z-20"
          >
            {/* Stronger Backlight Glow */}
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500/30 to-purple-500/30 blur-[120px]" />

            {/* Mascot Float Animation */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image
                src="/anime-girl-5.png"
                alt="Mascot"
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 contrast-105"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
