"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import { VocabTooltip } from "../VocabTooltip";
import { downloadLessonGuideToDevice } from "@/lib/downloadHelper";
import { playClickSound } from "@/lib/soundEffects";
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  Sparkles,
} from "lucide-react";

interface Step2LearnProps {
  bundle: LessonBundle;
  onBackToSelect: () => void;
  onContinueToExplore: () => void;
}

export const Step2Learn: React.FC<Step2LearnProps> = ({
  bundle,
  onBackToSelect,
  onContinueToExplore,
}) => {
  const { language } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const title =
    language === "hi"
      ? bundle.title_hi
      : language === "or"
      ? bundle.title_or
      : bundle.title_en;

  const content =
    language === "hi"
      ? bundle.content_hi
      : language === "or"
      ? bundle.content_or
      : bundle.content_en;

  const audioLanguageLabel =
    language === "hi" ? "Hindi (हिन्दी)" : language === "or" ? "Odia (ଓଡ଼ିଆ)" : "English";

  const handleToggleSpeech = () => {
    playClickSound(650);
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${title}. ${content}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === "hi" ? "hi-IN" : language === "or" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-7 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6"
    >
      {/* Chapter Top Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold"
          >
            <BookOpen className="w-4 h-4" />
          </motion.div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Step 2: Core Concept Learning • {bundle.subject} (Class {bundle.classLevel})
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Playback Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleToggleSpeech}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 transition-colors cursor-pointer ${
              isPlayingAudio
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>🔊 Listen in {audioLanguageLabel}</span>
              </>
            )}
          </motion.button>

          {/* Download Notes for Phone Storage */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => downloadLessonGuideToDevice(bundle, language)}
            className="min-h-[40px] px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download notes to device storage"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Notes</span>
          </motion.button>
        </div>
      </div>

      {/* Main Lightweight Lesson Content (Large, High Contrast, Accessible) */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/80"
        >
          <p className="text-base sm:text-lg md:text-xl text-zinc-900 dark:text-zinc-100 leading-relaxed font-medium">
            {content}
          </p>
        </motion.div>

        {/* Bilingual Vocabulary Matrix Helper */}
        {bundle.keyVocabKeys && bundle.keyVocabKeys.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Bilingual & Trilingual Vocabulary in this Lesson:</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tap or hover over any chip to view standard Hindi, Odia, and English definitions with phonetics.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {bundle.keyVocabKeys.map((vKey) => (
                <VocabTooltip key={vKey} wordKey={vKey} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        {/* Back to Select (Outline style) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(500);
            onBackToSelect();
          }}
          className="min-h-[44px] sm:min-h-[40px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Select</span>
        </motion.button>

        {/* Continue to Explore (Solid black style) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(750);
            onContinueToExplore();
          }}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Explore</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
