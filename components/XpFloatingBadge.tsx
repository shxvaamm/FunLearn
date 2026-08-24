"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Sparkles } from "lucide-react";

interface XpFloatingBadgeProps {
  amount: number;
  label?: string;
  isVisible: boolean;
  onComplete?: () => void;
  x?: number;
  y?: number;
}

export const XpFloatingBadge: React.FC<XpFloatingBadgeProps> = ({
  amount,
  label,
  isVisible,
  onComplete,
}) => {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 1600);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [10, -25, -45, -60],
            scale: [0.7, 1.15, 1.05, 0.9],
          }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-50 pointer-events-none sm:bottom-12 sm:right-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-2xl border-2 border-zinc-700 dark:border-zinc-300 font-mono font-black text-sm sm:text-base backdrop-blur-md">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>+{amount} XP</span>
            {label && <span className="text-xs text-zinc-300 dark:text-zinc-600 font-sans font-semibold">({label})</span>}
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
