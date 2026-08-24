"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { syncEngine, type SyncStatusState } from "@/lib/syncEngine";
import {
  db,
  initLocalStore,
  DEFAULT_USER_ID,
} from "@/lib/offlineStore";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { useLiveQuery } from "dexie-react-hooks";
import {
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Layers,
} from "lucide-react";

interface SyncDevPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncDevPanel: React.FC<SyncDevPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [syncState, setSyncState] = useState<SyncStatusState>(syncEngine.getState());
  const [activeTab, setActiveTab] = useState<"queue" | "tables" | "schema">("queue");

  const pendingQueue = useLiveQuery(() => db.pendingSyncQueue.toArray(), [], []);
  const localProfile = useLiveQuery(() => db.profiles.get(DEFAULT_USER_ID), [], null);
  const cachedBundles = useLiveQuery(() => db.lessonBundles.toArray(), [], []);

  useEffect(() => {
    return syncEngine.subscribe(setSyncState);
  }, []);

  if (!isOpen) return null;

  const handleToggleSimulation = (offline: boolean) => {
    syncEngine.setSimulatedOffline(offline);
  };

  const handleTriggerSync = async () => {
    await syncEngine.triggerSync();
  };

  const handleClearQueue = async () => {
    await db.pendingSyncQueue.clear();
  };

  const handleResetDatabase = async () => {
    await db.pendingSyncQueue.clear();
    await db.profiles.clear();
    await db.lessonBundles.clear();
    await initLocalStore();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-xl h-full shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Offline-First & Sync Inspector
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Dexie.js IndexedDB ↔ Supabase Backend
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Simulator Controls */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Network Simulator
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
              {isSupabaseConfigured ? "Live Supabase Cloud" : "Local Mock Sandbox"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleToggleSimulation(false)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold border transition-colors ${
                !syncState.isSimulatedOffline
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>Simulate Online</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleSimulation(true)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold border transition-colors ${
                syncState.isSimulatedOffline
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <WifiOff className="w-4 h-4" />
              <span>Simulate Offline</span>
            </button>
          </div>

          {/* Sync Trigger Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Last Synced:{" "}
              <strong className="text-zinc-800 dark:text-zinc-200">
                {syncState.lastSyncedAt
                  ? new Date(syncState.lastSyncedAt).toLocaleTimeString()
                  : "Never"}
              </strong>
            </div>

            <button
              type="button"
              disabled={syncState.isSyncing || syncState.isSimulatedOffline}
              onClick={handleTriggerSync}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-40 text-white dark:text-zinc-900 rounded-md font-bold text-xs shadow-xs transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncState.isSyncing ? "animate-spin" : ""}`}
              />
              <span>{syncState.isSyncing ? "Syncing..." : "Sync Now"}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-4 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "queue"
                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Pending Queue ({pendingQueue?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tables")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "tables"
                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Dexie Tables
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "schema"
                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Supabase Schema
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "queue" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Dexie Queue: <code className="text-zinc-800 dark:text-zinc-200">pendingSyncQueue</code>
                </span>
                {pendingQueue && pendingQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearQueue}
                    className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Queue
                  </button>
                )}
              </div>

              {pendingQueue && pendingQueue.length > 0 ? (
                <div className="space-y-2.5">
                  {pendingQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-zinc-900 dark:text-white">
                          {item.actionType}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px] bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
                        {JSON.stringify(item.payload, null, 2)}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                        <span>ID: {item.id.slice(0, 8)}...</span>
                        <span className="capitalize font-semibold text-zinc-800 dark:text-zinc-200">
                          Status: {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-zinc-700 dark:text-zinc-300" />
                  <p>Queue is clear! All offline mutations are synced.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "tables" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Table: <code>profiles</code>
                </span>
                <pre className="p-2 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 rounded font-mono text-[11px] overflow-x-auto border border-zinc-200 dark:border-zinc-800">
                  {JSON.stringify(localProfile, null, 2)}
                </pre>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Table: <code>lessonBundles</code> ({cachedBundles.length})
                </span>
                <div className="space-y-1">
                  {cachedBundles.map((b) => (
                    <div
                      key={b.slug}
                      className="p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
                    >
                      <span className="font-semibold">{b.slug}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {b.isCachedLocally ? "CACHED" : "NOT CACHED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetDatabase}
                className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-md font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Re-seed Local Dexie DB
              </button>
            </div>
          )}

          {activeTab === "schema" && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                SQL Schema Reference (<code>schema.sql</code>):
              </span>
              <pre className="p-3 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[60vh]">
{`-- Supabase Core Schema
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  class_level INT NOT NULL,
  preferred_lang VARCHAR(10) DEFAULT 'hi',
  total_xp INT DEFAULT 0,
  level_title VARCHAR(100),
  streak_days INT DEFAULT 1,
  teacher_id UUID
);

CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id),
  subject VARCHAR(100),
  chapter_slug VARCHAR(150),
  progress_percent INT DEFAULT 0,
  status VARCHAR(30) DEFAULT 'in_progress',
  score INT DEFAULT 0,
  UNIQUE(user_id, subject, chapter_slug)
);

CREATE TABLE mission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id),
  mission_slug VARCHAR(150),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INT DEFAULT 0,
  offline_synced_flag BOOLEAN DEFAULT FALSE,
  client_mutation_id UUID UNIQUE
);`}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

