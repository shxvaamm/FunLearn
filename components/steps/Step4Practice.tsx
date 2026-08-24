"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import {
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface Step4PracticeProps {
  bundle: LessonBundle;
  onBack: () => void;
  onContinue: () => void;
}

export const Step4Practice: React.FC<Step4PracticeProps> = ({
  bundle,
  onBack,
  onContinue,
}) => {
  const { language } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const practiceQ = bundle.questions[0];

  const qText =
    language === "hi"
      ? practiceQ.question_hi
      : language === "or"
      ? practiceQ.question_or
      : practiceQ.question_en;

  const options =
    language === "hi"
      ? practiceQ.options_hi
      : language === "or"
      ? practiceQ.options_or
      : practiceQ.options_en;

  const explanation =
    language === "hi"
      ? practiceQ.explanation_hi
      : language === "or"
      ? practiceQ.explanation_or
      : practiceQ.explanation_en;

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
    setIsSubmitted(true);
  };

  const isCorrect = selectedIdx === practiceQ.correctAnswerIndex;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-7 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
          <CheckSquare className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Step 4: Interactive Concept Practice
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
            Quick Understanding Check
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
          {qText}
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {options.map((opt, idx) => {
            const isChosen = selectedIdx === idx;
            const isRight = idx === practiceQ.correctAnswerIndex;

            let btnStyle =
              "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100";

            if (isSubmitted) {
              if (isRight) {
                btnStyle =
                  "border-zinc-900 dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold";
              } else if (isChosen) {
                btnStyle =
                  "border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 line-through";
              } else {
                btnStyle = "opacity-40 border-zinc-200 dark:border-zinc-800";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={`p-3.5 rounded-lg border text-left text-xs sm:text-sm transition-colors flex items-center justify-between min-h-[48px] ${btnStyle}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded border border-current flex items-center justify-center font-bold text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </span>

                {isSubmitted && isRight && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {isSubmitted && isChosen && !isRight && <XCircle className="w-5 h-5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-zinc-900 dark:text-white">
              <HelpCircle className="w-4 h-4" /> Explanation:
            </div>
            <p>{explanation}</p>
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
          <span>Back to Explore</span>
        </button>

        <button
          type="button"
          disabled={!isSubmitted}
          onClick={onContinue}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-40 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>Continue to Experiment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
