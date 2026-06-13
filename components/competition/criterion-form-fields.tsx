import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function CriterionField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-medium text-foreground/90">{label}</Label>
      {children}
      {hint ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function CriterionActiveToggle({
  checked,
  onCheckedChange,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{checked ? activeLabel : inactiveLabel}</p>
        <p className="text-[11px] text-muted-foreground">
          {checked
            ? "Included in progress and scoring"
            : "Hidden from candidates and scoring"}
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function CriterionPillGroup<T extends string>({
  value,
  onChange,
  options,
  accent = "violet",
  columns = 2,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; description?: string }[];
  accent?: "violet" | "amber";
  columns?: 2 | 3;
}) {
  const activeStyles = {
    violet:
      "border-violet-400/45 bg-violet-500/18 text-violet-50 shadow-[0_0_20px_-8px_oklch(0.55_0.2_300)]",
    amber:
      "border-amber-400/45 bg-amber-500/18 text-amber-50 shadow-[0_0_20px_-8px_oklch(0.7_0.15_75)]",
  };

  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150",
              selected
                ? activeStyles[accent]
                : "border-white/10 bg-white/2 text-muted-foreground hover:border-white/18 hover:bg-white/4 hover:text-foreground",
            )}
          >
            <span className="block text-sm font-medium">{option.label}</span>
            {option.description ? (
              <span className="mt-0.5 block text-[11px] leading-snug opacity-80">
                {option.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
