"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms?: string[];
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt: () => Promise<void>;
  }
}

const PROMPT_KEY = "prime-day-pwa-prompted-v2";
const INSTALLED_KEY = "prime-day-pwa-installed";
const FORCE_PROMPT_ALL =
  process.env.NEXT_PUBLIC_INSTALL_PROMPT_ALL?.toLowerCase() === "true";

const isStandaloneMode = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error - standalone is iOS only
    window.navigator.standalone === true
  );
};

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const alreadySeen = localStorage.getItem(PROMPT_KEY) === "1";
    const alreadyInstalled = localStorage.getItem(INSTALLED_KEY) === "1";

    if (
      (alreadySeen && !FORCE_PROMPT_ALL) ||
      alreadyInstalled ||
      isStandaloneMode()
    ) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (localStorage.getItem(PROMPT_KEY) === "1" && !FORCE_PROMPT_ALL) {
        return;
      }

      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
      if (!FORCE_PROMPT_ALL) {
        localStorage.setItem(PROMPT_KEY, "1");
      }
    };

    const handleAppInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      setDeferredPrompt(null);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "1");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Install prompt failed", error);
      }
    } finally {
      setVisible(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setDeferredPrompt(null);
    if (typeof window !== "undefined" && !FORCE_PROMPT_ALL) {
      localStorage.setItem(PROMPT_KEY, "1");
    }
  }, []);

  if (!visible || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-5 flex justify-center px-4 pointer-events-none z-50">
      <div className="relative w-full max-w-md pointer-events-auto overflow-hidden rounded-[28px] border-2 border-black bg-white text-[#0f172a] shadow-[8px_8px_0px_#111827]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#ffe5f5] via-[#fff9d6] to-[#e0f2ff] opacity-80"
          aria-hidden
        />
        <div
          className="absolute -top-10 right-0 w-40 h-40 pointer-events-none"
          aria-hidden
        >
          <Image
            src="/anime-girl-10.png"
            alt="Prime Day anime mascot"
            fill
            sizes="160px"
            className="object-contain drop-shadow-[0px_8px_16px_rgba(0,0,0,0.2)]"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
              <Image
                src="/icon.png"
                alt="Prime Day icon"
                width={44}
                height={44}
                className="rounded-xl"
                priority
              />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                Dashboard exclusive
              </p>
              <p className="text-xl font-black tracking-tight">
                Install Prime Day
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-[#334155] leading-relaxed">
            Launch the app instantly, track offline progress, and get hype from
            our anime coach wherever you go.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 rounded-2xl border-2 border-black bg-[#ff61d8] py-3 text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_#000] transition-transform active:translate-y-0.5"
              onClick={handleInstall}
            >
              Install now
            </button>
            <button
              className="flex-1 rounded-2xl border-2 border-black bg-white py-3 text-sm font-black uppercase tracking-widest text-[#0f172a] shadow-[4px_4px_0px_#000] transition-transform active:translate-y-0.5"
              onClick={handleClose}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
