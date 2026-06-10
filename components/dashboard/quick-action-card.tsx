import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type QuickActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "violet" | "amber" | "emerald" | "sky";
};

const accents = {
  violet: {
    border: "border-violet-400/15 hover:border-violet-400/35",
    mesh: "from-violet-500/15 via-fuchsia-500/5 to-indigo-500/10",
    icon: "text-violet-100",
    iconBg: "from-violet-500/35 to-indigo-600/20 ring-violet-400/25",
    arrow: "group-hover:text-violet-200",
  },
  amber: {
    border: "border-amber-400/15 hover:border-amber-400/35",
    mesh: "from-amber-500/15 via-orange-500/5 to-yellow-500/10",
    icon: "text-amber-100",
    iconBg: "from-amber-500/35 to-orange-600/20 ring-amber-400/25",
    arrow: "group-hover:text-amber-200",
  },
  emerald: {
    border: "border-emerald-400/15 hover:border-emerald-400/35",
    mesh: "from-emerald-500/15 via-teal-500/5 to-cyan-500/10",
    icon: "text-emerald-100",
    iconBg: "from-emerald-500/35 to-teal-600/20 ring-emerald-400/25",
    arrow: "group-hover:text-emerald-200",
  },
  sky: {
    border: "border-sky-400/15 hover:border-sky-400/35",
    mesh: "from-sky-500/15 via-cyan-500/5 to-blue-500/10",
    icon: "text-sky-100",
    iconBg: "from-sky-500/35 to-cyan-600/20 ring-sky-400/25",
    arrow: "group-hover:text-sky-200",
  },
};

export function QuickActionCard({
  href,
  title,
  description,
  icon: Icon,
  accent = "violet",
}: QuickActionCardProps) {
  const styles = accents[accent];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[148px] flex-col overflow-hidden rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-xl",
        "transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/[0.06] hover:shadow-[0_24px_48px_-24px_oklch(0_0_0/80%)]",
        styles.border,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-80 transition-opacity duration-500 group-hover:opacity-100",
          styles.mesh,
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl bg-linear-to-br ring-1",
            styles.iconBg,
          )}
        >
          <Icon className={cn("size-5", styles.icon)} strokeWidth={1.75} />
        </div>
        <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/20">
          <ArrowUpRight
            className={cn(
              "size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-px group-hover:-translate-y-px",
              styles.arrow,
            )}
            aria-hidden
          />
        </div>
      </div>

      <div className="relative mt-auto pt-5">
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/90">
          {description}
        </p>
      </div>
    </Link>
  );
}
