"use client";

import { Button } from "@/components/ui/button";
import { SignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-4 left-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xl border-border hover:bg-accent"
        >
          <ArrowLeft size={18} /> Back
        </Button>
      </Link>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Start your journey with a clean, fast experience.
        </p>
      </motion.div>

      {/* === TRUE CENTER WRAPPER === */}
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-md">
          {/* SINGLE CLEAN CONTAINER — no glow, no double box */}
          <div
            className="
              rounded-2xl 
              border border-border 
              bg-card 
              p-6 
              shadow-sm
            "
          >
            <SignUp signInUrl="/sign-in" />
          </div>
        </div>
      </div>
      {/* ============================= */}
    </div>
  );
}
