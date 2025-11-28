
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full bg-[#4F4FD9] text-white font-sans overflow-hidden relative selection:bg-white/20">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#5f5fe6] via-[#4e4ecb] to-[#3d3db3] opacity-70 pointer-events-none" />

      <div className="h-dvh w-full md:h-screen md:container md:mx-auto md:max-w-7xl md:px-12 flex flex-col md:grid md:grid-cols-2 md:items-center relative z-10">
        {/* LEFT SIDE */}
        <div className="flex flex-col h-full w-full md:h-auto md:justify-center md:gap-10">
          {/* TEXT */}
          <div className="pt-10 px-6 md:px-0 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h1 className="text-[2.5rem] md:text-[4.5rem] leading-[1.05] font-extrabold tracking-tight">
                Turn your day
                <br />
                into progress.
              </h1>

              <p className="hidden md:block text-lg text-indigo-100 mt-6 max-w-lg leading-relaxed font-medium">
                PrimeDay tracks everything you do, summarizes your day with AI,
                and gives you a clear, simple plan to improve tomorrow.
              </p>
            </motion.div>
          </div>
          <div className="flex-1 min-h-1 w-full flex items-center justify-center relative md:hidden py-4">
            <div className="relative w-full max-w-[450px] h-[50vh]">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl" />

              <div className="relative w-full h-full">
                <Image
                  src="/anime-girl-5.png"
                  alt="Mascot"
                  fill
                  className="object-contain w-full h-full  relative z-10"
                  priority
                />
              </div>
            </div>
          </div>

          {/* BUTTONS – always bottom on phone */}
          <div className="px-6 pb-10 md:pb-0 md:px-0 shrink-0 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full flex flex-col items-center md:items-start gap-6"
            >
              <Button className="group relative w-full md:w-64 h-14 md:h-16 bg-white text-[#4F4FD9] hover:bg-gray-100 hover:shadow-2xl hover:scale-105 text-lg font-bold rounded-full shadow-xl transition-all duration-300 active:scale-95  cursor-pointer">
                Start improving today
              </Button>

              <Button
                variant={"link"}
                className="text-white  text-sm md:text-base cursor-pointer font-semibold transition-all duration-300"
              >
                Already using PrimeDay?
              </Button>

              <p className="text-white/60 text-[11px] md:text-xs text-center md:text-left max-w-[260px]">
                By starting or signing in, you agree to our{" "}
                <a className="underline decoration-white/40 hover:decoration-white text-center cursor-pointer transition-all">
                  Terms of use
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* PC IMAGE — perfect sizing from your PC version */}
        <div className="hidden md:flex justify-center items-center h-full relative">
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-[520px] h-[520px] lg:w-[650px] lg:h-[650px]"
          >
            <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="relative w-full h-full"
            >
              <Image
                src="/anime-girl-5.png"
                alt="Mascot"
                fill
                className="object-contain drop-shadow-2xl relative z-10"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
