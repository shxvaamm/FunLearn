"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
  Zap,
  ShieldCheck,
  Globe,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  updateLocalStudentProfile,
  DEFAULT_USER_ID,
  type SupportedLanguage,
} from "@/lib/offlineStore";
import { saveLocalSession } from "@/lib/authSession";
import { playClickSound, playSuccessSound, playErrorSound } from "@/lib/soundEffects";

// Official Google "G" Icon
const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function StudentGoogleLoginPage() {
  const router = useRouter();

  const [classLevel, setClassLevel] = useState<number>(7);
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>("hi");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Auto-detect and handle Google OAuth redirect callback on page load
  useEffect(() => {
    // 1. Direct Hash extraction (when Google redirects with #access_token=...)
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      setIsLoading(true);
      setStatusMessage({
        type: "info",
        text: "Completing Google Sign-in... Welcome to FunLearn!",
      });

      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token") || "";

        if (accessToken) {
          supabase.auth
            .setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            .then(async ({ data }) => {
              const user = data?.user || (await supabase.auth.getUser()).data?.user;
              if (user) {
                const resolvedName =
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  user.email?.split("@")[0] ||
                  "Student";
                const resolvedEmail = user.email || "";

                saveLocalSession({
                  id: user.id,
                  name: resolvedName,
                  email: resolvedEmail,
                  role: "student",
                  classLevel: 7,
                });

                await updateLocalStudentProfile({
                  userId: user.id,
                  studentName: resolvedName,
                  classLevel: 7,
                  preferredLang: "hi",
                });

                playSuccessSound();
                window.location.replace("/");
              } else {
                window.location.replace("/");
              }
            })
            .catch(() => {
              window.location.replace("/");
            });
          return;
        }
      } catch (err) {
        console.error("[Google Auth Callback] Hash parsing error:", err);
      }
    }

    // 2. Check if already has active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const resolvedName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Student";

        saveLocalSession({
          id: user.id,
          name: resolvedName,
          email: user.email || "",
          role: "student",
          classLevel: 7,
        });

        window.location.replace("/");
      }
    });

    // 3. Listen for onAuthStateChange events
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
        const user = session.user;
        const resolvedName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Student";

        saveLocalSession({
          id: user.id,
          name: resolvedName,
          email: user.email || "",
          role: "student",
          classLevel: 7,
        });

        await updateLocalStudentProfile({
          userId: user.id,
          studentName: resolvedName,
          classLevel: 7,
          preferredLang: "hi",
        });

        window.location.replace("/");
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  // Handle Google OAuth Sign-In button click
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    playClickSound(700);

    // Save preferences locally first
    await updateLocalStudentProfile({
      userId: DEFAULT_USER_ID,
      studentName: "Student (Google User)",
      classLevel,
      preferredLang,
    });

    // ── 1. Live Supabase Google OAuth ──────────────────────────────────────────
    if (isSupabaseConfigured) {
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${origin}/`,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) throw error;

        if (data?.url) {
          playSuccessSound();
          window.location.href = data.url;
          return;
        }
      } catch (err: any) {
        console.warn("[Google Auth] OAuth redirect exception:", err?.message);
        setStatusMessage({
          type: "error",
          text: err?.message || "Could not connect to Google. Please check your network and try again.",
        });
        setIsLoading(false);
        return;
      }
    }

    // ── 2. Fallback / Instant 1-Click Google Sandbox Session ───────────────────
    try {
      saveLocalSession({
        id: DEFAULT_USER_ID,
        name: "Aarav Patel",
        role: "student",
        email: "aarav.patel@school.edu",
        classLevel,
      });

      playSuccessSound();
      setStatusMessage({
        type: "success",
        text: "Signed in with Google! Loading FunLearn STEM Hub...",
      });

      setTimeout(() => {
        window.location.replace("/");
      }, 400);
    } catch {
      playErrorSound();
      setStatusMessage({
        type: "error",
        text: "Failed to initialize student session. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col p-4 sm:p-6 transition-colors">
      {/* Top Header Strip */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Staff / General Portal</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
          Student Portal
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center py-2">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Card Header & Branding */}
          <div className="text-center space-y-3">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              className="w-14 h-14 bg-zinc-900 dark:bg-white rounded-2xl mx-auto flex items-center justify-center shadow-md"
            >
              <GraduationCap className="w-7 h-7 text-white dark:text-zinc-900" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                Student Sign In
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Access your gamified STEM labs &amp; curriculum missions
              </p>
            </div>
          </div>

          {/* Student Class & Language Preferences */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 text-left">
            <div>
              <label
                htmlFor="studentClassSelect"
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" /> Class / Grade
              </label>
              <select
                id="studentClassSelect"
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-900 dark:text-white outline-none cursor-pointer"
              >
                <option value={6}>Class 6</option>
                <option value={7}>Class 7 (Recommended)</option>
                <option value={8}>Class 8</option>
                <option value={9}>Class 9</option>
                <option value={10}>Class 10</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="studentLangSelect"
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1"
              >
                <Globe className="w-3 h-3" /> Language
              </label>
              <select
                id="studentLangSelect"
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-2 text-xs font-bold text-zinc-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
              </select>
            </div>
          </div>

          {/* Primary Action: Sign in with Google */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white font-bold py-4 px-6 rounded-2xl shadow-sm transition-all min-h-[56px] flex items-center justify-center gap-3.5 text-sm sm:text-base cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                statusMessage.type === "error"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                  : statusMessage.type === "info"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
                  : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
              }`}
            >
              {statusMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </motion.div>
          )}

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>1-Click Safe Auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Auto-save Progress</span>
            </div>
          </div>

          {/* Teacher & Staff Portal Link */}
          <div className="pt-2 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Are you a Teacher or School Administrator?{" "}
              <Link
                href="/login"
                className="font-bold text-zinc-900 dark:text-white underline hover:no-underline ml-1"
              >
                Staff Portal →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
