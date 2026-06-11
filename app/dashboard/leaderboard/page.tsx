"use client";

import { useEffect, useState } from "react";

import { CandidateShowcase } from "@/components/candidates/candidate-showcase";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
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
  const [candidates, setCandidates] = useState<
    Array<{
      id: string;
      name: string;
      handle: string;
      initials: string;
      views: number;
      likes: number;
      comments: number;
      engagementScore: number;
    }>
  >([]);

  useEffect(() => {
    if (!isAdmin) return;

    let active = true;

    async function load() {
      try {
        const data = await fetchAdminLeaderboard();
        if (!active) return;
        setTitle(data.competition.title);
        setOrganizationName(data.organization.name);
        setOrganizationLogoUrl(data.organization.logo_url ?? "");
        setCandidates(
          data.leaderboard.map((entry: LeaderboardEntry) => ({
            id: String(entry.candidate_id),
            name: entry.name,
            handle: entry.username,
            initials: entry.initials,
            views: entry.views,
            likes: entry.likes,
            comments: entry.comments,
            engagementScore: entry.engagement_score,
          })),
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin"
        title="Leaderboard"
        description="Live candidate rankings with engagement scores. Only visible to admins."
      />
      <div className="-mx-4 overflow-hidden rounded-2xl border border-white/8 sm:-mx-6 lg:-mx-8">
        <CandidateShowcase
          candidates={candidates}
          competitionTitle={title}
          organizationName={organizationName}
          organizationLogoUrl={organizationLogoUrl}
          showEngagementScore
        />
      </div>
    </div>
  );
}
