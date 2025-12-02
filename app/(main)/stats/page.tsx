"use client";

import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StatsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#22C55E]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-black/5 md:hidden"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
              Statistics
            </h1>
            <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
              VISUALIZE YOUR PROGRESS
            </p>
          </div>
        </header>

        <div className="p-12 border-2 border-black border-dashed rounded-2xl bg-[#F1F5F9]/50 text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="h-24 w-24 rounded-full bg-[#22C55E] border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#121212] relative z-10">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight mb-2 relative z-10">
            Stats Coming Soon
          </h2>
          <p className="text-sm font-bold text-gray-400 max-w-md relative z-10">
            We're building powerful charts to help you track your habits and
            goals over time. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
