"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowRight,
  Flame,
  Zap,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { type LessonBundle } from "@/lib/offlineStore";
import { useLanguage } from "@/context/LanguageContext";
import { playClickSound, playLevelUpSound } from "@/lib/soundEffects";

interface MissionPlayerModalProps {
  bundle: LessonBundle;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const MissionPlayerModal: React.FC<MissionPlayerModalProps> = ({
  bundle,
  isOpen,
  onClose,
  onComplete,
}) => {
  const { language } = useLanguage();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isMissionFinished, setIsMissionFinished] = useState(false);

  if (!isOpen) return null;

  const questionsList = bundle.questions || [];
  const currentQuiz = questionsList[currentQuizIndex];
  const isCorrect = selectedOption === currentQuiz?.correctAnswerIndex;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    playClickSound(600 + index * 50);
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuiz) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuiz.correctAnswerIndex) {
      setUserScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuizIndex + 1 < questionsList.length) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setIsMissionFinished(true);
      playLevelUpSound();
      onComplete(userScore + (isCorrect ? 1 : 0));
    }
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    setIsMissionFinished(false);
  };

  const getQuestionText = () => {
    if (!currentQuiz) return "";
    return language === "hi"
      ? currentQuiz.question_hi
      : language === "or"
      ? currentQuiz.question_or
      : currentQuiz.question_en;
  };

  const getOptionText = (optIndex: number) => {
    if (!currentQuiz) return "";
    if (language === "hi") return currentQuiz.options_hi[optIndex];
    if (language === "or") return currentQuiz.options_or[optIndex];
    return currentQuiz.options_en[optIndex];
  };

  const getExplanationText = () => {
    if (!currentQuiz) return "";
    return language === "hi"
      ? currentQuiz.explanation_hi
      : language === "or"
      ? currentQuiz.explanation_or
      : currentQuiz.explanation_en;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              {bundle.subject}
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
              {bundle.title_en}
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!isMissionFinished ? (
            <>
              {/* Question Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>
                    Question {currentQuizIndex + 1} of {questionsList.length}
                  </span>
                  <span>Score: {userScore}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-zinc-900 dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuizIndex + 1) / (questionsList.length || 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                  {getQuestionText()}
                </h3>
              </div>

              {/* Option Choices */}
              <div className="space-y-2.5">
                {currentQuiz?.options_en.map((_: string, optIdx: number) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = currentQuiz.correctAnswerIndex === optIdx;

                  let buttonStyle =
                    "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400";

                  if (isAnswerSubmitted) {
                    if (isThisCorrect) {
                      buttonStyle =
                        "border-zinc-900 dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold";
                    } else if (isThisSelected && !isThisCorrect) {
                      buttonStyle =
                        "border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 line-through";
                    } else {
                      buttonStyle =
                        "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 text-zinc-400";
                    }
                  } else if (isThisSelected) {
                    buttonStyle =
                      "border-zinc-900 dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold shadow-xs";
                  }

                  return (
                    <motion.button
                      key={optIdx}
                      whileTap={!isAnswerSubmitted ? { scale: 0.98 } : undefined}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full min-h-[48px] p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${buttonStyle}`}
                    >
                      <span className="font-medium">{getOptionText(optIdx)}</span>
                      {isAnswerSubmitted && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation Dropdown (if submitted) */}
              <AnimatePresence>
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isCorrect ? "Correct!" : "Explanation:"}</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {getExplanationText()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Completed Screen */
            <div className="text-center py-6 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className="w-16 h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
              >
                <Trophy className="w-8 h-8" />
              </motion.div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Mission Complete!
                </h3>
                <p className="text-xs text-zinc-500">
                  You scored {userScore} out of {questionsList.length}
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    XP Gained
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 fill-current" /> +{bundle.xpReward}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    Streak Bonus
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 fill-current" /> +1 Day
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          {!isMissionFinished ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 cursor-pointer"
              >
                Exit
              </button>

              {!isAnswerSubmitted ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Check Answer
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-end gap-2 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Done
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
