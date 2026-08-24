"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { syncEngine, type SyncStatusState } from "@/lib/syncEngine";
import { registerServiceWorker } from "@/lib/pwaConfig";
import { RefreshCw, CheckCircle2, Wifi } from "lucide-react";

export const PwaSyncBanner: React.FC = () => {
  const [syncState, setSyncState] = useState<SyncStatusState>(syncEngine.getState());
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>(
    "Online detected. Syncing progress with teacher dashboard..."
  );

  useEffect(() => {
    registerServiceWorker();

    const unsubscribe = syncEngine.subscribe((state) => {
      setSyncState(state);
      if (state.isSyncing) {
        setBannerMessage("Online detected. Syncing progress with teacher dashboard...");
        setShowBanner(true);
      } else if (state.syncedItemCount > 0) {
        setBannerMessage("Sync complete! Teacher dashboard updated.");
        setShowBanner(true);
        const timer = setTimeout(() => setShowBanner(false), 3500);
        return () => clearTimeout(timer);
      }
    });

    const handleOnline = () => {
      setBannerMessage("Online detected. Syncing progress with teacher dashboard...");
      setShowBanner(true);
      syncEngine.triggerSync().finally(() => {
        setTimeout(() => setShowBanner(false), 3500);
      });
    };

    window.addEventListener("online", handleOnline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-16 md:bottom-4 left-1/2 z-50 max-w-md w-[90%] sm:w-auto px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-xl border border-zinc-800 dark:border-zinc-200 flex items-center justify-between gap-3 text-xs font-semibold"
        >
          <div className="flex items-center gap-2.5">
            {syncState.isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-white dark:text-zinc-900" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white dark:text-zinc-900" />
            )}
            <span className="truncate">{bannerMessage}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-white dark:bg-zinc-900 animate-ping shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

