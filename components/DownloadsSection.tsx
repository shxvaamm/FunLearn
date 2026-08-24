"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle, db } from "@/lib/offlineStore";
import { useLiveQuery } from "dexie-react-hooks";
import { downloadLessonGuideToDevice } from "@/lib/downloadHelper";
import { playClickSound } from "@/lib/soundEffects";
import {
  Download,
  FileText,
  CheckCircle2,
  HardDrive,
} from "lucide-react";

interface DownloadsSectionProps {
  bundles?: LessonBundle[];
}

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({ bundles: propBundles }) => {
  const { language } = useLanguage();
  const [downloadedSlug, setDownloadedSlug] = useState<string | null>(null);

  const localBundles = useLiveQuery(() => db.lessonBundles.toArray(), [], []);
  const bundles = propBundles || localBundles || [];

  const handleDownload = (b: LessonBundle) => {
    playClickSound(650);
    downloadLessonGuideToDevice(b, language);
    setDownloadedSlug(b.slug);
    setTimeout(() => setDownloadedSlug(null), 3000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wide">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Zero-Data Device Downloads</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
            Self-Contained Lesson Guides & Notes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Download printable text + markdown summaries directly to your phone storage to study with no screen time or battery drain.
          </p>
        </div>
      </div>

      {/* Grid of Chapter Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {bundles.map((b, idx) => {
          const isRecentlyDownloaded = downloadedSlug === b.slug;

          const title =
            language === "hi"
              ? b.title_hi
              : language === "or"
              ? b.title_or
              : b.title_en;

          return (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
              className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Class {b.classLevel} • {b.subject}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {title}
                  </h4>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    ~{Math.round(b.sizeKb || 45)} KB • .md format
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleDownload(b)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border shrink-0 transition-colors cursor-pointer ${
                  isRecentlyDownloaded
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                    : "bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {isRecentlyDownloaded ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
