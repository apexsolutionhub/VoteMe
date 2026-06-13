"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Award,
  Crown,
  ListChecks,
  Medal,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useVisiblePolling } from "@/hooks/use-visible-polling";
import {
  fetchAdminCompetitionStandings,
  syncCompetition,
  type CompetitionStandings,
  type CompetitionStandingsCandidate,
  type CriterionOutcome,
} from "@/lib/competition-api";
import { liveTrackingIntervalMs } from "@/lib/live-tracking";
import { cn } from "@/lib/utils";

type CompetitionStandingsPanelProps = {
  compact?: boolean;
  /** 0 disables polling. Omit to use live-tracking settings from the API. */
  pollIntervalMs?: number;
  /** Bump to reload after a parent-coordinated sync. */
  refreshToken?: number;
};

function formatMetric(value: number | null | undefined, metricKey: string) {
  if (value == null) return "—";
  if (metricKey === "rank") return `#${value}`;
  return value.toLocaleString();
}

export function CompetitionStandingsPanel({
  compact = false,
  pollIntervalMs,
  refreshToken = 0,
}: CompetitionStandingsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<CompetitionStandings | null>(null);
  const [competitionTitle, setCompetitionTitle] = useState("");
  const [liveTrackingEnabled, setLiveTrackingEnabled] = useState(false);
  const [trackingIntervalMinutes, setTrackingIntervalMinutes] = useState(10);

  const loadStandings = useCallback(
    async ({ sync = false }: { sync?: boolean } = {}) => {
      try {
        if (sync) {
          try {
            await syncCompetition();
          } catch {
            // Still refresh standings if sync fails.
          }
        }
        const data = await fetchAdminCompetitionStandings();
        setStandings(data.standings);
        setCompetitionTitle(data.competition.title);
        setLiveTrackingEnabled(data.competition.live_tracking_enabled);
        setTrackingIntervalMinutes(data.competition.tracking_interval_minutes);
      } catch {
        setStandings(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadStandings();
  }, [loadStandings]);

  useEffect(() => {
    if (!refreshToken) return;
    void loadStandings();
  }, [refreshToken, loadStandings]);

  const resolvedPollIntervalMs =
    pollIntervalMs === 0
      ? 0
      : pollIntervalMs ??
        (liveTrackingEnabled
          ? liveTrackingIntervalMs(trackingIntervalMinutes)
          : 0);

  useVisiblePolling(
    () => loadStandings({ sync: true }),
    resolvedPollIntervalMs,
    { enabled: resolvedPollIntervalMs > 0 && liveTrackingEnabled },
  );

  if (loading) {
    return compact ? (
      <Skeleton className="h-48 rounded-3xl" />
    ) : (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!standings) {
    return (
      <GlassCard
        accent="violet"
        title="Competition standings"
        description="Unable to load current competitor standings."
        icon={<Trophy className="size-5 text-violet-400" strokeWidth={1.75} />}
      >
        <p className="text-sm text-muted-foreground">
          Refresh the page or try again in a few minutes.
        </p>
      </GlassCard>
    );
  }

  const { winner, criteria_outcomes, candidates, final_award } = standings;

  return (
    <div className="space-y-6">
      <GlassCard
        accent="violet"
        title="Who is winning"
        description={`Live standings for ${competitionTitle}. Rankings use engagement score; milestones show who met each criterion.`}
        icon={<Crown className="size-5 text-violet-400" strokeWidth={1.75} />}
      >
        {winner ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-violet-500/25 bg-linear-to-br from-violet-500/12 via-fuchsia-500/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <WinnerAvatar candidate={winner} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-300/80">
                  Current leader
                </p>
                <p className="text-lg font-semibold">{winner.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  @{winner.username}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Rank #{winner.rank}</span>
                  <span>·</span>
                  <span>
                    Score {winner.engagement_score.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </span>
                  <span>·</span>
                  <span>
                    {winner.milestones_unlocked}/{winner.milestones_total} milestones
                  </span>
                </div>
              </div>
            </div>
            {final_award ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 sm:max-w-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
                  Final award
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-50/90">
                  {final_award}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No competitors with videos yet.
          </p>
        )}
      </GlassCard>

      {!compact ? (
        <>
          <DashboardSection
            title="Who gets what"
            description="Each criterion and the candidate(s) currently winning or awarded it."
          >
            {criteria_outcomes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No milestone criteria configured yet.
              </p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {criteria_outcomes.map((outcome) => (
                  <CriterionOutcomeCard key={outcome.criterion_id} outcome={outcome} />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection
            title="All competitors"
            description="Full roster with rank, engagement score, and milestone progress."
          >
            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-white/8 bg-white/3 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Views</th>
                    <th className="px-4 py-3">Likes</th>
                    <th className="px-4 py-3">Milestones</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr
                      key={candidate.candidate_id}
                      className={cn(
                        "border-b border-white/6 last:border-0",
                        candidate.rank === 1 && "bg-violet-500/6",
                      )}
                    >
                      <td className="px-4 py-3 font-medium tabular-nums">
                        #{candidate.rank}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <WinnerAvatar candidate={candidate} size="sm" />
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground">
                              @{candidate.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {candidate.engagement_score.toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {candidate.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {candidate.likes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-32 space-y-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>
                              {candidate.milestones_unlocked}/
                              {candidate.milestones_total}
                            </span>
                            <span>{candidate.milestone_progress}%</span>
                          </div>
                          <Progress
                            value={candidate.milestone_progress}
                            className="h-1.5 bg-white/5"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat
              label="Competitors"
              value={standings.total_candidates}
              icon={Users}
            />
            <MiniStat
              label="Criteria tracked"
              value={criteria_outcomes.length}
              icon={ListChecks}
            />
            <MiniStat
              label="Leader score"
              value={
                winner
                  ? winner.engagement_score.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })
                  : "—"
              }
              icon={Medal}
            />
          </div>
          {criteria_outcomes.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {criteria_outcomes.slice(0, 4).map((outcome) => (
                <CriterionOutcomeCard key={outcome.criterion_id} outcome={outcome} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function WinnerAvatar({
  candidate,
  size = "md",
}: {
  candidate: Pick<
    CompetitionStandingsCandidate,
    "name" | "initials" | "profile_image_url"
  >;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-9" : "size-14";
  const hasPhoto = Boolean(candidate.profile_image_url);

  if (hasPhoto) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full ring-2 ring-violet-400/30", dim)}>
        <Image
          src={candidate.profile_image_url}
          alt={candidate.name}
          fill
          className="object-cover"
          sizes={size === "sm" ? "36px" : "56px"}
        />
      </div>
    );
  }

  return (
    <Avatar className={cn(dim, "ring-2 ring-violet-400/30")}>
      <AvatarImage src={candidate.profile_image_url} alt={candidate.name} />
      <AvatarFallback className="bg-violet-500/20 text-violet-100">
        {candidate.initials}
      </AvatarFallback>
    </Avatar>
  );
}

function CriterionOutcomeCard({ outcome }: { outcome: CriterionOutcome }) {
  const statusLabel =
    outcome.status === "awarded"
      ? "Awarded"
      : outcome.status === "leading"
        ? "Currently leading"
        : "Open";

  const statusClass =
    outcome.status === "awarded"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : outcome.status === "leading"
        ? "border-violet-500/30 bg-violet-500/10 text-violet-200"
        : "border-white/10 bg-white/5 text-muted-foreground";

  return (
    <div className="rounded-xl border border-white/8 bg-white/2 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {outcome.evaluation_mode === "relative" ? (
              <Target className="size-4 shrink-0 text-violet-300" />
            ) : (
              <Award className="size-4 shrink-0 text-amber-300" />
            )}
            <p className="font-medium">{outcome.title}</p>
          </div>
          {outcome.description ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {outcome.description}
            </p>
          ) : null}
        </div>
        <Badge variant="outline" className={cn("shrink-0 text-[10px]", statusClass)}>
          {statusLabel}
        </Badge>
      </div>

      {outcome.holders.length > 0 ? (
        <ul className="space-y-2">
          {outcome.holders.map((holder) => (
            <li
              key={holder.candidate_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/6 bg-white/3 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <WinnerAvatar candidate={holder} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{holder.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    @{holder.username} · Rank #{holder.rank}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-violet-200">
                {formatMetric(holder.current, outcome.metric_key)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          No candidate has met this criterion yet.
        </p>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/2 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
