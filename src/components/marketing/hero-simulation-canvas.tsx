import { Activity, Atom, FlaskConical, Orbit, Waves } from "lucide-react";

const modules = [
  { code: "PHY-01", label: "Vertical throw", color: "#FF8A3D" },
  { code: "PHY-02", label: "Wave interference", color: "#3DE0D0" },
  { code: "CHM-01", label: "Orbital probability", color: "#B48CFF" },
  { code: "MAT-01", label: "Function transform", color: "#3DE08A" },
];

export function HeroSimulationCanvas() {
  return (
    <div className="home-simulation-canvas brand-grid" role="img" aria-label="Looping previews of five interactive science and mathematics simulations">
      <div className="flex items-center justify-between border-b border-white/9 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping bg-[#3DE08A] opacity-50" />
            <span className="relative inline-flex size-2 bg-[#3DE08A]" />
          </span>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#C7C5CC]">Live concept canvas</p>
        </div>
        <p className="font-mono text-[10px] text-[#FF8A3D]">05 MODELS / LOOP</p>
      </div>

      <div className="grid gap-px bg-white/8 sm:grid-cols-2">
        <div className="relative min-h-56 overflow-hidden bg-[#0E0D10]/96 p-5">
          <div className="flex items-center justify-between"><p className="font-mono text-[10px] text-[#FF8A3D]">01 / KINEMATICS</p><Activity size={17} className="text-[#FF8A3D]" /></div>
          <div className="relative mx-auto mt-3 h-40 max-w-52">
            <span className="absolute inset-y-2 left-1/2 border-l border-dashed border-white/25" />
            <span className="sim-ball-loop absolute left-1/2 size-6 -translate-x-1/2 bg-[#F5D9A8] shadow-[0_0_24px_rgba(255,138,61,.55)]" />
            <span className="absolute bottom-0 left-1/2 h-px w-36 -translate-x-1/2 bg-white/25" />
            <span className="absolute right-0 top-2 font-mono text-[9px] text-[#3DE0D0]">v = 0</span>
            <span className="absolute left-0 top-20 font-mono text-[9px] text-[#FF8A3D]">a = -g</span>
          </div>
          <p className="text-sm font-semibold">Vertical throw</p>
        </div>

        <div className="relative min-h-56 overflow-hidden bg-[#0E0D10]/96 p-5">
          <div className="flex items-center justify-between"><p className="font-mono text-[10px] text-[#3DE0D0]">02 / WAVES</p><Waves size={17} className="text-[#3DE0D0]" /></div>
          <svg className="mt-7 h-32 w-full" viewBox="0 0 260 120" aria-hidden="true">
            <path d="M0 60 C22 8 44 112 66 60 S110 8 132 60 S176 112 198 60 S242 8 264 60" fill="none" stroke="#3DE0D0" strokeOpacity=".35" strokeWidth="2" />
            <path className="sim-wave-draw" d="M0 60 C22 112 44 8 66 60 S110 112 132 60 S176 8 198 60 S242 112 264 60" fill="none" stroke="#FF5A1F" strokeWidth="2.5" />
            <line x1="0" x2="260" y1="60" y2="60" stroke="#C7C5CC" strokeOpacity=".22" />
          </svg>
          <p className="text-sm font-semibold">Interference</p>
        </div>

        <div className="relative min-h-52 overflow-hidden bg-[#0E0D10]/96 p-5">
          <div className="flex items-center justify-between"><p className="font-mono text-[10px] text-[#B48CFF]">03 / ATOMIC</p><Atom size={17} className="text-[#B48CFF]" /></div>
          <div className="relative mx-auto mt-4 size-32">
            <span className="absolute inset-0 rounded-full border border-[#B48CFF]/35" />
            <span className="sim-orbit-loop absolute inset-4 rounded-full border border-[#3DE0D0]/30"><i className="absolute -top-1 left-1/2 size-2 bg-[#3DE0D0] shadow-[0_0_14px_#3DE0D0]" /></span>
            <span className="absolute inset-[42px] rounded-full bg-[#FF8A3D] shadow-[0_0_26px_rgba(255,138,61,.4)]" />
          </div>
          <p className="text-sm font-semibold">Orbital probability</p>
        </div>

        <div className="relative min-h-52 overflow-hidden bg-[#0E0D10]/96 p-5">
          <div className="flex items-center justify-between"><p className="font-mono text-[10px] text-[#3DE08A]">04 / CALCULUS</p><Orbit size={17} className="text-[#3DE08A]" /></div>
          <svg className="mt-5 h-32 w-full" viewBox="0 0 260 120" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => <line key={`v-${index}`} x1={index * 43} x2={index * 43} y1="0" y2="120" stroke="#2A262E" />)}
            {Array.from({ length: 5 }, (_, index) => <line key={`h-${index}`} x1="0" x2="260" y1={index * 30} y2={index * 30} stroke="#2A262E" />)}
            <path className="sim-function-shift" d="M0 102 C45 104 66 78 92 61 C123 40 145 17 260 10" fill="none" stroke="#3DE08A" strokeWidth="3" />
            <circle className="sim-graph-point" cx="92" cy="61" r="5" fill="#FF8A3D" />
          </svg>
          <p className="text-sm font-semibold">Function transform</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-hidden border-t border-white/9 px-5 py-3">
        <FlaskConical size={15} className="shrink-0 text-[#FF8A3D]" />
        <div className="simulation-ticker flex min-w-max gap-8">
          {[...modules, ...modules].map((module, index) => <span className="font-mono text-[10px] uppercase tracking-[.12em] text-[#C7C5CC]/70" key={`${module.code}-${index}`}><b style={{ color: module.color }}>{module.code}</b> {module.label}</span>)}
        </div>
      </div>
    </div>
  );
}
