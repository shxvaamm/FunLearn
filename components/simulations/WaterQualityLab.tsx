import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TestTube,
  Droplets,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Hand,
  FlaskConical,
} from "lucide-react";
import {
  playDropSound,
  playSuccessSound,
  playErrorSound,
  playClickSound,
} from "@/lib/soundEffects";
import { XpFloatingBadge } from "@/components/XpFloatingBadge";

export interface WaterSample {
  id: string;
  name: string;
  sourceDescription: string;
  actualPh: number;
  type: "Acidic" | "Neutral" | "Basic";
  liquidPattern: string;
  liquidColor: string;
  treatmentNotes: string;
}

export const WATER_SAMPLES: WaterSample[] = [
  {
    id: "village-well",
    name: "Village Drinking Well",
    sourceDescription: "Deep ground water from village community well pump.",
    actualPh: 7.2,
    type: "Neutral",
    liquidPattern: "bg-zinc-200 dark:bg-zinc-700",
    liquidColor: "bg-emerald-500/30 dark:bg-emerald-500/40 text-emerald-950 dark:text-emerald-100",
    treatmentNotes: "Safe neutral water suitable for drinking and household cooking.",
  },
  {
    id: "paddy-runoff",
    name: "Paddy Field Runoff Water",
    sourceDescription: "Standing water mixed with decomposing organic mulch.",
    actualPh: 4.8,
    type: "Acidic",
    liquidPattern: "bg-zinc-400 dark:bg-zinc-500",
    liquidColor: "bg-amber-500/40 dark:bg-amber-500/50 text-amber-950 dark:text-amber-100",
    treatmentNotes: "Acidic runoff. Farmers add slaked lime (chuna/base) to balance soil pH.",
  },
  {
    id: "rainwater-tank",
    name: "Rooftop Rainwater Tank",
    sourceDescription: "Collected clean monsoon rainwater stored in cement vessel.",
    actualPh: 6.8,
    type: "Neutral",
    liquidPattern: "bg-zinc-100 dark:bg-zinc-800",
    liquidColor: "bg-teal-400/30 dark:bg-teal-400/40 text-teal-950 dark:text-teal-100",
    treatmentNotes: "Near-neutral fresh rainwater, ideal for irrigation and seed germination.",
  },
  {
    id: "farm-lime-tank",
    name: "Agricultural Lime Wash",
    sourceDescription: "Water mixed with calcium carbonate/lime for soil conditioning.",
    actualPh: 9.6,
    type: "Basic",
    liquidPattern: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
    liquidColor: "bg-blue-600/40 dark:bg-blue-500/50 text-blue-950 dark:text-blue-100",
    treatmentNotes: "Alkaline base solution used to neutralize highly acidic farm soil.",
  },
];

// 14-Step pH color palette for tactile tap matching
const PH_COLOR_PALETTE = [
  { ph: 0, color: "#EF4444" },
  { ph: 2, color: "#F97316" },
  { ph: 4, color: "#FBBF24" },
  { ph: 6, color: "#84CC16" },
  { ph: 7, color: "#10B981" },
  { ph: 8, color: "#06B6D4" },
  { ph: 10, color: "#3B82F6" },
  { ph: 12, color: "#6366F1" },
  { ph: 14, color: "#8B5CF6" },
];

export interface WaterQualityLabProps {
  mode?: "explore" | "practice" | "experiment";
  onTaskComplete?: () => void;
}

