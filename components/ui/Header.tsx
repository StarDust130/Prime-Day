"use client";

import React, { useState, useEffect, useRef } from "react";
import { LogOut, User, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    // New state for scroll behavior
    const [hideHeader, setHideHeader] = useState(false);
    const lastScrollY = useRef(0);

    // Check login status on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("primeDayUsername");
        const userId = localStorage.getItem("primeDayUserId");

        if (userId) {
            setUsername(storedUser || "User");
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    // Handle Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // If scrolling down AND past 50px (to avoid jitter at top), hide header
            // If scrolling up, show header
            if (currentScrollY > 50 && currentScrollY > lastScrollY.current) {
                setHideHeader(true);
            } else {
                setHideHeader(false);
            }
            
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (res.ok) {
                localStorage.removeItem("primeDayUserId");
                localStorage.removeItem("primeDayHasOnboarded");
                localStorage.removeItem("primeDayUsername");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navigateTo = (path: string) => {
        window.location.href = path;
    };

    if (!isVisible) return null;

    return (
        <>
            {/* --- HEADER BAR --- */}
            <motion.header 
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hideHeader ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-primary border-b-[3px] border-black h-16 md:h-20 px-4 md:px-6 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)] w-full fixed top-0 left-0 z-40"
            >
                {/* LEFT: Logo Composition */}
                <button
                    className="group flex items-center gap-2 md:gap-3 cursor-pointer bg-transparent border-none p-0"
                    onClick={() => navigateTo("/dashboard")}
                >
                    {/* Bauhaus Icon Composition */}
                    <div className="relative w-8 h-8 md:w-10 md:h-10">
                        <div className="absolute inset-0 bg-[#38BDF8] border-2 border-black rounded-sm transform rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[2px_2px_0px_0px_#000]" />
                        <div className="absolute inset-0 bg-[#F4B400] border-2 border-black rounded-full transform -rotate-6 scale-75 group-hover:rotate-0 transition-transform duration-300" />
                        <Zap className="absolute inset-0 m-auto w-4 h-4 md:w-5 md:h-5 text-black z-10" />
                    </div>

                    <div className="flex flex-col items-start leading-none">
                        <span className="font-black italic tracking-tighter text-lg md:text-2xl text-[#121212] uppercase relative">
                            Prime Day
                            <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#E94235] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </span>
                        <span className="font-mono text-[9px] md:text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                            Dashboard OS
                        </span>
                    </div>
                </button>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Logout Trigger */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all hover:bg-red-50 group rounded-md"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-[#E94235] transition-colors" />
                    </button>

                    {/* Profile Icon */}
                    <button
                        onClick={() => navigateTo("/account")}
                        className="flex items-center gap-3 p-1 md:pr-4 bg-[#121212] border-2 border-black rounded-full shadow-[3px_3px_0px_0px_#38BDF8] md:shadow-[4px_4px_0px_0px_#38BDF8] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all hover:bg-[#2a2a2a] group"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F4B400] border-2 border-white flex items-center justify-center text-black">
                            <span className="font-black text-xs md:text-sm">
                                {username?.charAt(0).toUpperCase() || "U"}
                            </span>
                        </div>
                        <span className="font-bold text-white text-sm hidden md:block tracking-wide">
                            {username || "USER"}
                        </span>
                    </button>
                </div>
            </motion.header>

            {/* Spacer - Matches header height */}
            <div className="h-16 md:h-20" />

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop with Scanline Effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute inset-0 bg-[#38BDF8]/40 backdrop-blur-sm"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
                            className="relative bg-[#F4F4F0] border-[3px] border-black w-full max-w-[90%] md:max-w-sm p-0 shadow-[8px_8px_0px_0px_#000] md:shadow-[12px_12px_0px_0px_#000] overflow-hidden"
                        >
                            {/* Window Title Bar */}
                            <div className="bg-black text-white p-2 md:p-3 flex justify-between items-center border-b-[3px] border-black">
                                <span className="font-mono font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                    System Alert
                                </span>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="hover:text-[#E94235]"
                                >
                                    <X className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 text-center relative">
                                {/* Decorative Elements */}
                                <div className="absolute top-4 left-4 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#F4B400] border-2 border-black" />
                               

                                <h3 className="text-2xl md:text-3xl font-extrabold mb-2  uppercase  transform -skew-x-6 text-red-500">
                                    Confirm Logout?
                                </h3>
                                <p className="text-gray-600 font-bold text-sm md:text-base mb-6 md:mb-8 border-b-2 border-black inline-block pb-1">
                                    Your progress is saved.
                                </p>

                                <div className="flex gap-3 md:gap-4">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 py-3 md:py-4 font-black text-sm md:text-base uppercase tracking-wider border-[3px] text-gray-500 border-black bg-white hover:bg-gray-100 shadow-[3px_3px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all"
                                    >
                                        Stay
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 py-3 md:py-4 font-black text-sm md:text-base uppercase tracking-wider border-[3px] border-black bg-[#E94235] text-white hover:bg-red-600 shadow-[3px_3px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all"
                                    >
                                        Logout Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
