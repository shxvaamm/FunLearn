"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import { VocabTooltip } from "../VocabTooltip";
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lightbulb,
} from "lucide-react";

interface Step3ExploreProps {
  bundle: LessonBundle;
  onBack: () => void;
  onContinue: () => void;
}

export const Step3Explore: React.FC<Step3ExploreProps> = ({
  bundle,
  onBack,
  onContinue,
}) => {
  const { language } = useLanguage();

  const title =
    language === "hi"
      ? bundle.title_hi
      : language === "or"
      ? bundle.title_or
      : bundle.title_en;

  const exploreContent =
    language === "hi"
      ? bundle.exploreContent_hi || bundle.description_hi
      : language === "or"
      ? bundle.exploreContent_or || bundle.description_or
      : bundle.exploreContent_en || bundle.description_en;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-7 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Step 3: Real-World Rural Exploration
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
            Practical Applications of {title}
          </h2>
        </div>
      </div>

      {/* Exploration Card */}
      <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/80 space-y-4">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white text-sm">
          <Lightbulb className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span>Village STEM Insights:</span>
        </div>
        <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
          {exploreContent}
        </p>

        {bundle.keyVocabKeys && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-500 font-semibold">Key Terms:</span>
            {bundle.keyVocabKeys.map((vk) => (
              <VocabTooltip key={vk} wordKey={vk} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] sm:min-h-[40px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learn</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>Continue to Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
