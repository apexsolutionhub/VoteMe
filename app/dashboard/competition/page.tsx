"use client";

import { CompetitionCriteriaManager } from "@/components/competition/competition-criteria-manager";
import { CompetitionSettingsForm } from "@/components/competition/competition-settings-form";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";

export default function CompetitionSettingsPage() {
  const user = useDashboardUser();

  if (user.role !== "admin") {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Admin"
        title="Competition"
        description="Configure registration rules, scoring weights, milestones, and live engagement tracking for your workspace."
      />
      <div className="space-y-8">
        <CompetitionSettingsForm />
        <CompetitionCriteriaManager />
      </div>
    </>
  );
}
