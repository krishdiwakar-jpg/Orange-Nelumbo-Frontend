import type { LucideIcon } from "lucide-react";

export function PreferenceToggle({
  checked,
  description,
  disabled = false,
  icon: Icon,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-white/8 py-5 last:border-b-0">
      <span className="grid size-10 shrink-0 place-items-center border border-white/10 bg-[#0E0D10] text-[#FF8A3D]">
        <Icon aria-hidden="true" size={17} strokeWidth={1.6} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[#C7C5CC]/80">{description}</p>
      </div>
      <button
        aria-label={`${checked ? "Disable" : "Enable"} ${label}`}
        aria-checked={checked}
        className={`relative h-11 w-14 shrink-0 border transition disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "border-[#FF5A1F] bg-[#FF5A1F]" : "border-[#55505C] bg-[#2A262E]"
        }`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <span className={`absolute top-[11px] size-5 bg-[#FAF8F2] transition-[left] ${checked ? "left-[30px]" : "left-1"}`} />
      </button>
    </div>
  );
}
