"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  User,
  Video,
} from "lucide-react";

import { CandidateResultCard } from "@/components/candidate/candidate-result-card";
import { CandidateAchievements } from "@/components/candidate/candidate-achievements";
import { Skeleton } from "@/components/ui/skeleton";
import { useVisiblePolling } from "@/hooks/use-visible-polling";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { PasswordSetupOverviewSection } from "@/components/dashboard/password-setup-panel";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  fetchCandidateAnalytics,
  type CandidateAnalytics,
  type CandidateStats,
} from "@/lib/competition-api";
import { liveTrackingIntervalMs } from "@/lib/live-tracking";
import { syncAllCandidateVideos } from "@/lib/video-sync";
import { cn } from "@/lib/utils";

const emptyStats: CandidateStats = {
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  brand_mention_comments: 0,
  last_synced_at: null,
  competition_status: "draft",
  live_tracking_enabled: false,
  tracking_interval_minutes: 10,
};

const CandidatePerformanceCharts = dynamic(
  () =>
    import("@/components/candidate/candidate-performance-charts").then(
      (mod) => mod.CandidatePerformanceCharts,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[320px] rounded-2xl" />
        <Skeleton className="h-[320px] rounded-2xl" />
      </div>
    ),
  },
);

const emptyAnalytics: CandidateAnalytics = {
  totals: emptyStats,
  history: [],
  videos: [],
  achievements: [],
  profile_complete: false,
  video_count: 0,
  unlocked_achievements: 0,
  total_achievements: 0,
  competition_result: null,
};

export function CandidateDashboardHome() {
  const user = useDashboardUser();
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  const [analytics, setAnalytics] = useState<CandidateAnalytics>(emptyAnalytics);
  const analyticsRef = useRef(analytics);

  useEffect(() => {
    analyticsRef.current = analytics;
  }, [analytics]);

  const refreshAnalytics = useCallback(async () => {
    try {
      const { totals, videos } = analyticsRef.current;
      if (totals.live_tracking_enabled && videos.length > 0) {
        await syncAllCandidateVideos(videos.map((video) => ({ id: video.id })));
      }
      const data = await fetchCandidateAnalytics();
      setAnalytics(data);
    } catch {
      setAnalytics(emptyAnalytics);
    }
  }, []);

  useEffect(() => {
    void refreshAnalytics();
  }, [refreshAnalytics]);

  const pollIntervalMs = analytics.totals.live_tracking_enabled
    ? liveTrackingIntervalMs(analytics.totals.tracking_interval_minutes)
    : 0;

  useVisiblePolling(refreshAnalytics, pollIntervalMs, {
    enabled: pollIntervalMs > 0,
  });

  const stats = analytics.totals;

  return (
    <>
      <DashboardPageHeader
        eyebrow="Your dashboard"
        title="Hey,"
        description="Track what you've achieved so far — live metrics, growth charts, and milestones."
      />

      <PasswordSetupOverviewSection
        overviewStats={{
          views: stats.views,
          competition_status: stats.competition_status,
        }}
      >
        <div className="space-y-10">
        <DashboardSection
          title="Live metrics"
          description="Updated automatically when your videos sync."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total views"
              value={stats.views.toLocaleString()}
              hint={
                stats.live_tracking_enabled
                  ? `Live every ${stats.tracking_interval_minutes}m`
                  : "Tracking paused"
              }
              icon={Eye}
              accent="violet"
            />
            <StatCard
              label="Likes"
              value={stats.likes.toLocaleString()}
              hint="Across competition videos"
              icon={Heart}
              accent="violet"
            />
            <StatCard
              label="Comments"
              value={stats.comments.toLocaleString()}
              hint="Audience interactions"
              icon={MessageCircle}
              accent="emerald"
            />
            <StatCard
              label="Shares"
              value={stats.shares.toLocaleString()}
              hint="Viral reach"
              icon={Share2}
              accent="sky"
            />
          </div>
        </DashboardSection>

        <CandidatePerformanceCharts
          history={analytics.history}
          videos={analytics.videos}
        />

        {analytics.competition_result?.visible ? (
          <CandidateResultCard
            rank={analytics.competition_result.rank}
            engagementScore={analytics.competition_result.engagement_score}
            onPodium={analytics.competition_result.on_podium}
          />
        ) : null}

        {analytics.achievements.length > 0 ? (
          <CandidateAchievements
            achievements={analytics.achievements}
            unlockedCount={analytics.unlocked_achievements}
            totalCount={analytics.total_achievements}
          />
        ) : null}

        <DashboardSection
          title="Shortcuts"
          description="Profile and competition videos."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <QuickActionCard
              href="/dashboard/videos"
              title="Competition videos"
              description="Paste TikTok video links to sync live metrics"
              icon={Video}
              accent="violet"
            />
            <QuickActionCard
              href="/dashboard/profile"
              title="Your profile"
              description="Photo, bio, social channel & contact details"
              icon={User}
              accent="emerald"
            />
          </div>
        </DashboardSection>

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-violet-500/20 p-6",
            "bg-linear-to-br from-violet-500/15 via-fuchsia-500/10 to-indigo-500/10 backdrop-blur-xl",
          )}
        >
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-violet-300" />
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] capitalize",
                    stats.competition_status === "live"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-violet-500/20 bg-violet-500/10 text-violet-300",
                  )}
                >
                  {stats.competition_status}
                </Badge>
                {analytics.unlocked_achievements > 0 ? (
                  <Badge
                    variant="outline"
                    className="border-violet-500/20 bg-violet-500/10 text-[10px] text-violet-300"
                  >
                    {analytics.unlocked_achievements} achievements
                  </Badge>
                ) : null}
              </div>
              <p className="text-lg font-semibold tracking-tight">
                You&apos;re in, {displayName.split(" ")[0]}!
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {analytics.video_count > 0
                  ? `${analytics.video_count} video${analytics.video_count === 1 ? "" : "s"} in the competition. Comments mentioning Ella Resort count toward admin scoring.`
                  : "Complete your profile and add competition videos to start tracking live metrics."}
                {stats.last_synced_at ? (
                  <span>
                    {" "}
                    Last synced {new Date(stats.last_synced_at).toLocaleString()}.
                  </span>
                ) : null}
              </p>
            </div>
            <Link
                href="/dashboard/videos"
                className="inline-flex shrink-0 text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                Manage competition videos →
              </Link>
          </div>
          <Sparkles
            aria-hidden
            className="absolute -right-2 -bottom-4 size-28 text-violet-500/10"
            strokeWidth={1}
          />
        </div>
        </div>
      </PasswordSetupOverviewSection>
    </>
  );
}
