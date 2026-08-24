"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import { ElectricityLab } from "../simulations/ElectricityLab";
import { WaterQualityLab } from "../simulations/WaterQualityLab";
import { playClickSound, playLevelUpSound } from "@/lib/soundEffects";
import {
  Compass,
  CheckSquare,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Step3To5SimulationsProps {
  bundle: LessonBundle;
  step?: 3 | 4 | 5;
  stepNumber?: 3 | 4 | 5;
  onBack: () => void;
  onContinue: () => void;
  onTaskCompleted?: (stepNumber: 3 | 4 | 5) => void;
}

export const Step3To5Simulations: React.FC<Step3To5SimulationsProps> = ({
  bundle,
  step,
  stepNumber: propStepNumber,
  onBack,
  onContinue,
  onTaskCompleted,
}) => {
  const currentStepNum = (step || propStepNumber || 3) as 3 | 4 | 5;
  const { language } = useLanguage();
  const [taskCompletedState, setTaskCompletedState] = useState(false);

  const stepMeta = {
    3: {
      title: "Step 3: Explore (Sandbox Mode)",
      sub: "Freely test and observe without constraints.",
      icon: Compass,
      mode: "explore" as const,
    },
    4: {
      title: "Step 4: Practice (Guided Challenge)",
      sub: "Follow guided prompts to achieve specific target outcomes.",
      icon: CheckSquare,
      mode: "practice" as const,
    },
    5: {
      title: "Step 5: Experiment (Hypothesis Testing)",
      sub: "Adjust variables and measure system effects.",
      icon: FlaskConical,
      mode: "experiment" as const,
    },
  }[currentStepNum];

  const Icon = stepMeta.icon;

  const handleLabSuccess = () => {
    if (!taskCompletedState) {
      playLevelUpSound();
      setTaskCompletedState(true);
      if (onTaskCompleted) {
        onTaskCompleted(currentStepNum);
      }
    }
  };

  const renderActiveLab = () => {
    switch (bundle.slug) {
      case "water-quality-ph-indicator":
        return (
          <WaterQualityLab
            mode={stepMeta.mode}
            onTaskComplete={handleLabSuccess}
          />
        );
      case "electricity-circuit-builder":
      default:
        return (
          <ElectricityLab
            mode={stepMeta.mode}
            onTaskComplete={handleLabSuccess}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Simulation Header Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold"
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Interactive Lab • {bundle.subject}
            </div>
            <h1 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
              {stepMeta.title}
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{stepMeta.sub}</p>
          </div>
        </div>

        {taskCompletedState && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Task Mastered! (+25 XP)</span>
          </motion.div>
        )}
      </div>

      {/* Interactive Simulation Sandbox Canvas */}
      <div className="w-full">{renderActiveLab()}</div>

      {/* Navigation Actions */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(500);
            onBack();
          }}
          className="min-h-[44px] sm:min-h-[40px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(750);
            onContinue();
          }}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>
            {currentStepNum === 5 ? "Proceed to Real-World Mission" : "Next Step"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
