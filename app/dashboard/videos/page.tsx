"use client";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { CompetitionVideosForm } from "@/components/candidate/competition-videos-form";
import { TikTokConnectCard } from "@/components/candidate/tiktok-connect-card";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";

export default function CandidateVideosPage() {
  const user = useDashboardUser();

  if (user.role !== "candidate") {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="Your videos,"
        description="Submit competition video links. Each URL is validated against your organization's platform."
      />
      <div className="space-y-6">
        <TikTokConnectCard />
        <CompetitionVideosForm />
      </div>
    </>
  );
}
