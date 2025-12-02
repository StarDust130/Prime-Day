"use client";

import React, { useState, useEffect, useRef } from "react";
import { Home, ListTodo, Plus, Goal, Telescope, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNav() {
  const [pathname, setPathname] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await fetch("/api/friends/request");
        if (res.ok) {
          const data = await res.json();
          if (data.incoming) {
            setPendingCount(data.incoming.length);
          }
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    if (!["/", "/auth", "/onboarding"].includes(window.location.pathname)) {
      fetchPendingRequests();
    }
  }, [pathname]);

  useEffect(() => {
    setPathname(window.location.pathname);

    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Smoother scroll detection
      if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    window.location.assign(path);
  };

  const navItems = [
    { label: "Home", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    {
      label: "Habits",
      path: "/habits",
      icon: <ListTodo className="w-5 h-5" />,
    },
    {
      label: "Friends",
      path: "/friends",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "More",
      path: "/more",
      icon: <Telescope className="w-5 h-5" />,
    },
  ];

  const createAction = {
    label: "Create",
    path: "/create",
    icon: <Plus className="w-7 h-7" />,
  };

  if (["/", "/auth", "/onboarding"].includes(pathname)) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }} // Smoother entry
          className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center px-6 pointer-events-none"
        >
          <div className="flex items-center gap-4 w-full max-w-lg">
            {/* --- MAIN NAVIGATION BAR --- */}
            <div className="pointer-events-auto flex-1 bg-white border-2 border-black rounded-2xl h-16 px-6 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {navItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className="relative flex flex-col items-center justify-center w-12 h-12 rounded-xl group"
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Active Background Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-bg"
                        className="absolute inset-0 bg-[#121212] rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-black"
                      }`}
                    >
                      {React.cloneElement(item.icon as React.ReactElement<any>, {
                        strokeWidth: isActive ? 2.5 : 2,
                      })}

                      {/* Notification Badge */}
                      {item.label === "Friends" && pendingCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* --- CREATE ACTION (RIGHT SIDE) --- */}
            <div className="pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(createAction.path)}
                className="w-16 h-16 bg-[#38BDF8] border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black transition-colors hover:bg-[#7dd3fc]"
              >
                <span className="drop-shadow-sm">{createAction.icon}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
