import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Power,
  RotateCcw,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Hand,
  Layers,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/soundEffects";
import { XpFloatingBadge } from "@/components/XpFloatingBadge";

export interface ElectricityLabProps {
  mode?: "explore" | "practice" | "experiment";
  targetTask?: {
    voltage?: number;
    resistance?: number;
    description: string;
  };
  onTaskComplete?: () => void;
}

export const ElectricityLab: React.FC<ElectricityLabProps> = ({
  mode = "explore",
  targetTask,
  onTaskComplete,
}) => {
  const [voltage, setVoltage] = useState<number>(6); // 3V, 6V, 9V, 12V
  const [resistance, setResistance] = useState<number>(20); // 1 to 100 Ohms
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(false);
  const [showXpFloater, setShowXpFloater] = useState<boolean>(false);
  const [activeTappedComponent, setActiveTappedComponent] = useState<string | null>(null);
  const [inspectedComponent, setInspectedComponent] = useState<string | null>(null);

  const [recordedData, setRecordedData] = useState<
    Array<{ v: number; r: number; i: number; p: number }>
  >([]);

  // Ohm's Law: I = V / R
  const current = isSwitchClosed && resistance > 0 ? voltage / resistance : 0;
  const power = isSwitchClosed ? voltage * current : 0;

  // Bulb brightness percentage (capped at 100%)
  const bulbBrightness = isSwitchClosed ? Math.min(100, Math.round((power / 4) * 100)) : 0;

  // Check practice task completion
  const isTaskFulfilled =
    mode === "practice" &&
    isSwitchClosed &&
    (!targetTask?.voltage || targetTask.voltage === voltage) &&
    (!targetTask?.resistance || targetTask.resistance === resistance);

  useEffect(() => {
    if (isTaskFulfilled && onTaskComplete) {
      playSuccessSound();
      setShowXpFloater(true);
      onTaskComplete();
    }
  }, [isTaskFulfilled, onTaskComplete]);

  const triggerTapFeedback = (compName: string) => {
    setActiveTappedComponent(compName);
    setTimeout(() => setActiveTappedComponent(null), 400);
  };

  // Direct Tap Handlers
  const handleTapBattery = () => {
    triggerTapFeedback("battery");
    playClickSound(650);
    const voltages = [3, 6, 9, 12];
    const nextIndex = (voltages.indexOf(voltage) + 1) % voltages.length;
    setVoltage(voltages[nextIndex]);
    setInspectedComponent(`Battery Voltage set to ${voltages[nextIndex]}V`);
  };

  const handleToggleSwitch = () => {
    triggerTapFeedback("switch");
    const nextState = !isSwitchClosed;
    setIsSwitchClosed(nextState);
    if (nextState) {
      playSuccessSound();
      setShowXpFloater(true);
      setInspectedComponent("Knife Switch CLOSED: Circuit Complete!");
    } else {
      playClickSound(500);
      setInspectedComponent("Knife Switch OPEN: Current Stopped.");
    }
  };

  const handleTapResistor = () => {
    triggerTapFeedback("resistor");
    playClickSound(750);
    const presetResistances = [5, 10, 20, 50, 100];
    const nextIndex = (presetResistances.indexOf(resistance) + 1) % presetResistances.length;
    const newR = presetResistances[nextIndex >= 0 ? nextIndex : 0];
    setResistance(newR);
    setInspectedComponent(`Resistance Box tuned to ${newR} Ω`);
  };

  const handleTapBulb = () => {
    triggerTapFeedback("bulb");
    playClickSound(900);
    setInspectedComponent(
      isSwitchClosed
        ? `Bulb Glow: ${bulbBrightness}% • Power Consumption: ${power.toFixed(2)}W • Current: ${current.toFixed(3)}A`
        : "Bulb: Inactive (Close the Switch to complete circuit and light the filament)"
    );
  };

  const handleRecordExperimentRow = () => {
    if (!isSwitchClosed) return;
    playClickSound(900);
    const newEntry = {
      v: voltage,
      r: resistance,
      i: Number(current.toFixed(3)),
      p: Number(power.toFixed(2)),
    };
    setRecordedData((prev) => [newEntry, ...prev.slice(0, 5)]);
  };

  const handleReset = () => {
    playClickSound(400);
    setVoltage(6);
    setResistance(20);
    setIsSwitchClosed(false);
    setInspectedComponent(null);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 sm:p-6 space-y-5">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              Tactile Circuit Board
            </span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
              <Hand className="w-3 h-3" /> Tap Components Directly to Interact
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1">
            Circuit, Voltage & Ohm&apos;s Law Simulator ($I = V / R$)
          </h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[38px] px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Circuit</span>
        </button>
      </div>

      {/* Guided Task Banner (If in Practice/Experiment Mode) */}
      {mode === "practice" && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
            isTaskFulfilled
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
              : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
          }`}
        >
          {isTaskFulfilled ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-zinc-500" />
          )}
          <div className="space-y-1">
            <div className="font-bold">
              {isTaskFulfilled ? "Practice Task Completed!" : "Active Practice Task:"}
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {targetTask?.description ||
                "Set Battery to 9V, Resistance to 10Ω, and close the switch to observe current on the Ammeter."}
            </p>
          </div>
        </div>
      )}

      {/* Tactile Inspection Bar */}
      {inspectedComponent && (
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-900 dark:text-white flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 truncate">
            <Zap className="w-3.5 h-3.5 fill-current text-amber-500 shrink-0" />
            <span className="truncate">{inspectedComponent}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
            Live Feed
          </span>
        </div>
      )}

      {/* Interactive Tactile Vector Canvas */}
      <div className="relative bg-zinc-50 dark:bg-zinc-950 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 p-3 sm:p-5 overflow-hidden shadow-inner">
        {/* Helper Hint Badge */}
        <div className="absolute top-3 left-3 z-10 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 backdrop-blur-xs shadow-xs">
          <Hand className="w-3 h-3 text-zinc-900 dark:text-white animate-pulse" />
          <span>Tap any component on the board to operate</span>
        </div>

        {/* SVG Circuit Canvas */}
        <div className="w-full max-w-2xl mx-auto aspect-[16/10] sm:aspect-[16/9] relative flex items-center justify-center">
          <svg
            viewBox="0 0 600 360"
            className="w-full h-full select-none touch-none"
            aria-label="Interactive Circuit Simulator Canvas"
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern
                id="circuitGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-zinc-200 dark:text-zinc-800"
                />
              </pattern>
            </defs>
            <rect width="600" height="360" fill="url(#circuitGrid)" />

            {/* Wire Loop Base */}
            <path
              d="M 120 70 L 480 70 L 480 290 L 120 290 Z"
              fill="none"
              stroke={isSwitchClosed ? "#27272A" : "#A1A1AA"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-zinc-500"
            />

            {/* Animated SVG Current Dash-Array when Switch is Closed */}
            {isSwitchClosed && (
              <path
                d="M 120 70 L 480 70 L 480 290 L 120 290 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-zinc-200"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur={`${Math.max(0.5, Math.min(3, 3 - current * 2.5))}s`}
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* Animated Electron Flow Floating Particles */}
            {isSwitchClosed && (
              <>
                <circle r="4" fill="#09090B" className="dark:fill-white">
                  <animateMotion
                    path="M 120 70 L 480 70 L 480 290 L 120 290 Z"
                    dur={`${Math.max(0.8, Math.min(4, 4 - current * 4))}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="4" fill="#09090B" className="dark:fill-white">
                  <animateMotion
                    path="M 120 70 L 480 70 L 480 290 L 120 290 Z"
                    dur={`${Math.max(0.8, Math.min(4, 4 - current * 4))}s`}
                    begin="0.6s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="3" fill="#09090B" className="dark:fill-white">
                  <animateMotion
                    path="M 120 70 L 480 70 L 480 290 L 120 290 Z"
                    dur={`${Math.max(0.8, Math.min(4, 4 - current * 4))}s`}
                    begin="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {/* 1. BATTERY COMPONENT (Left Side: x=120, y=180) - TACTILE TAP TO CYCLE VOLTAGE */}
            <g
              transform="translate(120, 180)"
              onClick={handleTapBattery}
              className="cursor-pointer group"
            >
              {/* Touch area target */}
              <rect x="-45" y="-40" width="90" height="80" fill="transparent" />
              <rect x="-35" y="-30" width="70" height="60" rx="8" fill="white" className="dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700 group-hover:stroke-zinc-900 dark:group-hover:stroke-white transition-all shadow-xs" strokeWidth="1.5" />

              {/* Glowing active ring pulse on tap */}
              {activeTappedComponent === "battery" && (
                <circle cx="0" cy="0" r="38" stroke="currentColor" fill="none" strokeWidth="2" className="text-zinc-900 dark:text-white animate-ping" />
              )}

              {/* Long plate (+) */}
              <line x1="-25" y1="-15" x2="-25" y2="15" stroke="currentColor" strokeWidth="3.5" className="text-zinc-900 dark:text-white" />
              {/* Short plate (-) */}
              <line x1="-15" y1="-8" x2="-15" y2="8" stroke="currentColor" strokeWidth="5" className="text-zinc-900 dark:text-white" />
              {/* Second cell */}
              <line x1="0" y1="-15" x2="0" y2="15" stroke="currentColor" strokeWidth="3.5" className="text-zinc-900 dark:text-white" />
              <line x1="10" y1="-8" x2="10" y2="8" stroke="currentColor" strokeWidth="5" className="text-zinc-900 dark:text-white" />

              <text x="0" y="44" textAnchor="middle" className="text-[12px] font-black fill-zinc-900 dark:fill-white font-mono">
                {voltage}V Battery ⟳
              </text>
            </g>

            {/* 2. SWITCH COMPONENT (Top Side: x=300, y=70) - TACTILE TAP TO TOGGLE */}
            <g
              transform="translate(300, 70)"
              className="cursor-pointer group"
              onClick={handleToggleSwitch}
            >
              {/* Touch area target */}
              <rect x="-50" y="-30" width="100" height="60" fill="transparent" />
              <rect x="-42" y="-22" width="84" height="44" rx="8" fill="white" className="dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700 group-hover:stroke-zinc-900 dark:group-hover:stroke-white transition-all shadow-xs" strokeWidth="1.5" />

              {/* Glowing active ring pulse on tap */}
              {activeTappedComponent === "switch" && (
                <circle cx="0" cy="0" r="38" stroke="currentColor" fill="none" strokeWidth="2" className="text-zinc-900 dark:text-white animate-ping" />
              )}

              {/* Terminals */}
              <circle cx="-25" cy="0" r="4" fill="currentColor" className="text-zinc-900 dark:text-white" />
              <circle cx="25" cy="0" r="4" fill="currentColor" className="text-zinc-900 dark:text-white" />

              {/* Blade */}
              {isSwitchClosed ? (
                <line x1="-25" y1="0" x2="25" y2="0" stroke="currentColor" strokeWidth="4" className="text-zinc-900 dark:text-white" />
              ) : (
                <line x1="-25" y1="0" x2="20" y2="-22" stroke="currentColor" strokeWidth="4" className="text-zinc-900 dark:text-white" />
              )}

              <text x="0" y="32" textAnchor="middle" className="text-[11px] font-bold fill-zinc-700 dark:fill-zinc-300">
                {isSwitchClosed ? "⚡ CLOSED (Tap)" : "⭕ OPEN (Tap)"}
              </text>
            </g>

            {/* 3. RESISTANCE BOX (Right Side: x=480, y=180) - TACTILE TAP TO TUNE */}
            <g
              transform="translate(480, 180)"
              onClick={handleTapResistor}
              className="cursor-pointer group"
            >
              {/* Touch area target */}
              <rect x="-45" y="-40" width="90" height="80" fill="transparent" />
              <rect x="-35" y="-30" width="70" height="60" rx="8" fill="white" className="dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700 group-hover:stroke-zinc-900 dark:group-hover:stroke-white transition-all shadow-xs" strokeWidth="1.5" />

              {/* Glowing active ring pulse on tap */}
              {activeTappedComponent === "resistor" && (
                <circle cx="0" cy="0" r="38" stroke="currentColor" fill="none" strokeWidth="2" className="text-zinc-900 dark:text-white animate-ping" />
              )}

              {/* Resistor Zig-Zag */}
              <path
                d="M 0 -22 L 0 -12 L -12 -8 L 12 -2 L -12 4 L 12 10 L -12 16 L 0 20 L 0 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinejoin="round"
                className="text-zinc-900 dark:text-white"
              />
              <text x="0" y="44" textAnchor="middle" className="text-[12px] font-black fill-zinc-900 dark:fill-white font-mono">
                R = {resistance} Ω ⟳
              </text>
            </g>

            {/* 4. LIGHT BULB (Bottom Side: x=300, y=290) - TACTILE TAP TO INSPECT */}
            <g
              transform="translate(300, 290)"
              onClick={handleTapBulb}
              className="cursor-pointer group"
            >
              {/* Touch area target */}
              <rect x="-50" y="-40" width="100" height="80" fill="transparent" />
              <rect x="-40" y="-30" width="80" height="60" rx="8" fill="white" className="dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700 group-hover:stroke-zinc-900 dark:group-hover:stroke-white transition-all shadow-xs" strokeWidth="1.5" />

              {/* Glowing active ring pulse on tap */}
              {activeTappedComponent === "bulb" && (
                <circle cx="0" cy="0" r="40" stroke="currentColor" fill="none" strokeWidth="2" className="text-amber-500 animate-ping" />
              )}

              {/* Dynamic Bulb Glow Radiations */}
              {isSwitchClosed && (
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r={24 + (bulbBrightness / 100) * 28}
                    fill="currentColor"
                    className="text-amber-400 dark:text-amber-300"
                    opacity={0.15 + (bulbBrightness / 100) * 0.45}
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r={18 + (bulbBrightness / 100) * 14}
                    fill="currentColor"
                    className="text-amber-300 dark:text-amber-200"
                    opacity={0.3 + (bulbBrightness / 100) * 0.55}
                  />
                </>
              )}

              {/* Bulb Outline */}
              <circle
                cx="0"
                cy="0"
                r="18"
                fill={isSwitchClosed ? (bulbBrightness > 50 ? "#FEF08A" : "#FDE68A") : "none"}
                stroke="currentColor"
                strokeWidth="2.5"
                className={
                  isSwitchClosed
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-700 dark:text-zinc-300"
                }
              />

              {/* Filament Cross */}
              <path
                d="M -7 -6 L 0 4 L 7 -6"
                fill="none"
                stroke={isSwitchClosed ? "#B45309" : "currentColor"}
                strokeWidth="2.5"
                className={!isSwitchClosed ? "text-zinc-900 dark:text-zinc-100" : ""}
              />

              <text x="0" y="42" textAnchor="middle" className="text-[11px] font-bold fill-zinc-700 dark:fill-zinc-300">
                Bulb: {bulbBrightness}% Glow
              </text>
            </g>
          </svg>
        </div>

        {/* Floating XP Badge on task completion or circuit activate */}
        <XpFloatingBadge
          amount={30}
          label="Circuit Closed"
          isVisible={showXpFloater}
          onComplete={() => setShowXpFloater(false)}
        />

        {/* Live Gauges Box (Ammeter & Voltmeter) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {/* Voltmeter */}
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-0.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Voltmeter (V)
            </div>
            <div className="text-lg font-black text-zinc-900 dark:text-white font-mono">
              {isSwitchClosed ? `${voltage}.00 V` : "0.00 V"}
            </div>
          </div>

          {/* Ammeter */}
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-0.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Ammeter (I = V/R)
            </div>
            <div className="text-lg font-black text-zinc-900 dark:text-white font-mono">
              {current.toFixed(3)} A
            </div>
          </div>

          {/* Resistance */}
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-0.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Resistance (R)
            </div>
            <div className="text-lg font-black text-zinc-900 dark:text-white font-mono">
              {resistance} Ω
            </div>
          </div>

          {/* Power */}
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-0.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Power (P = V×I)
            </div>
            <div className="text-lg font-black text-zinc-900 dark:text-white font-mono">
              {power.toFixed(2)} W
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Control Sliders & Switch Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* 1. Voltage Selector */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
          <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
            <span>Battery Voltage (V):</span>
            <span className="font-mono text-sm">{voltage} Volts</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[3, 6, 9, 12].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVoltage(v)}
                className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                  voltage === v
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                    : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
        </div>

        {/* 2. Resistance Slider */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Resistance Box:
            </span>
            <span className="font-mono text-sm">{resistance} Ω</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
            <span>1 Ω (Low)</span>
            <span>50 Ω</span>
            <span>100 Ω (High)</span>
          </div>
        </div>

        {/* 3. Switch Controller */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5" /> Knife Switch Toggle:
          </span>
          <button
            type="button"
            onClick={() => setIsSwitchClosed(!isSwitchClosed)}
            className={`w-full min-h-[44px] py-2 px-3 rounded-lg text-xs font-extrabold border transition-colors flex items-center justify-center gap-2 ${
              isSwitchClosed
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isSwitchClosed ? "Circuit Closed (ON)" : "Circuit Open (OFF)"}</span>
          </button>
        </div>
      </div>

      {/* Hypothesis Record Table (If in Experiment Mode) */}
      {mode === "experiment" && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
              Experiment Observation Data Table (Ohm&apos;s Law Verification)
            </div>
            <button
              type="button"
              disabled={!isSwitchClosed}
              onClick={handleRecordExperimentRow}
              className="min-h-[36px] px-3 py-1 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-40 text-white dark:text-zinc-900 rounded-md font-bold text-xs shadow-xs transition-colors"
            >
              + Record Current Trial
            </button>
          </div>

          {recordedData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold">
                  <tr>
                    <th className="p-2 border-b">Trial #</th>
                    <th className="p-2 border-b">Voltage (V)</th>
                    <th className="p-2 border-b">Resistance (R)</th>
                    <th className="p-2 border-b">Current I = V/R</th>
                    <th className="p-2 border-b">Power (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {recordedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white dark:hover:bg-zinc-900 font-mono">
                      <td className="p-2 font-sans font-bold">#{recordedData.length - idx}</td>
                      <td className="p-2">{row.v} V</td>
                      <td className="p-2">{row.r} Ω</td>
                      <td className="p-2 font-bold">{row.i} A</td>
                      <td className="p-2">{row.p} W</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic text-center py-2">
              Close the switch and click &quot;+ Record Current Trial&quot; to log experimental data points.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
