"use client";

import { PasswordSetupPanel } from "@/components/dashboard/password-setup-panel";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";

export default function DashboardChangePasswordPage() {
  const user = useDashboardUser();

  return (
    <>
      <DashboardPageHeader
        title="Change password,"
        description={
          user.must_change_password
            ? "Set a new password alongside your account security checklist."
            : "Update your password to keep your account secure."
        }
      />
      <PasswordSetupPanel />
    </>
  );
}
