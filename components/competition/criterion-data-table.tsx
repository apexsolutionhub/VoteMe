"use client";

import { Award, Pencil, Target, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CompetitionCriterion } from "@/lib/competition-api";
import { formatMetricKey } from "@/lib/criterion-form-utils";
import { cn } from "@/lib/utils";

const GRID_COLUMNS =
  "minmax(0,1.6fr) minmax(0,0.9fr) minmax(0,0.75fr) 2.5rem 4rem 4.5rem";

export function CriterionRowHeader({ columns }: { columns: string[] }) {
  return (
    <div
      className="sticky top-0 z-10 grid gap-3 border-b border-white/10 bg-background/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
      style={{ gridTemplateColumns: GRID_COLUMNS }}
    >
      {columns.map((column) => (
        <span key={column} className={column === "" ? "sr-only" : undefined}>
          {column || "Actions"}
        </span>
      ))}
    </div>
  );
}

export function CriterionDataRow({
  item,
  isSelected,
  accent,
  detail,
  detailLabel = "Value",
  onEdit,
  onDelete,
}: {
  item: CompetitionCriterion;
  isSelected: boolean;
  accent: "violet" | "amber";
  detail: string;
  detailLabel?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const accentStyles = {
    violet: {
      bar: "bg-violet-400",
      selected: "bg-violet-500/12 ring-violet-400/35",
      glow: "shadow-[inset_3px_0_0_0_oklch(0.65_0.18_300)]",
    },
    amber: {
      bar: "bg-amber-400",
      selected: "bg-amber-500/12 ring-amber-400/35",
      glow: "shadow-[inset_3px_0_0_0_oklch(0.75_0.15_75)]",
    },
  };
  const styles = accentStyles[accent];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit();
        }
      }}
      className={cn(
        "group grid cursor-pointer items-center gap-3 px-4 py-3 transition-all duration-200",
        isSelected
          ? cn("ring-1 ring-inset", styles.selected, styles.glow)
          : "hover:bg-white/3",
      )}
      style={{ gridTemplateColumns: GRID_COLUMNS }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{item.title}</p>
          {isSelected ? (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 px-1.5 py-0 text-[9px] uppercase",
                accent === "violet"
                  ? "border-violet-400/30 text-violet-200"
                  : "border-amber-400/30 text-amber-200",
              )}
            >
              Editing
            </Badge>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
            {item.description}
          </p>
        ) : null}
      </div>

      <MetricChip metric={item.metric_key} accent={accent} />

      <div className="min-w-0">
        <p className="truncate text-sm tabular-nums text-foreground/90">
          {detail}
        </p>
        {item.kind === "milestone" && item.evaluation_mode === "relative" ? (
          <p className="text-[10px] text-muted-foreground">Relative</p>
        ) : item.kind === "metric" ? (
          <p className="text-[10px] capitalize text-muted-foreground">
            {item.weight_input_type}
          </p>
        ) : null}
      </div>

      <span className="text-center text-sm tabular-nums text-muted-foreground">
        {item.sort_order}
      </span>

      <Badge
        variant="outline"
        className={cn(
          "mx-auto w-fit justify-center px-1.5 py-0 text-[10px]",
          item.is_active
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-white/12 bg-white/5 text-muted-foreground",
        )}
      >
        {item.is_active ? "On" : "Off"}
      </Badge>

      <div
        className="flex justify-end gap-1"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(
            "size-8 text-muted-foreground hover:text-foreground",
            isSelected && "text-foreground",
          )}
          onClick={onEdit}
          aria-label="Edit"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          aria-label="Delete"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function MetricChip({
  metric,
  accent,
}: {
  metric: string;
  accent: "violet" | "amber";
}) {
  const styles = {
    violet: "border-violet-400/25 bg-violet-500/10 text-violet-100",
    amber: "border-amber-400/25 bg-amber-500/10 text-amber-100",
  };

  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full truncate rounded-md border px-2 py-0.5 text-[11px] capitalize",
        styles[accent],
      )}
    >
      {formatMetricKey(metric)}
    </span>
  );
}

export function CriterionEmptyState({
  message,
  accent,
}: {
  message: string;
  accent: "violet" | "amber";
}) {
  const Icon = accent === "violet" ? Target : Award;

  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center",
        accent === "violet"
          ? "border-violet-400/20 bg-violet-500/4"
          : "border-amber-400/20 bg-amber-500/4",
      )}
    >
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-2xl border",
          accent === "violet"
            ? "border-violet-400/25 bg-violet-500/12 text-violet-300"
            : "border-amber-400/25 bg-amber-500/12 text-amber-300",
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <p className="max-w-[240px] text-sm font-medium text-foreground/90">
        Nothing saved yet
      </p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

export function CriterionTableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-background/60">
      <div className="max-h-[min(480px,55vh)] overflow-y-auto">{children}</div>
    </div>
  );
}
