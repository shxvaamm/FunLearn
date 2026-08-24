"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Download,
  CheckCircle2,
  Trash2,
  Play,
  HardDrive,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { type LessonBundle } from "@/lib/offlineStore";
import { useLanguage } from "@/context/LanguageContext";
import { VocabTooltip } from "./VocabTooltip";
import { downloadLessonGuideToDevice } from "@/lib/downloadHelper";
import { playClickSound } from "@/lib/soundEffects";

interface LessonBundleCardProps {
  bundle: LessonBundle;
  onSelect: (bundle: LessonBundle) => void;
  onDownloadForOffline: (slug: string) => Promise<void>;
  onRemoveFromCache: (slug: string) => Promise<void>;
}

export const LessonBundleCard: React.FC<LessonBundleCardProps> = ({
  bundle,
  onSelect,
  onDownloadForOffline,
  onRemoveFromCache,
}) => {
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const title =
    language === "hi"
      ? bundle.title_hi
      : language === "or"
      ? bundle.title_or
      : bundle.title_en;

  const description =
    language === "hi"
      ? bundle.description_hi
      : language === "or"
      ? bundle.description_or
      : bundle.description_en;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      await onDownloadForOffline(bundle.slug);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      await onRemoveFromCache(bundle.slug);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="space-y-3">
        {/* Badges & Meta info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              Class {bundle.classLevel}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              {bundle.subject}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {bundle.estimatedMinutes}m
            </span>
            <span>•</span>
            <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-current" /> +{bundle.xpReward} XP
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
            {title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Trilingual Key Vocab Chips */}
        {bundle.keyVocabKeys && bundle.keyVocabKeys.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
              Vocab:
            </span>
            {bundle.keyVocabKeys.map((vKey) => (
              <VocabTooltip key={vKey} wordKey={vKey} />
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        {/* Offline Cache Toggle Indicator */}
        <div className="flex items-center gap-1.5">
          {bundle.isCachedLocally ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Ready</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleRemove}
                disabled={isProcessing}
                className="ml-1 p-1 text-zinc-400 hover:text-red-500 rounded transition-colors"
                title="Remove from offline cache"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleDownload}
              disabled={isProcessing}
              className="text-[11px] font-bold px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded border border-zinc-300 dark:border-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Pre-cache full lesson for offline use"
            >
              <Download className="w-3 h-3" />
              <span>{isProcessing ? "Saving..." : "Cache Offline"}</span>
            </motion.button>
          )}

          {/* Download note button for device storage */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => downloadLessonGuideToDevice(bundle, language)}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded transition-colors"
            title="Download Notes to Device Storage"
          >
            <HardDrive className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Main CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => {
            playClickSound(700);
            onSelect(bundle);
          }}
          className="min-h-[38px] px-3.5 py-1.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Mission</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
