"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

import {
  LeaderboardCeremony,
  LeaderboardUnavailable,
  type ShowcaseCandidate,
} from "@/components/candidates/leaderboard-ceremony";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchPublicLeaderboard,
  type LeaderboardEntry,
} from "@/lib/competition-api";
import { getApiErrorMessage } from "@/lib/auth-api";

type PublicLeaderboardClientProps = {
  orgSlug: string;
};

function mapLeaderboard(entries: LeaderboardEntry[]): ShowcaseCandidate[] {
  return entries.map((entry) => ({
    id: String(entry.candidate_id),
    name: entry.name,
    handle: entry.username,
    initials: entry.initials,
    profileImageUrl: entry.profile_image_url || undefined,
    views: entry.views,
    likes: entry.likes,
    comments: entry.comments,
    engagementScore: entry.engagement_score,
    rank: entry.rank,
  }));
}

export function PublicLeaderboardClient({ orgSlug }: PublicLeaderboardClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("Social Media Engagement Competition");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const [competitionStatus, setCompetitionStatus] = useState("draft");
  const [leaderboardAvailable, setLeaderboardAvailable] = useState(false);
  const [candidates, setCandidates] = useState<ShowcaseCandidate[]>([]);

  const loadLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchPublicLeaderboard(orgSlug);
      setTitle(data.competition.title);
      setOrganizationName(data.organization.name);
      setOrganizationLogoUrl(data.organization.logo_url ?? "");
      setCompetitionStatus(data.competition.status);
      setLeaderboardAvailable(data.leaderboard_available);
      setCandidates(mapLeaderboard(data.leaderboard));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [orgSlug]);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${organizationName} — ${title}`,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Leaderboard link copied");
    } catch {
      toast.error("Could not share link");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to voteMe
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh">
      <div className="fixed left-4 top-4 z-50 flex gap-2 sm:left-6 sm:top-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-white/12 bg-black/40 text-white/80 backdrop-blur-md hover:bg-black/55 hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="size-3.5" />
            voteMe
          </Link>
        </Button>
        {leaderboardAvailable ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/12 bg-black/40 text-white/80 backdrop-blur-md hover:bg-black/55 hover:text-white"
            onClick={() => void handleShare()}
          >
            <Share2 className="size-3.5" />
            Share
          </Button>
        ) : null}
      </div>

      {!leaderboardAvailable ? (
        <LeaderboardUnavailable
          competitionStatus={competitionStatus}
          competitionTitle={title}
        />
      ) : (
        <LeaderboardCeremony
          candidates={candidates}
          competitionTitle={title}
          organizationName={organizationName}
          organizationLogoUrl={organizationLogoUrl}
        />
      )}
    </div>
  );
}
