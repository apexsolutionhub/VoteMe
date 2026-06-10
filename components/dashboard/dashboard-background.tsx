"use client";

import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import { cn } from "@/lib/utils";

export function DashboardBackground() {
  const user = useDashboardUser();
  const accent = getDashboardAccent(user.role === "admin");

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[oklch(0.12_0.01_280)]" />
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-80",
          accent.mesh,
        )}
      />
      <div
        className={cn(
          "absolute -left-[20%] -top-[10%] size-[min(80vw,640px)] rounded-full blur-[100px] animate-pulse",
          accent.orb1,
        )}
      />
      <div
        className={cn(
          "absolute -right-[15%] top-[20%] size-[min(70vw,560px)] rounded-full blur-[110px] animate-pulse [animation-delay:2s]",
          accent.orb2,
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-1/2 size-[min(60vw,480px)] -translate-x-1/2 translate-y-1/3 rounded-full blur-[90px]",
          accent.orb3,
        )}
      />
      <div className="dashboard-grid-bg absolute inset-0" />
      <div className="noise-overlay absolute inset-0 opacity-60 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.1_0.01_280/80)_100%)]" />
    </div>
  );
}
