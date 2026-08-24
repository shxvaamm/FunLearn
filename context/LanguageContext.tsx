"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { SupportedLanguage } from "@/lib/offlineStore";
import { updateLocalStudentProfile, DEFAULT_USER_ID } from "@/lib/offlineStore";

export interface VocabItem {
  id: string;
  en: string;
  hi: string;
  or: string;
  phonetics?: {
    hi?: string;
    or?: string;
  };
  def_en: string;
  def_hi: string;
  def_or: string;
  category: "Physics" | "Biology" | "Math" | "Environment" | "General";
}

// Educational Glossary with rich bilingual and trilingual representations
export const VOCAB_DICTIONARY: Record<string, VocabItem> = {
  force: {
    id: "force",
    en: "Force",
    hi: "बल",
    or: "ବଳ",
    phonetics: { hi: "Bal", or: "Bala" },
    def_en: "A push or pull upon an object resulting from its interaction with another object.",
    def_hi: "किसी वस्तु पर लगने वाला धक्का या खिंचाव जो उसकी गति या दिशा को बदल सकता है।",
    def_or: "କୌଣସି ବସ୍ତୁ ଉପରେ ପ୍ରୟୋଗ କରାଯାଉଥିବା ଠେଲା କିମ୍ବା ଟଣା ଯାହା ତାର ସ୍ଥିତି ବଦଳାଇପାରେ।",
    category: "Physics",
  },
  photosynthesis: {
    id: "photosynthesis",
    en: "Photosynthesis",
    hi: "प्रकाश संश्लेषण",
    or: "ଆଲୋକ ସଂଶ୍ଳେଷଣ",
    phonetics: { hi: "Prakash Sanshleshan", or: "Aloka Sansleshana" },
    def_en: "The biological process by which green plants use sunlight to synthesize nutrients from CO2 and water.",
    def_hi: "हरे पौधों द्वारा सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड से भोजन बनाने की प्रक्रिया।",
    def_or: "ସବୁଜ ଉଦ୍ଭିଦଗୁଡ଼ିକ ସୂର୍ଯ୍ୟାଲୋକ, ଜଳ ଓ ଅଙ୍ଗାରକାମ୍ଳ ବ୍ୟବହାର କରି ଖାଦ୍ୟ ପ୍ରସ୍ତୁତ କରିବା ପ୍ରକ୍ରିୟା।",
    category: "Biology",
  },
  chlorophyll: {
    id: "chlorophyll",
    en: "Chlorophyll",
    hi: "पर्णहरित / क्लोरोफिल",
    or: "ହରିତ୍‌କଣା / କ୍ଲୋରୋଫିଲ",
    phonetics: { hi: "Chlorophyll", or: "Haritakana" },
    def_en: "A green pigment present in all green plants responsible for the absorption of light to provide energy for photosynthesis.",
    def_hi: "पत्तियों में मौजूद हरा रंगद्रव्य जो सूर्य की रोशनी को सोखने में मदद करता है।",
    def_or: "ଉଦ୍ଭିଦ ପତ୍ରରେ ଥିବା ସବୁଜ ରଙ୍ଗର କଣିକା ଯାହା ସୂର୍ଯ୍ୟକିରଣ ଶୋଷଣ କରେ।",
    category: "Biology",
  },
  oxygen: {
    id: "oxygen",
    en: "Oxygen",
    hi: "ऑक्सीजन / प्राणवायु",
    or: "ଅମ୍ଳଜାନ / ପ୍ରାଣବାୟୁ",
    phonetics: { hi: "Oxygen", or: "Amlajana" },
    def_en: "A colorless, odorless gas essential for the respiration of almost all living organisms.",
    def_hi: "रंगहीन और गंधहीन गैस जो सभी जीवित प्राणियों के सांस लेने के लिए आवश्यक है।",
    def_or: "ଜୀବଜଗତର ଶ୍ୱାସକ୍ରିୟା ପାଇଁ ଏକ ଅତ୍ୟାବଶ୍ୟକୀୟ ଗ୍ୟାସ।",
    category: "Biology",
  },
  fraction: {
    id: "fraction",
    en: "Fraction",
    hi: "भिन्न",
    or: "ଭଗ୍ନାଂଶ",
    phonetics: { hi: "Bhinn", or: "Bhagnansa" },
    def_en: "A numerical quantity that represents a part of a whole (Numerator / Denominator).",
    def_hi: "एक संख्या जो किसी पूरी वस्तु के एक हिस्से को दर्शाती है (अंश / हर)।",
    def_or: "ଏକ ସଂଖ୍ୟା ଯାହା ଏକ ସମ୍ପୂର୍ଣ୍ଣ ବସ୍ତୁର ଅଂଶ ବା ଭାଗକୁ ଦର୍ଶାଏ (ଲବ / ହର)।",
    category: "Math",
  },
  numerator: {
    id: "numerator",
    en: "Numerator",
    hi: "अंश",
    or: "ଲବ",
    phonetics: { hi: "Ansh", or: "Laba" },
    def_en: "The number above the line in a fraction showing how many parts are taken.",
    def_hi: "भिन्न में रेखा के ऊपर की संख्या जो लिए गए भागों की संख्या बताती है।",
    def_or: "ଭଗ୍ନାଂଶର ଉପରି ଭାଗ ସଂଖ୍ୟା ଯାହା ନିଆଯାଇଥିବା ଭାଗ ଦର୍ଶାଏ।",
    category: "Math",
  },
  denominator: {
    id: "denominator",
    en: "Denominator",
    hi: "हर",
    or: "ହର",
    phonetics: { hi: "Har", or: "Hara" },
    def_en: "The number below the line in a fraction showing the total number of equal parts.",
    def_hi: "भिन्न में रेखा के नीचे की संख्या जो कुल बराबर भागों को दर्शाती है।",
    def_or: "ଭଗ୍ନାଂଶର ତଳ ଭାଗ ସଂଖ୍ୟା ଯାହା ମୋଟ ସମାନ ଭାଗ ଦର୍ଶାଏ।",
    category: "Math",
  },
  gravity: {
    id: "gravity",
    en: "Gravity",
    hi: "गुरुत्वाकर्षण",
    or: "ମାଧ୍ୟାକର୍ଷଣ",
    phonetics: { hi: "Gurutvaakarshan", or: "Madhyakarshana" },
    def_en: "The universal force of attraction acting between all matter.",
    def_hi: "वह आकर्षण बल जिसके द्वारा पृथ्वी सभी वस्तुओं को अपने केंद्र की ओर खींचती है।",
    def_or: "ପୃଥିବୀ ଯେଉଁ ବଳ ଦ୍ୱାରା ପ୍ରତ୍ୟେକ ବସ୍ତୁକୁ ନିଜ କେନ୍ଦ୍ର ଆଡ଼କୁ ଟାଣେ।",
    category: "Physics",
  },
  friction: {
    id: "friction",
    en: "Friction",
    hi: "घर्षण",
    or: "ଘର୍ଷଣ",
    phonetics: { hi: "Gharshan", or: "Gharshana" },
    def_en: "The resistance that one surface or object encounters when moving over another.",
    def_hi: "दो सतहों के बीच संपर्क से उत्पन्न होने वाला प्रतिरोध जो गति को धीमा करता है।",
    def_or: "ଦୁଇଟି ପୃଷ୍ଠ ପରସ୍ପର ସଂସ୍ପର୍ଶରେ ଆସି ଗତି କରିବା ବେଳେ ସୃଷ୍ଟି ହେଉଥିବା ପ୍ରତିରୋଧ।",
    category: "Physics",
  },
  lever: {
    id: "lever",
    en: "Lever",
    hi: "उत्तोलक / लीवर",
    or: "ଉତ୍ତୋଳକ / ଲିଭର",
    phonetics: { hi: "Uttolak", or: "Uttolaka" },
    def_en: "A rigid bar resting on a pivot, used to help move a heavy load with less effort.",
    def_hi: "एक सरल मशीन जिसमें एक छड़ होती है जो आलम्ब पर घूमती है और भारी बोझ उठाने में मदद करती है।",
    def_or: "ଏକ ସରଳ ଯନ୍ତ୍ର ଯାହା କମ୍ ବଳ ପ୍ରୟୋଗ କରି ଭାରୀ ବସ୍ତୁ ଉଠାଇବାରେ ସାହାଯ୍ୟ କରେ।",
    category: "Physics",
  },
  solar_energy: {
    id: "solar_energy",
    en: "Solar Energy",
    hi: "सौर ऊर्जा",
    or: "ସୌର ଶକ୍ତି",
    phonetics: { hi: "Saur Urja", or: "Soura Sakti" },
    def_en: "Radiant light and heat from the Sun that is harnessed using technologies like solar panels.",
    def_hi: "सूर्य से प्राप्त होने वाली ऊर्जा जिसे सोलर पैनल के माध्यम से बिजली में बदला जाता है।",
    def_or: "ସୂର୍ଯ୍ୟଙ୍କଠାରୁ ମିଳୁଥିବା ଶକ୍ତି ଯାହା ବିଦ୍ୟୁତ ଓ ତାପ ଉତ୍ପାଦନରେ ବ୍ୟବହୃତ ହୁଏ।",
    category: "Environment",
  },
};

