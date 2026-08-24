"use client";

import React from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Compass,
  CheckSquare,
  FlaskConical,
  Target,
  FileCheck2,
  Trophy,
  Layers,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { playClickSound } from "@/lib/soundEffects";

export type LearningStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepMetadata {
  stepNumber: LearningStepId;
  label_en: string;
  label_hi: string;
  label_or: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const LEARNING_STEPS: StepMetadata[] = [
  {
    stepNumber: 1,
    label_en: "1. Select",
    label_hi: "1. विषय चुनें",
    label_or: "1. ବିଷୟ ବାଛନ୍ତୁ",
    icon: Layers,
    description: "Choose class and STEM chapter",
  },
  {
    stepNumber: 2,
    label_en: "2. Learn",
    label_hi: "2. सीखें",
    label_or: "2. ଶିଖନ୍ତୁ",
    icon: BookOpen,
    description: "Core conceptual explanation",
  },
  {
    stepNumber: 3,
    label_en: "3. Explore",
    label_hi: "3. खोजें",
    label_or: "3. ଅନୁସନ୍ଧାନ",
    icon: Compass,
    description: "Free sandbox virtual simulator",
  },
  {
    stepNumber: 4,
    label_en: "4. Practice",
    label_hi: "4. अभ्यास",
    label_or: "4. ଅଭ୍ୟାସ",
    icon: CheckSquare,
    description: "Guided simulation task with instant feedback",
  },
  {
    stepNumber: 5,
    label_en: "5. Experiment",
    label_hi: "5. प्रयोग",
    label_or: "5. ପରୀକ୍ଷଣ",
    icon: FlaskConical,
    description: "Adjust variables & test hypotheses",
  },
  {
    stepNumber: 6,
    label_en: "6. Mission",
    label_hi: "6. मिशन",
    label_or: "6. ମିଶନ",
    icon: Target,
    description: "Real-world village crisis challenge",
  },
  {
    stepNumber: 7,
    label_en: "7. Assess",
    label_hi: "7. मूल्यांकन",
    label_or: "7. ମୂଲ୍ୟାଙ୍କନ",
    icon: FileCheck2,
    description: "CBSE aligned 4-question competency quiz",
  },
  {
    stepNumber: 8,
    label_en: "8. Reward",
    label_hi: "8. पुरस्कार",
    label_or: "8. ପୁରସ୍କାର",
    icon: Trophy,
    description: "Earn XP, unlock badges & celebrate",
  },
];

interface LearningFlowBarProps {
  currentStep: LearningStepId;
  maxUnlockedStep: LearningStepId;
  onStepClick: (step: LearningStepId) => void;
  selectedChapterTitle?: string;
}

export const LearningFlowBar: React.FC<LearningFlowBarProps> = ({
  currentStep,
  maxUnlockedStep,
  onStepClick,
  selectedChapterTitle,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
      {/* Top Title & Progress status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
          <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            8-Step Pedagogical Workflow
          </span>
          {selectedChapterTitle && (
            <span className="text-xs text-zinc-500 truncate max-w-[200px] sm:max-w-xs font-medium">
              • {selectedChapterTitle}
            </span>
          )}
        </div>
        <div className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
          Step <span className="text-zinc-900 dark:text-white font-bold">{currentStep}</span> of 8
        </div>
      </div>

      {/* Mobile Horizontal Scrollable Pills */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 touch-pan-x scrollbar-none">
        {LEARNING_STEPS.map((step) => {
          const isCurrent = currentStep === step.stepNumber;
          const isUnlocked = step.stepNumber <= maxUnlockedStep;

          return (
            <motion.button
              key={step.stepNumber}
              whileTap={{ scale: 0.95 }}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                playClickSound(500 + step.stepNumber * 50);
                onStepClick(step.stepNumber);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCurrent
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                  : isUnlocked
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200"
                  : "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed"
              }`}
            >
              <span>{step.stepNumber}. {step.label_en.replace(/^\d+\.\s*/, "")}</span>
              {!isUnlocked && <Lock className="w-3 h-3 opacity-60" />}
            </motion.button>
          );
        })}
      </div>

      {/* Desktop Grid Layout (8 Pillars) */}
      <div className="hidden sm:grid grid-cols-4 lg:grid-cols-8 gap-2">
        {LEARNING_STEPS.map((step) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.stepNumber;
          const isPast = step.stepNumber < currentStep;
          const isUnlocked = step.stepNumber <= maxUnlockedStep;

          let cardStyle =
            "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed";

          if (isCurrent) {
            cardStyle =
              "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm ring-1 ring-zinc-900/10 dark:ring-white/20";
          } else if (isUnlocked) {
            cardStyle =
              "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 hover:border-zinc-400 cursor-pointer";
          }

          return (
            <motion.button
              key={step.stepNumber}
              whileHover={isUnlocked ? { y: -2, transition: { duration: 0.15 } } : undefined}
              whileTap={isUnlocked ? { scale: 0.95 } : undefined}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                playClickSound(500 + step.stepNumber * 50);
                onStepClick(step.stepNumber);
              }}
              className={`p-2 sm:p-2.5 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 transition-colors min-h-[72px] ${cardStyle}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono opacity-70">
                  0{step.stepNumber}
                </span>
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-current" />
                ) : isUnlocked ? (
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 shrink-0 opacity-60" />
                )}
              </div>
              <span className="text-xs font-bold leading-none truncate w-full">
                {step.label_en}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
