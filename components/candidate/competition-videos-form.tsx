"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  Heart,
  Link2,
  MessageCircle,
  RefreshCw,
  Share2,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  addCandidateVideo,
  fetchCandidateVideos,
  fetchOrganizationMe,
  removeCandidateVideo,
  syncCandidateVideo,
  type CompetitionVideo,
} from "@/lib/competition-api";
import { Spinner } from "@/components/ui/spinner";
import { displayVideoTitle, normalizeVideoUrl } from "@/lib/video-url";
import { competitionVideoValidation } from "@/lib/validations";
import { useVisiblePolling } from "@/hooks/use-visible-polling";
import { liveTrackingIntervalMs } from "@/lib/live-tracking";
import { syncAllCandidateVideos } from "@/lib/video-sync";
import { cn } from "@/lib/utils";

function mergeVideo(
  current: CompetitionVideo[],
  incoming: CompetitionVideo,
): CompetitionVideo[] {
  const without = current.filter((video) => video.id !== incoming.id);
  return [incoming, ...without];
}

function formatMetric(value: number): string {
  return value.toLocaleString();
}

function ineligibilityLabel(reason?: string): string | null {
  switch (reason) {
    case "published_before_start":
      return "Published before go live";
    case "published_after_end":
      return "Published after competition ended";
    case "competition_not_started":
      return "Competition not live yet";
    default:
      return null;
  }
}

