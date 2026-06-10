"use client";

import { useRouter } from "next/navigation";

import { GrantCredentialsForm } from "@/components/admin/grant-credentials-form";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAdmin } from "@/hooks/use-require-admin";

export default function GrantCredentialsPage() {
  const router = useRouter();
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
        title="Grant credentials,"
        description="Create login access for new candidates. They must change their password on first sign-in."
      />
      <GrantCredentialsForm
        onCreated={async () => {
          router.push("/dashboard/candidates");
        }}
      />
    </>
  );
}
