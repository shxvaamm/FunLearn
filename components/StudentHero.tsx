"use client";

import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getLevelTitle,
  updateLocalStudentProfile,
  DEFAULT_USER_ID,
} from "@/lib/offlineStore";
import { db } from "@/lib/offlineStore";
import { useLiveQuery } from "dexie-react-hooks";
import { VocabTooltip } from "./VocabTooltip";
import {
  Trophy,
  Flame,
  Award,
  School,
  Layers,
} from "lucide-react";

export const StudentHero: React.FC = () => {
  const { language, t } = useLanguage();

  const profile = useLiveQuery(
    () => db.profiles.get(DEFAULT_USER_ID),
    [],
    null
  );

  const totalXp = profile?.totalXp || 380;
  const levelTitle = getLevelTitle(totalXp, language);

  const nextMilestone =
    totalXp < 150
      ? 150
      : totalXp < 400
      ? 400
      : totalXp < 800
      ? 800
      : totalXp < 1500
      ? 1500
      : totalXp < 3000
      ? 3000
      : 5000;

  const prevMilestone =
    totalXp < 150
      ? 0
      : totalXp < 400
      ? 150
      : totalXp < 800
      ? 400
      : totalXp < 1500
      ? 800
      : totalXp < 3000
      ? 1500
      : 3000;

  const progressPercent = Math.min(
    100,
    Math.round(((totalXp - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
  );

  const handleClassChange = (newClass: number) => {
    updateLocalStudentProfile({
      userId: DEFAULT_USER_ID,
      classLevel: newClass,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-center">
        {/* Left Column: Student Details & Class Selector */}
        <div className="md:col-span-7 space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide cursor-default"
            >
              <Trophy className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              {levelTitle}
            </motion.span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium truncate max-w-full">
              <School className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{profile?.villageSchoolName || "Govt. Upper Primary School, Pipili"}</span>
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
              <span>{profile?.studentName || "Aarav Patel"}</span>
              <motion.span
                layout
                className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-md"
              >
                {t("classLabel")} {profile?.classLevel || 7}
              </motion.span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Offline-ready rural STEM curriculum with zero connectivity dependencies.
            </p>
          </div>

          {/* Touch-Friendly Horizontal Scroll Class Switcher */}
          <div className="space-y-1.5 pt-0.5">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Select Class:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 touch-pan-x scrollbar-none">
              {[6, 7, 8, 9, 10].map((c) => {
                const isSelected = (profile?.classLevel || 7) === c;
                return (
                  <motion.button
                    key={c}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => handleClassChange(c)}
                    className={`min-h-[44px] min-w-[56px] sm:min-h-[36px] px-3 py-1.5 rounded-lg sm:rounded-md text-xs font-bold border transition-colors shrink-0 flex items-center justify-center cursor-pointer relative ${
                      isSelected
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                        : "bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    Class {c}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Trilingual Spotlight Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs flex flex-wrap items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
          >
            <span className="font-bold text-zinc-900 dark:text-white uppercase text-[10px] tracking-wider">
              Spotlight:
            </span>
            <span>Learn how</span>
            <VocabTooltip wordKey="photosynthesis" />
            <span>harnesses</span>
            <VocabTooltip wordKey="solar_energy" />
            <span>and releases</span>
            <VocabTooltip wordKey="oxygen" />!
          </motion.div>
        </div>

        {/* Right Column: Gamification Stats Box */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="md:col-span-5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-700/80 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs cursor-default"
              >
                <Award className="w-4 h-4" />
              </motion.div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                  {t("xpLabel")}
                </div>
                <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  {totalXp} XP
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                  {t("streakLabel")}
                </div>
                <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center justify-end gap-1">
                  <Flame className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>{profile?.streakDays || 4} Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Gray Progress Bar with spring animation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span>Milestone Progress</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {totalXp} / {nextMilestone} XP ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-zinc-900 dark:bg-white rounded-full"
              />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-right">
              {nextMilestone - totalXp} XP to next level
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

