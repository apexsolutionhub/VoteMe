"use client";

import { getUserDisplayName } from "@/components/dashboard/dashboard-user-display";
import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { cn } from "@/lib/utils";

type DashboardPageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export function DashboardPageHeader({
  title,
  description,
  eyebrow = "Workspace",
}: DashboardPageHeaderProps) {
  const user = useDashboardUser();
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);

  return (
    <header className="relative mb-10 overflow-hidden rounded-3xl glass-panel-strong">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-60",
          isAdmin
            ? "from-amber-500/10 via-transparent to-orange-500/5"
            : "from-violet-500/10 via-transparent to-indigo-500/5",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent",
          accent.line,
        )}
      />
      <div className="relative px-6 py-8 sm:px-8 sm:py-9">
        <p
          className={cn(
            "text-[11px] font-semibold tracking-[0.22em] uppercase",
            accent.eyebrow,
          )}
        >
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}{" "}
          <span
            className={cn(
              "bg-linear-to-r bg-clip-text text-transparent",
              accent.gradient,
            )}
          >
            {getUserDisplayName(user)}
          </span>
        </h1>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground/95 sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
