"use client";

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
    <div className="fixed bottom-5 inset-x-0 flex justify-center md:hidden px-4 pointer-events-none z-50">
      <div className="w-full max-w-sm pointer-events-auto bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_#000] p-4 text-[#121212]">
        <p className="font-black uppercase tracking-tight text-base mb-3">
          Install this app for faster access
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-[#fffb14] border-2 border-black rounded-2xl py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0px_#000] active:translate-y-0.5"
            onClick={handleInstall}
          >
            Install
          </button>
          <button
            className="flex-1 bg-white border-2 border-black rounded-2xl py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0px_#000] active:translate-y-0.5"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
