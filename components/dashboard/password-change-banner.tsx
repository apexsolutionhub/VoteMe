"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, ArrowRight, KeyRound } from "lucide-react";

import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PasswordChangeBanner() {
  const pathname = usePathname();
  const user = useDashboardUser();
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);

  if (!user.must_change_password) {
    return null;
  }

  if (
    pathname === "/dashboard" ||
    pathname === "/dashboard/change-password"
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border px-4 py-4 sm:px-5 backdrop-blur-sm",
        accent.badge,
        isAdmin
          ? "bg-linear-to-r from-amber-500/10 via-orange-500/5 to-transparent"
          : "bg-linear-to-r from-violet-500/10 via-fuchsia-500/5 to-transparent",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl border",
              accent.badge,
            )}
          >
            <KeyRound className="size-4" strokeWidth={1.75} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Set your password</p>
              <AlertTriangle className="size-3.5 text-amber-400" />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your dashboard is ready — update your temporary password in
              Security when you can. You can explore everything else in the
              meantime.
            </p>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className={cn(
            "shrink-0 rounded-xl bg-linear-to-r text-white shadow-lg",
            isAdmin
              ? "from-amber-600 to-orange-600 shadow-amber-500/25 hover:from-amber-500 hover:to-orange-500"
              : "from-violet-600 to-indigo-600 shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500",
          )}
        >
          <Link href="/dashboard/change-password">
            Change password
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
