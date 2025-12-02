"use client";

import React, { useState, useEffect, useRef } from "react";
import { Home, ListTodo, Plus, Target, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNav() {
  const [pathname, setPathname] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Update active state on mount and when url changes if possible in this env
    setPathname(window.location.pathname);

    // Optional: Add a listener for popstate if using standard navigation
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // --- SCROLL DETECTION LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide on scroll down (threshold 50px), Show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
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
    window.location.href = path;
  };

  const navItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      color: "bg-[#38BDF8]",
    }, // Sky Blue
    {
      label: "Habits",
      path: "/habits",
      icon: <ListTodo className="w-5 h-5" />,
      color: "bg-[#F4B400]",
    }, // Yellow
    {
      label: "Create",
      path: "/create",
      icon: <Plus className="w-7 h-7" />,
      isMain: true,
      color: "bg-[#121212]",
    }, // Black
    {
      label: "Goals",
      path: "/goals",
      icon: <Target className="w-5 h-5" />,
      color: "bg-[#E94235]",
    }, // Red
    {
      label: "Profile",
      path: "/account",
      icon: <User className="w-5 h-5" />,
      color: "bg-[#8B5CF6]",
    }, // Purple
  ];

  // Hide nav on specific paths
  if (["/", "/auth", "/onboarding"].includes(pathname)) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          {/* --- THE DOCK CONTAINER --- */}
          <div className="pointer-events-auto bg-white border-2 border-black rounded-2xl p-2 flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              if (item.isMain) {
                // --- CENTER "CREATE" BUTTON ---
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNavigation(item.path)}
                    className="mx-1 w-14 h-14 bg-[#121212] text-white rounded-xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#38BDF8] relative -top-6 hover:-top-7 transition-all"
                  >
                    <span className="relative z-10">{item.icon}</span>
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    relative w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "text-black"
                        : "text-gray-400 hover:text-black hover:bg-gray-50"
                    }
                  `}
                >
                  {/* Active Background Pill Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className={`absolute inset-0 rounded-xl border-2 border-black ${item.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span className="relative z-10">
                    {React.cloneElement(item.icon as React.ReactElement, {
                      className: `w-5 h-5 transition-transform duration-200 ${
                        isActive ? "scale-110 stroke-[3px]" : "scale-100"
                      }`,
                    })}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
