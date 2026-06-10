"use client";

import { useEffect, useState } from "react";
import { Link2, Unlink } from "lucide-react";
import { toast } from "sonner";

import { GlassCard } from "@/components/dashboard/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  disconnectTikTok,
  fetchTikTokStatus,
  getTikTokConnectInfo,
  type TikTokConnectInfo,
  type TikTokStatus,
} from "@/lib/competition-api";

export function TikTokConnectCard() {
  const [status, setStatus] = useState<TikTokStatus | null>(null);
  const [connectInfo, setConnectInfo] = useState<TikTokConnectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  async function loadStatus() {
    try {
      const data = await fetchTikTokStatus();
      setStatus(data);
      if (data.configured && !data.connected) {
        const info = await getTikTokConnectInfo();
        setConnectInfo(info);
      } else {
        setConnectInfo(null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleConnect() {
    setConnecting(true);
    try {
      const info = await getTikTokConnectInfo();
      setConnectInfo(info);
      window.location.href = info.authorize_url;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectTikTok();
      await loadStatus();
      toast.success("TikTok disconnected");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <GlassCard
      accent="violet"
      title="TikTok connection"
      description="Connect your TikTok account so voteMe can pull real views, likes, and comments via the Display API."
      icon={<Link2 className="size-5 text-violet-400" strokeWidth={1.75} />}
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">Checking connection…</p>
      ) : !status?.configured ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            TikTok Login Kit is not configured yet. Video views, likes, and
            comments still sync from public TikTok data when you add a video URL.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Your organizer can optionally add{" "}
            <code className="rounded bg-white/5 px-1">TIKTOK_CLIENT_KEY</code> and{" "}
            <code className="rounded bg-white/5 px-1">TIKTOK_CLIENT_SECRET</code>{" "}
            to enable one-click TikTok connect and comment ingestion.
          </p>
        </div>
      ) : status.connected ? (
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          >
            Connected
          </Badge>
          <Button type="button" variant="outline" size="sm" onClick={handleDisconnect}>
            <Unlink className="size-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleConnect}
            disabled={connecting}
            className="bg-linear-to-r from-violet-600 to-indigo-600 text-white"
          >
            <Link2 className="size-4" />
            {connecting ? "Redirecting…" : "Connect TikTok"}
          </Button>
          {connectInfo ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
              <p className="mb-2 font-medium text-foreground/90">
                TikTok developer portal checklist ({connectInfo.login_kit} mode)
              </p>
              <ul className="list-disc space-y-1 pl-4">
                {connectInfo.setup_hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </GlassCard>
  );
}
