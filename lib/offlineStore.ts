import Dexie, { type Table } from "dexie";

export type SupportedLanguage = "en" | "hi" | "or";

export type SubjectCategory = "Physics" | "Chemistry" | "Mathematics" | "Biology";

export interface StudentProfile {
  id?: string;
  userId: string;
  studentName: string;
  classLevel: number;
  preferredLang: SupportedLanguage;
  totalXp: number;
  levelTitle: string;
  streakDays: number;
  teacherId?: string;
  villageSchoolName?: string;
  avatarId?: string;
  lastActiveDate?: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question_en: string;
  question_hi: string;
  question_or: string;
  options_en: string[];
  options_hi: string[];
  options_or: string[];
  correctAnswerIndex: number;
  explanation_en: string;
  explanation_hi: string;
  explanation_or: string;
  vocabKey?: string;
}

export interface LessonBundle {
  id: string;
  slug: string;
  subject: SubjectCategory;
  classLevel: number;
  estimatedMinutes: number;
  xpReward: number;
  title_en: string;
  title_hi: string;
  title_or: string;
  description_en: string;
  description_hi: string;
  description_or: string;
  content_en: string;
  content_hi: string;
  content_or: string;
  exploreContent_en?: string;
  exploreContent_hi?: string;
  exploreContent_or?: string;
  experimentTitle_en?: string;
  experimentTitle_hi?: string;
  experimentTitle_or?: string;
  experimentSteps_en?: string[];
  experimentSteps_hi?: string[];
  experimentSteps_or?: string[];
  keyVocabKeys: string[];
  questions: QuizQuestion[];
  isCachedLocally: boolean;
  sizeKb: number;
  cachedAt?: string;
}

export interface ChapterProgressRecord {
  id?: string;
  userId: string;
  subject: string;
  chapterSlug: string;
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed";
  score: number;
  lastAccessedAt: string;
}

export type SyncActionType =
  | "MISSION_LOG"
  | "XP_UPDATE"
  | "PROGRESS_UPDATE"
  | "PROFILE_UPDATE";

export interface PendingSyncItem {
  id: string; // clientMutationId (UUID)
  userId: string;
  actionType: SyncActionType;
  payload: Record<string, any>;
  timestamp: string;
  retryCount: number;
  status: "pending" | "syncing" | "failed";
  lastError?: string;
}

export interface DownloadedChapterPayload {
  slug: string;
  subject: SubjectCategory;
  classLevel: number;
  title: string;
  sizeKb: number;
  downloadedAt: string;
  bundleData: LessonBundle;
}

export class FunLearnDatabase extends Dexie {
  profiles!: Table<StudentProfile, string>; // key: userId
  lessonBundles!: Table<LessonBundle, string>; // key: slug
  downloadedChapters!: Table<DownloadedChapterPayload, string>; // key: slug
  chapterProgress!: Table<ChapterProgressRecord, number>; // auto-inc ID
  pendingSyncQueue!: Table<PendingSyncItem, string>; // key: id

  constructor() {
    super("FunLearnOfflineDB");
    this.version(3).stores({
      profiles: "userId, studentName, classLevel, totalXp",
      lessonBundles: "slug, subject, classLevel",
      downloadedChapters: "slug, subject, classLevel, downloadedAt",
      chapterProgress: "++id, [userId+subject+chapterSlug], userId, chapterSlug, status",
      pendingSyncQueue: "id, userId, actionType, timestamp, status",
    });
  }
}

export const db = new FunLearnDatabase();

