"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function CoachPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello! I'm your Prime Day coach. I'm here to help you crush your goals. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.response },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

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
          <div
            ref={scrollRef}
            className="flex-1 p-4 space-y-6 overflow-y-auto bg-[#F8FAFC] scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl border-2 border-black flex items-center justify-center flex-none shadow-[2px_2px_0px_0px_#000] transition-transform hover:scale-105 ${
                    msg.role === "ai" ? "bg-[#A855F7]" : "bg-[#121212]"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="h-6 w-6 text-white" />
                  ) : (
                    <span className="font-black text-white text-xs">ME</span>
                  )}
                </div>
                <div
                  className={`p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative group transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] ${
                    msg.role === "ai"
                      ? "bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-gray-800"
                      : "bg-[#121212] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 max-w-[85%] animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-[#A855F7] border-2 border-black flex items-center justify-center flex-none shadow-[2px_2px_0px_0px_#000]">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="p-4 bg-white border-2 border-black rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex items-center gap-2">
                  <span
                    className="w-2 h-2 bg-[#A855F7] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-[#A855F7] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-[#A855F7] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t-2 border-black bg-white">
            <div className="flex gap-3 items-end">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask your coach..."
                  className="h-14 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#E2E8F0] focus-visible:ring-0 focus-visible:border-[#A855F7] focus-visible:shadow-[4px_4px_0px_0px_#A855F7] transition-all font-medium pl-4 pr-4 text-base"
                />
              </div>
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-14 w-14 bg-[#121212] hover:bg-black/90 text-white rounded-xl border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_#A855F7] active:translate-y-[2px] active:shadow-none transition-all flex-none"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-3 flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3 text-[#A855F7]" />
                Powered by Groq AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
