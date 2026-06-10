"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Megaphone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearAuth, type AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type DashboardAccent = "violet" | "amber";

type DashboardShellProps = {
  user: AuthUser;
  accent: DashboardAccent;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const accentStyles = {
  violet: {
    orb1: "bg-violet-600/20",
    orb2: "bg-indigo-500/15",
    orb3: "bg-fuchsia-500/10",
    logo: "from-violet-500 to-indigo-600 shadow-violet-500/25",
    badge: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    avatar: "bg-violet-500/15 text-violet-300",
    titleGradient:
      "from-violet-400 via-fuchsia-400 to-indigo-400",
    icon: Megaphone,
    roleLabel: "Candidate",
  },
  amber: {
    orb1: "bg-amber-600/20",
    orb2: "bg-orange-500/15",
    orb3: "bg-yellow-500/10",
    logo: "from-amber-500 to-orange-600 shadow-amber-500/25",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    avatar: "bg-amber-500/15 text-amber-300",
    titleGradient:
      "from-amber-400 via-orange-400 to-yellow-400",
    icon: LayoutDashboard,
    roleLabel: "Admin",
  },
};

function getInitials(user: AuthUser) {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  return user.username.slice(0, 2).toUpperCase();
}

function getDisplayName(user: AuthUser) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.username;
}

export function DashboardShell({
  user,
  accent,
  title,
  description,
  actions,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const styles = accentStyles[accent];
  const Icon = styles.icon;

  function handleSignOut() {
    clearAuth();
    router.replace("/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-32 top-0 size-[420px] rounded-full blur-[120px] animate-pulse",
          styles.orb1,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-24 bottom-1/4 size-[480px] rounded-full blur-[130px] animate-pulse [animation-delay:1.5s]",
          styles.orb2,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/3 size-[320px] -translate-x-1/2 rounded-full blur-[100px]",
          styles.orb3,
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/3%)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 lg:py-10">
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-lg",
                styles.logo,
              )}
            >
              <Icon className="size-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-xs", styles.badge)}
                >
                  {styles.roleLabel}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  voteMe dashboard
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {title}{" "}
                <span
                  className={cn(
                    "bg-linear-to-r bg-clip-text text-transparent",
                    styles.titleGradient,
                  )}
                >
                  {getDisplayName(user)}
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-card/40 px-3 py-2 backdrop-blur-xl">
              <Avatar className="size-9">
                <AvatarFallback className={styles.avatar}>
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {getDisplayName(user)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>
            {actions}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