// XP Level Title Helper
export function getLevelTitle(xp: number, lang: SupportedLanguage = "en"): string {
  if (xp < 150) {
    return lang === "hi"
      ? "ज्ञान आरंभी (Novice Explorer)"
      : lang === "or"
      ? "ଜ୍ଞାନ ଆରମ୍ଭୀ (Novice Explorer)"
      : "Novice Explorer";
  } else if (xp < 400) {
    return lang === "hi"
      ? "खोजी शिक्षार्थी (Curious Seeker)"
      : lang === "or"
      ? "ଖୋଜି ଶିକ୍ଷାର୍ଥୀ (Curious Seeker)"
      : "Curious Seeker";
  } else if (xp < 800) {
    return lang === "hi"
      ? "ग्राम विज्ञानी (Village Scientist)"
      : lang === "or"
      ? "ଗ୍ରାମ ବିଜ୍ଞାନୀ (Village Scientist)"
      : "Village Scientist";
  } else if (xp < 1500) {
    return lang === "hi"
      ? "प्रायोगिक गुरु (Experiment Master)"
      : lang === "or"
      ? "ପ୍ରାୟୋଗିକ ଗୁରୁ (Experiment Master)"
      : "Experiment Master";
  } else if (xp < 3000) {
    return lang === "hi"
      ? "महान अन्वेषक (Grand Researcher)"
      : lang === "or"
      ? "ମହାନ୍ ଅନ୍ୱେଷକ (Grand Researcher)"
      : "Grand Researcher";
  } else {
    return lang === "hi"
      ? "ज्ञान शिरोमणि (Village Laureate)"
      : lang === "or"
      ? "ଜ୍ଞାନ ଶିରୋମଣି (Village Laureate)"
      : "Village Laureate";
  }
}

export const DEFAULT_USER_ID = "rural-student-aarav-001";

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  userId: DEFAULT_USER_ID,
  studentName: "Aarav Patel",
  classLevel: 7,
  preferredLang: "hi",
  totalXp: 380,
  levelTitle: "खोजी शिक्षार्थी (Curious Seeker)",
  streakDays: 4,
  villageSchoolName: "Govt. Upper Primary School, Pipili",
  avatarId: "sprout",
  lastActiveDate: new Date().toISOString().split("T")[0],
  updatedAt: new Date().toISOString(),
};

import { MOCK_LESSON_BUNDLES } from "./mockData";

export const INITIAL_LESSON_BUNDLES: LessonBundle[] = MOCK_LESSON_BUNDLES;


export async function initLocalStore(): Promise<void> {
  try {
    const profileCount = await db.profiles.count();
    if (profileCount === 0) {
      await db.profiles.put(INITIAL_STUDENT_PROFILE);
    }

    // Refresh and sync bundles
    await db.lessonBundles.bulkPut(INITIAL_LESSON_BUNDLES);
  } catch (error) {
    console.error("[offlineStore] Error initializing local Dexie store:", error);
  }
}

export async function loadDemoOfflineAssets(): Promise<number> {
  try {
    await db.lessonBundles.bulkPut(MOCK_LESSON_BUNDLES);
    for (const b of MOCK_LESSON_BUNDLES) {
      await saveChapterToOfflineStorage(b);
    }
    return MOCK_LESSON_BUNDLES.length;
  } catch (err) {
    console.error("[offlineStore] Error loading demo offline assets:", err);
    return 0;
  }
}


export async function getLocalStudentProfile(userId: string = DEFAULT_USER_ID): Promise<StudentProfile | undefined> {
  return await db.profiles.get(userId);
}

export async function updateLocalStudentProfile(profile: Partial<StudentProfile> & { userId: string }): Promise<void> {
  try {
    const existing = await db.profiles.get(profile.userId);
    const totalXp = profile.totalXp !== undefined ? profile.totalXp : (existing?.totalXp ?? 380);
    const preferredLang = profile.preferredLang || existing?.preferredLang || "hi";
    const levelTitle = getLevelTitle(totalXp, preferredLang);

    const merged = {
      ...(existing || {}),
      ...profile,
    };

    const baseProfile: StudentProfile = {
      userId: profile.userId,
      studentName: merged.studentName || "Student",
      classLevel: merged.classLevel || 7,
      preferredLang,
      totalXp,
      levelTitle,
      streakDays: merged.streakDays ?? 4,
      villageSchoolName: merged.villageSchoolName ?? "Govt. School",
      avatarId: merged.avatarId ?? "sprout",
      lastActiveDate: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
    };

    await db.profiles.put(baseProfile);
  } catch (err) {
    console.error("[offlineStore] updateLocalStudentProfile error:", err);
  }
}

