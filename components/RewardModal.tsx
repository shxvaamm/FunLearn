"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Sparkles, Zap, Check, X, Trophy, ShieldCheck } from "lucide-react";
import { playUnlockSound, playClickSound } from "@/lib/soundEffects";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeTitle: string;
  badgeDescription: string;
  xpEarned: number;
  newLevelTitle?: string;
  badgeIconType?: "award" | "trophy" | "shield" | "zap";
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  badgeTitle,
  badgeDescription,
  xpEarned,
  newLevelTitle,
  badgeIconType = "award",
}) => {
  useEffect(() => {
    if (isOpen) {
      playUnlockSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl text-center space-y-5 overflow-hidden"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Lightweight SVG Particle Confetti Burst */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              {[...Array(16)].map((_, i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x2 = 200 + Math.cos(rad) * 160;
                const y2 = 180 + Math.sin(rad) * 160;
                return (
                  <motion.circle
                    key={i}
                    cx="200"
                    cy="180"
                    r={i % 2 === 0 ? "4" : "6"}
                    className={i % 3 === 0 ? "fill-zinc-900 dark:fill-white" : i % 3 === 1 ? "fill-zinc-400" : "fill-zinc-600"}
                    initial={{ cx: 200, cy: 180, opacity: 1, scale: 0 }}
                    animate={{
                      cx: [200, x2],
                      cy: [180, y2],
                      opacity: [1, 1, 0],
                      scale: [0, 1.2, 0.5],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Badge Icon Reveal */}
          <div className="relative inline-block my-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-full border-2 border-dashed border-zinc-400 dark:border-zinc-600 opacity-60"
            />
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-xl mx-auto border-4 border-zinc-200 dark:border-zinc-700"
            >
              {badgeIconType === "trophy" ? (
                <Trophy className="w-12 h-12" />
              ) : badgeIconType === "shield" ? (
                <ShieldCheck className="w-12 h-12" />
              ) : badgeIconType === "zap" ? (
                <Zap className="w-12 h-12 fill-current" />
              ) : (
                <Award className="w-12 h-12" />
              )}
            </motion.div>
          </div>

          {/* Modal Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[11px] font-bold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">
              <Sparkles className="w-3 h-3" />
              <span>Achievement Unlocked!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {badgeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto">
              {badgeDescription}
            </p>
          </div>

          {/* XP & Level Info Pill */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-around font-mono">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-500 font-sans">XP Rewarded</div>
              <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-zinc-900 dark:fill-white" />
                <span>+{xpEarned} XP</span>
              </div>
            </div>
            {newLevelTitle && (
              <div className="text-center border-l border-zinc-200 dark:border-zinc-700 pl-3">
                <div className="text-[10px] uppercase font-bold text-zinc-500 font-sans">New Rank</div>
                <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[140px]">
                  {newLevelTitle}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full min-h-[48px] py-3 px-6 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Claim &amp; Continue Learning</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
