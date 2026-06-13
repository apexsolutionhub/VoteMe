"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CriterionWorkspaceLayoutProps = {
  accent: "violet" | "amber";
  form: ReactNode;
  table: ReactNode;
};

const accentStyles = {
  violet: {
    shell: "border-violet-500/20 bg-violet-500/[0.03]",
    divider: "bg-violet-500/15",
    formHeader: "text-violet-200/90",
    tableHeader: "border-violet-500/10 bg-violet-500/[0.04]",
  },
  amber: {
    shell: "border-amber-500/20 bg-amber-500/[0.03]",
    divider: "bg-amber-500/15",
    formHeader: "text-amber-200/90",
    tableHeader: "border-amber-500/10 bg-amber-500/[0.04]",
  },
};

export function CriterionWorkspaceLayout({
  accent,
  form,
  table,
}: CriterionWorkspaceLayoutProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_0_oklch(1_0_0/5%)]",
        styles.shell,
      )}
    >
      <div className="grid lg:grid-cols-[minmax(0,400px)_1px_minmax(0,1fr)] xl:grid-cols-[minmax(0,440px)_1px_minmax(0,1fr)]">
        <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div
            className={cn(
              "border-b px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest lg:border-b-0",
              styles.formHeader,
              styles.tableHeader,
            )}
          >
            Editor
          </div>
          <div className="p-4 sm:p-5">{form}</div>
        </div>

        <div
          aria-hidden
          className={cn("hidden lg:block", styles.divider)}
        />

        <div className="min-w-0 border-t lg:border-t-0">
          <div
            className={cn(
              "border-b px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest",
              styles.formHeader,
              styles.tableHeader,
            )}
          >
            Saved items
          </div>
          <div className="p-4 sm:p-5">{table}</div>
        </div>
      </div>
    </div>
  );
}

export function CriterionFormShell({
  accent,
  title,
  badge,
  children,
  footer,
}: {
  accent: "violet" | "amber";
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}) {
  const border =
    accent === "violet" ? "border-violet-500/12" : "border-amber-500/12";

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-background/50", border)}>
      <div className="flex items-center justify-between gap-2 border-b border-white/6 px-4 py-3.5">
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
        {badge}
      </div>
      <div className="space-y-4 p-4">{children}</div>
      <div className={cn("border-t px-4 py-3.5", border)}>{footer}</div>
    </div>
  );
}

export function CriterionTableShell({
  count,
  empty,
  children,
}: {
  count: number;
  empty: boolean;
  children: ReactNode;
}) {
  if (empty) {
    return children;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {count} configured · click a row to edit
      </p>
      {children}
    </div>
  );
}
