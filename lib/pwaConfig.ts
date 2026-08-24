"use client";

import { syncEngine } from "./syncEngine";

export function registerServiceWorker(): void {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.log("[PWA] Service Worker registration failed:", err);
        });

      // Listen for message from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "TRIGGER_BACKGROUND_SYNC") {
          console.log("[PWA] Triggering Supabase cloud sync from SW message...");
          syncEngine.triggerSync().catch(console.error);
        }
      });
    });
  }
}

export function requestBackgroundSync(): void {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "SyncManager" in window
  ) {
    navigator.serviceWorker.ready
      .then((reg: any) => {
        return reg.sync.register("sync-funlearn-progress");
      })
      .catch((err) => {
        console.log("[PWA] Background sync registration fallback:", err);
        syncEngine.triggerSync().catch(console.error);
      });
  } else {
    // Immediate fallback
    syncEngine.triggerSync().catch(console.error);
  }
}
