"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav, type NavTab } from "@/components/MobileBottomNav";
import { StudentHero } from "@/components/StudentHero";
import { LearningFlowController } from "@/components/LearningFlowController";
import { VocabularyGlossarySection } from "@/components/VocabularyGlossarySection";
import { DownloadsSection } from "@/components/DownloadsSection";
import { OfflineDownloadManager } from "@/components/OfflineDownloadManager";
import { PwaSyncBanner } from "@/components/PwaSyncBanner";
import { isSessionActive } from "@/lib/authSession";
import {
  initLocalStore,
  db,
} from "@/lib/offlineStore";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Globe,
  Award,
  Download,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  // Section refs for smooth mobile tab scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const lessonsRef = useRef<HTMLDivElement>(null);
  const glossaryRef = useRef<HTMLDivElement>(null);
  const downloadsRef = useRef<HTMLDivElement>(null);

  // Initialize store on mount
  useEffect(() => {
    initLocalStore();
  }, []);

  // Live query lesson bundles from local Dexie database
  const bundles = useLiveQuery(() => db.lessonBundles.toArray(), [], []);

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "lessons") {
      lessonsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "glossary") {
      glossaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "downloads") {
      downloadsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Adaptive Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Responsive Container */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-20 md:mb-6 space-y-6 sm:space-y-8"
      >
        {/* Student Profile Hero Card */}
        <div ref={heroRef}>
          <StudentHero />
        </div>

        {/* 8-Step Core Student Learning Flow & Chapter Selector */}
        <section ref={lessonsRef} className="space-y-3.5 sm:space-y-4 pt-1">
          <LearningFlowController
            bundles={bundles || []}
            initialClass={7}
          />
        </section>

        {/* Offline Content Download & Storage Manager */}
        <div ref={downloadsRef} className="space-y-6">
          <OfflineDownloadManager />
          <DownloadsSection />
        </div>

        {/* Trilingual Conceptual Glossary Section */}
        <div ref={glossaryRef}>
          <VocabularyGlossarySection />
        </div>

        {/* Platform Capabilities & Core Features Card */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 sm:space-y-6"
        >
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white">
            <Layers className="w-4 h-4" /> Core Learning Capabilities
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Feature 1: 8-Step Learning Flow */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 transition-shadow hover:shadow-xs"
            >
              <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                8-Step Pedagogical Engine
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Structured workflow: Select, Learn, Explore, Practice, Experiment, Mission, Assess, and Reward.
              </p>
            </motion.div>

            {/* Feature 2: Trilingual Audio & Glossary */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 transition-shadow hover:shadow-xs"
            >
              <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Trilingual Audio &amp; Vocab
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Switch instantly between English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ) with offline voice narration and standard definitions.
              </p>
            </motion.div>

            {/* Feature 3: Offline-First Reliability */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 transition-shadow hover:shadow-xs"
            >
              <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
                <Download className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Zero-Data Device Downloads
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Download printable markdown summaries directly to phone storage for zero battery/screen drain offline study.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </motion.main>

      {/* PWA Background Sync Banner */}
      <PwaSyncBanner />

      {/* Mobile Sticky Bottom Navigation (< 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}
