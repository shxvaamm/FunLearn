"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Users,
  Download,
  Search,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Flame,
  FileSpreadsheet,
  Printer,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentScoreRecord {
  id: string;
  name: string;
  rollNo: string;
  classLevel: number;
  physicsScore: number;
  mathScore: number;
  chemScore: number;
  bioScore: number;
  streakDays: number;
  totalXp: number;
  weakTopic?: string;
  weakScore?: number;
}

// ─── Mock Data (offline/demo fallback) ────────────────────────────────────────

const MOCK_STUDENTS: StudentScoreRecord[] = [
  {
    id: "s-101",
    name: "Aarav Patel",
    rollNo: "01",
    classLevel: 7,
    physicsScore: 92,
    mathScore: 88,
    chemScore: 82,
    bioScore: 94,
    streakDays: 6,
    totalXp: 520,
  },
  {
    id: "s-102",
    name: "Priya Nayak",
    rollNo: "02",
    classLevel: 7,
    physicsScore: 88,
    mathScore: 92,
    chemScore: 85,
    bioScore: 90,
    streakDays: 7,
    totalXp: 580,
  },
  {
    id: "s-103",
    name: "Rahul Das",
    rollNo: "03",
    classLevel: 7,
    physicsScore: 52,
    mathScore: 74,
    chemScore: 68,
    bioScore: 62,
    streakDays: 2,
    totalXp: 240,
    weakTopic: "Force & Friction on Mud Roads",
    weakScore: 52,
  },
  {
    id: "s-104",
    name: "Ananya Jena",
    rollNo: "04",
    classLevel: 7,
    physicsScore: 76,
    mathScore: 70,
    chemScore: 44,
    bioScore: 65,
    streakDays: 1,
    totalXp: 210,
    weakTopic: "Chemical Equations & Indicators",
    weakScore: 44,
  },
  {
    id: "s-105",
    name: "Vikram Mohanty",
    rollNo: "05",
    classLevel: 7,
    physicsScore: 80,
    mathScore: 55,
    chemScore: 78,
    bioScore: 72,
    streakDays: 3,
    totalXp: 310,
    weakTopic: "Fractions & Perimeter Optimization",
    weakScore: 55,
  },
];

// ─── Helper: derive subject scores from chapter_progress rows ─────────────────

