"use client";

import Link from "next/link";
import { LayoutDashboard, Megaphone } from "lucide-react";

import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import { DashboardProfileMenu } from "@/components/dashboard/dashboard-profile-menu";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const user = useDashboardUser();
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass-panel-strong mx-auto max-w-7xl overflow-hidden rounded-2xl">
        <div
          aria-hidden
          className={cn(
            "h-px bg-linear-to-r from-transparent to-transparent",
            accent.line,
          )}
        />
        <div className="px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="group flex min-w-0 items-center gap-3.5"
            >
              <div
                className={cn(
                  "relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-xl transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl",
                  accent.logo,
                )}
              >
                <div className="absolute inset-0 rounded-xl bg-linear-to-t from-black/20 to-transparent" />
                {isAdmin ? (
                  <LayoutDashboard
                    className="relative size-5"
                    strokeWidth={1.75}
                  />
                ) : (
                  <Megaphone className="relative size-5" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold tracking-tight">
                    voteMe
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full px-2 text-[10px]", accent.badge)}
                  >
                    {isAdmin ? "Admin" : "Candidate"}
                  </Badge>
                </div>
                {user.organization ? (
                  <p className="truncate text-xs text-muted-foreground/90">
                    {user.organization.name}
                  </p>
                ) : null}
              </div>
            </Link>

            <DashboardProfileMenu />
          </div>

          <div className="mt-4">
            <DashboardTabs />
          </div>
        </div>
      </div>
    </header>
  );
}
