"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  getLocalSession,
  saveLocalSession,
  clearLocalSession,
  type LocalSessionUser,
} from "@/lib/authSession";
import { db, DEFAULT_USER_ID, getLocalStudentProfile } from "@/lib/offlineStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "student" | "teacher" | "admin";

export interface SupabaseProfile {
  userId: string;
  studentName: string;
  classLevel: number;
  preferredLang: "en" | "hi" | "or";
  totalXp: number;
  levelTitle: string;
  streakDays: number;
  teacherId?: string;
  villageSchoolName?: string;
  avatarId?: string;
  role: UserRole;
}

interface AuthContextValue {
  /** Supabase session — null when logged out or Supabase not configured */
  session: Session | null;
  /** Supabase user object */
  user: User | null;
  /** Profile row fetched from public.profiles */
  profile: SupabaseProfile | null;
  /** Derived role — defaults to 'student' when offline */
  role: UserRole;
  /** True while session is being loaded on mount */
  isLoading: boolean;
  /** True when Supabase credentials are not configured */
  isOfflineMode: boolean;
  /** Sign the current user out, clear storage, and redirect to /login/student */
  signOut: () => Promise<void>;
  /** Re-fetch the profile row (call after profile updates) */
  refreshProfile: () => Promise<void>;
}

const DEFAULT_ACTIVE_PROFILE: SupabaseProfile = {
  userId: DEFAULT_USER_ID,
  studentName: "Aarav Patel",
  classLevel: 7,
  preferredLang: "hi",
  totalXp: 380,
  levelTitle: "खोजी शिक्षार्थी (Curious Seeker)",
  streakDays: 4,
  villageSchoolName: "Govt. Upper Primary School",
  avatarId: "sprout",
  role: "student",
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: DEFAULT_ACTIVE_PROFILE,
  role: "student",
  isLoading: false,
  isOfflineMode: !isSupabaseConfigured,
  signOut: async () => {},
  refreshProfile: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SupabaseProfile | null>(DEFAULT_ACTIVE_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch profile from Supabase ────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) {
      // Fetch local offline profile
      const localP = await getLocalStudentProfile(userId);
      const localSess = getLocalSession();
      if (localP || localSess) {
        setProfile({
          userId: localP?.userId || userId,
          studentName: localP?.studentName || localSess?.name || "Student",
          classLevel: localP?.classLevel || 7,
          preferredLang: (localP?.preferredLang as "en" | "hi" | "or") || "hi",
          totalXp: localP?.totalXp || 380,
          levelTitle: localP?.levelTitle || "खोजी शिक्षार्थी (Curious Seeker)",
          streakDays: localP?.streakDays || 4,
          villageSchoolName: localP?.villageSchoolName,
          role: localSess?.role || "student",
        });
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "user_id, student_name, class_level, preferred_lang, total_xp, level_title, streak_days, teacher_id, village_school_name, avatar_id, role"
        )
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        console.log("[AuthContext] Provisioning fallback profile from user metadata...");
        const fallbackProfile: SupabaseProfile = {
          userId,
          studentName: "Student",
          classLevel: 7,
          preferredLang: "hi",
          totalXp: 380,
          levelTitle: "खोजी शिक्षार्थी (Curious Seeker)",
          streakDays: 4,
          role: "student",
        };
        setProfile(fallbackProfile);

        // Upsert default profile row into Supabase
        supabase
          .from("profiles")
          .upsert({
            user_id: userId,
            student_name: fallbackProfile.studentName,
            class_level: 7,
            preferred_lang: "hi",
            role: "student",
            total_xp: 380,
          })
          .then(() => {});
        return;
      }

      setProfile({
        userId: data.user_id,
        studentName: data.student_name || "Student",
        classLevel: data.class_level || 7,
        preferredLang: (data.preferred_lang as "en" | "hi" | "or") || "hi",
        totalXp: data.total_xp ?? 380,
        levelTitle: data.level_title || "खोजी शिक्षार्थी (Curious Seeker)",
        streakDays: data.streak_days ?? 4,
        teacherId: data.teacher_id ?? undefined,
        villageSchoolName: data.village_school_name ?? undefined,
        avatarId: data.avatar_id ?? undefined,
        role: (data.role as UserRole) ?? "student",
      });
    } catch (err) {
      console.error("[AuthContext] Profile fetch exception:", err);
      // Even on exception, set a default fallback profile so the user is not locked out
      setProfile({
        userId,
        studentName: "Student",
        classLevel: 7,
        preferredLang: "hi",
        totalXp: 380,
        levelTitle: "खोजी शिक्षार्थी (Curious Seeker)",
        streakDays: 4,
        role: "student",
      });
    }
  }, []);

  // ── Bootstrap session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const localSess = getLocalSession();

    if (!isSupabaseConfigured) {
      // Offline mode: load from localStorage & Dexie
      if (localSess) {
        fetchProfile(localSess.id || DEFAULT_USER_ID).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
      return;
    }

    // Get current session synchronously from storage
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setIsLoading(false));
      } else if (localSess) {
        fetchProfile(localSess.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Subscribe to future auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Sign out ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await clearLocalSession();
    setSession(null);
    setUser(null);
    setProfile(DEFAULT_ACTIVE_PROFILE);
  }, []);

  // ── Derived role ───────────────────────────────────────────────────────────
  const role: UserRole = profile?.role ?? "student";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        isLoading,
        isOfflineMode: !isSupabaseConfigured,
        signOut,
        refreshProfile: () =>
          user ? fetchProfile(user.id) : profile ? fetchProfile(profile.userId) : Promise.resolve(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
