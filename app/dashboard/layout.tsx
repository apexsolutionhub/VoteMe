"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { DashboardBackground } from "@/components/dashboard/dashboard-background";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ADMIN_LEADERBOARD_PATH } from "@/components/dashboard/dashboard-nav";
import { DashboardUserProvider } from "@/components/dashboard/dashboard-user-context";
import { PasswordChangeBanner } from "@/components/dashboard/password-change-banner";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useRequireAuth({ requirePasswordChanged: false });
  const pathname = usePathname();
  const isFullscreenLeaderboard = pathname === ADMIN_LEADERBOARD_PATH;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isFullscreenLeaderboard) {
    return (
      <DashboardUserProvider user={user}>
        <div className="relative min-h-svh bg-background">{children}</div>
      </DashboardUserProvider>
    );
  }

  return (
    <DashboardUserProvider user={user}>
      <div className="relative min-h-svh overflow-hidden bg-background">
        <DashboardBackground />
        <div className="relative z-10 flex min-h-svh flex-col">
          <DashboardHeader />
          <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
            <PasswordChangeBanner />
            {children}
          </main>
        </div>
      </div>
    </DashboardUserProvider>
  );
}
