"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
  Mail,
  KeyRound,
  Wifi,
  WifiOff,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  updateLocalStudentProfile,
  DEFAULT_USER_ID,
  type SupportedLanguage,
} from "@/lib/offlineStore";

type UserRole = "student" | "teacher" | "admin";

async function handleOfflineStudentLogin(
  studentName: string,
  classLevel: number,
  preferredLang: SupportedLanguage
): Promise<void> {
  await updateLocalStudentProfile({
    userId: DEFAULT_USER_ID,
    studentName: studentName || "Demo Student",
    classLevel: Number(classLevel),
    preferredLang,
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");

  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState(!isSupabaseConfigured ? "Aarav Patel" : "");
  const [classLevel, setClassLevel] = useState<number>(7);
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>("hi");
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState("");

  const [email, setEmail] = useState(!isSupabaseConfigured ? "teacher@school.edu" : "");
  const [password, setPassword] = useState(!isSupabaseConfigured ? "demo-password" : "");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleStudentRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your name to continue." });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);

    if (!isSupabaseConfigured) {
      try {
        await handleOfflineStudentLogin(studentName, classLevel, preferredLang);
        setStatusMessage({ type: "success", text: `Welcome, ${studentName}! Loading STEM chapters...` });
        setTimeout(() => router.push("/"), 700);
      } catch {
        setStatusMessage({ type: "error", text: "Could not start offline session." });
        setIsLoading(false);
      }
      return;
    }

    if (!studentEmail.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your email address." });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: studentEmail,
        options: {
          shouldCreateUser: true,
          data: { student_name: studentName, class_level: classLevel, preferred_lang: preferredLang, role: "student" },
        },
      });
      if (error) throw error;
      setOtpSent(true);
      setStatusMessage({ type: "info", text: `OTP sent to ${studentEmail}. Check your inbox.` });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err?.message || "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email: studentEmail, token: otpToken, type: "email" });
      if (error) throw error;
      const userId = data.user?.id;
      if (!userId) throw new Error("No user returned after OTP verification");
      await supabase.from("profiles").upsert(
        { user_id: userId, student_name: studentName || "Student", class_level: classLevel, preferred_lang: preferredLang, role: "student" },
        { onConflict: "user_id" }
      );
      await updateLocalStudentProfile({ userId, studentName: studentName || "Student", classLevel, preferredLang });
      setStatusMessage({ type: "success", text: "Verified! Loading STEM chapters..." });
      setTimeout(() => router.push("/"), 700);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err?.message || "Invalid OTP. Please check your email and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    if (!isSupabaseConfigured) {
      setStatusMessage({ type: "success", text: "Demo mode: Redirecting to teacher dashboard..." });
      setTimeout(() => router.push("/teacher"), 700);
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const userId = data.user?.id;
      if (!userId) throw new Error("Authentication failed — no user returned.");
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("role").eq("user_id", userId).single();
      if (profileError || !profileData) throw new Error("Your account profile was not found. Please contact your school administrator.");
      const userRole = profileData.role as string;
      if (userRole !== "teacher" && userRole !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Access denied. This account is registered as a student. Please use the Student tab.");
      }
      setStatusMessage({ type: "success", text: `Welcome! Redirecting to ${userRole === "admin" ? "Admin" : "Teacher"} Dashboard...` });
      setTimeout(() => router.push("/teacher"), 700);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err?.message || "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = role === "student" ? (otpSent ? handleStudentVerifyOtp : handleStudentRequestOtp) : handleStaffLogin;

  const submitLabel = isLoading ? "Please wait..."
    : role === "student"
      ? otpSent ? "Verify OTP & Enter Portal" : isSupabaseConfigured ? "Send Login Code →" : "Enter Learning Portal →"
      : role === "teacher" ? "Access Teacher Dashboard →" : "Enter Admin Console →";

  const tabIcons: Record<UserRole, React.ReactNode> = {
    student: <GraduationCap className="w-3.5 h-3.5" />,
    teacher: <Users className="w-3.5 h-3.5" />,
    admin: <ShieldCheck className="w-3.5 h-3.5" />,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col p-4 sm:p-6 transition-colors">
      {/* Top Strip */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </Link>
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">FunLearn v2.0</span>
      </div>

      {/* Center Content */}
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center py-2">

        {/* Demo Mode Banner */}
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 rounded-2xl flex items-start gap-3"
          >
            <WifiOff className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">Demo / Offline Mode</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Forms are pre-filled. Click <strong className="text-white">Quick Enter</strong> to jump straight into the app.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={async () => {
                setIsLoading(true);
                if (role === "student") {
                  await handleOfflineStudentLogin(studentName || "Aarav Patel", classLevel, preferredLang);
                  router.push("/");
                } else {
                  router.push("/teacher");
                }
              }}
              className="shrink-0 flex items-center gap-1.5 bg-white text-zinc-900 font-bold text-xs px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Quick Enter
            </motion.button>
          </motion.div>
        )}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden"
        >

          {/* Branding */}
          <div className="px-6 pt-7 pb-5 text-center border-b border-zinc-100 dark:border-zinc-800">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              className="w-11 h-11 bg-zinc-900 dark:bg-white rounded-xl mx-auto flex items-center justify-center mb-3 shadow-sm"
            >
              <GraduationCap className="w-5 h-5 text-white dark:text-zinc-900" />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">FunLearn Portal</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Rural STEM Learning &amp; Analytics Platform</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Role Tabs */}
            <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
              {(["student", "teacher", "admin"] as UserRole[]).map((r) => (
                <motion.button
                  key={r}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => { setRole(r); setOtpSent(false); setStatusMessage(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 capitalize cursor-pointer ${
                    role === r
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {tabIcons[r]}
                  {r}
                </motion.button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* STUDENT — Step 1 */}
              {role === "student" && !otpSent && (
                <>
                  <div>
                    <label htmlFor="studentName" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="studentName"
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aarav Patel"
                      className="w-full border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm min-h-[48px] transition-all outline-none"
                    />
                  </div>

                  {isSupabaseConfigured && (
                    <div>
                      <label htmlFor="studentEmail" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                        Email Address <span className="text-zinc-400 font-normal normal-case">(OTP will be sent here)</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          id="studentEmail"
                          type="email"
                          required
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full pl-10 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 min-h-[48px] transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="classLevel" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">Class Grade</label>
                      <select
                        id="classLevel"
                        value={classLevel}
                        onChange={(e) => setClassLevel(Number(e.target.value))}
                        className="w-full border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-3 py-3 text-zinc-900 dark:text-zinc-100 text-sm min-h-[48px] font-medium transition-all outline-none"
                      >
                        {[6, 7, 8, 9, 10].map((c) => (
                          <option key={c} value={c}>Class {c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="preferredLang" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">Language</label>
                      <select
                        id="preferredLang"
                        value={preferredLang}
                        onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
                        className="w-full border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-3 py-3 text-zinc-900 dark:text-zinc-100 text-sm min-h-[48px] font-medium transition-all outline-none"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="or">ଓଡ଼ିଆ</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      Looking for 1-Click Student Sign In?
                    </span>
                    <Link
                      href="/login/student"
                      className="text-xs font-bold text-zinc-900 dark:text-white underline hover:no-underline shrink-0 flex items-center gap-1"
                    >
                      Sign In with Google →
                    </Link>
                  </div>
                </>
              )}

              {/* STUDENT — OTP Step */}
              {role === "student" && otpSent && (
                <>
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    OTP sent to <strong className="text-zinc-900 dark:text-white">{studentEmail}</strong>. Enter the 6-digit code below.
                  </div>
                  <div>
                    <label htmlFor="otpToken" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">6-Digit OTP Code</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="otpToken"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ""))}
                        placeholder="_ _ _ _ _ _"
                        className="w-full pl-10 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xl font-mono tracking-[0.5em] text-center min-h-[54px] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => { setOtpSent(false); setOtpToken(""); setStatusMessage(null); }} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline transition-colors">
                    ← Use a different email
                  </button>
                </>
              )}

              {/* TEACHER FORM */}
              {role === "teacher" && (
                <>
                  <div>
                    <label htmlFor="teacherEmail" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      School Staff Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="teacherEmail"
                        type="email"
                        required={isSupabaseConfigured}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="teacher@school.edu"
                        className="w-full pl-10 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 min-h-[48px] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="teacherPassword" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="teacherPassword"
                        type={showPassword ? "text" : "password"}
                        required={isSupabaseConfigured}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-11 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 min-h-[48px] transition-all outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ADMIN FORM */}
              {role === "admin" && (
                <>
                  <div>
                    <label htmlFor="adminEmail" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      District Admin Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="adminEmail"
                        type="email"
                        required={isSupabaseConfigured}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@district.gov.in"
                        className="w-full pl-10 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 min-h-[48px] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="adminPassword" className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Admin Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        required={isSupabaseConfigured}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-11 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-900/10 bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 min-h-[48px] transition-all outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    Role verified server-side from profiles table — no hardcoded admin keys.
                  </p>
                </>
              )}

              {/* Status Message */}
              {statusMessage && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold border flex items-start gap-2.5 ${
                  statusMessage.type === "error"
                    ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                    : statusMessage.type === "success"
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}>
                  {statusMessage.type === "error" ? (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{statusMessage.text}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3.5 px-4 rounded-xl shadow-sm active:scale-[0.98] transition-all min-h-[52px] flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            </form>

            {/* Footer hint */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                {isSupabaseConfigured ? (
                  <><Wifi className="w-3 h-3 shrink-0" /><span>Secured by Supabase Auth — no passwords stored client-side.</span></>
                ) : (
                  <><Lock className="w-3 h-3 shrink-0" /><span>Offline login — data stays on this device only.</span></>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-zinc-400 py-3">
        FunLearn Rural STEM Education Initiative &bull; Low-Bandwidth Architecture
      </div>
    </div>
  );
}
