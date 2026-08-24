"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import {
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface Step5ExperimentProps {
  bundle: LessonBundle;
  onBack: () => void;
  onContinue: () => void;
}

export const Step5Experiment: React.FC<Step5ExperimentProps> = ({
  bundle,
  onBack,
  onContinue,
}) => {
  const { language } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const experimentTitle =
    language === "hi"
      ? bundle.experimentTitle_hi || bundle.title_hi
      : language === "or"
      ? bundle.experimentTitle_or || bundle.title_or
      : bundle.experimentTitle_en || bundle.title_en;

  const experimentSteps =
    language === "hi"
      ? bundle.experimentSteps_hi || []
      : language === "or"
      ? bundle.experimentSteps_or || []
      : bundle.experimentSteps_en || [];

  const handleToggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isAllStepsCompleted =
    experimentSteps.length === 0 || completedSteps.length >= experimentSteps.length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-7 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
          <FlaskConical className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Step 5: Village Science & Math Experiment
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
            {experimentTitle}
          </h2>
        </div>
      </div>

      {/* Experiment Interactive Checklist */}
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Follow each step of the experiment below using simple household materials:
        </p>

        <div className="space-y-2.5">
          {experimentSteps.map((stepText, idx) => {
            const isDone = completedSteps.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleStep(idx)}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                  isDone
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-400 dark:border-zinc-600 font-semibold"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                    isDone
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="leading-relaxed">{stepText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] sm:min-h-[40px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice</span>
        </button>

        <button
          type="button"
          disabled={!isAllStepsCompleted}
          onClick={onContinue}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-40 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>Continue to Mission Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
