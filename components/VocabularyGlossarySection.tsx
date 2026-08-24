"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useLanguage, VOCAB_DICTIONARY } from "@/context/LanguageContext";
import { VocabTooltip } from "./VocabTooltip";
import { Search, Volume2 } from "lucide-react";

export const VocabularyGlossarySection: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const vocabList = Object.values(VOCAB_DICTIONARY);

  const categories = ["All", "Physics", "Biology", "Math", "Environment"];

  const filteredVocab = vocabList.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hi.includes(searchQuery) ||
      item.or.includes(searchQuery) ||
      (item.phonetics?.hi && item.phonetics.hi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.phonetics?.or && item.phonetics.or.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (en: string, native: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        language === "hi" ? `${native}, ${en}` : `${en}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5 sm:space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-bold mb-1.5 sm:mb-2 uppercase tracking-wide">
            <span>Trilingual Dictionary</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
            Bilingual & Trilingual Vocabulary Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 sm:mt-1">
            Standardized terminology across English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ) for rural STEM clarity.
          </p>
        </div>

        {/* Search Input (Touch-friendly 44px min height on mobile) */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search concept (Force, ବଳ, बल)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] sm:min-h-[38px] pl-9 pr-3 py-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills (Horizontal scroll on touch devices) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 touch-pan-x scrollbar-none">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`min-h-[40px] sm:min-h-[32px] px-3.5 py-1 rounded-lg sm:rounded-md text-xs font-bold border transition-colors shrink-0 flex items-center justify-center cursor-pointer ${
              selectedCategory === cat
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                : "bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Vocabulary Flashcard Grid (Mobile: 1 col, Laptop: 2-3 col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((v, idx) => {
          const activeDefinition =
            language === "hi"
              ? v.def_hi
              : language === "or"
              ? v.def_or
              : v.def_en;

          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              whileHover={{ y: -2 }}
              className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                    {v.category}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => handleSpeak(v.en, v.hi, e)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                    <span>{v.en}</span>
                    <span className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">
                      {v.hi}
                    </span>
                  </h3>
                  <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Odia: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{v.or}</span>{" "}
                    {v.phonetics?.or && (
                      <span className="text-zinc-400 text-[11px] font-normal">
                        ({v.phonetics.or})
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {activeDefinition}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>Interactive Tooltip:</span>
                <VocabTooltip wordKey={v.id} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
