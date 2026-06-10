"use client";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { CompetitionSettingsForm } from "@/components/competition/competition-settings-form";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";

export default function CompetitionSettingsPage() {
  const user = useDashboardUser();

  if (user.role !== "admin") {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="Competition,"
        description="Set registration rules, scoring weights, final award, and live tracking for your SaaS workspace."
      />
      <CompetitionSettingsForm />
    </>
  );
}
