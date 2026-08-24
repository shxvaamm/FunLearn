"use client";

import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { db, DEFAULT_USER_ID, type StudentProfile } from "./offlineStore";

export interface LocalSessionUser {
  id: string;
  name: string;
  role: "student" | "teacher" | "admin";
  email?: string;
  phone?: string;
  classLevel?: number;
  loginTime: string;
}

const SESSION_STORAGE_KEY = "funlearn_session_user";
const SESSION_COOKIE_NAME = "funlearn_auth_session";

/**
 * Returns the currently active authenticated session user from localStorage
 */
export function getLocalSession(): LocalSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalSessionUser;
  } catch {
    return null;
  }
}

/**
 * Saves authenticated session to localStorage and sets root cookie for SSR middleware
 */
export function saveLocalSession(user: Partial<LocalSessionUser> & { id: string; name: string }): LocalSessionUser {
  const sessionUser: LocalSessionUser = {
    id: user.id,
    name: user.name,
    role: user.role || "student",
    email: user.email,
    phone: user.phone,
    classLevel: user.classLevel || 7,
    loginTime: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      // Set cookie for middleware access
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(user.id)}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {
      console.error("[authSession] Error saving session:", e);
    }
  }

  return sessionUser;
}

/**
 * Completely clears all local auth tokens, cookies, and signs out of Supabase
 */
export async function clearLocalSession(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    } catch (e) {
      console.error("[authSession] Error clearing local session:", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network failures on signout
    }
  }
}

/**
 * Synchronously checks if a user session is active
 */
export function isSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(getLocalSession());
}
