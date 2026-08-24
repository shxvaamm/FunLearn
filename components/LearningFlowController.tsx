"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type LessonBundle } from "@/lib/offlineStore";
import { LearningFlowBar, type LearningStepId } from "./LearningFlowBar";
import { Step1Select } from "./steps/Step1Select";
import { Step2Learn } from "./steps/Step2Learn";
import { Step3To5Simulations } from "./steps/Step3To5Simulations";
import { Step6Mission } from "./steps/Step6Mission";
import { Step7Assess } from "./steps/Step7Assess";
import { Step8Reward } from "./steps/Step8Reward";

interface LearningFlowControllerProps {
  bundles: LessonBundle[];
  initialClass?: number;
}

export const LearningFlowController: React.FC<LearningFlowControllerProps> = ({
  bundles,
  initialClass = 7,
}) => {
  const [currentStep, setCurrentStep] = useState<LearningStepId>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<LearningStepId>(1);
  const [selectedClass, setSelectedClass] = useState<number>(initialClass);
  const [selectedChapter, setSelectedChapter] = useState<LessonBundle | null>(
    bundles[0] || null
  );
  const [missionScore, setMissionScore] = useState<number>(100);

  const unlockUpTo = (step: LearningStepId) => {
    setMaxUnlockedStep((prev) => (step > prev ? step : prev));
  };

  const handleSelectChapter = (chapter: LessonBundle) => {
    setSelectedChapter(chapter);
    unlockUpTo(2);
    setCurrentStep(2); // Automatically advance to Step 2: Learn
  };

  const handleBackToSelect = () => {
    setCurrentStep(1);
  };

  const handleContinueToExplore = () => {
    unlockUpTo(3);
    setCurrentStep(3);
  };

  const handleBackToLearn = () => {
    setCurrentStep(2);
  };

  const handleContinueToPractice = () => {
    unlockUpTo(4);
    setCurrentStep(4);
  };

  const handleBackToExplore = () => {
    setCurrentStep(3);
  };

  const handleContinueToExperiment = () => {
    unlockUpTo(5);
    setCurrentStep(5);
  };

  const handleBackToPractice = () => {
    setCurrentStep(4);
  };

  const handleContinueToMission = () => {
    unlockUpTo(6);
    setCurrentStep(6);
  };

  const handleBackToExperiment = () => {
    setCurrentStep(5);
  };

  const handleMissionPassed = (score: number) => {
    setMissionScore(score);
    unlockUpTo(7);
    setCurrentStep(7);
  };

  const handleBackToMission = () => {
    setCurrentStep(6);
  };

  const handleContinueToReward = () => {
    unlockUpTo(8);
    setCurrentStep(8);
  };

  const handleRestartChapter = () => {
    setCurrentStep(2);
  };

  const handleSelectNextChapter = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top 8-Step Flow Bar Tracker */}
      <LearningFlowBar
        currentStep={currentStep}
        maxUnlockedStep={maxUnlockedStep}
        onStepClick={(step) => setCurrentStep(step)}
        selectedChapterTitle={
          currentStep > 1 ? selectedChapter?.title_en : undefined
        }
      />

      {/* Active Step Dynamic View with Smooth Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {currentStep === 1 && (
            <Step1Select
              bundles={bundles}
              selectedClass={selectedClass}
              onSelectClass={(c) => setSelectedClass(c)}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentStep === 2 && selectedChapter && (
            <Step2Learn
              bundle={selectedChapter}
              onBackToSelect={handleBackToSelect}
              onContinueToExplore={handleContinueToExplore}
            />
          )}

          {currentStep === 3 && selectedChapter && (
            <Step3To5Simulations
              step={3}
              bundle={selectedChapter}
              onBack={handleBackToLearn}
              onContinue={handleContinueToPractice}
            />
          )}

          {currentStep === 4 && selectedChapter && (
            <Step3To5Simulations
              step={4}
              bundle={selectedChapter}
              onBack={handleBackToExplore}
              onContinue={handleContinueToExperiment}
            />
          )}

          {currentStep === 5 && selectedChapter && (
            <Step3To5Simulations
              step={5}
              bundle={selectedChapter}
              onBack={handleBackToPractice}
              onContinue={handleContinueToMission}
            />
          )}

          {currentStep === 6 && selectedChapter && (
            <Step6Mission
              bundle={selectedChapter}
              onBack={handleBackToExperiment}
              onMissionPassed={handleMissionPassed}
            />
          )}

          {currentStep === 7 && selectedChapter && (
            <Step7Assess
              bundle={selectedChapter}
              scorePercent={missionScore}
              onBack={handleBackToMission}
              onContinueToReward={handleContinueToReward}
            />
          )}

          {currentStep === 8 && selectedChapter && (
            <Step8Reward
              bundle={selectedChapter}
              scorePercent={missionScore}
              onRestartChapter={handleRestartChapter}
              onSelectNextChapter={handleSelectNextChapter}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


