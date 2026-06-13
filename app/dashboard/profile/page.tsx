"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { CandidateProfileForm } from "@/components/profile/candidate-profile-form";
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const user = useDashboardUser();
  const router = useRouter();

  useEffect(() => {
    if (user.role === "admin") {
      router.replace("/dashboard");
    }
  }, [user.role, router]);

  if (user.role === "admin") {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Candidate"
        title="Profile,"
        description="Build your competition identity — every field updates the live preview instantly."
      />
      <CandidateProfileForm />
    </>
  );
}
