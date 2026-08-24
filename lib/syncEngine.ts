import {
  db,
  getPendingSyncQueue,
  removePendingSyncItem,
  markSyncItemFailed,
  type PendingSyncItem,
} from "./offlineStore";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

// ── Exponential backoff with jitter (capped at 30s) ─────────────────────────
function backoffMs(retryCount: number): number {
  const base = Math.min(500 * Math.pow(2, retryCount), 30_000);
  const jitter = Math.random() * 500;
  return base + jitter;
}

// ── Sleep helper ─────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// ── Is this a Postgres unique constraint violation? (code 23505) ─────────────
function isUniqueConstraintError(err: any): boolean {
  return (
    err?.code === "23505" ||
    err?.message?.includes("duplicate key") ||
    err?.message?.includes("unique constraint") ||
    err?.details?.includes("already exists")
  );
}

export interface SyncStatusState {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  syncedItemCount: number;
  syncHistory: Array<{
    id: string;
    actionType: string;
    status: "success" | "mock_success" | "failed";
    timestamp: string;
    details?: string;
  }>;
}

type SyncListener = (state: SyncStatusState) => void;

class SyncEngine {
  private isSyncing = false;
  private isSimulatedOffline = false;
  private lastSyncedAt: string | null = null;
  private lastSyncError: string | null = null;
  private totalSyncedCount = 0;
  private syncHistory: SyncStatusState["syncHistory"] = [];
  private listeners: Set<SyncListener> = new Set();
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initListeners();
    }
  }

  public initListeners(): void {
    if (this.isInitialized || typeof window === "undefined") return;

    window.addEventListener("online", () => {
      console.log("[SyncEngine] Network restored (online event). Triggering background sync...");
      this.notifyListeners();
      this.triggerSync();
    });

    window.addEventListener("offline", () => {
      console.log("[SyncEngine] Network lost (offline event). Switched to offline mode.");
      this.notifyListeners();
    });

    this.isInitialized = true;
    // Initial sync check if already online
    if (navigator.onLine && !this.isSimulatedOffline) {
      setTimeout(() => this.triggerSync(), 1500);
    }
  }

  public isEffectivelyOnline(): boolean {
    if (typeof window === "undefined") return true;
    if (this.isSimulatedOffline) return false;
    return navigator.onLine;
  }

  public setSimulatedOffline(offline: boolean): void {
    this.isSimulatedOffline = offline;
    console.log(`[SyncEngine] Simulation mode set: ${offline ? "FORCED OFFLINE" : "ONLINE"}`);
    this.notifyListeners();
    if (!offline && navigator.onLine) {
      this.triggerSync();
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    // Emit current state immediately
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): SyncStatusState {
    const isOnline = typeof window !== "undefined" ? navigator.onLine : true;
    return {
      isOnline: isOnline && !this.isSimulatedOffline,
      isSimulatedOffline: this.isSimulatedOffline,
      isSyncing: this.isSyncing,
      pendingCount: 0,
      lastSyncedAt: this.lastSyncedAt,
      lastSyncError: this.lastSyncError,
      syncedItemCount: this.totalSyncedCount,
      syncHistory: [...this.syncHistory],
    };
  }

  public getStatus(): SyncStatusState {
    return this.getState();
  }


  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error("[SyncEngine] Error in sync listener:", err);
      }
    });
  }

  /**
   * Main sync procedure: drains the pending mutations in Dexie
   */
  public async triggerSync(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) {
      console.log("[SyncEngine] Sync already in progress. Skipping duplicate run.");
      return { synced: 0, failed: 0 };
    }

    if (!this.isEffectivelyOnline()) {
      console.log("[SyncEngine] Device is currently offline. Background sync deferred.");
      return { synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.lastSyncError = null;
    this.notifyListeners();

    let successCount = 0;
    let failCount = 0;

    try {
      const queue = await getPendingSyncQueue();
      console.log(`[SyncEngine] Processing ${queue.length} pending mutations from Dexie queue...`);

      for (const item of queue) {
        // Skip dead-letter items permanently
        if ((item as any).status === "dead_letter") {
          console.log(`[SyncEngine] Skipping dead-letter item ${item.id}`);
          continue;
        }

        // Double check network state between items
        if (!this.isEffectivelyOnline()) break;

        // Apply exponential backoff for previously-failed items
        if (item.retryCount > 0 && item.status === "failed") {
          const delay = backoffMs(item.retryCount);
          console.log(
            `[SyncEngine] Backing off ${Math.round(delay)}ms for item ${item.id} (retry #${item.retryCount})`
          );
          await sleep(delay);
        }

        try {
          await this.syncItemToSupabase(item);
          await removePendingSyncItem(item.id);
          successCount++;
          this.totalSyncedCount++;

          this.syncHistory.unshift({
            id: item.id,
            actionType: item.actionType,
            status: isSupabaseConfigured ? "success" : "mock_success",
            timestamp: new Date().toISOString(),
            details: `Synced ${item.actionType} for user ${item.userId}`,
          });
          if (this.syncHistory.length > 20) this.syncHistory.pop();
        } catch (itemErr: any) {
          // ── Idempotent success: duplicate client_mutation_id ────────────────
          if (isUniqueConstraintError(itemErr)) {
            console.log(
              `[SyncEngine] Item ${item.id} already synced (duplicate key) — removing from queue.`
            );
            await removePendingSyncItem(item.id);
            successCount++;
            this.totalSyncedCount++;
            this.syncHistory.unshift({
              id: item.id,
              actionType: item.actionType,
              status: "success",
              timestamp: new Date().toISOString(),
              details: "Already synced (idempotent duplicate)",
            });
            continue;
          }

          console.error(`[SyncEngine] Failed to sync mutation ${item.id}:`, itemErr);
          failCount++;
          const errorMessage = itemErr?.message || "Sync network error";

          // ── Dead-letter after 5 retries ─────────────────────────────────────
          const newRetryCount = (item.retryCount || 0) + 1;
          if (newRetryCount >= 5) {
            console.error(
              `[SyncEngine] Item ${item.id} exceeded max retries — moving to dead-letter.`
            );
            const deadItem = await db.pendingSyncQueue.get(item.id);
            if (deadItem) {
              deadItem.retryCount = newRetryCount;
              deadItem.status = "dead_letter" as any;
              deadItem.lastError = errorMessage;
              await db.pendingSyncQueue.put(deadItem);
            }
          } else {
            await markSyncItemFailed(item.id, errorMessage);
          }

          this.syncHistory.unshift({
            id: item.id,
            actionType: item.actionType,
            status: "failed",
            timestamp: new Date().toISOString(),
            details: errorMessage,
          });
        }
      }

      this.lastSyncedAt = new Date().toISOString();
    } catch (globalErr: any) {
      console.error("[SyncEngine] Critical error during sync queue drain:", globalErr);
      this.lastSyncError = globalErr?.message || "Unknown sync error";
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }

    return { synced: successCount, failed: failCount };
  }

  /**
   * Syncs a single item to Supabase or simulates it when running locally in mock mode
   */
  private async syncItemToSupabase(item: PendingSyncItem): Promise<void> {
    if (!isSupabaseConfigured) {
      // Simulate network roundtrip latency for realistic demonstration
      await new Promise((res) => setTimeout(res, 450));
      console.log(
        `[SyncEngine (Mock Mode)] Successfully synced ${item.actionType} (${item.id}) to local Supabase sandbox:`,
        item.payload
      );
      return;
    }

    switch (item.actionType) {
      case "MISSION_LOG": {
        const { error } = await supabase.from("mission_logs").upsert(
          {
            user_id: item.userId,
            mission_slug: item.payload.mission_slug,
            score: item.payload.score,
            xp_earned: item.payload.xp_earned,
            completed_at: item.payload.completed_at || item.timestamp,
            offline_synced_flag: true,
            client_mutation_id: item.id,
            synced_at: new Date().toISOString(),
          },
          { onConflict: "client_mutation_id" }
        );

        if (error) throw error;
        break;
      }

      case "XP_UPDATE": {
        // Increment total_xp on Supabase profile or update directly
        const { error } = await supabase
          .from("profiles")
          .update({
            total_xp: item.payload.newTotalXp,
            level_title: item.payload.levelTitle,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", item.userId);

        if (error) {
          console.warn("[SyncEngine] Supabase profile XP update warning:", error);
          // If row doesn't exist, we can fallback to upsert
        }
        break;
      }

      case "PROGRESS_UPDATE": {
        const { error } = await supabase.from("chapter_progress").upsert(
          {
            user_id: item.userId,
            subject: item.payload.subject,
            chapter_slug: item.payload.chapterSlug,
            progress_percent: item.payload.progressPercent,
            status: item.payload.status,
            score: item.payload.score,
            last_accessed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,subject,chapter_slug" }
        );

        if (error) throw error;
        break;
      }

      case "PROFILE_UPDATE": {
        const { error } = await supabase
          .from("profiles")
          .upsert(
            {
              user_id: item.userId,
              student_name: item.payload.studentName,
              class_level: item.payload.classLevel,
              preferred_lang: item.payload.preferredLang,
              total_xp: item.payload.totalXp,
              level_title: item.payload.levelTitle,
              streak_days: item.payload.streakDays,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (error) throw error;
        break;
      }

      default:
        console.log(`[SyncEngine] Unknown action type: ${item.actionType}`);
    }
  }
}

export const syncEngine = new SyncEngine();