export function CompetitionVideosForm() {
  const [videos, setVideos] = useState<CompetitionVideo[]>([]);
  const [platform, setPlatform] = useState("tiktok");
  const [liveTracking, setLiveTracking] = useState(false);
  const [trackingIntervalMinutes, setTrackingIntervalMinutes] = useState(10);
  const [loading, setLoading] = useState(true);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<number>>(() => new Set());
  const videosRef = useRef(videos);
  const liveTrackingRef = useRef(liveTracking);

  useEffect(() => {
    videosRef.current = videos;
    liveTrackingRef.current = liveTracking;
  }, [videos, liveTracking]);

  const form = useForm<z.infer<typeof competitionVideoValidation>>({
    resolver: zodResolver(competitionVideoValidation),
    defaultValues: { url: "" },
  });

  const loadOrgConfig = useCallback(async () => {
    try {
      const org = await fetchOrganizationMe();
      if (org.competition?.social_platform) {
        setPlatform(org.competition.social_platform);
      }
      setLiveTracking(Boolean(org.competition?.live_tracking_enabled));
      setTrackingIntervalMinutes(org.competition?.tracking_interval_minutes ?? 10);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }, []);

  const loadVideos = useCallback(async () => {
    try {
      const videoList = await fetchCandidateVideos();
      setVideos(videoList);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const applySyncedVideos = useCallback((syncedVideos: CompetitionVideo[]) => {
    setVideos((current) =>
      syncedVideos.reduce(
        (list, video) => mergeVideo(list, video),
        current,
      ),
    );
  }, []);

  const refreshVideos = useCallback(async () => {
    const currentVideos = videosRef.current;
    if (currentVideos.length === 0) {
      return;
    }

    const pending = currentVideos.filter(
      (video) => video.sync_status !== "synced",
    );
    const shouldSync =
      pending.length > 0 ||
      (liveTrackingRef.current && currentVideos.length > 0);

    if (!shouldSync) {
      return;
    }

    const targets = pending.length > 0 ? pending : currentVideos;
    const { outcomes, updatedCount, failedCount } =
      await syncAllCandidateVideos(targets);

    applySyncedVideos(outcomes.map((outcome) => outcome.video));

    if (failedCount > 0 && updatedCount === 0) {
      toast.warning(
        outcomes.find((outcome) => outcome.warning)?.warning ??
          "Could not refresh TikTok metrics right now.",
      );
    }
  }, [applySyncedVideos]);

  async function handleRefreshAll() {
    if (videos.length === 0) return;
    setRefreshingAll(true);
    try {
      const { outcomes, updatedCount, failedCount } =
        await syncAllCandidateVideos(videos);
      applySyncedVideos(outcomes.map((outcome) => outcome.video));

      if (updatedCount > 0) {
        toast.success(
          `Refreshed ${updatedCount} video${updatedCount === 1 ? "" : "s"}`,
        );
      } else if (failedCount > 0) {
        toast.warning(
          outcomes.find((outcome) => outcome.warning)?.warning ??
            "Could not fetch fresh metrics from TikTok. Try again shortly.",
        );
      }
    } finally {
      setRefreshingAll(false);
    }
  }

  useEffect(() => {
    void Promise.all([loadOrgConfig(), loadVideos()]);
  }, [loadOrgConfig, loadVideos]);

  const hasPendingVideos = videos.some(
    (video) => video.sync_status !== "synced" || syncingIds.has(video.id),
  );
  const pollIntervalMs = hasPendingVideos
    ? 3_000
    : liveTracking
      ? liveTrackingIntervalMs(trackingIntervalMinutes)
      : 0;

  useVisiblePolling(refreshVideos, pollIntervalMs, {
    enabled: pollIntervalMs > 0,
  });

  async function runVideoSync(videoId: number) {
    setSyncingIds((current) => new Set(current).add(videoId));
    try {
      const synced = await syncCandidateVideo(videoId);
      setVideos((current) => mergeVideo(current, synced));
      if (synced.metrics_updated === false) {
        toast.warning(
          synced.sync_warning ??
            "Could not fetch fresh TikTok metrics right now.",
        );
      } else if (synced.sync_status === "synced") {
        toast.success("Video metrics synced");
      }
      return synced;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return null;
    } finally {
      setSyncingIds((current) => {
        const next = new Set(current);
        next.delete(videoId);
        return next;
      });
    }
  }

  async function onSubmit(values: z.infer<typeof competitionVideoValidation>) {
    try {
      const created = await addCandidateVideo(values.url);
      form.reset();
      setVideos((current) => mergeVideo(current, created));
      toast.success("Video added — syncing metrics…");
      void runVideoSync(created.id);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleRemove(id: number) {
    try {
      await removeCandidateVideo(id);
      setVideos((current) => current.filter((video) => video.id !== id));
      toast.success("Video removed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  function handleUrlPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.trim()) {
      return;
    }
    event.preventDefault();
    form.setValue("url", normalizeVideoUrl(pasted), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <GlassCard
      accent="violet"
      title="Competition videos"
      description={`Add ${platformLabel} video links to track live views, likes, and comments.`}
      icon={<Video className="size-5 text-violet-400" strokeWidth={1.75} />}
    >
      {platform === "tiktok" ? (
        <p className="mb-4 rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100/90">
          Paste your TikTok video URL — short links, mobile links, and full URLs
          are normalized automatically. Only videos published while the
          competition is live count toward milestones and the leaderboard.
        </p>
      ) : null}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-6 grid w-full gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
      >
        <CustomFormField
          name="url"
          control={form.control}
          fieldType={formFieldTypes.INPUT}
          label="Video URL"
          placeholder="https://www.tiktok.com/@username/video/..."
          className="h-10 w-full border-white/10 bg-white/3"
          onPaste={handleUrlPaste}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-10 w-full shrink-0 bg-linear-to-r from-violet-600 to-indigo-600 text-white lg:w-auto"
        >
          <Link2 className="size-4" />
          Add video
        </Button>
      </form>

      {videos.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {liveTracking
              ? `Live refresh every ${trackingIntervalMinutes} min while this tab is open.`
              : "Live tracking is off — use Refresh metrics for manual updates."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-white/12"
            onClick={() => void handleRefreshAll()}
            disabled={refreshingAll}
          >
            <RefreshCw
              className={cn("size-3.5", refreshingAll && "animate-spin")}
            />
            Refresh metrics
          </Button>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading videos…</p>
      ) : videos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-violet-500/20 bg-violet-500/5 px-4 py-6 text-center text-sm text-muted-foreground">
          No videos yet. Add your {platformLabel} competition video links above.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead>Video</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead>Sync</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} className="border-white/8">
                <TableCell className="max-w-[220px]">
                  <div className="space-y-1">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "block truncate text-sm font-medium hover:underline",
                        video.is_competition_eligible
                          ? "text-violet-300"
                          : "text-muted-foreground",
                      )}
                      title={video.title?.trim() || video.url}
                    >
                      {displayVideoTitle(video)}
                    </a>
                    {!video.is_competition_eligible ? (
                      <Badge
                        variant="outline"
                        className="border-rose-500/30 bg-rose-500/10 text-[10px] text-rose-200"
                        title={ineligibilityLabel(video.ineligibility_reason) ?? undefined}
                      >
                        Excluded from competition
                      </Badge>
                    ) : null}
                    <p className="truncate text-[11px] text-muted-foreground">
                      {video.title?.trim()
                        ? video.url
                        : video.platform_video_id
                          ? `ID ${video.platform_video_id}`
                          : video.url}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={cn(
                      !video.is_competition_eligible && "text-muted-foreground/60",
                    )}
                  >
                    {formatMetric(video.views)}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={cn(
                      !video.is_competition_eligible && "text-muted-foreground/60",
                    )}
                  >
                    {formatMetric(video.likes)}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={cn(
                      !video.is_competition_eligible && "text-muted-foreground/60",
                    )}
                  >
                    {formatMetric(video.comments)}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={cn(
                      !video.is_competition_eligible && "text-muted-foreground/60",
                    )}
                  >
                    {formatMetric(video.shares)}
                  </span>
                </TableCell>
                <TableCell>
                  {syncingIds.has(video.id) ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="size-3.5 text-violet-300" />
                      <span className="text-[11px] text-violet-200">Syncing…</span>
                    </div>
                  ) : video.sync_status === "synced" ? (
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300"
                      >
                        Synced
                      </Badge>
                      {video.last_synced_at ? (
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(video.last_synced_at).toLocaleString()}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void runVideoSync(video.id)}
                        className="block text-[10px] text-violet-300 hover:underline"
                      >
                        Refresh
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-200"
                      >
                        Pending
                      </Badge>
                      <button
                        type="button"
                        onClick={() => void runVideoSync(video.id)}
                        className="block text-[10px] text-violet-300 hover:underline"
                      >
                        Retry sync
                      </button>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => handleRemove(video.id)}
                    aria-label="Remove video"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {videos.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3 text-violet-300/80" />
            Views
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3 text-violet-300/80" />
            Likes
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3 text-violet-300/80" />
            Comments
          </span>
          <span className="inline-flex items-center gap-1">
            <Share2 className="size-3 text-violet-300/80" />
            Shares
          </span>
        </div>
      ) : null}
    </GlassCard>
  );
}