export const WaterQualityLab: React.FC<WaterQualityLabProps> = ({
  mode = "explore",
  onTaskComplete,
}) => {
  const [selectedSample, setSelectedSample] = useState<WaterSample>(WATER_SAMPLES[0]);
  const [dropsAdded, setDropsAdded] = useState<number>(0);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [isSwirling, setIsSwirling] = useState<boolean>(false);
  const [matchedPh, setMatchedPh] = useState<number>(7);
  const [isTested, setIsTested] = useState<boolean>(false);
  const [hasCompletedTask, setHasCompletedTask] = useState<boolean>(false);
  const [showXpFloater, setShowXpFloater] = useState<boolean>(false);
  const [activeFeedbackTip, setActiveFeedbackTip] = useState<string | null>(null);

  const handleAddDropper = () => {
    playDropSound();
    setIsDropping(true);
    setTimeout(() => {
      setDropsAdded((prev) => Math.min(prev + 1, 5));
      setIsTested(true);
      setIsDropping(false);
      setActiveFeedbackTip("Indicator Added! Tap test tube to swirl and mix.");
    }, 380);
  };

  const handleSwirlTube = () => {
    if (dropsAdded === 0) {
      handleAddDropper();
      return;
    }
    playDropSound();
    setIsSwirling(true);
    setTimeout(() => {
      setIsSwirling(false);
      setActiveFeedbackTip("Sample Swirled! Compare color with pH Palette below.");
    }, 450);
  };

  const handleSelectSample = (sample: WaterSample) => {
    playClickSound(700);
    setSelectedSample(sample);
    setDropsAdded(0);
    setIsTested(false);
    setActiveFeedbackTip(`Selected ${sample.name}. Tap dropper to add reagent.`);
  };

  const handleSelectPalettePh = (val: number) => {
    playClickSound(600 + val * 40);
    setMatchedPh(val);
  };

  const handleReset = () => {
    playClickSound(400);
    setSelectedSample(WATER_SAMPLES[0]);
    setDropsAdded(0);
    setMatchedPh(7);
    setIsTested(false);
    setActiveFeedbackTip(null);
  };

  // Check if matched pH is close to actual pH (within ±0.8)
  const isMatchAccurate = isTested && Math.abs(matchedPh - selectedSample.actualPh) <= 0.8;

  const handleVerifyMatch = () => {
    if (isMatchAccurate) {
      playSuccessSound();
      setShowXpFloater(true);
      setHasCompletedTask(true);
      if (onTaskComplete) onTaskComplete();
    } else {
      playErrorSound();
    }
  };

  // Determine indicator shade/fill based on sample pH
  const getTubeShade = () => {
    if (dropsAdded === 0) return "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100";
    return selectedSample.liquidColor;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              Tactile Chemistry Lab
            </span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
              <Hand className="w-3 h-3" /> Tap Pipette &amp; Test Tube Directly
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1">
            Village Water Quality &amp; pH Testing Simulator (pH 0–14)
          </h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[38px] px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* 1. Choose Water Sample Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
          <span>1. Select Water Sample:</span>
          <span className="text-[11px] font-mono text-zinc-400">4 Local Rural Sources</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WATER_SAMPLES.map((sample) => (
            <motion.button
              key={sample.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between gap-1.5 min-h-[64px] ${
                selectedSample.id === sample.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs font-bold ring-2 ring-zinc-900/10 dark:ring-white/10"
                  : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span className="truncate">{sample.name}</span>
              <span className="text-[10px] font-mono opacity-80">
                {selectedSample.id === sample.id ? "✓ Active" : "Tap to Load"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tactile Tip Feedback Bar */}
      {activeFeedbackTip && (
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-900 dark:text-white flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 truncate">
            <FlaskConical className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />
            <span className="truncate">{activeFeedbackTip}</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">Live Lab</span>
        </div>
      )}

      {/* Main Interactive Stage: Test Tube + Reagent Dropper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-zinc-50 dark:bg-zinc-950 p-5 sm:p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-inner">
        {/* Visual Test Tube Canvas */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{
              rotate: isSwirling ? [-4, 4, -3, 3, -1, 1, 0] : 0,
            }}
            transition={{ duration: 0.45 }}
            onClick={handleSwirlTube}
            className="relative w-32 h-64 border-4 border-t-0 border-zinc-800 dark:border-zinc-200 rounded-b-full p-2 bg-white dark:bg-zinc-900 flex flex-col justify-end overflow-hidden shadow-inner cursor-pointer group"
            title="Tap to Swirl / Mix Liquid"
          >
            {/* Animated Droplet Falling into Tube */}
            <AnimatePresence>
              {isDropping && (
                <motion.div
                  initial={{ y: -30, opacity: 1, scale: 0.8 }}
                  animate={{ y: 80, opacity: 0, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, ease: "easeIn" }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-3.5 h-5 bg-amber-500 rounded-full rounded-t-none shadow-sm" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Liquid Level with Smooth Color Transition */}
            <div
              className={`w-full transition-all duration-500 rounded-b-[40px] flex items-center justify-center text-xs font-bold text-center px-1 ${
                dropsAdded === 0
                  ? "h-36 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                  : `h-44 ${getTubeShade()}`
              }`}
            >
              {dropsAdded > 0 ? (
                <div className="text-[11px] font-mono leading-tight py-2 animate-in fade-in duration-300">
                  {dropsAdded} Drop{dropsAdded > 1 ? "s" : ""}
                  <br />
                  <span className="text-[10px] font-bold">
                    {selectedSample.actualPh < 6
                      ? "Acidic"
                      : selectedSample.actualPh > 8
                      ? "Basic"
                      : "Neutral"}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-400 font-normal">Tap to Add Drops</span>
              )}
            </div>

            {/* Test tube graduation marks */}
            <div className="absolute top-8 left-2 right-2 border-b border-zinc-300 dark:border-zinc-700 text-[9px] font-mono text-zinc-400">
              50 ml
            </div>
            <div className="absolute top-20 left-2 right-2 border-b border-zinc-300 dark:border-zinc-700 text-[9px] font-mono text-zinc-400">
              30 ml
            </div>
            <div className="absolute top-32 left-2 right-2 border-b border-zinc-300 dark:border-zinc-700 text-[9px] font-mono text-zinc-400">
              10 ml
            </div>
          </motion.div>

          <div className="text-center space-y-1">
            <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-1.5">
              <span>{selectedSample.name}</span>
              <span className="text-[10px] font-normal text-zinc-500">(Tap tube to swirl)</span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs">
              {selectedSample.sourceDescription}
            </div>
          </div>
        </div>

        {/* Dropper Action & pH Scale Matching */}
        <div className="space-y-4">
          {/* Tactile Pipette Dropper Action */}
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Droplets className="w-4 h-4" /> Universal Indicator Pipette
              </span>
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                {dropsAdded}/5 Drops
              </span>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleAddDropper}
              className="w-full min-h-[44px] px-4 py-2.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Droplets className="w-4 h-4 text-amber-400 fill-current" />
              <span>Tap to Squeeze Indicator Droplet</span>
            </motion.button>
          </div>

          {/* Interactive 14-Step pH Palette Chips */}
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Tap to Match pH Color:
              </span>
              <span className="font-mono text-sm px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-black">
                pH {matchedPh.toFixed(1)}
              </span>
            </div>

            {/* Color Strip Chips */}
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
              {PH_COLOR_PALETTE.map((p) => (
                <button
                  key={p.ph}
                  type="button"
                  onClick={() => handleSelectPalettePh(p.ph)}
                  className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    Math.abs(matchedPh - p.ph) < 0.5
                      ? "ring-2 ring-zinc-900 dark:ring-white border-zinc-900 scale-105"
                      : "border-zinc-200 dark:border-zinc-700 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-[9px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    {p.ph}
                  </span>
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="14"
              step="0.1"
              value={matchedPh}
              onChange={(e) => setMatchedPh(Number(e.target.value))}
              className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
            />

            <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
              <span>0 (Acidic)</span>
              <span>7 (Neutral)</span>
              <span>14 (Alkaline)</span>
            </div>

            <motion.button
              type="button"
              disabled={!isTested}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerifyMatch}
              className="w-full min-h-[40px] px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify pH Match</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scientific Insights & Findings */}
      {isTested && (
        <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-zinc-900 dark:text-white uppercase tracking-wide">
            <HelpCircle className="w-4 h-4" /> Lab Analysis &amp; Rural Water Safety:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase">
                Actual Sample pH
              </span>
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-white">
                {selectedSample.actualPh} ({selectedSample.type})
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase">
                Litmus Paper Reaction
              </span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {selectedSample.actualPh < 7
                  ? "Blue Litmus turns Red"
                  : selectedSample.actualPh > 7
                  ? "Red Litmus turns Blue"
                  : "No color shift (Neutral)"}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase">
                Turmeric Indicator
              </span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {selectedSample.actualPh > 8
                  ? "Turns Reddish-Brown (Base)"
                  : "Stays Yellow (Acid/Neutral)"}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1">
            <strong>Agricultural &amp; Health Note:</strong> {selectedSample.treatmentNotes}
          </p>
        </div>
      )}

      {/* Floating XP Badge */}
      <XpFloatingBadge
        amount={35}
        label="pH Analysis Verified"
        isVisible={showXpFloater}
        onComplete={() => setShowXpFloater(false)}
      />
    </div>
  );
};

