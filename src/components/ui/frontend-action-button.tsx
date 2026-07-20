"use client";

import { ArrowRight, Check } from "lucide-react";
import { usePathname } from "next/navigation";

import { useDeviceState } from "@/components/account/use-device-state";
import { useApp } from "@/components/providers/app-provider";

export function FrontendActionButton({
  actionKey,
  doneLabel,
  idleLabel,
}: {
  actionKey?: string;
  doneLabel: string;
  idleLabel: string;
}) {
  const { user } = useApp();
  const pathname = usePathname();
  const [done, setDone, ready] = useDeviceState(
    `orange-nelumbo:action:${user?.id ?? "guest"}:${actionKey ?? pathname}:v1`,
    false,
    (value) => value === true,
  );

  return (
    <button
      aria-pressed={done}
      className="button-primary"
      disabled={!ready}
      onClick={() => setDone(true)}
      type="button"
    >
      {done ? <Check aria-hidden="true" size={17} /> : null}
      {done ? doneLabel : idleLabel}
      {!done ? <ArrowRight aria-hidden="true" size={17} /> : null}
    </button>
  );
}
