"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Calendar,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<{
    username: string;
    birthday: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const res = await fetch("/api/account");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setNewUsername(data.user.username);
      } else {
        console.error("Failed to fetch account");
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setMessage({ type: "success", text: "Username updated successfully!" });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update username",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:p-8 pt-6 px-4 font-sans text-[#121212] overflow-hidden relative">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#A855F7]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#F4B400]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <header className="mb-8 text-center md:text-left flex items-center gap-4">
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
              Account Settings
            </h1>
            <p className="text-sm font-bold text-gray-400 font-mono tracking-widest mt-1">
              MANAGE YOUR IDENTITY
            </p>
          </div>
        </header>

        <div className="space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-2xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#38BDF8]">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="h-24 w-24 rounded-full bg-[#38BDF8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#121212]">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {user?.username}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm font-bold text-gray-500">
                  <Sparkles className="h-4 w-4 text-[#F4B400]" />
                  <span>Prime Member</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateUsername} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Username
                </label>
                <div className="relative">
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="h-12 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#E2E8F0] focus-visible:ring-0 focus-visible:border-[#38BDF8] focus-visible:shadow-[2px_2px_0px_0px_#38BDF8] transition-all font-bold text-lg"
                    placeholder="Enter new username"
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  This is your unique identity on Prime Day.
                </p>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 border-black text-sm font-bold ${
                    message.type === "success"
                      ? "bg-[#DCFCE7] text-[#166534] shadow-[2px_2px_0px_0px_#166534]"
                      : "bg-[#FEE2E2] text-[#991B1B] shadow-[2px_2px_0px_0px_#991B1B]"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={saving || newUsername === user?.username}
                className="w-full h-12 bg-[#121212] hover:bg-black/90 text-white rounded-xl border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_#F4B400] transition-all font-bold uppercase tracking-wider text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* BIRTHDAY CARD */}
          <div className="bg-[#F1F5F9] rounded-2xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#94A3B8] opacity-80">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Birthday
              </label>
              <div className="p-4 border-2 border-black/20 bg-white/50 rounded-xl font-mono font-bold text-lg text-gray-600">
                {user?.birthday
                  ? new Date(user.birthday).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })
                  : "Not set"}
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Your birthday is used for account recovery and cannot be
                changed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
