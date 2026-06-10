"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";

export function useRequireAdmin() {
  const user = useDashboardUser();
  const router = useRouter();

  useEffect(() => {
    if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user.role, router]);

  return user.role === "admin";
}