export async function addLocalXp(userId: string = DEFAULT_USER_ID, xpToAdd: number): Promise<StudentProfile> {
  let profile = await db.profiles.get(userId);
  if (!profile) {
    profile = { ...INITIAL_STUDENT_PROFILE, userId };
  }

  const newTotalXp = (profile.totalXp || 0) + xpToAdd;
  const newLevelTitle = getLevelTitle(newTotalXp, profile.preferredLang);

  const updatedProfile: StudentProfile = {
    ...profile,
    totalXp: newTotalXp,
    levelTitle: newLevelTitle,
    updatedAt: new Date().toISOString(),
  };

  await db.profiles.put(updatedProfile);
  return updatedProfile;
}

export async function getCachedLessonBundles(): Promise<LessonBundle[]> {
  return await db.lessonBundles.toArray();
}

export async function toggleLessonBundleCache(slug: string, cache: boolean): Promise<LessonBundle | undefined> {
  const bundle = await db.lessonBundles.get(slug);
  if (bundle) {
    bundle.isCachedLocally = cache;
    bundle.cachedAt = cache ? new Date().toISOString() : undefined;
    await db.lessonBundles.put(bundle);
    return bundle;
  }
  return undefined;
}

export async function logCompletedMissionLocally(params: {
  userId: string;
  missionSlug: string;
  score: number;
  xpEarned: number;
}): Promise<void> {
  const { userId, missionSlug, score, xpEarned } = params;
  await addLocalXp(userId, xpEarned);

  await db.chapterProgress
    .where("[userId+subject+chapterSlug]")
    .equals([userId, "Science", missionSlug])
    .modify({
      progressPercent: 100,
      status: "completed",
      score,
      lastAccessedAt: new Date().toISOString(),
    })
    .catch(async () => {
      await db.chapterProgress.put({
        userId,
        subject: "Science",
        chapterSlug: missionSlug,
        progressPercent: 100,
        status: "completed",
        score,
        lastAccessedAt: new Date().toISOString(),
      });
    });
}

export async function getPendingSyncQueue(): Promise<PendingSyncItem[]> {
  return await db.pendingSyncQueue.orderBy("timestamp").toArray();
}

export async function removePendingSyncItem(id: string): Promise<void> {
  await db.pendingSyncQueue.delete(id);
}

export async function markSyncItemFailed(id: string, errorMessage: string): Promise<void> {
  const item = await db.pendingSyncQueue.get(id);
  if (item) {
    item.retryCount += 1;
    item.status = "failed";
    item.lastError = errorMessage;
    await db.pendingSyncQueue.put(item);
  }
}

export async function saveChapterToOfflineStorage(bundle: LessonBundle): Promise<void> {
  const payload: DownloadedChapterPayload = {
    slug: bundle.slug,
    subject: bundle.subject,
    classLevel: bundle.classLevel,
    title: bundle.title_en,
    sizeKb: bundle.sizeKb || 1200,
    downloadedAt: new Date().toISOString(),
    bundleData: bundle,
  };
  await db.downloadedChapters.put(payload);

  // Mark in lessonBundles too
  bundle.isCachedLocally = true;
  bundle.cachedAt = new Date().toISOString();
  await db.lessonBundles.put(bundle);
}

export async function deleteChapterFromOfflineStorage(slug: string): Promise<void> {
  await db.downloadedChapters.delete(slug);
  const bundle = await db.lessonBundles.get(slug);
  if (bundle) {
    bundle.isCachedLocally = false;
    bundle.cachedAt = undefined;
    await db.lessonBundles.put(bundle);
  }
}

export async function clearAllOfflineStorage(): Promise<void> {
  await db.downloadedChapters.clear();
  const allBundles = await db.lessonBundles.toArray();
  for (const b of allBundles) {
    b.isCachedLocally = false;
    b.cachedAt = undefined;
    await db.lessonBundles.put(b);
  }
}

export async function getDownloadedChaptersList(): Promise<DownloadedChapterPayload[]> {
  return await db.downloadedChapters.toArray();
}

export async function getTotalOfflineStorageUsedKb(): Promise<number> {
  const chapters = await db.downloadedChapters.toArray();
  return chapters.reduce((acc, c) => acc + (c.sizeKb || 0), 0);
}


