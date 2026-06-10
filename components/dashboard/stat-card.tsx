import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "violet" | "amber" | "emerald" | "sky";
};

const accentStyles = {
  violet: {
    ring: "ring-violet-500/20",
    iconBg: "from-violet-500/30 to-indigo-600/15",
    icon: "text-violet-200",
    value: "text-violet-100",
    glow: "from-violet-500/20",
    border: "hover:border-violet-400/25",
  },
  amber: {
    ring: "ring-amber-500/20",
    iconBg: "from-amber-500/30 to-orange-600/15",
    icon: "text-amber-100",
    value: "text-amber-50",
    glow: "from-amber-500/20",
    border: "hover:border-amber-400/25",
  },
  emerald: {
    ring: "ring-emerald-500/20",
    iconBg: "from-emerald-500/30 to-teal-600/15",
    icon: "text-emerald-100",
    value: "text-emerald-50",
    glow: "from-emerald-500/20",
    border: "hover:border-emerald-400/25",
  },
  sky: {
    ring: "ring-sky-500/20",
    iconBg: "from-sky-500/30 to-cyan-600/15",
    icon: "text-sky-100",
    value: "text-sky-50",
    glow: "from-sky-500/20",
    border: "hover:border-sky-400/25",
  },
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "violet",
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl",
        "transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_-20px_oklch(0_0_0/60%)]",
        styles.border,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-linear-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          styles.glow,
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {label}
          </p>
          <p
            className={cn(
              "text-4xl font-bold tracking-tight tabular-nums",
              styles.value,
            )}
          >
            {value}
          </p>
          {hint ? (
            <p className="text-xs leading-relaxed text-muted-foreground/80">
              {hint}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ring-1",
            styles.iconBg,
            styles.ring,
          )}
        >
          <Icon className={cn("size-5", styles.icon)} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
