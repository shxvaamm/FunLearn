"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { syncEngine, type SyncStatusState } from "@/lib/syncEngine";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/offlineStore";
import { HardDriveDownload, RefreshCw, WifiOff, CheckCircle2 } from "lucide-react";

interface OfflineBannerProps {
  onOpenSyncDevPanel: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onOpenSyncDevPanel }) => {
  const { t } = useLanguage();
  const [syncState, setSyncState] = useState<SyncStatusState>(syncEngine.getState());
  const [lastSyncNotice, setLastSyncNotice] = useState<string | null>(null);

  const pendingCount = useLiveQuery(() => db.pendingSyncQueue.count(), [], 0);

  useEffect(() => {
    return syncEngine.subscribe(setSyncState);
  }, []);

  const handleSyncNow = async () => {
    const result = await syncEngine.triggerSync();
    if (result.synced > 0) {
      setLastSyncNotice(t("syncSuccess"));
      setTimeout(() => setLastSyncNotice(null), 4000);
    }
  };

  const isOffline = !syncState.isOnline;
  const hasPendingItems = (pendingCount ?? 0) > 0;
  const shouldShow = isOffline || hasPendingItems || !!lastSyncNotice;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2.5 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Status text */}
            <div className="flex items-center gap-2.5">
              {lastSyncNotice ? (
                <div className="p-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : isOffline ? (
                <div className="p-1 border border-zinc-400 dark:border-zinc-600 rounded">
                  <WifiOff className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
                </div>
              ) : (
                <div className="p-1 border border-zinc-400 dark:border-zinc-600 rounded">
                  <HardDriveDownload className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
                </div>
              )}

              <div>
                {lastSyncNotice ? (
                  <span className="font-semibold">{lastSyncNotice}</span>
                ) : isOffline ? (
                  <span className="font-normal text-zinc-700 dark:text-zinc-300">
                    <strong className="font-bold text-zinc-900 dark:text-white">
                      {t("statusOffline")}
                    </strong>{" "}
                    — All progress & quizzes are saved locally in your browser IndexedDB.
                  </span>
                ) : (
                  <span className="font-normal text-zinc-700 dark:text-zinc-300">
                    <strong className="font-bold text-zinc-900 dark:text-white">{pendingCount}</strong>{" "}
                    {t("pendingItemsToSync")} ready to upload to Supabase.
                  </span>
                )}
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2">
              {hasPendingItems && syncState.isOnline && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  disabled={syncState.isSyncing}
                  onClick={handleSyncNow}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-md font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      syncState.isSyncing ? "animate-spin" : ""
                    }`}
                  />
                  <span>{syncState.isSyncing ? t("statusSyncing") : t("btnSyncNow")}</span>
                </motion.button>
              )}

              <button
                type="button"
                onClick={onOpenSyncDevPanel}
                className="text-xs font-semibold underline text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                Inspect Queue
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