function deriveScores(progressRows: any[]): Partial<StudentScoreRecord> {
  const subjectMap: Record<string, number[]> = {
    Physics: [],
    Mathematics: [],
    Chemistry: [],
    Biology: [],
  };

  for (const row of progressRows) {
    const subj = row.subject as string;
    if (subjectMap[subj] !== undefined) {
      subjectMap[subj].push(row.score ?? 0);
    }
  }

  const avg = (arr: number[]) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  const physicsScore = avg(subjectMap["Physics"]);
  const mathScore = avg(subjectMap["Mathematics"]);
  const chemScore = avg(subjectMap["Chemistry"]);
  const bioScore = avg(subjectMap["Biology"]);

  // Compute weak topic
  const subjectScores = [
    { label: "Physics & Electricity", score: physicsScore },
    { label: "Mathematics & Fractions", score: mathScore },
    { label: "Chemistry & pH", score: chemScore },
    { label: "Biology & Photosynthesis", score: bioScore },
  ];
  const weakest = subjectScores.sort((a, b) => a.score - b.score)[0];

  return {
    physicsScore,
    mathScore,
    chemScore,
    bioScore,
    weakTopic: weakest.score < 60 ? weakest.label : undefined,
    weakScore: weakest.score < 60 ? weakest.score : undefined,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const { user, profile: teacherProfile } = useAuth();
  const [selectedClass, setSelectedClass] = useState<number>(7);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [students, setStudents] = useState<StudentScoreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Fetch real student data from Supabase ─────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    if (!isSupabaseConfigured || !user) {
      // Offline/demo mode
      setStudents(MOCK_STUDENTS);
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all student profiles linked to this teacher
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, student_name, class_level, total_xp, streak_days")
        .eq("teacher_id", user.id)
        .eq("role", "student")
        .order("student_name");

      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        // No linked students found — fall back to demo
        setStudents(MOCK_STUDENTS);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      // Fetch chapter progress for all linked students in one query
      const studentIds = profilesData.map((p) => p.user_id);
      const { data: progressData, error: progressError } = await supabase
        .from("chapter_progress")
        .select("user_id, subject, score")
        .in("user_id", studentIds);

      if (progressError) throw progressError;

      // Build student records
      const records: StudentScoreRecord[] = profilesData.map((p, idx) => {
        const studentProgress = (progressData ?? []).filter(
          (row) => row.user_id === p.user_id
        );
        const scores = deriveScores(studentProgress);

        return {
          id: p.user_id,
          name: p.student_name,
          rollNo: String(idx + 1).padStart(2, "0"),
          classLevel: p.class_level,
          streakDays: p.streak_days ?? 0,
          totalXp: p.total_xp ?? 0,
          physicsScore: scores.physicsScore ?? 0,
          mathScore: scores.mathScore ?? 0,
          chemScore: scores.chemScore ?? 0,
          bioScore: scores.bioScore ?? 0,
          weakTopic: scores.weakTopic,
          weakScore: scores.weakScore,
        };
      });

      setStudents(records);
      setIsDemoMode(false);
    } catch (err: any) {
      console.error("[TeacherDashboard] Fetch error:", err);
      setFetchError(err?.message || "Failed to load student data.");
      // Graceful fallback to mock
      setStudents(MOCK_STUDENTS);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ── Filtered + derived stats ──────────────────────────────────────────────
  const filteredStudents = students.filter((s) => {
    const matchesClass = s.classLevel === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const weakStudents = filteredStudents.filter(
    (s) => s.weakScore !== undefined && s.weakScore < 60
  );

  const avg = (key: keyof StudentScoreRecord) =>
    Math.round(
      filteredStudents.reduce((acc, s) => acc + (s[key] as number), 0) /
        (filteredStudents.length || 1)
    );

  const avgPhysics = avg("physicsScore");
  const avgMath = avg("mathScore");
  const avgChem = avg("chemScore");
  const avgBio = avg("bioScore");

  // ── Export CSV ─────────────────────────────────────────────────────────────
  const handleExportCsv = () => {
    const headers =
      "RollNo,StudentName,Class,PhysicsScore,MathScore,ChemistryScore,BiologyScore,StreakDays,TotalXP,NeedsAttention\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.rollNo}","${s.name}",Class ${s.classLevel},${s.physicsScore}%,${s.mathScore}%,${s.chemScore}%,${s.bioScore}%,${s.streakDays} Days,${s.totalXp} XP,"${s.weakTopic || "On Track"}"`
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const a = document.createElement("a");
    a.setAttribute("href", csvContent);
    a.setAttribute(
      "download",
      `Class_${selectedClass}_STEM_Performance_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-24 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 shrink-0 text-zinc-500" />
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Demo Mode — Showing sample student data.{" "}
              {fetchError && (
                <span className="text-red-600 dark:text-red-400 font-normal">
                  ({fetchError})
                </span>
              )}{" "}
              Connect Supabase and link students to a teacher account to see real data.
            </p>
            <button
              type="button"
              onClick={fetchStudents}
              className="ml-auto p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        )}

        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Student Platform</span>
              </Link>
              <span className="text-zinc-400">•</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                Teacher Analytics
              </span>
              {!isDemoMode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                  Live
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Rural School STEM Competency Dashboard
            </h1>
            <p className="text-xs text-zinc-500">
              {teacherProfile?.villageSchoolName ||
                "Govt. Upper Primary School, Pipili"}{" "}
              • Offline-first low-bandwidth reporting
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => window.print()}
              className="min-h-[40px] px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleExportCsv}
              className="min-h-[40px] px-4 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 shrink-0">
              Class:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[6, 7, 8, 9, 10].map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setSelectedClass(c)}
                  className={`min-h-[36px] px-3.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    selectedClass === c
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Class {c}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>
        </motion.div>

        {/* Subject Averages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Physics & Electricity", score: avgPhysics },
            { label: "Maths & Fractions", score: avgMath },
            { label: "Chemistry & pH", score: avgChem },
            { label: "Biology & Photosynthesis", score: avgBio },
          ].map(({ label, score }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 + idx * 0.04 }}
              whileHover={{ y: -2 }}
              className="p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs text-center space-y-1"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div
                className={`text-2xl sm:text-3xl font-black font-mono ${
                  score < 60
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-900 dark:text-white"
                }`}
              >
                {score}%
              </div>
              <div className="text-[11px] text-zinc-500 font-semibold">Avg Competency</div>
            </motion.div>
          ))}
        </div>

        {/* Weak Students Heatmap */}
        {weakStudents.length > 0 && (
          <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-red-600 dark:border-red-500 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-red-600 dark:text-red-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>
                Needs Attention Heatmap — {weakStudents.length} student
                {weakStudents.length > 1 ? "s" : ""} below 60%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {weakStudents.map((ws) => (
                <div
                  key={ws.id}
                  className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-900 dark:text-red-200">
                      {ws.name} (Roll #{ws.rollNo})
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600 text-white font-black">
                      {ws.weakScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-red-800 dark:text-red-300 leading-snug">
                    Weak Topic: <strong>{ws.weakTopic}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                Class {selectedClass} Performance ({filteredStudents.length} Students)
              </span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Academic Year 2026</span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">
              No students found for Class {selectedClass}
              {searchQuery ? ` matching "${searchQuery}"` : ""}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Roll #</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5 text-center">Physics</th>
                    <th className="p-3.5 text-center">Maths</th>
                    <th className="p-3.5 text-center">Chemistry</th>
                    <th className="p-3.5 text-center">Biology</th>
                    <th className="p-3.5 text-center">Streak</th>
                    <th className="p-3.5 text-center">XP</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {filteredStudents.map((student) => {
                    const hasWeak = student.weakScore !== undefined && student.weakScore < 60;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="p-3.5 font-mono font-bold text-zinc-500">
                          #{student.rollNo}
                        </td>
                        <td className="p-3.5 font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                          {student.name}
                        </td>
                        {(
                          [
                            student.physicsScore,
                            student.mathScore,
                            student.chemScore,
                            student.bioScore,
                          ] as number[]
                        ).map((score, i) => (
                          <td key={i} className="p-3.5 text-center font-mono font-bold">
                            <span className={score < 60 ? "text-red-600 dark:text-red-400 underline" : ""}>
                              {score}%
                            </span>
                          </td>
                        ))}
                        <td className="p-3.5 text-center font-mono">
                          <span className="inline-flex items-center gap-1 font-bold">
                            <Flame className="w-3 h-3 text-zinc-900 dark:text-white" />
                            {student.streakDays}d
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold">
                          <span className="inline-flex items-center gap-0.5">
                            <Zap className="w-3 h-3 text-zinc-900 dark:text-white" />
                            {student.totalXp}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {hasWeak ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 border border-red-400 dark:border-red-600 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> Needs Practice
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                              <CheckCircle2 className="w-3 h-3 text-zinc-500" /> On Track
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

