"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoachPage() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative flex flex-col">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#A855F7]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full flex flex-col h-full">
        <header className="mb-6 flex-none flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-black/5 md:hidden"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
              <Bot className="h-8 w-8 text-[#A855F7]" />
              AI Coach
            </h1>
            <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
              YOUR PERSONAL HABIT ASSISTANT
            </p>
          </div>
        </header>

        <div className="flex-1 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#A855F7] flex flex-col overflow-hidden relative">
          <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-[#F8FAFC]/50">
            {/* AI Message */}
            <div className="flex gap-4 max-w-[85%]">
              <div className="h-10 w-10 rounded-full bg-[#A855F7] border-2 border-black flex items-center justify-center flex-none shadow-[2px_2px_0px_0px_#121212]">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="p-4 bg-white border-2 border-black rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <p className="text-sm font-medium leading-relaxed">
                  Hello! I'm your Prime Day coach. I noticed you've been
                  consistent with your morning run. Great job! How can I help
                  you today?
                </p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse">
              <div className="h-10 w-10 rounded-full bg-[#121212] border-2 border-black flex items-center justify-center flex-none shadow-[2px_2px_0px_0px_#A855F7]">
                <span className="font-black text-white text-xs">ME</span>
              </div>
              <div className="p-4 bg-[#121212] text-white border-2 border-black rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <p className="text-sm font-medium leading-relaxed">
                  I'm struggling to drink enough water. Any tips?
                </p>
              </div>
            </div>

            {/* AI Message */}
            <div className="flex gap-4 max-w-[85%]">
              <div className="h-10 w-10 rounded-full bg-[#A855F7] border-2 border-black flex items-center justify-center flex-none shadow-[2px_2px_0px_0px_#121212]">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="p-4 bg-white border-2 border-black rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <p className="text-sm font-medium leading-relaxed">
                  Try habit stacking! Drink a glass of water immediately after
                  brushing your teeth. I can set a reminder for you if you'd
                  like.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t-2 border-black bg-white">
            <div className="flex gap-3">
              <Input
                placeholder="Ask your coach..."
                className="h-12 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#E2E8F0] focus-visible:ring-0 focus-visible:border-[#A855F7] focus-visible:shadow-[2px_2px_0px_0px_#A855F7] transition-all font-medium"
              />
              <Button
                size="icon"
                className="h-12 w-12 bg-[#121212] hover:bg-black/90 text-white rounded-xl border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_#A855F7] transition-all"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-3 flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#A855F7]" />
                Powered by AI (Coming Soon)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
