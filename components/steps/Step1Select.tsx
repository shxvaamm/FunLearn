"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import {
  type LessonBundle,
  type SubjectCategory,
} from "@/lib/offlineStore";
import { VocabTooltip } from "../VocabTooltip";
import { downloadLessonGuideToDevice } from "@/lib/downloadHelper";
import { playClickSound } from "@/lib/soundEffects";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Download,
  Zap,
  Atom,
  TestTube,
  Calculator,
  Dna,
} from "lucide-react";

interface Step1SelectProps {
  bundles: LessonBundle[];
  selectedClass: number;
  onSelectClass: (c: number) => void;
  onSelectChapter: (bundle: LessonBundle) => void;
}

const SUBJECT_LIST: Array<{ id: SubjectCategory; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "Physics", label: "Physics", icon: Atom },
  { id: "Chemistry", label: "Chemistry", icon: TestTube },
  { id: "Mathematics", label: "Mathematics", icon: Calculator },
  { id: "Biology", label: "Biology", icon: Dna },
];

export const Step1Select: React.FC<Step1SelectProps> = ({
  bundles,
  selectedClass,
  onSelectClass,
  onSelectChapter,
}) => {
  const { language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>("Physics");

  const filteredChapters = bundles.filter(
    (b) => b.classLevel === selectedClass && b.subject === selectedSubject
  );

  return (
    <div className="space-y-6">
      {/* 1. Class & Subject Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
      >
        {/* Class Selector Pills */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            1. Select Your Class:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 touch-pan-x scrollbar-none">
            {[6, 7, 8, 9, 10].map((c) => {
              const isSelected = selectedClass === c;
              return (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    playClickSound(600);
                    onSelectClass(c);
                  }}
                  className={`min-h-[44px] sm:min-h-[40px] px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/80"
                  }`}
                >
                  Class {c}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Subject Selector Tabs */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            2. Select Subject:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUBJECT_LIST.map((subj) => {
              const Icon = subj.icon;
              const isSelected = selectedSubject === subj.id;
              return (
                <motion.button
                  key={subj.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    playClickSound(750);
                    setSelectedSubject(subj.id);
                  }}
                  className={`min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/80"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">{subj.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 2. Chapter List Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Available Chapters for Class {selectedClass} • {selectedSubject}</span>
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {filteredChapters.length} Chapter{filteredChapters.length !== 1 ? "s" : ""}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filteredChapters.length > 0 ? (
            <motion.div
              key={`${selectedClass}-${selectedSubject}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredChapters.map((chapter, idx) => {
                const title =
                  language === "hi"
                    ? chapter.title_hi
                    : language === "or"
                    ? chapter.title_or
                    : chapter.title_en;

                const description =
                  language === "hi"
                    ? chapter.description_hi
                    : language === "or"
                    ? chapter.description_or
                    : chapter.description_en;

                return (
                  <motion.div
                    key={chapter.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-colors"
                  >
                    <div className="space-y-2">
                      {/* Header badge strip */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                          {chapter.subject}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {chapter.estimatedMinutes} mins
                          </span>
                          <span>•</span>
                          <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-0.5">
                            <Zap className="w-3 h-3 fill-current" /> +{chapter.xpReward} XP
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                        {title}
                      </h3>

                      {/* Description preview */}
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {description}
                      </p>

                      {/* Bilingual Key Vocab Chips */}
                      {chapter.keyVocabKeys && chapter.keyVocabKeys.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mr-0.5">
                            Glossary:
                          </span>
                          {chapter.keyVocabKeys.map((vk) => (
                            <VocabTooltip key={vk} wordKey={vk} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions: Download notes + Select Chapter button */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => downloadLessonGuideToDevice(chapter, language)}
                        className="min-h-[40px] px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Download notes to device"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Save Notes</span>
                      </motion.button>

                      {/* Clicking advances to Step 2 Learn */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => {
                          playClickSound(800);
                          onSelectChapter(chapter);
                        }}
                        className="min-h-[40px] px-4 py-1.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-zinc-500 dark:text-zinc-400 text-xs space-y-2"
            >
              <BookOpen className="w-8 h-8 mx-auto text-zinc-400" />
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                No specific chapters found for Class {selectedClass} in {selectedSubject}.
              </p>
              <p>Try switching to Class 7 or another STEM subject above.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
