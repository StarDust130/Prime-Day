"use client";

import { useEffect } from "react";
import InstallPrompt from "./InstallPrompt";

const PWAClient = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = async () => {
      try {
        const existingRegistration =
          await navigator.serviceWorker.getRegistration("/");
        if (existingRegistration) {
          return;
        }

        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Service worker registration failed", error);
        }
      }
    };

    register();
  }, []);

  return <InstallPrompt />;
};

export default PWAClient;
