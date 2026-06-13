"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Radio,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Share2,
  Trophy,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { PasswordSetupOverviewSection } from "@/components/dashboard/password-setup-panel";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompetitionStandingsPanel } from "@/components/admin/competition-standings-panel";
import { GlassCard } from "@/components/dashboard/glass-card";
import { ADMIN_LEADERBOARD_PATH } from "@/components/dashboard/dashboard-nav";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchCompetition,
  fetchOrgCandidates,
  syncCompetition,
  type CandidateProfile,
  type Competition,
} from "@/lib/competition-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { cn } from "@/lib/utils";

export function AdminDashboardHome() {
  const user = useDashboardUser();
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function loadData() {
    try {
      const [candidateData, competitionData] = await Promise.all([
        fetchOrgCandidates(),
        fetchCompetition().catch(() => null),
      ]);
      setCandidates(candidateData);
      setCompetition(competitionData);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSync() {
    setSyncing(true);
    try {
      const result = await syncCompetition();
      if (result.sync_warning) {
        toast.warning(result.sync_warning);
      } else {
        toast.success(`Synced ${result.synced_count} videos`);
      }
      void loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSyncing(false);
    }
  }

  const stats = useMemo(() => {
    const incomplete = candidates.filter((c) => !c.is_profile_complete).length;
    return {
      total: candidates.length,
      complete: candidates.length - incomplete,
      incomplete,
    };
  }, [candidates]);

  const publicLeaderboardHref =
    competition?.status === "ended" && user.organization?.slug
      ? `/o/${user.organization.slug}/leaderboard`
      : null;


  return (
    <>
      <DashboardPageHeader
        eyebrow="Admin overview"
        title="Welcome back,"
        description="Manage competition settings, candidate access, and live engagement tracking."
      />

      <PasswordSetupOverviewSection>
        <div className="space-y-10">
        <DashboardSection
          title="Organization snapshot"
          description="Live counts across your candidate roster."
        >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total candidates"
            value={loading ? "—" : stats.total}
            hint="Registered in your organization"
            icon={Users}
            accent="amber"
          />
          <StatCard
            label="Profiles complete"
            value={loading ? "—" : stats.complete}
            hint="Ready for leaderboard"
            icon={ShieldCheck}
            accent="emerald"
          />
          <StatCard
            label="Pending profiles"
            value={loading ? "—" : stats.incomplete}
            hint="Awaiting candidate setup"
            icon={UserX}
            accent="sky"
          />
        </div>
        </DashboardSection>

        <CompetitionStandingsPanel compact />

        <GlassCard
          accent="amber"
          title="Competition control"
          description="Go live, sync engagement metrics, and review the admin leaderboard."
          icon={<Radio className="size-5 text-amber-400" strokeWidth={1.75} />}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">
                  {competition?.title ?? "Competition"}
                </span>
                {competition ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] capitalize",
                      competition.status === "live"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/20 bg-amber-500/10 text-amber-300",
                    )}
                  >
                    {competition.status}
                  </Badge>
                ) : null}
              </div>
              <p className="max-w-lg text-xs text-muted-foreground">
                {competition?.live_tracking_enabled
                  ? `Live tracking every ${competition.tracking_interval_minutes} minutes`
                  : "Enable live tracking in Competition settings"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                className="border-white/10"
              >
                <RefreshCw
                  className={cn("size-4", syncing && "animate-spin")}
                />
                Sync now
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
              >
                <Link href="/dashboard/competition">
                  <Settings2 className="size-4" />
                  Settings
                </Link>
              </Button>
              <Button
                asChild={competition?.status === "ended"}
                variant="outline"
                size="sm"
                className="border-white/10"
                disabled={!competition || competition.status !== "ended"}
              >
                {competition?.status === "ended" ? (
                  <Link href={ADMIN_LEADERBOARD_PATH}>
                    <ExternalLink className="size-4" />
                    Leaderboard
                  </Link>
                ) : (
                  <>
                    <ExternalLink className="size-4" />
                    Leaderboard
                  </>
                )}
              </Button>
              {publicLeaderboardHref ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/10"
                >
                  <Link href={publicLeaderboardHref} target="_blank" rel="noopener noreferrer">
                    <Share2 className="size-4" />
                    Public link
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </GlassCard>

        <DashboardSection
          title="Quick actions"
          description="Jump straight to the tools you use most."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              href="/dashboard/competition"
              title="Competition"
              description="Registration rules, scoring weights, awards & tracking"
              icon={Settings2}
              accent="amber"
            />
            <QuickActionCard
              href="/dashboard/grant-credentials"
              title="Grant access"
              description="Create username & password for new candidates"
              icon={UserPlus}
              accent="emerald"
            />
            <QuickActionCard
              href="/dashboard/candidates"
              title="Candidates"
              description="View roster, search profiles & remove access"
              icon={Users}
              accent="sky"
            />
            <QuickActionCard
              href={competition?.status === "ended" ? ADMIN_LEADERBOARD_PATH : "/dashboard/competition"}
              title="Leaderboard"
              description={
                competition?.status === "ended"
                  ? "Winner reveal ceremony and top-three podium"
                  : "Unlocks when the competition ends"
              }
              icon={Trophy}
              accent="violet"
            />
          </div>
        </DashboardSection>
        </div>
      </PasswordSetupOverviewSection>
    </>
  );
}
