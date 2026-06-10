"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth({ requirePasswordChanged: false });

  useEffect(() => {
    if (!loading && user) {
      router.replace(
        user.must_change_password
          ? "/dashboard"
          : "/dashboard/change-password",
      );
    }
  }, [loading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
