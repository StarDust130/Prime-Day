"use client";

import Link from "next/link";
import {
  Users,
  User,
  Activity,
  Bot,
  ArrowRight,
  ArrowLeft,
  Goal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Goals",
    description: "Set & Track Targets",
    icon: Goal,
    href: "/goals",
    color: "bg-[#F472B6]", // Pink
    shadow: "shadow-[4px_4px_0px_0px_#DB2777]",
  },
  {
    title: "Friends",
    description: "Connect & Compete",
    icon: Users,
    href: "/friends",
    color: "bg-[#38BDF8]", // Sky Blue
    shadow: "shadow-[4px_4px_0px_0px_#0EA5E9]",
  },
  {
    title: "AI Coach",
    description: "Get Expert Advice",
    icon: Bot,
    href: "/coach",
    color: "bg-[#A855F7]", // Purple
    shadow: "shadow-[4px_4px_0px_0px_#9333EA]",
  },
  {
    title: "Statistics",
    description: "View Your Progress",
    icon: Activity,
    href: "/stats",
    color: "bg-[#22C55E]", // Green
    shadow: "shadow-[4px_4px_0px_0px_#16A34A]",
  },
  {
    title: "Account",
    description: "Manage Profile",
    icon: User,
    href: "/account",
    color: "bg-[#F4B400]", // Yellow
    shadow: "shadow-[4px_4px_0px_0px_#EAB308]",
  },
];

export default function MorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#F4B400]/5 rounded-full blur-[80px]" />
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
              More Options
            </h1>
            <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
              EXPLORE EVERYTHING ELSE
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <div
                className={`h-full bg-white p-6 rounded-2xl border-2 border-black ${item.shadow} group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-none transition-all duration-200 relative overflow-hidden`}
              >
                <div
                  className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}
                >
                  <item.icon className="w-24 h-24 text-black" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-4 ${item.color} shadow-[2px_2px_0px_0px_#121212]`}
                  >
                    <item.icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
