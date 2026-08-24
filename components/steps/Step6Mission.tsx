import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import {
  type LessonBundle,
  logCompletedMissionLocally,
  DEFAULT_USER_ID,
} from "@/lib/offlineStore";
import {
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sliders,
  Power,
  RotateCcw,
  Sparkles,
  Layers,
  HeartPulse,
  Trees,
} from "lucide-react";
import { playSuccessSound, playErrorSound, playClickSound } from "@/lib/soundEffects";
import { XpFloatingBadge } from "@/components/XpFloatingBadge";

interface Step6MissionProps {
  bundle: LessonBundle;
  onBack: () => void;
  onMissionPassed: (scorePercent: number) => void;
}

export const Step6Mission: React.FC<Step6MissionProps> = ({
  bundle,
  onBack,
  onMissionPassed,
}) => {
  const { language } = useLanguage();

  // Determine scenario based on subject
  const isPhysics = bundle.subject === "Physics";
  const isMath = bundle.subject === "Mathematics";
  const isChemistryOrBio = bundle.subject === "Chemistry" || bundle.subject === "Biology";

  // --- PHYSICS MISSION STATE: Village Clinic Emergency Lighting ---
  const [clinicVoltage, setClinicVoltage] = useState<number>(6); // Needs 12V for full medical light
  const [isBackupSwitchClosed, setIsBackupSwitchClosed] = useState<boolean>(false);
  const [isEmergencyTested, setIsEmergencyTested] = useState<boolean>(false);
  const [physicsMissionSuccess, setPhysicsMissionSuccess] = useState<boolean>(false);

  // --- MATHS MISSION STATE: Farm Field Area & Perimeter Optimization ---
  const [fieldLength, setFieldLength] = useState<number>(14); // Perimeter target: 40m => 2*(L+W)=40 => L+W=20
  const [fieldWidth, setFieldWidth] = useState<number>(6);
  const [mathMissionSuccess, setMathMissionSuccess] = useState<boolean>(false);
  const [isMathTested, setIsMathTested] = useState<boolean>(false);

  // --- CHEMISTRY/BIO MISSION STATE: Village Well Decontamination & Neutralization ---
  const [limeScoops, setLimeScoops] = useState<number>(2); // Target: 4 scoops to reach pH 7.0
  const [chemMissionSuccess, setChemMissionSuccess] = useState<boolean>(false);
  const [isChemTested, setIsChemTested] = useState<boolean>(false);
  const [showXpFloater, setShowXpFloater] = useState<boolean>(false);

  // 1. Test Physics Emergency Lighting
  const handleTestPhysicsEmergency = () => {
    setIsEmergencyTested(true);
    // Success condition: 12V battery and switch closed
    if (clinicVoltage === 12 && isBackupSwitchClosed) {
      playSuccessSound();
      setShowXpFloater(true);
      setPhysicsMissionSuccess(true);
      logCompletedMissionLocally({
        userId: DEFAULT_USER_ID,
        missionSlug: bundle.slug,
        score: 100,
        xpEarned: bundle.xpReward,
      });
    } else {
      playErrorSound();
      setPhysicsMissionSuccess(false);
    }
  };

  // 2. Test Math Perimeter & Area Optimization (Target: Perimeter = 40m, Maximum Area = 10x10 = 100 sq.m)
  const currentPerimeter = 2 * (fieldLength + fieldWidth);
  const currentArea = fieldLength * fieldWidth;
  const isOptimalPerimeter = currentPerimeter === 40;
  const isMaxArea = currentArea === 100; // 10 x 10 = 100

  const handleTestMathField = () => {
    setIsMathTested(true);
    if (isOptimalPerimeter && isMaxArea) {
      playSuccessSound();
      setShowXpFloater(true);
      setMathMissionSuccess(true);
      logCompletedMissionLocally({
        userId: DEFAULT_USER_ID,
        missionSlug: bundle.slug,
        score: 100,
        xpEarned: bundle.xpReward,
      });
    } else {
      playErrorSound();
      setMathMissionSuccess(false);
    }
  };

  // 3. Test Chemistry Water Neutralization
  const handleTestChemNeutralization = () => {
    setIsChemTested(true);
    if (limeScoops === 4) {
      playSuccessSound();
      setShowXpFloater(true);
      setChemMissionSuccess(true);
      logCompletedMissionLocally({
        userId: DEFAULT_USER_ID,
        missionSlug: bundle.slug,
        score: 100,
        xpEarned: bundle.xpReward,
      });
    } else {
      playErrorSound();
      setChemMissionSuccess(false);
    }
  };

  const isMissionPassed = isPhysics
    ? physicsMissionSuccess
    : isMath
    ? mathMissionSuccess
    : chemMissionSuccess;

  const handleProceedToAssess = () => {
    playClickSound(700);
    onMissionPassed(isMissionPassed ? 100 : 80);
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-7 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs"
          >
            <Target className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Step 6: Real-World STEM Mission • {bundle.subject}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              {isPhysics
                ? "Mission: Village Clinic Emergency Lighting"
                : isMath
                ? "Mission: Farm Field Area & Perimeter Optimization"
                : "Mission: Community Well Safe pH Decontamination"}
            </h1>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xs font-extrabold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <Zap className="w-4 h-4 fill-current text-zinc-900 dark:text-white" />
          <span>+{bundle.xpReward} Mission XP</span>
        </motion.div>
      </div>

      {/* ----------------- SCENARIO 1: PHYSICS CLINIC EMERGENCY LIGHTING ----------------- */}
      {isPhysics && (
        <div className="space-y-6">
          {/* Briefing Context */}
          <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
              <HeartPulse className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Village Health Clinic Emergency Briefing:</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              A thunderstorm knocked out the primary power grid at the Pipili Rural Health Sub-Centre during an urgent nighttime patient delivery. You must configure the emergency backup circuit using high-voltage solar batteries (<strong>12V</strong>) and close the knife switch to power the surgical lamp.
            </p>
          </div>

          {/* Interactive Circuit Builder & Clinic View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center bg-zinc-50 dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {/* Visual Ward Illumination Canvas */}
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3 text-center">
              <motion.div
                animate={
                  isBackupSwitchClosed && clinicVoltage === 12
                    ? { scale: [1, 1.06, 1] }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isBackupSwitchClosed && clinicVoltage === 12
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg ring-8 ring-zinc-900/10 dark:ring-white/10"
                    : isBackupSwitchClosed
                    ? "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 border-zinc-400"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 border-dashed border-zinc-300"
                }`}
              >
                <Zap className="w-10 h-10 fill-current" />
              </motion.div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-zinc-900 dark:text-white">
                  Clinic Operation Lamp:{" "}
                  {isBackupSwitchClosed && clinicVoltage === 12
                    ? "100% Bright (Illuminated)"
                    : isBackupSwitchClosed
                    ? "30% Dim (Insufficient Voltage)"
                    : "0% Off (No Current)"}
                </div>
                <div className="text-xs text-zinc-500">
                  {isBackupSwitchClosed && clinicVoltage === 12
                    ? "Safe for doctors to operate."
                    : "Requires full 12V circuit loop."}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="text-xs font-bold text-zinc-900 dark:text-white block">
                  Select Backup Battery Voltage:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 6, 12].map((v) => (
                    <motion.button
                      key={v}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setClinicVoltage(v)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        clinicVoltage === v
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {v}V Cell
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="text-xs font-bold text-zinc-900 dark:text-white block">
                  Emergency Knife Switch:
                </label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsBackupSwitchClosed(!isBackupSwitchClosed)}
                  className={`w-full min-h-[44px] py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isBackupSwitchClosed
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{isBackupSwitchClosed ? "Switch Closed (ON)" : "Switch Open (OFF)"}</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleTestPhysicsEmergency}
                className="w-full min-h-[44px] bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Test Emergency Power System</span>
              </motion.button>
            </div>
          </div>

          {/* Validation Feedback Banner */}
          {isEmergencyTested && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                physicsMissionSuccess
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {physicsMissionSuccess ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-zinc-500" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {physicsMissionSuccess
                    ? "Mission Accomplished! Emergency Clinic Lighting Restored."
                    : "Power Inadequate. Adjust Circuit Parameters:"}
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {physicsMissionSuccess
                    ? "The 12V battery successfully energized the clinic lamps through the closed circuit loop."
                    : "Ensure you select the 12V battery and close the knife switch to complete the loop."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ----------------- SCENARIO 2: MATHEMATICS FARM FIELD DESIGN ----------------- */}
      {isMath && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
              <Trees className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Village Agricultural Optimization Challenge:</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Farmer Ramesh has exactly <strong>40 meters of wire fencing</strong> to protect his high-yield wheat crop from cattle. Adjust the <strong>Length</strong> and <strong>Width</strong> sliders to use exactly 40m perimeter while maximizing the total farm surface area ($A = L \times W$).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center bg-zinc-50 dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {/* Visual Farm Grid representation */}
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div
                className="border-2 border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300"
                style={{
                  width: `${Math.max(60, fieldLength * 12)}px`,
                  height: `${Math.max(60, fieldWidth * 12)}px`,
                }}
              >
                {currentArea} m² Area
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                {fieldLength}m (L) × {fieldWidth}m (W)
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Field Length (L):</span>
                  <span className="font-mono">{fieldLength} meters</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="18"
                  value={fieldLength}
                  onChange={(e) => setFieldLength(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                />
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Field Width (W):</span>
                  <span className="font-mono">{fieldWidth} meters</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="18"
                  value={fieldWidth}
                  onChange={(e) => setFieldWidth(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                />
              </div>

              {/* Real-time Math Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg border bg-white dark:bg-zinc-900">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Perimeter 2(L+W)</span>
                  <span className={`font-mono font-bold text-sm ${isOptimalPerimeter ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                    {currentPerimeter}m / 40m
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border bg-white dark:bg-zinc-900">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Total Area (L×W)</span>
                  <span className={`font-mono font-bold text-sm ${isMaxArea ? "text-zinc-900 dark:text-white font-extrabold" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {currentArea} m²
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleTestMathField}
                className="w-full min-h-[44px] bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lock In Farm Field Design</span>
              </motion.button>
            </div>
          </div>

          {isMathTested && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                mathMissionSuccess
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {mathMissionSuccess ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-zinc-500" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {mathMissionSuccess
                    ? "Maximum Crop Yield Achieved!"
                    : "Not Optimal Yet. Keep Adjusting:"}
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {mathMissionSuccess
                    ? "A square layout of 10m × 10m uses exactly 40m perimeter and maximizes area at 100 m²."
                    : "Ensure perimeter is exactly 40m (L + W = 20) and area is maximized (10m × 10m)."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ----------------- SCENARIO 3: CHEMISTRY & BIOLOGY WELL DECONTAMINATION ----------------- */}
      {isChemistryOrBio && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>Village Community Drinking Well Decontamination:</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Monsoon runoff made the village drinking well acidic (pH 4.8). To make the water safe for 50 families, calculate and add the correct amount of <strong>agricultural slaked lime powder (4 scoops)</strong> to neutralize the reservoir to <strong>pH 7.0 (Safe Neutral)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center bg-zinc-50 dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3 text-center">
              <motion.div
                animate={limeScoops === 4 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-24 h-24 rounded-2xl flex items-center justify-center font-mono font-black text-2xl border-2 transition-all duration-300 ${
                  limeScoops === 4
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md ring-4 ring-zinc-900/10 dark:ring-white/10"
                    : limeScoops > 4
                    ? "bg-zinc-200 dark:bg-zinc-800 border-zinc-400 text-zinc-900 dark:text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                pH {(4.8 + limeScoops * 0.55).toFixed(1)}
              </motion.div>
              <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                {limeScoops === 4 ? "Neutral Safe (pH 7.0)" : limeScoops < 4 ? "Acidic (Unsafe)" : "Alkaline (Too Basic)"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Slaked Lime Scoops:</span>
                  <span className="font-mono">{limeScoops} Scoops</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setLimeScoops(s)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        limeScoops === s
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleTestChemNeutralization}
                className="w-full min-h-[44px] bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Test Decontaminated Well Water</span>
              </motion.button>
            </div>
          </div>

          {isChemTested && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                chemMissionSuccess
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {chemMissionSuccess ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-zinc-500" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {chemMissionSuccess
                    ? "Safe Drinking Water Restored for the Village!"
                    : "Water pH Still Imbalanced:"}
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {chemMissionSuccess
                    ? "4 scoops of agricultural slaked lime balanced the reservoir to pH 7.0."
                    : "Add exactly 4 scoops to reach neutral pH 7.0."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onBack}
          className="min-h-[44px] sm:min-h-[40px] px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Experiment</span>
        </motion.button>

        <motion.button
          whileHover={isMissionPassed ? { scale: 1.02 } : undefined}
          whileTap={isMissionPassed ? { scale: 0.96 } : undefined}
          type="button"
          disabled={!isMissionPassed}
          onClick={handleProceedToAssess}
          className="min-h-[44px] sm:min-h-[40px] px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-40 text-white dark:text-zinc-900 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Competency Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Floating XP Badge */}
      <XpFloatingBadge
        amount={50}
        label="STEM Mission Completed"
        isVisible={showXpFloater}
        onComplete={() => setShowXpFloater(false)}
      />
    </motion.div>
  );
};
