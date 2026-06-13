"use client";

import { ListChecks, Scale, Target, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

type CriteriaOverviewHeaderProps = {
  milestoneCount: number;
  metricCount: number;
  activeCount: number;
};

export function CriteriaOverviewHeader({
  milestoneCount,
  metricCount,
  activeCount,
}: CriteriaOverviewHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-violet-500/20",
        "bg-linear-to-br from-violet-500/12 via-fuchsia-500/6 to-amber-500/8 backdrop-blur-xl",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-violet-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-amber-500/15 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
            <ListChecks className="size-6 text-violet-300" />
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Milestones & scoring
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Configure progress milestones and scoring weights — editor on the
              left, saved items on the right.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatChip
            icon={Trophy}
            value={milestoneCount}
            label="Milestones"
            accent="violet"
          />
          <StatChip
            icon={Scale}
            value={metricCount}
            label="Metrics"
            accent="amber"
          />
          <StatChip
            icon={Target}
            value={activeCount}
            label="Active"
            accent="emerald"
          />
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  accent: "violet" | "amber" | "emerald";
}) {
  const styles = {
    violet: "border-violet-400/25 bg-violet-500/10 text-violet-100",
    amber: "border-amber-400/25 bg-amber-500/10 text-amber-100",
    emerald: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs",
        styles[accent],
      )}
    >
      <Icon className="size-3.5 opacity-80" />
      <span className="font-semibold tabular-nums">{value}</span>
      <span className="text-white/70">{label}</span>
    </div>
  );
}
