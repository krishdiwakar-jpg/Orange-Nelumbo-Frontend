"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Pause, Play, RotateCcw, Sparkles, X } from "lucide-react";

import type { Simulation } from "@/types/platform";

const gravity = 9.8;

export function SimulationLab({ simulation }: { simulation: Simulation }) {
  const [launchSpeed, setLaunchSpeed] = useState(simulation.controls?.[0]?.initialValue ?? 9.8);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);

  const totalTime = (2 * launchSpeed) / gravity;
  const apexTime = launchSpeed / gravity;
  const maxHeight = (launchSpeed * launchSpeed) / (2 * gravity);
  const velocity = launchSpeed - gravity * time;
  const height = Math.max(0, launchSpeed * time - 0.5 * gravity * time * time);
  const acceleration = -gravity;

  useEffect(() => {
    if (!playing) {
      previousRef.current = null;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        setTime(totalTime);
        setPlaying(false);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }
    const animate = (timestamp: number) => {
      if (previousRef.current == null) previousRef.current = timestamp;
      const delta = Math.min(0.05, (timestamp - previousRef.current) / 1000);
      previousRef.current = timestamp;
      setTime((current) => {
        const next = current + delta;
        if (next >= totalTime) { setPlaying(false); return totalTime; }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [playing, totalTime]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("button, a, input, textarea, select")) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (time >= totalTime) setTime(0);
        setPlaying((value) => !value);
      }
      if (event.key.toLowerCase() === "r") {
        setPlaying(false);
        setTime(0);
        previousRef.current = null;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [time, totalTime]);

  const reset = () => { setPlaying(false); setTime(0); previousRef.current = null; };
  const setPreset = (speed: number) => { setLaunchSpeed(speed); setPlaying(false); setTime(0); };

  const ballY = 330 - (height / Math.max(maxHeight, 0.1)) * 245;
  const graphX = 46 + (time / Math.max(totalTime, 0.1)) * 500;
  const graphY = 175 - (velocity / Math.max(launchSpeed, 0.1)) * 120;
  const trajectory = useMemo(() => {
    const points = Array.from({ length: 51 }, (_, index) => {
      const t = (totalTime * index) / 50;
      const v = launchSpeed - gravity * t;
      const x = 46 + (t / totalTime) * 500;
      const y = 175 - (v / launchSpeed) * 120;
      return `${x},${y}`;
    });
    return points.join(" ");
  }, [launchSpeed, totalTime]);

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC]/80 hover:text-white" href="/simulations"><ArrowLeft size={17} /> All simulations</Link>
        <div className="flex items-center gap-3"><span className="size-2 bg-[#3DE08A]" /><span className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE08A]">Lab live</span></div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="border border-[#FF5A1F]/25 bg-[#161418]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/8 p-5 sm:p-7">
            <div><p className="mono-kicker">KIN-006 → 011 · Interactive model</p><h2 className="mt-3 font-display text-3xl font-semibold">{simulation.shortTitle}</h2><p className="mt-2 max-w-2xl text-[#C7C5CC]/80">{simulation.description}</p></div>
            <div className="flex gap-2"><button aria-label={playing ? "Pause simulation" : "Play simulation"} className="grid size-11 place-items-center border border-[#FF5A1F]/40 text-[#FF8A3D] hover:bg-[#FF5A1F]/8" onClick={() => { if (time >= totalTime) setTime(0); setPlaying((value) => !value); }} type="button">{playing ? <Pause size={19} /> : <Play size={19} />}</button><button aria-label="Reset simulation" className="grid size-11 place-items-center border border-white/12 text-[#C7C5CC]/80 hover:border-[#FF5A1F] hover:text-white" onClick={reset} type="button"><RotateCcw size={18} /></button></div>
          </div>
          <div className="grid lg:grid-cols-[.78fr_1.22fr]">
            <div className="relative min-h-[420px] overflow-hidden border-b border-white/8 bg-[#0E0D10] lg:border-b-0 lg:border-r">
              <svg aria-label="Ball moving vertically under gravity" className="absolute inset-0 size-full" viewBox="0 0 420 420">
                <defs><linearGradient id="simGlow" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#FF8A3D"/><stop offset="1" stopColor="#FF5A1F"/></linearGradient><filter id="ballGlow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                {Array.from({length:9},(_,i)=><line key={`h${i}`} x1="0" x2="420" y1={i*52.5} y2={i*52.5} stroke="#2A262E"/>)}
                {Array.from({length:9},(_,i)=><line key={`v${i}`} y1="0" y2="420" x1={i*52.5} x2={i*52.5} stroke="#2A262E"/>)}
                <line x1="55" x2="365" y1="330" y2="330" stroke="#C7C5CC" strokeWidth="1" />
                <path d={`M210 330 Q210 85 210 330`} fill="none" stroke="#FF5A1F" strokeDasharray="5 7" opacity=".5" />
                <circle cx="210" cy={ballY} fill="url(#simGlow)" filter="url(#ballGlow)" r="12" />
                <line x1="210" x2="210" y1={ballY+20} y2={Math.min(365,ballY+64)} stroke="#3DE0D0" strokeWidth="2" />
                <path d={`M204 ${Math.min(358,ballY+56)} L210 ${Math.min(368,ballY+68)} L216 ${Math.min(358,ballY+56)}`} fill="none" stroke="#3DE0D0" strokeWidth="2" />
                <text x="228" y={Math.min(388,ballY+55)} fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="10">a = −g</text>
                <text x="55" y="355" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="9">LAUNCH LEVEL · y = 0</text>
                <text x="55" y="34" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="9">MAX HEIGHT {maxHeight.toFixed(2)} m</text>
              </svg>
            </div>
            <div className="p-5 sm:p-7">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {[['TIME',time.toFixed(2),'s'],['HEIGHT',height.toFixed(2),'m'],['VELOCITY',velocity.toFixed(2),'m/s'],['ACCELERATION',acceleration.toFixed(2),'m/s²']].map(([label,value,unit])=><div className="border border-white/9 bg-[#0E0D10] p-4" key={label}><p className="font-mono text-[11px] tracking-[.14em] text-[#C7C5CC]/70">{label}</p><p className={`mt-3 font-mono text-xl ${label==='VELOCITY'&&Math.abs(velocity)<.12?'text-[#F6C344]':'text-[#3DE0D0]'}`}>{value} <span className="text-[11px] text-[#C7C5CC]/70">{unit}</span></p></div>)}</div>
              <div className="mt-5 border border-white/9 bg-[#0E0D10] p-4"><div className="flex items-center justify-between"><p className="font-mono text-[11px] tracking-[.14em] text-[#C7C5CC]/70">LIVE EQUATION</p><p className="font-mono text-[11px] text-[#FF8A3D]">t apex = {apexTime.toFixed(2)} s</p></div><p className="mt-3 overflow-x-auto font-mono text-sm text-[#C7C5CC]">y = {launchSpeed.toFixed(1)}t − 4.9t² = {height.toFixed(2)} m</p></div>
              <div className="mt-5 border border-white/9 bg-[#0E0D10] p-3"><p className="mb-2 font-mono text-[11px] tracking-[.14em] text-[#C7C5CC]/70">VELOCITY–TIME</p><svg aria-label="Velocity versus time graph" className="w-full" viewBox="0 0 590 270"><line x1="46" x2="546" y1="175" y2="175" stroke="#C7C5CC"/><line x1="46" x2="46" y1="40" y2="250" stroke="#C7C5CC"/><polyline fill="none" points={trajectory} stroke="#FF5A1F" strokeWidth="3"/><line x1={graphX} x2={graphX} y1="40" y2="250" stroke="#3DE0D0" strokeDasharray="4 5"/><circle cx={graphX} cy={graphY} fill="#3DE0D0" r="5"/><text x="50" y="30" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10">v (m/s)</text><text x="500" y="245" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10">t (s)</text></svg></div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="border border-[#FF5A1F]/22 bg-[#161418] p-6">
            <p className="mono-kicker">Control panel</p>
            <label className="mt-6 block" htmlFor="launch-speed"><span className="flex items-center justify-between text-sm font-semibold"><span>Launch speed</span><span className="font-mono text-[#3DE0D0]">{launchSpeed.toFixed(1)} m/s</span></span><input className="mt-4 w-full accent-[#FF5A1F]" id="launch-speed" max="19.6" min="4.9" onChange={(event)=>{setLaunchSpeed(Number(event.target.value));reset();}} step="0.1" type="range" value={launchSpeed}/><span className="mt-2 flex justify-between font-mono text-[11px] text-[#C7C5CC]/70"><span>4.9</span><span>19.6</span></span></label>
            <div className="mt-6 grid grid-cols-2 gap-2">{[[4.9,'Quick hop'],[9.8,'One-second apex'],[14.7,'High throw'],[19.6,'Two-second apex']].map(([speed,label])=><button className={`min-h-11 border px-3 text-left text-xs font-semibold ${Math.abs(launchSpeed-(speed as number))<.01?'border-[#FF5A1F] bg-[#FF5A1F]/8 text-white':'border-white/10 text-[#C7C5CC]/80 hover:text-white'}`} key={speed as number} onClick={()=>setPreset(speed as number)} type="button"><span className="block font-mono text-[11px] text-[#FF8A3D]">{speed} m/s</span>{label as string}</button>)}</div>
            <button className="button-primary mt-6 w-full" onClick={()=>{if(time>=totalTime)setTime(0);setPlaying((value)=>!value);}} type="button">{playing?<><Pause size={17}/> Pause</>:<><Play size={17}/> {time>0?'Continue':'Launch'}</>}</button>
          </section>
          <section className="border border-[#3DE0D0]/25 bg-[#161418] p-6"><div className="flex items-center justify-between"><p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">Predict first</p><Sparkles className="text-[#3DE0D0]" size={19}/></div><h3 className="mt-5 font-display text-xl font-semibold">At the apex, acceleration is:</h3><div className="mt-4 grid gap-2">{['Zero — the ball stops','9.8 m/s² downward'].map((option,index)=><button className={`min-h-11 border px-3 text-left text-sm ${prediction===index?index===1?'border-[#3DE08A] bg-[#3DE08A]/8':'border-[#E0483C] bg-[#E0483C]/8':'border-white/10 text-[#C7C5CC]/80'}`} key={option} onClick={()=>setPrediction(index)} type="button">{prediction!==null&&prediction===index?(index===1?<Check className="mr-2 inline text-[#3DE08A]" size={15}/>:<X className="mr-2 inline text-[#E0483C]" size={15}/>):null}{option}</button>)}</div>{prediction!==null&&<p className="mt-4 text-sm leading-6 text-[#C7C5CC]">Velocity is momentarily zero; gravity is not. Acceleration stays 9.8 m/s² downward.</p>}</section>
          <section className="border border-white/9 bg-[#0E0D10] p-5"><p className="font-semibold">Keyboard</p><div className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs text-[#C7C5CC]/70"><kbd className="border border-white/12 px-2 py-1 font-mono">Space</kbd><span>Play / pause</span><kbd className="border border-white/12 px-2 py-1 font-mono">R</kbd><span>Reset</span></div></section>
        </aside>
      </div>
    </div>
  );
}