// UI Translations
export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appName: "FunLearn",
    appTagline: "Gamified Rural Learning — Offline First",
    navHome: "My Dashboard",
    navLessons: "Lesson Bundles",
    navMissions: "Active Missions",
    navGlossary: "Glossary",
    navDownloads: "Downloads",
    navTeacher: "Teacher Dashboard",
    badgeOfflineReady: "Offline Ready",
    badgeLowBandwidth: "Low Bandwidth Optimized",
    xpLabel: "XP Points",
    levelLabel: "Rank / Title",
    streakLabel: "Day Streak",
    classLabel: "Class",
    schoolLabel: "Village School",
    cachedLessonsTitle: "Offline Lesson Bundles",
    cachedLessonsDesc: "Download interactive packs to study without internet connectivity.",
    btnDownloadOffline: "Download Offline Pack",
    btnDownloaded: "Cached on Device",
    btnStartMission: "Start Mission Challenge",
    btnResume: "Resume Learning",
    btnStartLearning: "Start Learning",
    btnSaveNotes: "Save Notes to Device",
    btnListenAudio: "🔊 Listen Audio",
    btnStopAudio: "Stop Audio",
    btnBack: "Back",
    btnContinue: "Continue",
    step1Name: "Select",
    step2Name: "Learn",
    step3Name: "Explore",
    step4Name: "Practice",
    step5Name: "Experiment",
    step6Name: "Mission",
    step7Name: "Assess",
    step8Name: "Reward",
    subjPhysics: "Physics",
    subjChemistry: "Chemistry",
    subjMathematics: "Mathematics",
    subjBiology: "Biology",
    missionCompleted: "Mission Completed!",
    xpAwarded: "XP Earned!",
    statusOnline: "Connected (Online)",
    statusOffline: "Offline Mode (IndexedDB Active)",
    statusSyncing: "Syncing with Cloud...",
    pendingItemsToSync: "Pending mutations in queue",
    btnSyncNow: "Sync Now",
    syncSuccess: "All offline data synced with Supabase successfully!",
    toggleSimulatorOnline: "Simulate Online",
    toggleSimulatorOffline: "Simulate Offline",
    vocabTooltipHint: "Tap/Hover for Trilingual Definition",
    selectLang: "Language",
  },
  hi: {
    appName: "फन-लर्न (FunLearn)",
    appTagline: "ग्रामीण विद्यार्थियों के लिए खेल-खेल में शिक्षा — पूरी तरह ऑफलाइन",
    navHome: "मेरा डैशबोर्ड",
    navLessons: "पाठ्य बंडल",
    navMissions: "सक्रिय मिशन",
    navGlossary: "शब्दावली",
    navDownloads: "डाउनलोड",
    navTeacher: "शिक्षक डैशबोर्ड",
    badgeOfflineReady: "ऑफलाइन तैयार",
    badgeLowBandwidth: "धीमे इंटरनेट के अनुकूल",
    xpLabel: "एक्सपी (XP) अंक",
    levelLabel: "स्तर / उपाधि",
    streakLabel: "दैनिक लय (Streak)",
    classLabel: "कक्षा",
    schoolLabel: "ग्राम विद्यालय",
    cachedLessonsTitle: "ऑफलाइन पाठ्य बंडल",
    cachedLessonsDesc: "बिना इंटरनेट के पढ़ने के लिए पाठों को अपने डिवाइस में सहेजें।",
    btnDownloadOffline: "ऑफलाइन पैक डाउनलोड करें",
    btnDownloaded: "डिवाइस में सहेजा गया",
    btnStartMission: "मिशन चुनौती शुरू करें",
    btnResume: "पढ़ाई जारी रखें",
    btnStartLearning: "पढ़ना शुरू करें",
    btnSaveNotes: "नोट्स सहेजें",
    btnListenAudio: "🔊 ऑडियो सुनें",
    btnStopAudio: "ऑडियो रोकें",
    btnBack: "पीछे जाएं",
    btnContinue: "आगे बढ़ें",
    step1Name: "चुनें",
    step2Name: "सीखें",
    step3Name: "खोजें",
    step4Name: "अभ्यास",
    step5Name: "प्रयोग",
    step6Name: "मिशन",
    step7Name: "मूल्यांकन",
    step8Name: "पुरस्कार",
    subjPhysics: "भौतिक विज्ञान (Physics)",
    subjChemistry: "रसायन विज्ञान (Chemistry)",
    subjMathematics: "गणित (Mathematics)",
    subjBiology: "जीव विज्ञान (Biology)",
    missionCompleted: "मिशन पूरा हुआ!",
    xpAwarded: "एक्सपी अर्जित!",
    statusOnline: "इंटरनेट कनेक्टेड (Online)",
    statusOffline: "ऑफलाइन मोड (IndexedDB सक्रिय)",
    statusSyncing: "क्लाउड से सिंक हो रहा है...",
    pendingItemsToSync: "सिंक होने के लिए लंबित डेटा",
    btnSyncNow: "अभी सिंक करें",
    syncSuccess: "सभी ऑफलाइन डेटा सफलतापूर्वक सुपबेस (Supabase) से सिंक हो गए!",
    toggleSimulatorOnline: "ऑनलाइन सिमुलेशन",
    toggleSimulatorOffline: "ऑफलाइन सिमुलेशन",
    vocabTooltipHint: "त्रिभाषी अर्थ देखने के लिए टैप / होवर करें",
    selectLang: "भाषा चुनें",
  },
  or: {
    appName: "ଫନ୍-ଲର୍ଣ୍ଣ (FunLearn)",
    appTagline: "ଗ୍ରାମୀଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ ଖେଳ ଖେଳରେ ଶିକ୍ଷା — ସମ୍ପୂର୍ଣ୍ଣ ଅଫଲାଇନ୍",
    navHome: "ମୋ ଡ୍ୟାସବୋର୍ଡ",
    navLessons: "ପାଠ୍ୟ ବଣ୍ଡଲ",
    navMissions: "ଚାଲୁଥିବା ମିଶନ",
    navGlossary: "ଶବ୍ଦକୋଷ",
    navDownloads: "ଡାଉନଲୋଡ୍",
    navTeacher: "ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ",
    badgeOfflineReady: "ଅଫଲାଇନ୍ ପ୍ରସ୍ତୁତ",
    badgeLowBandwidth: "ସ୍ୱଳ୍ପ ଇଣ୍ଟରନେଟ୍ ଉପଯୋଗୀ",
    xpLabel: "ଏକ୍ସପି (XP) ପଏଣ୍ଟ",
    levelLabel: "ସ୍ତର / ପଦବୀ",
    streakLabel: "ଦୈନିକ କ୍ରମ (Streak)",
    classLabel: "ଶ୍ରେଣୀ",
    schoolLabel: "ଗ୍ରାମ୍ୟ ବିଦ୍ୟାଳୟ",
    cachedLessonsTitle: "ଅଫଲାଇନ୍ ପାଠ୍ୟ ବଣ୍ଡଲ",
    cachedLessonsDesc: "ବିନା ଇଣ୍ଟରନେଟରେ ପଢ଼ିବା ପାଇଁ ପାଠ୍ୟଗୁଡ଼ିକୁ ଡିଭାଇସରେ ସେଭ୍ କରନ୍ତୁ।",
    btnDownloadOffline: "ଅଫଲାଇନ୍ ପ୍ୟାକ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
    btnDownloaded: "ଡିଭାଇସରେ ସଂରକ୍ଷିତ",
    btnStartMission: "ମିଶନ ଆହ୍ୱାନ ଆରମ୍ଭ କରନ୍ତୁ",
    btnResume: "ପଢ଼ା ଜାରି ରଖନ୍ତୁ",
    btnStartLearning: "ପଢ଼ିବା ଆରମ୍ଭ କରନ୍ତୁ",
    btnSaveNotes: "ନୋଟ୍ସ ସେଭ୍ କରନ୍ତୁ",
    btnListenAudio: "🔊 ଅଡିଓ ଶୁଣନ୍ତୁ",
    btnStopAudio: "ଅଡିଓ ବନ୍ଦ କରନ୍ତୁ",
    btnBack: "ପଛକୁ ଯାଆନ୍ତୁ",
    btnContinue: "ଆଗକୁ ବଢ଼ନ୍ତୁ",
    step1Name: "ବାଛନ୍ତୁ",
    step2Name: "ଶିଖନ୍ତୁ",
    step3Name: "ଅନୁସନ୍ଧାନ",
    step4Name: "ଅଭ୍ୟାସ",
    step5Name: "ପରୀକ୍ଷା",
    step6Name: "ମିଶନ",
    step7Name: "ମୂଲ୍ୟାଙ୍କନ",
    step8Name: "ପୁରସ୍କାର",
    subjPhysics: "ପଦାର୍ଥ ବିଜ୍ଞାନ (Physics)",
    subjChemistry: "ରସାୟନ ବିଜ୍ଞାନ (Chemistry)",
    subjMathematics: "ଗଣିତ (Mathematics)",
    subjBiology: "ଜୀବ ବିଜ୍ଞାନ (Biology)",
    missionCompleted: "ମିଶନ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା!",
    xpAwarded: "ଏକ୍ସପି ଅର୍ଜିତ!",
    statusOnline: "ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ (Online)",
    statusOffline: "ଅଫଲାଇନ୍ ମୋଡ୍ (IndexedDB ସକ୍ରିୟ)",
    statusSyncing: "କ୍ଲାଉଡ୍ ସହିତ ସିଙ୍କ୍ ହେଉଛି...",
    pendingItemsToSync: "ଅପଲୋଡ୍ ପାଇଁ ବାକି ଥିବା ତଥ୍ୟ",
    btnSyncNow: "ବର୍ତ୍ତମାନ ସିଙ୍କ୍ କରନ୍ତୁ",
    syncSuccess: "ସମସ୍ତ ଅଫଲାଇନ୍ ତଥ୍ୟ ସୁପାବେସ୍ ସହିତ ସଫଳତାର ସହ ସିଙ୍କ୍ ହୋଇଛି!",
    toggleSimulatorOnline: "ଅନଲାଇନ୍ ସିମୁଲେସନ",
    toggleSimulatorOffline: "ଅଫଲାଇନ୍ ସିମୁଲେସନ",
    vocabTooltipHint: "ତ୍ରିଭାଷୀ ଅର୍ଥ ଦେଖିବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    selectLang: "ଭାଷା ବାଛନ୍ତୁ",
  },
};


interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  getVocab: (vocabKey: string) => VocabItem | undefined;
  getTrilingualLabel: (vocabKey: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("hi");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("funlearn_lang") as SupportedLanguage;
      if (stored && ["en", "hi", "or"].includes(stored)) {
        setLanguageState(stored);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("funlearn_lang", lang);
    }
    // Update local offline profile preference
    updateLocalStudentProfile({
      userId: DEFAULT_USER_ID,
      preferredLang: lang,
    }).catch(console.error);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = UI_TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (UI_TRANSLATIONS.en[key]) {
      return UI_TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const getVocab = (vocabKey: string): VocabItem | undefined => {
    return VOCAB_DICTIONARY[vocabKey];
  };

  const getTrilingualLabel = (vocabKey: string): string => {
    const item = VOCAB_DICTIONARY[vocabKey];
    if (!item) return vocabKey;
    return `${item.en} — ${item.hi} — ${item.or}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getVocab,
        getTrilingualLabel,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
