"use client";

import React from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TeacherError({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-5 text-center">
        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Dashboard Error
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Could not load the Teacher Analytics Dashboard. Check your connection and try again.
          </p>
          {error?.message && (
            <p className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-2 rounded-lg break-all text-left border border-zinc-200 dark:border-zinc-700">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Student Platform
          </Link>
          <button
            type="button"
            onClick={reset}
            className="flex-1 py-3 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-bold hover:bg-black dark:hover:bg-zinc-100 transition-colors inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
