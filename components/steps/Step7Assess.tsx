import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { type LessonBundle } from "@/lib/offlineStore";
import {
  FileCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Zap,
} from "lucide-react";
import { playSuccessSound, playErrorSound, playClickSound } from "@/lib/soundEffects";
import { XpFloatingBadge } from "@/components/XpFloatingBadge";


export interface CompetencyQuestion {
  id: string;
  type: "MCQ" | "AssertionReason" | "Practical";
  title: string;
  question_en: string;
  assertion_en?: string;
  reason_en?: string;
  options_en: string[];
  correctIndex: number;
  explanation_en: string;
}

export const PHYSICS_COMPETENCY_QUESTIONS: CompetencyQuestion[] = [
  {
    id: "cbse-p1",
    type: "MCQ",
    title: "1. Conceptual Understanding (MCQ)",
    question_en: "According to Ohm's Law ($V = I \\times R$), if the electrical resistance of a village water pump motor doubles while the supply voltage remains constant at 220V, what happens to the electric current flowing through it?",
    options_en: [
      "Current is halved ($I/2$)",
      "Current is doubled ($2I$)",
      "Current remains unchanged",
      "Current quadruples ($4I$)",
    ],
    correctIndex: 0,
    explanation_en: "Current $I$ is inversely proportional to resistance ($I = V/R$). Doubling resistance ($2R$) cuts current to half.",
  },
  {
    id: "cbse-p2",
    type: "AssertionReason",
    title: "2. Scientific Logic (Assertion & Reasoning)",
    question_en: "Evaluate the scientific relationship between electric circuits and safety fuses:",
    assertion_en: "Assertion (A): An electric fuse wire melts and breaks the circuit when an excessively high current passes through it.",
    reason_en: "Reason (R): A fuse wire has a very low melting point and high resistance, producing heating effect ($H = I^2Rt$) to prevent fire hazards.",
    options_en: [
      "Both (A) and (R) are true, and (R) is the correct explanation of (A)",
      "Both (A) and (R) are true, but (R) is NOT the correct explanation of (A)",
      "(A) is true, but (R) is false",
      "(A) is false, but (R) is true",
    ],
    correctIndex: 0,
    explanation_en: "Both statements are factually correct. The high resistance and low melting point of the fuse wire safely disconnect power before appliance damage occurs.",
  },
  {
    id: "cbse-p3",
    type: "Practical",
    title: "3. Practical & Diagram-based Application",
    question_en: "In a village solar lighting setup, a student measures 12V across a backup circuit with an Ammeter reading of 0.6 Amperes. What is the equivalent resistance of the clinic light bulb?",
    options_en: [
      "20 Ohms ($R = 12\\text{V} / 0.6\\text{A}$)",
      "7.2 Ohms",
      "0.05 Ohms",
      "72 Ohms",
    ],
    correctIndex: 0,
    explanation_en: "$R = V / I = 12\\text{V} / 0.6\\text{A} = 20\\ \\Omega$.",
  },
];

export const MATH_COMPETENCY_QUESTIONS: CompetencyQuestion[] = [
  {
    id: "cbse-m1",
    type: "MCQ",
    title: "1. Foundational Geometry (MCQ)",
    question_en: "A rectangular farmland has a length of 25 meters and a width of 12 meters. What is the total perimeter required to fence the boundary?",
    options_en: [
      "74 meters ($2 \\times [25 + 12]$)",
      "300 meters",
      "37 meters",
      "150 meters",
    ],
    correctIndex: 0,
    explanation_en: "Perimeter of rectangle $= 2 \\times (\\text{Length} + \\text{Width}) = 2 \\times (25 + 12) = 74\\text{ meters}$.",
  },
  {
    id: "cbse-m2",
    type: "AssertionReason",
    title: "2. Mathematical Logic (Assertion & Reasoning)",
    question_en: "Evaluate perimeter and area optimization for rectangular fields:",
    assertion_en: "Assertion (A): For a fixed fencing perimeter, a square shape encloses a larger surface area than any other non-square rectangle.",
    reason_en: "Reason (R): For two numbers with a constant sum, their product is maximized when both numbers are equal.",
    options_en: [
      "Both (A) and (R) are true, and (R) is the correct explanation of (A)",
      "Both (A) and (R) are true, but (R) is NOT the correct explanation of (A)",
      "(A) is true, but (R) is false",
      "(A) is false, but (R) is true",
    ],
    correctIndex: 0,
    explanation_en: "When $L+W$ is constant, product $L \\times W$ is maximized when $L = W$ (a square).",
  },
  {
    id: "cbse-m3",
    type: "Practical",
    title: "3. Practical Field Analysis",
    question_en: "If a 100 m² square wheat field produces 40 kg of grain per 25 m² quadrant, what is the total harvest yield?",
    options_en: [
      "160 kg ($4 \\times 40\\text{ kg}$)",
      "100 kg",
      "200 kg",
      "80 kg",
    ],
    correctIndex: 0,
    explanation_en: "$100\\text{ m}^2 / 25\\text{ m}^2 = 4$ quadrants. Total yield $= 4 \\times 40\\text{ kg} = 160\\text{ kg}$.",
  },
];

