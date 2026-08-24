import { type LessonBundle, type SupportedLanguage } from "./offlineStore";
import { VOCAB_DICTIONARY } from "@/context/LanguageContext";

/**
 * Downloads a formatted STEM lesson guide and quiz sheet directly to the user's device storage
 */
export function downloadLessonGuideToDevice(
  bundle: LessonBundle,
  lang: SupportedLanguage = "en"
): void {
  const title =
    lang === "hi"
      ? bundle.title_hi
      : lang === "or"
      ? bundle.title_or
      : bundle.title_en;

  const description =
    lang === "hi"
      ? bundle.description_hi
      : lang === "or"
      ? bundle.description_or
      : bundle.description_en;

  const content =
    lang === "hi"
      ? bundle.content_hi
      : lang === "or"
      ? bundle.content_or
      : bundle.content_en;

  let vocabSection = "";
  if (bundle.keyVocabKeys && bundle.keyVocabKeys.length > 0) {
    vocabSection = `\n==================================================\nTRILINGUAL VOCABULARY & KEY CONCEPTS\n==================================================\n`;
    bundle.keyVocabKeys.forEach((key) => {
      const v = VOCAB_DICTIONARY[key];
      if (v) {
        vocabSection += `\n* ${v.en} | ${v.hi} (${v.phonetics?.hi || ""}) | ${v.or} (${v.phonetics?.or || ""})\n`;
        vocabSection += `  - English: ${v.def_en}\n`;
        vocabSection += `  - हिन्दी: ${v.def_hi}\n`;
        vocabSection += `  - ଓଡ଼ିଆ: ${v.def_or}\n`;
      }
    });
  }

  let questionsSection = `\n==================================================\nPRACTICE QUESTIONS & SELF-ASSESSMENT\n==================================================\n`;
  bundle.questions.forEach((q, idx) => {
    const qText =
      lang === "hi" ? q.question_hi : lang === "or" ? q.question_or : q.question_en;
    const opts =
      lang === "hi" ? q.options_hi : lang === "or" ? q.options_or : q.options_en;
    const exp =
      lang === "hi" ? q.explanation_hi : lang === "or" ? q.explanation_or : q.explanation_en;

    questionsSection += `\nQ${idx + 1}: ${qText}\n`;
    opts.forEach((opt, oIdx) => {
      questionsSection += `   [${String.fromCharCode(65 + oIdx)}] ${opt}\n`;
    });
    questionsSection += `   Answer: [${String.fromCharCode(65 + q.correctAnswerIndex)}] (Explanation: ${exp})\n`;
  });

  const fileContent = `==================================================
FUNLEARN RURAL EDUCATION PLATFORM
LESSON REVISION GUIDE & STUDY SHEET
==================================================
Subject: ${bundle.subject}
Class Level: Class ${bundle.classLevel}
Estimated Study Time: ${bundle.estimatedMinutes} Minutes
XP Reward: +${bundle.xpReward} XP
Downloaded On: ${new Date().toLocaleDateString()}

TOPIC: ${title}
--------------------------------------------------
${description}

LESSON SUMMARY:
${content}
${vocabSection}
${questionsSection}
==================================================
Saved directly to your device storage.
FunLearn — Empowering Rural Learners.
==================================================`;

  const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `FunLearn_${bundle.subject}_Class${bundle.classLevel}_${bundle.slug}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
