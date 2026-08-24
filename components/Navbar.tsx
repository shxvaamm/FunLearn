"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  type SupportedLanguage,
  type StudentProfile,
  getLocalStudentProfile,
  DEFAULT_USER_ID,
} from "@/lib/offlineStore";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/offlineStore";
import type { NavTab } from "./MobileBottomNav";
import {
  Flame,
  Zap,
  GraduationCap,
  Moon,
  Sun,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Download,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Globe,
  Award,
} from "lucide-react";

interface NavbarProps {
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = "home",
  onSelectTab,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { signOut, user: authUser, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const liveProfile = useLiveQuery(
    () => db.profiles.get(DEFAULT_USER_ID),
    [],
    null
  );

  useEffect(() => {
    getLocalStudentProfile(DEFAULT_USER_ID).then((p) => {
      if (p) setProfile(p);
    });

    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("funlearn_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (typeof window !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("funlearn_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("funlearn_theme", "light");
      }
    }
  };

  const currentProfile = liveProfile || profile;
  const displayName = authProfile?.studentName || currentProfile?.studentName || "Aarav Patel";
  const displayClass = authProfile?.classLevel || currentProfile?.classLevel || 7;
  const displayXp = authProfile?.totalXp || currentProfile?.totalXp || 380;
  const displayStreak = authProfile?.streakDays || currentProfile?.streakDays || 4;
  const displayLevel = currentProfile?.levelTitle || "खोजी शिक्षार्थी (Curious Seeker)";

  // Compute initials for avatar
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 sm:py-3 shadow-xs"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Desktop Direct Navigation Links */}
        <div className="flex items-center gap-3 md:gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onSelectTab?.("home")}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white">
                FunLearn
              </span>
            </div>
          </motion.button>

          {/* Desktop Navigation Links (>= 768px) */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "home" as NavTab, label: t("navHome", "Dashboard"), icon: LayoutDashboard },
              { id: "lessons" as NavTab, label: t("navLessons", "Lessons"), icon: BookOpen },
              { id: "glossary" as NavTab, label: "Glossary", icon: Sparkles },
              { id: "downloads" as NavTab, label: "Downloads", icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onSelectTab?.(tab.id)}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-tab"
                      className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-md -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              href="/teacher"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Teacher Dashboard</span>
            </motion.a>
          </nav>
        </div>

        {/* Right: Actions (Streak, XP, Language Switcher, Theme, Profile Avatar Dropdown) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Streak Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-800 dark:text-zinc-200 text-xs font-bold shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>{displayStreak}d</span>
          </motion.div>

          {/* XP Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md text-xs font-extrabold shadow-xs min-h-[36px] sm:min-h-auto"
          >
            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>{displayXp} XP</span>
          </motion.div>

          {/* Language Switcher */}
          <div className="hidden md:flex relative items-center bg-white dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-700">
            <select
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                English (EN)
              </option>
              <option value="hi" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                हिन्दी (Hindi)
              </option>
              <option value="or" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                ଓଡ଼ିଆ (Odia)
              </option>
            </select>
          </div>

          {/* Theme Switcher */}
          <motion.button
            whileTap={{ scale: 0.88, rotate: 20 }}
            whileHover={{ scale: 1.06 }}
            type="button"
            onClick={toggleDarkMode}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </motion.button>

          {/* Persistent Top-Right Profile Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-900 dark:hover:border-white transition-all cursor-pointer shadow-xs focus:outline-none"
              title="User Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-black tracking-tight">
                {initials || "ST"}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 mr-1 hidden sm:block" />
            </motion.button>

            {/* Dropdown Menu Modal */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 space-y-4 z-50 text-left"
                >
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-11 h-11 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm font-black shadow-xs shrink-0">
                      {initials || "ST"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate">
                          {displayName}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                          Class {displayClass}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {displayLevel}
                      </p>
                    </div>
                  </div>

                  {/* Student Statistics Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Total XP
                      </div>
                      <div className="text-base font-black font-mono text-zinc-900 dark:text-white flex items-center gap-1 mt-0.5">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        {displayXp}
                      </div>
                    </div>

                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Daily Streak
                      </div>
                      <div className="text-base font-black font-mono text-zinc-900 dark:text-white flex items-center gap-1 mt-0.5">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {displayStreak} Days
                      </div>
                    </div>
                  </div>

                  {/* Language Selection Quick Switcher */}
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Language
                      </span>
                      <span className="text-zinc-900 dark:text-white font-mono">
                        {language === "hi" ? "हिन्दी" : language === "or" ? "ଓଡ଼ିଆ" : "English"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {(["en", "hi", "or"] as SupportedLanguage[]).map((lng) => (
                        <button
                          key={lng}
                          type="button"
                          onClick={() => setLanguage(lng)}
                          className={`py-1 text-[11px] font-bold rounded border transition-colors ${
                            language === lng
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                              : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          {lng === "en" ? "EN" : lng === "hi" ? "हिन्दी" : "ଓଡ଼ିଆ"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portal Navigation Shortcuts */}
                  <div className="space-y-1 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                    <Link
                      href="/teacher"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Teacher Dashboard</span>
                      </span>
                      <span className="text-[10px] text-zinc-400">Class Data</span>
                    </Link>

                    <Link
                      href="/login/student"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Switch Account</span>
                      </span>
                      <span className="text-[10px] text-zinc-400">Login</span>
                    </Link>
                  </div>

                  {/* Log Out Button */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-2.5 px-3 bg-zinc-100 hover:bg-red-50 dark:bg-zinc-800 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out &amp; Clear Local Session</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
