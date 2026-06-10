"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Heart, Link2, MessageCircle, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  addCandidateVideo,
  fetchCandidateVideos,
  fetchOrganizationMe,
  fetchTikTokStatus,
  removeCandidateVideo,
  type CompetitionVideo,
} from "@/lib/competition-api";
import { competitionVideoValidation } from "@/lib/validations";

export function CompetitionVideosForm() {
  const [videos, setVideos] = useState<CompetitionVideo[]>([]);
  const [platform, setPlatform] = useState("tiktok");
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [tiktokConfigured, setTiktokConfigured] = useState(false);
  const [liveTracking, setLiveTracking] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof competitionVideoValidation>>({
    resolver: zodResolver(competitionVideoValidation),
    defaultValues: { url: "" },
  });

  async function loadVideos() {
    try {
      const [videoList, org, tiktok] = await Promise.all([
        fetchCandidateVideos(),
        fetchOrganizationMe(),
        fetchTikTokStatus().catch(() => ({ connected: false })),
      ]);
      setVideos(videoList);
      setTiktokConnected(tiktok.connected);
      setTiktokConfigured(tiktok.configured);
      if (org.competition?.social_platform) {
        setPlatform(org.competition.social_platform);
      }
      setLiveTracking(Boolean(org.competition?.live_tracking_enabled));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
    const interval = setInterval(loadVideos, 60_000);
    return () => clearInterval(interval);
  }, []);

  async function onSubmit(values: z.infer<typeof competitionVideoValidation>) {
    try {
      await addCandidateVideo(values.url);
      form.reset();
      await loadVideos();
      toast.success("Video added — syncing live metrics");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleRemove(id: number) {
    try {
      await removeCandidateVideo(id);
      await loadVideos();
      toast.success("Video removed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <GlassCard
      accent="violet"
      title="Competition videos"
      description={`Add ${platformLabel} video links to track live views, likes, and comments.`}
      icon={<Video className="size-5 text-violet-400" strokeWidth={1.75} />}
    >
      {!tiktokConfigured && platform === "tiktok" ? (
        <p className="mb-4 rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100/90">
          Live views, likes, and comments sync automatically from your TikTok
          video URLs. No account connection required.
        </p>
      ) : !tiktokConnected && platform === "tiktok" ? (
        <p className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          Connect TikTok for enhanced sync and comment tracking.{" "}
          <Link href="/dashboard/videos" className="font-medium underline">
            Connect TikTok
          </Link>
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
          placeholder={`https://www.${platform === "youtube" ? "youtube.com/watch?v=" : `${platform}.com/`}...`}
          className="h-10 w-full border-white/10 bg-white/3"
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

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading videos…</p>
      ) : videos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-violet-500/20 bg-violet-500/5 px-4 py-6 text-center text-sm text-muted-foreground">
          No videos yet. Add your {platformLabel} competition video links above.
        </p>
      ) : (
        <ul className="space-y-3">
          {videos.map((video) => (
            <li
              key={video.id}
              className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm font-medium text-violet-300 hover:underline"
                >
                  {video.url}
                </a>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "Views", value: video.views, icon: Eye },
                    { label: "Likes", value: video.likes, icon: Heart },
                    {
                      label: "Comments",
                      value: video.comments,
                      icon: MessageCircle,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-2.5 py-1.5 text-xs"
                    >
                      <stat.icon className="size-3.5 text-violet-300/80" />
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {stat.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {video.last_synced_at
                    ? `Last synced ${new Date(video.last_synced_at).toLocaleString()}`
                    : liveTracking
                      ? "Waiting for first sync…"
                      : "Live tracking is paused by admin"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive"
                onClick={() => handleRemove(video.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
