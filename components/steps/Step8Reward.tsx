"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import { RewardModal } from "../RewardModal";
import { downloadLessonGuideToDevice } from "@/lib/downloadHelper";
import { playClickSound, playLevelUpSound } from "@/lib/soundEffects";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Download,
} from "lucide-react";

interface Step8RewardProps {
  bundle: LessonBundle;
  score?: number;
  scorePercent?: number;
  onRestartChapter: () => void;
  onSelectNextChapter?: () => void;
  onGoToNextChapter?: () => void;
}

export const Step8Reward: React.FC<Step8RewardProps> = ({
  bundle,
  score: propScore,
  scorePercent,
  onRestartChapter,
  onSelectNextChapter,
  onGoToNextChapter,
}) => {
  const { language } = useLanguage();
  const [showRewardModal, setShowRewardModal] = useState(false);

  const effectiveScore = propScore !== undefined ? propScore : (scorePercent ? Math.round((scorePercent / 100) * 4) : 4);
  const earnedXp = bundle.xpReward + effectiveScore * 10;
  const isPerfect = effectiveScore >= 4;

  const handleOpenRewardModal = () => {
    playLevelUpSound();
    setShowRewardModal(true);
  };

  const handleNext = () => {
    if (onSelectNextChapter) onSelectNextChapter();
    else if (onGoToNextChapter) onGoToNextChapter();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto text-center space-y-6"
    >
      {/* Trophy & Badge Presentation */}
      <div className="space-y-3">
        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chapter Completed</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
          Outstanding Achievement!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          You have mastered <strong>{bundle.title_en}</strong> through hands-on simulations, real-world village missions, and assessment.
        </p>
      </div>

      {/* Stats Summary Grid (XP, Score, Streak) */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          whileHover={{ y: -3 }}
          className="p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-1"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            XP Earned
          </div>
          <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-zinc-900 dark:text-white fill-current" />
            +{earnedXp}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-1"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Quiz Score
          </div>
          <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
            {effectiveScore}/4
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-1"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Daily Streak
          </div>
          <div className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-zinc-900 dark:text-white fill-current" />
            Active
          </div>
        </motion.div>
      </div>

      {/* Badge Unlocked Notification Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-4 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Badge Unlocked
            </div>
            <div className="text-xs sm:text-sm font-bold">
              {isPerfect ? "STEM Master • 100% Accuracy" : "Circuit Explorer • Level 1"}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleOpenRewardModal}
          className="px-3 py-1.5 bg-white text-zinc-900 rounded-md text-xs font-bold hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          View Badge
        </motion.button>
      </motion.div>

      {/* Offline sync note */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
        <span>Saved to local IndexedDB. Will auto-sync whenever internet connects.</span>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(500);
            onRestartChapter();
          }}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Chapter</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => downloadLessonGuideToDevice(bundle, language)}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save Certificate / Notes</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(800);
            handleNext();
          }}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <span>Choose Next Chapter</span>
        </motion.button>
      </div>

      {/* Badge Modal */}
      <RewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeTitle={isPerfect ? "STEM Master" : "Circuit Explorer"}
        badgeDescription={`Mastered ${bundle.title_en} with distinction.`}
        xpEarned={earnedXp}
      />
    </motion.div>
  );
};
