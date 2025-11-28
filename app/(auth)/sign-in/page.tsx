"use client";

import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative p-4">
      {/* Back Button */}
      <Link href="/" className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xl border-border hover:bg-accent"
        >
          <ArrowLeft size={18} /> Back
        </Button>
      </Link>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold">Welcome back</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Sign in to continue.
        </p>
      </motion.div>

      {/* === TRUE CENTER WRAPPER (THIS FIXES YOUR PROBLEM) === */}
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-3">
            <SignIn signUpUrl="/sign-up" />
          </div>
        </div>
      </div>
      {/* ===================================================== */}
    </div>
  );
}
