"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Play, RotateCcw, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LessonLab } from "@/types/platform";

const GRAVITY = 9.8;

function flightTime(speed: number, groundOffset = 0) {
  return (speed + Math.sqrt(Math.max(0, speed * speed - 2 * GRAVITY * groundOffset))) / GRAVITY;
}

function heightAt(speed: number, time: number) {
  return speed * time - 0.5 * GRAVITY * time * time;
}

function velocityAt(speed: number, time: number) {
  return speed - GRAVITY * time;
}

function fixed(value: number) {
  const safe = Math.abs(value) < 0.005 ? 0 : value;
  return `${safe < 0 ? "−" : ""}${Math.abs(safe).toFixed(2)}`;
}

export function VerticalThrowLab({ lab }: { lab: LessonLab }) {
  const initialPreset = lab.presets[0];
  const [presetId, setPresetId] = useState(initialPreset.id);
  const [launchSpeed, setLaunchSpeed] = useState(initialPreset.launchSpeed);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const startedAt = useRef(0);
  const preset = lab.presets.find((item) => item.id === presetId) ?? initialPreset;
  const duration = useMemo(
    () =>
      Math.max(
        flightTime(launchSpeed, preset.groundOffset),
        preset.secondLaunchSpeed
          ? flightTime(preset.secondLaunchSpeed, preset.groundOffset)
          : 0,
      ),
    [launchSpeed, preset.groundOffset, preset.secondLaunchSpeed],
  );

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        setElapsed(duration);
        setRunning(false);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }
    let frame = 0;
    const step = (now: number) => {
      const next = Math.min(duration, (now - startedAt.current) / 1000);
      setElapsed(next);
      if (next >= duration) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [duration, running]);

  const mainFlight = flightTime(launchSpeed, preset.groundOffset);
  const mainTime = Math.min(elapsed, mainFlight);
  const height = elapsed >= mainFlight ? (preset.groundOffset ?? 0) : heightAt(launchSpeed, mainTime);
  const velocity = elapsed >= mainFlight ? 0 : velocityAt(launchSpeed, mainTime);
  const apexTime = launchSpeed / GRAVITY;
  const status = elapsed === 0
    ? "Ready"
    : elapsed >= mainFlight
      ? "Landed"
      : Math.abs(mainTime - apexTime) < 0.045
        ? "Apex"
        : mainTime < apexTime
          ? "Rising"
          : "Falling";

  const secondSpeed = preset.secondLaunchSpeed;
  const secondFlight = secondSpeed ? flightTime(secondSpeed, preset.groundOffset) : 0;
  const secondTime = secondSpeed ? Math.min(elapsed, secondFlight) : 0;
  const secondHeight = secondSpeed
    ? elapsed >= secondFlight
      ? (preset.groundOffset ?? 0)
      : heightAt(secondSpeed, secondTime)
    : 0;
  const maxApex = Math.max(
    launchSpeed * launchSpeed / (2 * GRAVITY),
    secondSpeed ? secondSpeed * secondSpeed / (2 * GRAVITY) : 0,
  );
  const minHeight = Math.min(0, preset.groundOffset ?? 0);
  const maxHeight = Math.max(1, maxApex);
  const span = maxHeight - minHeight;
  const trackTop = 40;
  const trackBottom = 316;
  const toY = (value: number) => trackBottom - ((value - minHeight) / span) * (trackBottom - trackTop);
  const graphLeft = 340;
  const graphRight = 770;
  const graphTop = 42;
  const graphBottom = 316;
  const maxVelocity = Math.max(
    launchSpeed,
    Math.abs(velocityAt(launchSpeed, mainFlight)),
    secondSpeed ?? 0,
    secondSpeed ? Math.abs(velocityAt(secondSpeed, secondFlight)) : 0,
    1,
  );
  const graphX = (time: number) => graphLeft + (time / Math.max(duration, 0.01)) * (graphRight - graphLeft);
  const graphY = (value: number) => graphTop + ((maxVelocity - value) / (2 * maxVelocity)) * (graphBottom - graphTop);

  function choosePreset(id: string) {
    const next = lab.presets.find((item) => item.id === id);
    if (!next) return;
    setRunning(false);
    setPresetId(next.id);
    setLaunchSpeed(next.launchSpeed);
    setElapsed(0);
    setPrediction(null);
    startedAt.current = 0;
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    startedAt.current = 0;
  }

  function run() {
    setElapsed(0);
    startedAt.current = performance.now();
    setRunning(true);
  }

  return (
    <div className="overflow-hidden border border-[#FF5A1F]/30 bg-[#0E0D10] shadow-[0_0_70px_rgba(255,90,31,.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-4 sm:px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#FF5A1F]">{lab.title}</p>
          <p className="mt-1 text-xs text-[#C7C5CC]/70">Run the process · a = −g constant · no air resistance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={status === "Landed" ? "success" : status === "Apex" ? "cyan" : "brand"}>{status}</Badge>
          <Button aria-label="Reset simulation" onClick={reset} size="sm" variant="ghost"><RotateCcw size={15} /> Reset</Button>
        </div>
      </div>

      <div className="brand-grid border-b border-white/8 bg-[#0E0D10] p-2 sm:p-4">
        <svg
          aria-label="A vertical throw beside its live velocity-time graph"
          className="h-auto min-h-[300px] w-full"
          role="img"
          viewBox="0 0 800 360"
        >
          <defs>
            <filter id="lab-ball-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <marker id="lab-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5" viewBox="0 0 7 7"><path d="M0 0L7 3.5L0 7Z" fill="#FF5A1F" /></marker>
          </defs>

          <line stroke="#3A3640" strokeWidth="1" x1="45" x2="285" y1={toY(0)} y2={toY(0)} />
          <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="9" x="46" y={toY(0) - 9}>LAUNCH LEVEL · y = 0</text>
          {minHeight < 0 ? <><line stroke="#8A2F0A" strokeWidth="1" x1="45" x2="285" y1={toY(minHeight)} y2={toY(minHeight)} /><text fill="#FF8A3D" fontFamily="JetBrains Mono" fontSize="9" x="46" y={toY(minHeight) - 8}>GROUND · y = {minHeight.toFixed(1)} m</text></> : null}
          <line stroke="#C7C5CC" strokeDasharray="5 7" strokeOpacity=".45" x1="125" x2="125" y1={trackTop} y2={trackBottom} />
          {secondSpeed ? <line stroke="#C7C5CC" strokeDasharray="5 7" strokeOpacity=".25" x1="225" x2="225" y1={trackTop} y2={trackBottom} /> : null}

          {Math.abs(velocity) > 0.04 && elapsed < mainFlight ? (
            <line
              markerEnd="url(#lab-arrow)"
              stroke="#FF5A1F"
              strokeWidth="2.5"
              x1="150"
              x2="150"
              y1={toY(height)}
              y2={toY(height) + Math.max(-55, Math.min(55, -velocity * 4))}
            />
          ) : null}
          <circle cx="125" cy={toY(height)} fill="#F5D9A8" filter="url(#lab-ball-glow)" r="10" />
          <text fill="#FF8A3D" fontFamily="JetBrains Mono" fontSize="9" x="158" y={toY(height) + 3}>v = {fixed(velocity)} m/s</text>
          {secondSpeed ? <><circle cx="225" cy={toY(secondHeight)} fill="#3DE0D0" filter="url(#lab-ball-glow)" r="9" /><text fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="9" x="238" y={toY(secondHeight) + 3}>u₂</text></> : null}

          <line stroke="#55505C" x1={graphLeft} x2={graphRight} y1={graphY(0)} y2={graphY(0)} />
          <line stroke="#55505C" x1={graphLeft} x2={graphLeft} y1={graphTop} y2={graphBottom} />
          <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="9" x={graphLeft + 7} y={graphTop + 3}>v (m/s)</text>
          <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x={graphRight} y={graphY(0) - 9}>t (s)</text>
          <line stroke="#3DE0D0" strokeDasharray="5 7" strokeOpacity=".22" strokeWidth="2" x1={graphX(0)} x2={graphX(mainFlight)} y1={graphY(launchSpeed)} y2={graphY(velocityAt(launchSpeed, mainFlight))} />
          <line stroke="#3DE0D0" strokeWidth="3" x1={graphX(0)} x2={graphX(mainTime)} y1={graphY(launchSpeed)} y2={graphY(velocityAt(launchSpeed, mainTime))} />
          <circle cx={graphX(Math.min(apexTime, mainTime))} cy={graphY(mainTime >= apexTime ? 0 : velocityAt(launchSpeed, mainTime))} fill="#3DE0D0" r="4" />
          {mainTime >= apexTime ? <text fill="#FFB020" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x={graphX(apexTime)} y={graphY(0) + 18}>APEX</text> : null}
          {secondSpeed ? <line stroke="#FF8A3D" strokeOpacity=".8" strokeWidth="2" x1={graphX(0)} x2={graphX(secondTime)} y1={graphY(secondSpeed)} y2={graphY(velocityAt(secondSpeed, secondTime))} /> : null}
          <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="9" x={graphLeft} y="344">t = {fixed(mainTime)} s</text>
          <text fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x={graphRight} y="344">slope = −g = −9.80 m/s²</text>
        </svg>
      </div>

      <div className="grid border-b border-white/8 sm:grid-cols-4">
        {[
          ["t", `${fixed(mainTime)} s`, "text-[#3DE0D0]"],
          ["v", `${fixed(velocity)} m/s`, "text-[#3DE0D0]"],
          ["y", `${fixed(height)} m`, "text-[#3DE0D0]"],
          ["a", "−9.80 m/s²", "text-[#FF8A3D]"],
        ].map(([label, value, colour], index) => (
          <div className={`p-4 sm:p-5 ${index ? "border-t border-white/8 sm:border-l sm:border-t-0" : ""}`} key={label}>
            <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70">{label}</p>
            <p aria-live="polite" className={`mt-2 font-mono text-lg font-semibold ${colour}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="block">
          <span className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]">
            <span>{lab.controls[0].label}</span><span className="text-[#3DE0D0]">{launchSpeed.toFixed(2)} m/s</span>
          </span>
          <input
            aria-label="Launch speed in metres per second"
            className="mt-4 h-8 w-full cursor-pointer accent-[#FF5A1F]"
            max={lab.controls[0].max}
            min={lab.controls[0].min}
            onChange={(event) => {
              setRunning(false);
              setElapsed(0);
              setLaunchSpeed(Number(event.target.value));
            }}
            step={lab.controls[0].step}
            type="range"
            value={launchSpeed}
          />
          <span className="flex justify-between font-mono text-[11px] text-[#C7C5CC]/70"><span>{lab.controls[0].min}</span><span>{lab.controls[0].max} m/s</span></span>
        </label>
        <Button className="min-w-44" disabled={running} onClick={run} size="lg"><Play size={17} /> {running ? "Running…" : "Run throw"}</Button>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/8 px-5 py-4 sm:px-6">
        {lab.presets.map((item) => (
          <button
            aria-pressed={item.id === presetId}
            className={`min-h-11 border px-3 font-mono text-[11px] uppercase tracking-[.1em] transition ${item.id === presetId ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF8A3D]" : "border-white/10 text-[#C7C5CC]/70 hover:border-[#FF5A1F]/35 hover:text-white"}`}
            key={item.id}
            onClick={() => choosePreset(item.id)}
            type="button"
          >
            {item.label} · {item.conceptId}
          </button>
        ))}
      </div>

      <div className="grid border-t border-white/8 lg:grid-cols-2">
        <div className="p-5 sm:p-6">
          <p className="mono-kicker">The equation · live</p>
          <p className="mt-4 overflow-x-auto whitespace-nowrap font-mono text-sm text-[#C7C5CC] sm:text-base">
            v = u − gt = <span className="text-[#3DE0D0]">{launchSpeed.toFixed(2)}</span> − 9.80 × <span className="text-[#3DE0D0]">{fixed(mainTime)}</span> = <span className="text-[#FF8A3D]">{fixed(velocity)} m/s</span>
          </p>
          <p className="mt-5 text-sm leading-6 text-[#C7C5CC]/80">{lab.model}</p>
        </div>
        <div className="border-t border-white/8 p-5 sm:p-6 lg:border-l lg:border-t-0">
          <p className="mono-kicker">Predict · then run</p>
          <p className="mt-4 text-sm font-semibold text-white">{lab.prediction.prompt}</p>
          <div className="mt-4 grid gap-2">
            {lab.prediction.options.map((option, index) => {
              const selected = prediction === index;
              const correct = index === lab.prediction.correctOption;
              const revealed = prediction !== null;
              return (
                <button
                  className={`flex min-h-11 items-center gap-3 border px-3 text-left text-sm transition ${revealed && correct ? "border-[#3DE08A] bg-[#3DE08A]/8 text-[#3DE08A]" : revealed && selected ? "border-[#E0483C] bg-[#E0483C]/8 text-[#E0483C]" : "border-white/10 text-[#C7C5CC] hover:border-[#FF5A1F]/35"}`}
                  disabled={revealed}
                  key={option}
                  onClick={() => setPrediction(index)}
                  type="button"
                >
                  <span className="grid size-6 shrink-0 place-items-center border border-current font-mono text-[11px]">{String.fromCharCode(65 + index)}</span>
                  <span className="flex-1">{option}</span>
                  {revealed && correct ? <Check size={16} /> : revealed && selected ? <X size={16} /> : null}
                </button>
              );
            })}
          </div>
          {prediction !== null ? (
            <p className="mt-4 border-l-2 border-[#3DE08A] bg-[#3DE08A]/6 px-4 py-3 text-sm leading-6 text-[#C7C5CC]">{lab.prediction.explanation}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