export const CHEM_COMPETENCY_QUESTIONS: CompetencyQuestion[] = [
  {
    id: "cbse-c1",
    type: "MCQ",
    title: "1. Chemical Indicators (MCQ)",
    question_en: "Which of the following village kitchen substances turns red litmus paper blue?",
    options_en: [
      "Baking soda solution (Basic)",
      "Lemon juice (Acidic)",
      "Tamarind water (Acidic)",
      "Pure distilled rainwater (Neutral)",
    ],
    correctIndex: 0,
    explanation_en: "Baking soda (sodium bicarbonate) is a base, which turns red litmus paper blue.",
  },
  {
    id: "cbse-c2",
    type: "AssertionReason",
    title: "2. Soil Chemistry (Assertion & Reasoning)",
    question_en: "Evaluate agricultural soil conditioning:",
    assertion_en: "Assertion (A): Farmers add slaked lime (calcium hydroxide) to fields having excessively acidic soil.",
    reason_en: "Reason (R): Slaked lime is a base that undergoes a neutralization reaction with soil acids to restore balanced pH for crop roots.",
    options_en: [
      "Both (A) and (R) are true, and (R) is the correct explanation of (A)",
      "Both (A) and (R) are true, but (R) is NOT the correct explanation of (A)",
      "(A) is true, but (R) is false",
      "(A) is false, but (R) is true",
    ],
    correctIndex: 0,
    explanation_en: "Slaked lime is basic and neutralizes acidic soils to an optimal pH of 6.5–7.2.",
  },
  {
    id: "cbse-c3",
    type: "Practical",
    title: "3. Practical Water Analysis",
    question_en: "A sample of water from a village tank shows pH 9.2 when tested with a universal indicator. How should this water be classified?",
    options_en: [
      "Moderately Basic (Alkaline)",
      "Strongly Acidic",
      "Neutral Safe",
      "Pure Distilled",
    ],
    correctIndex: 0,
    explanation_en: "pH values above 7 are basic/alkaline. pH 9.2 is moderately basic.",
  },
];

interface Step7AssessProps {
  bundle: LessonBundle;
  scorePercent?: number;
  onBack: () => void;
  onContinueToReward: () => void;
}

export const Step7Assess: React.FC<Step7AssessProps> = ({
  bundle,
  onBack,
  onContinueToReward,
}) => {
  const isPhysics = bundle.subject === "Physics";
  const isMath = bundle.subject === "Mathematics";

  const questions: CompetencyQuestion[] = isPhysics
    ? PHYSICS_COMPETENCY_QUESTIONS
    : isMath
    ? MATH_COMPETENCY_QUESTIONS
    : CHEM_COMPETENCY_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [showXpFloater, setShowXpFloater] = useState(false);

  const currentQ = questions[currentIndex];
  const chosenIndex = selectedAnswers[currentIndex];
  const hasSelected = chosenIndex !== undefined;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      playSuccessSound();
      setShowXpFloater(true);
    } else {
      playErrorSound();
    }
  };

  const handleNext = () => {
    playClickSound(600);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      onContinueToReward();
    }
  };

  const calculateTotalCorrect = () => {
    return questions.reduce((acc, q, idx) => {
      return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  };

  const isCurrentCorrect = chosenIndex === currentQ.correctIndex;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-7 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Step 7: Competency-Based Assessment • CBSE Aligned
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              {currentQ.title}
            </h1>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="w-20 bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-zinc-900 dark:bg-white h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Box */}
      <div className="space-y-4">
        <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
          <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-relaxed">
            {currentQ.question_en}
          </p>

          {/* Assertion & Reasoning Specific Callout */}
          {currentQ.type === "AssertionReason" && (
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs sm:text-sm font-medium">
              <div className="text-zinc-900 dark:text-zinc-100">
                <strong>{currentQ.assertion_en}</strong>
              </div>
              <div className="text-zinc-900 dark:text-zinc-100">
                <strong>{currentQ.reason_en}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Option Selection Grid with Motion Shake & Scale Bounce */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQ.options_en.map((opt, idx) => {
            const isSelected = chosenIndex === idx;
            const isRight = idx === currentQ.correctIndex;

            let btnStyle =
              "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100";

            if (isAnswered) {
              if (isRight) {
                btnStyle =
                  "border-zinc-900 dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold shadow-xs";
              } else if (isSelected) {
                btnStyle =
                  "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300";
              } else {
                btnStyle = "opacity-40 border-zinc-200 dark:border-zinc-800";
              }
            }

            // Animation variants for correct vs incorrect selection
            const animateState = isAnswered && isSelected
              ? isRight
                ? { scale: [1, 1.05, 0.98, 1.02, 1] }
                : { x: [0, -10, 10, -8, 8, -4, 4, 0] }
              : {};

            return (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                animate={animateState}
                transition={{ duration: 0.45 }}
                className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-colors flex items-center justify-between min-h-[50px] ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md border border-current flex items-center justify-center font-bold text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </div>

                {isAnswered && isRight && (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                {isAnswered && isSelected && !isRight && (
                  <XCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Floating XP Badge */}
        <XpFloatingBadge
          amount={25}
          label="Correct Answer"
          isVisible={showXpFloater}
          onComplete={() => setShowXpFloater(false)}
        />


        {/* Detailed Plain Text Explanation */}
        {isAnswered && (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 space-y-1.5 border border-zinc-300 dark:border-zinc-700">
            <div className="font-bold flex items-center gap-1.5 text-zinc-900 dark:text-white">
              <HelpCircle className="w-4 h-4" />
              <span>
                {isCurrentCorrect ? "Correct! Concept Breakdown:" : "Explanation & Correction:"}
              </span>
            </div>
            <p className="leading-relaxed">{currentQ.explanation_en}</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex((prev) => prev - 1);
              setIsAnswered(true);
            } else {
              onBack();
            }
          }}
          className="min-h-[44px] sm:min-h-[40px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentIndex > 0 ? "Previous Question" : "Back to Mission"}</span>
        </button>

        <button
          type="button"
          disabled={!isAnswered}
          onClick={handleNext}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-40 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>
            {currentIndex + 1 < questions.length ? "Next Assessment Question" : "Finalize & Claim Reward"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
