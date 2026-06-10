"use client";

import { CandidatesRoster } from "@/components/admin/candidates-roster";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAdmin } from "@/hooks/use-require-admin";

export default function CandidatesPage() {
  const isAdmin = useRequireAdmin();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Candidate roster,"
        description="Search, review profiles, and remove accounts that should no longer have access."
      />
      <CandidatesRoster />
    </>
  );
}
