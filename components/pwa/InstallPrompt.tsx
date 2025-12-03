"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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

const INSTALLED_KEY = "prime-day-pwa-installed";
const FORCE_PROMPT_ALL =
  process.env.NEXT_PUBLIC_INSTALL_PROMPT_ALL?.toLowerCase() === "true";

const isStandaloneMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS only property
    window.navigator.standalone === true
  );
};

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const bypassPromptRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    bypassPromptRef.current = FORCE_PROMPT_ALL || isLocal;

    const alreadyInstalled = localStorage.getItem(INSTALLED_KEY) === "1";
    if (alreadyInstalled || isStandaloneMode()) {
      return;
    }

    if (bypassPromptRef.current) {
      setVisible(true);
      setPreviewMode(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setPreviewMode(false);
      setVisible(true);
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
    setPreviewMode(false);
  }, []);

  if (!visible || (!deferredPrompt && !previewMode)) {
    return null;
  }

  const installReady = Boolean(deferredPrompt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      <div className="relative w-full max-w-sm pointer-events-auto rounded-3xl border-2 border-black bg-white text-[#0f172a] shadow-[10px_10px_0px_#111827]">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />
        <div className="relative z-10 flex flex-col gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000]">
              <Image
                src="/icon.png"
                alt="Prime Day icon"
                width={40}
                height={40}
                className="rounded-xl"
                priority
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-black">
                Prime Day
              </p>
              <p className="text-xl font-black tracking-tight">
                Install the Prime Day app
              </p>
            </div>
          </div>

          <p className="text-xs font-semibold text-black leading-relaxed">
            Launch faster, stay logged in, and get a more app-like experience by
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className={`flex-1 rounded-2xl border-2 border-black bg-sky-500 py-2.5 text-xs font-black uppercase tracking-[0.35em] text-white shadow-[3px_3px_0px_#000] transition-transform active:translate-y-0.5 ${
                installReady ? "" : "cursor-not-allowed opacity-60"
              }`}
              onClick={installReady ? handleInstall : undefined}
              disabled={!installReady}
            >
              {installReady ? "Install app" : "Use browser menu"}
            </button>
            <button
              className="flex-1 rounded-2xl border-2 border-black bg-white py-2.5 text-xs font-black uppercase tracking-[0.35em] text-[#0f172a] shadow-[3px_3px_0px_#000] transition-transform active:translate-y-0.5"
              onClick={handleClose}
            >
              Not now
            </button>
          </div>

          {previewMode && !installReady && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black text-center">
              Local preview • use “Add to Home Screen”
            </p>
          )}
        </div>

        <Image
          src="/anime-girl-10.png"
          alt="Prime Day anime mascot"
          width={140}
          height={140}
          className="absolute -top-4 -right-3 w-24 drop-shadow-[0px_8px_16px_rgba(0,0,0,0.25)]"
          priority
        />
      </div>
    </div>
  );
};

export default InstallPrompt;
