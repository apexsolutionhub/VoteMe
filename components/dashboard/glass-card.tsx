import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = {
  title: string;
  description?: string;
  accent?: "violet" | "amber";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const accentStyles = {
  violet: {
    line: "via-violet-400/60",
    mesh: "from-violet-500/12 via-fuchsia-500/5 to-transparent",
    iconWrap: "border-violet-400/15 bg-violet-500/10",
  },
  amber: {
    line: "via-amber-400/60",
    mesh: "from-amber-500/12 via-orange-500/5 to-transparent",
    iconWrap: "border-amber-400/15 bg-amber-500/10",
  },
};

export function GlassCard({
  title,
  description,
  accent = "violet",
  icon,
  children,
  className,
  contentClassName,
}: GlassCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_-30px_oklch(0_0_0/70%)] backdrop-blur-2xl",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-70",
          styles.mesh,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent",
          styles.line,
        )}
      />

      <div className="relative border-b border-white/6 px-6 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          {icon ? (
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner",
                styles.iconWrap,
              )}
            >
              {icon}
            </div>
          ) : null}
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground/90">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cn("relative px-6 py-6 sm:px-7", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
