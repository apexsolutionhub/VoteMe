"use client";

import Link from "next/link";
import {
  CircleDot,
  ExternalLink,
  Radio,
  RefreshCw,
  Timer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_LEADERBOARD_PATH } from "@/components/dashboard/dashboard-nav";
import { Skeleton } from "@/components/ui/skeleton";
import type { Competition } from "@/lib/competition-api";
import { cn } from "@/lib/utils";

const platformLabels: Record<string, string> = {
  tiktok: "TikTok",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
};

type CompetitionOverviewBarProps = {
  competition: Competition | null;
  loading?: boolean;
  milestoneCount?: number;
  metricCount?: number;
  syncing?: boolean;
  onSync?: () => void;
  onGoLive?: () => void;
  onEnd?: () => void;
};

export function CompetitionOverviewBar({
  competition,
  loading,
  milestoneCount = 0,
  metricCount = 0,
  syncing,
  onSync,
  onGoLive,
  onEnd,
}: CompetitionOverviewBarProps) {
  if (loading) {
    return <Skeleton className="h-36 rounded-3xl sm:h-32" />;
  }

  const isLive = competition?.status === "live";
  const isEnded = competition?.status === "ended";
  const platform =
    platformLabels[competition?.social_platform ?? ""] ??
    competition?.social_platform ??
    "—";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border",
        isLive
          ? "border-emerald-500/25 bg-linear-to-br from-emerald-500/12 via-amber-500/6 to-orange-500/8"
          : isEnded
            ? "border-white/10 bg-linear-to-br from-white/6 via-white/3 to-transparent"
            : "border-amber-500/20 bg-linear-to-br from-amber-500/12 via-orange-500/6 to-yellow-500/5",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-amber-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-8 size-36 rounded-full bg-orange-500/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 text-[10px] font-semibold uppercase tracking-wider",
                isLive
                  ? "border-emerald-500/35 bg-emerald-500/12 text-emerald-200"
                  : isEnded
                    ? "border-white/15 bg-white/6 text-muted-foreground"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-200",
              )}
            >
              {isLive ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
              ) : (
                <CircleDot className="size-3 opacity-70" />
              )}
              {competition?.status ?? "draft"}
            </Badge>
            <Badge
              variant="outline"
              className="border-white/12 bg-white/5 text-[10px] text-foreground/90"
            >
              {platform}
            </Badge>
            {competition?.live_tracking_enabled ? (
              <Badge
                variant="outline"
                className="gap-1 border-sky-500/25 bg-sky-500/8 text-[10px] text-sky-200"
              >
                <Timer className="size-3" />
                Every {competition.tracking_interval_minutes}m
              </Badge>
            ) : null}
          </div>

          <div>
            <h2 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {competition?.title ?? "Competition"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {competition?.description?.trim() ||
                "Configure rules, milestones, and scoring to launch your competition."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1">
              <span className="font-medium text-foreground">{milestoneCount}</span>{" "}
              milestones
            </span>
            <span className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1">
              <span className="font-medium text-foreground">{metricCount}</span>{" "}
              scoring metrics
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/12 bg-white/4"
            onClick={onSync}
            disabled={!competition || syncing}
          >
            <RefreshCw className={cn("size-4", syncing && "animate-spin")} />
            Sync
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500"
            onClick={onGoLive}
            disabled={!competition || competition.status === "live"}
          >
            <Radio className="size-4" />
            Go live
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/12"
            onClick={onEnd}
            disabled={!competition || competition.status === "ended"}
          >
            End
          </Button>
          <Button
            asChild={competition?.status === "ended"}
            variant="outline"
            size="sm"
            className="border-white/12"
            disabled={!competition || competition.status !== "ended"}
            title={
              competition?.status !== "ended"
                ? "Available after the competition ends"
                : undefined
            }
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
        </div>
      </div>
    </div>
  );
}

export function CompetitionSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-[640px] rounded-3xl" />
      <Skeleton className="h-[480px] rounded-3xl" />
    </div>
  );
}
