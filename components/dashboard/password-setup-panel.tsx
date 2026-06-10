"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  LayoutDashboard,
  Shield,
  Sparkles,
  Trophy,
  Video,
} from "lucide-react";

import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import { GlassCard } from "@/components/dashboard/glass-card";
import {
  useDashboardUser,
  useUpdateDashboardUser,
} from "@/components/dashboard/dashboard-user-context";
import type { CandidateStats } from "@/lib/competition-api";
import type { AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type PasswordSetupPanelProps = {
  /** Extra content shown below the form column on overview (e.g. full dashboard) */
  children?: ReactNode;
  /** Snapshot metrics for the welcome aside on candidate overview */
  overviewStats?: Pick<CandidateStats, "views" | "competition_status">;
};

function SecurityAside({ user }: { user: AuthUser }) {
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);
  const tips = isAdmin
    ? [
        "Use a unique password you do not reuse elsewhere.",
        "Grant candidate access only to trusted team members.",
        "Review competition sync and leaderboard settings regularly.",
      ]
    : [
        "Pick a strong password — at least 8 characters.",
        "Your engagement stats and charts stay visible while you update.",
        "Mention Ella Resort in comments — admins track brand mentions separately.",
      ];

  return (
    <GlassCard
      accent={isAdmin ? "amber" : "violet"}
      title="Account security"
      description="Set a personal password for your voteMe account. Everything else in your dashboard remains available."
      icon={<Shield className="size-5 text-violet-400" strokeWidth={1.75} />}
      className="h-full"
    >
      <ul className="space-y-3">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <CheckCircle2
              className={cn("mt-0.5 size-4 shrink-0", accent.eyebrow)}
            />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            accent.badge,
            "hover:bg-white/5",
          )}
        >
          <LayoutDashboard className="size-3.5" />
          Back to overview
        </Link>
        {!isAdmin ? (
          <Link
            href="/dashboard/videos"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              accent.badge,
              "hover:bg-white/5",
            )}
          >
            <Video className="size-3.5" />
            My videos
          </Link>
        ) : null}
      </div>
    </GlassCard>
  );
}

function OverviewAside({
  user,
  stats,
}: {
  user: AuthUser;
  stats?: PasswordSetupPanelProps["overviewStats"];
}) {
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <GlassCard
      accent={isAdmin ? "amber" : "violet"}
      title={`Welcome, ${displayName.split(" ")[0]}`}
      description="Your dashboard is ready. Set a new password on the right — metrics, charts, and achievements are below."
      icon={<Sparkles className="size-5 text-violet-400" strokeWidth={1.75} />}
      className="h-full"
    >
      {!isAdmin && stats ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Views", value: stats.views.toLocaleString() },
            {
              label: "Status",
              value: stats.competition_status,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/8 bg-white/3 px-3 py-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Manage competitions, candidates, and live tracking from your admin
          overview once your password is updated.
        </p>
      )}
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <Trophy className={cn("size-3.5", accent.eyebrow)} />
        <span className="capitalize">
          Competition {stats?.competition_status ?? "draft"}
        </span>
      </div>
    </GlassCard>
  );
}

export function PasswordSetupPanel({
  children,
  overviewStats,
}: PasswordSetupPanelProps) {
  const user = useDashboardUser();
  const setUser = useUpdateDashboardUser();
  const isAdmin = user.role === "admin";
  const isOverview = Boolean(children);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
        {isOverview ? (
          <OverviewAside user={user} stats={overviewStats} />
        ) : (
          <SecurityAside user={user} />
        )}

        <div className="flex w-full items-stretch">
          <ChangePasswordForm
            role={user.role}
            required={user.must_change_password}
            onSuccess={setUser}
            className="h-full w-full"
          />
        </div>
      </div>

      {children}
    </div>
  );
}

export function PasswordSetupOverviewSection({
  overviewStats,
  children,
}: PasswordSetupPanelProps) {
  const user = useDashboardUser();

  if (!user.must_change_password) {
    return <>{children}</>;
  }

  return (
    <PasswordSetupPanel overviewStats={overviewStats}>
      {children}
    </PasswordSetupPanel>
  );
}
