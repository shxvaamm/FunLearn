"use client";

import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/offlineStore";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Download,
} from "lucide-react";

export type NavTab = "home" | "lessons" | "glossary" | "downloads";

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { t } = useLanguage();
  const cachedCount = useLiveQuery(
    async () => {
      const all = await db.lessonBundles.toArray();
      return all.filter((b) => Boolean(b.isCachedLocally)).length;
    },
    [],
    0
  );

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    action: () => void;
  }> = [
    {
      id: "home",
      label: t("navHome", "Home"),
      icon: LayoutDashboard,
      action: () => onSelectTab("home"),
    },
    {
      id: "lessons",
      label: t("navLessons", "Lessons"),
      icon: BookOpen,
      action: () => onSelectTab("lessons"),
    },
    {
      id: "glossary",
      label: "Glossary",
      icon: Sparkles,
      action: () => onSelectTab("glossary"),
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: Download,
      badge: (cachedCount ?? 0) > 0 ? (cachedCount ?? 0) : undefined,
      action: () => onSelectTab("downloads"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 py-1.5 px-3 flex justify-around items-center shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={item.action}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-lg transition-colors relative cursor-pointer ${
              isActive
                ? "text-zinc-900 dark:text-white font-bold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "stroke-[2.5]" : "stroke-[1.8]"
                }`}
              />
              {item.badge !== undefined && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black rounded-full flex items-center justify-center border border-white dark:border-zinc-900"
                >
                  {item.badge}
                </motion.span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {item.label}
            </span>
            {isActive && (
              <motion.span
                layoutId="mobile-nav-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-1 h-1 bg-zinc-900 dark:bg-white rounded-full mt-0.5"
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};

