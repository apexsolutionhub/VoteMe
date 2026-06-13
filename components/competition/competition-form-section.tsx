import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CompetitionFormSectionProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CompetitionFormSection({
  title,
  description,
  badge,
  trailing,
  children,
  className,
}: CompetitionFormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-white/2 p-5 sm:p-6",
        className,
      )}
    >
      <header className="mb-5 flex flex-col gap-3 border-b border-white/6 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {badge}
          </div>
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {trailing ? (
          <div className="shrink-0 text-xs text-muted-foreground">{trailing}</div>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function CriterionModeBadge({
  mode,
  accent,
}: {
  mode: "create" | "edit";
  accent: "violet" | "amber";
}) {
  const styles = {
    violet: "border-violet-400/30 bg-violet-500/12 text-violet-200",
    amber: "border-amber-400/30 bg-amber-500/12 text-amber-200",
  };

  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium", styles[accent])}>
      {mode === "edit" ? "Editing" : "New"}
    </Badge>
  );
}
