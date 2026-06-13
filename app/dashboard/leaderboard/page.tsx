"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  LeaderboardCeremony,
  LeaderboardUnavailable,
  type ShowcaseCandidate,
} from "@/components/candidates/leaderboard-ceremony";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import {
  fetchAdminLeaderboard,
  type LeaderboardEntry,
} from "@/lib/competition-api";

export default function AdminLeaderboardPage() {
  const isAdmin = useRequireAdmin();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Social Media Engagement Competition");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const [competitionStatus, setCompetitionStatus] = useState("draft");
  const [leaderboardAvailable, setLeaderboardAvailable] = useState(false);
  const [candidates, setCandidates] = useState<ShowcaseCandidate[]>([]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await fetchAdminLeaderboard();
      setTitle(data.competition.title);
      setOrganizationName(data.organization.name);
      setOrganizationLogoUrl(data.organization.logo_url ?? "");
      setCompetitionStatus(data.competition.status);
      setLeaderboardAvailable(data.leaderboard_available);
      setCandidates(
        data.leaderboard.map((entry: LeaderboardEntry) => ({
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
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    void loadLeaderboard();
  }, [isAdmin, loadLeaderboard]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!leaderboardAvailable) {
    return (
      <div className="relative min-h-svh">
        <Link
          href="/dashboard"
          className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-black/55 hover:text-white sm:left-6 sm:top-6"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard
        </Link>
        <LeaderboardUnavailable
          competitionStatus={competitionStatus}
          competitionTitle={title}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-svh">
      <Link
        href="/dashboard"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-black/55 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-3.5" />
        Dashboard
      </Link>
      <LeaderboardCeremony
        candidates={candidates}
        competitionTitle={title}
        organizationName={organizationName}
        organizationLogoUrl={organizationLogoUrl}
      />
    </div>
  );
}
