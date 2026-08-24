"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, Sparkles, Volume2 } from "lucide-react";

interface VocabTooltipProps {
  wordKey: string;
  children?: React.ReactNode;
  inline?: boolean;
}

export const VocabTooltip: React.FC<VocabTooltipProps> = ({
  wordKey,
  children,
  inline = true,
}) => {
  const { getVocab, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vocab = getVocab(wordKey);

  if (!vocab) {
    return <span>{children || wordKey}</span>;
  }

  const currentLangText =
    language === "hi" ? vocab.hi : language === "or" ? vocab.or : vocab.en;

  const currentDefinition =
    language === "hi"
      ? vocab.def_hi
      : language === "or"
      ? vocab.def_or
      : vocab.def_en;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSpeaking(true);
      const textToSpeak =
        language === "hi"
          ? `${vocab.hi}, ${vocab.en}`
          : language === "or"
          ? `${vocab.or}, ${vocab.en}`
          : vocab.en;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <span
      className={`relative inline-block ${
        inline ? "align-baseline" : ""
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Subtle gray chip with high contrast text */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md font-medium text-xs text-zinc-800 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
        title="Click or hover for Trilingual definition"
      >
        <span className="underline decoration-zinc-400 dark:decoration-zinc-500 underline-offset-2">
          {children || currentLangText}
        </span>
        <Sparkles className="w-3 h-3 text-zinc-500" />
      </motion.button>

      {/* Crisp Minimalist Tooltip Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-lg text-zinc-900 dark:text-zinc-100 text-xs pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white text-sm">
                <BookOpen className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span>{vocab.en}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded font-semibold text-[10px] uppercase">
                  {vocab.category}
                </span>
                <button
                  type="button"
                  onClick={handleSpeak}
                  aria-label="Listen to pronunciation"
                  className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors ${
                    isSpeaking ? "text-zinc-900 dark:text-white animate-pulse" : ""
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trilingual Matrix Pill */}
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-lg mb-2 border border-zinc-200 dark:border-zinc-700 flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                Trilingual Matrix
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                <span className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200">
                  EN: {vocab.en}
                </span>
                <span className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200">
                  HI: {vocab.hi} {vocab.phonetics?.hi ? `(${vocab.phonetics.hi})` : ""}
                </span>
                <span className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200">
                  OR: {vocab.or} {vocab.phonetics?.or ? `(${vocab.phonetics.or})` : ""}
                </span>
              </div>
            </div>

            {/* Definition */}
            <p className="text-[11.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              {currentDefinition}
            </p>

            {/* Pointer Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-6 border-transparent border-t-zinc-300 dark:border-t-zinc-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

