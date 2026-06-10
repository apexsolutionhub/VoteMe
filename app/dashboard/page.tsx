"use client";

import { AdminDashboardHome } from "@/components/dashboard/admin-dashboard-home";
import { CandidateDashboardHome } from "@/components/dashboard/candidate-dashboard-home";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";

export default function DashboardPage() {
  const user = useDashboardUser();

  if (user.role === "admin") {
    return <AdminDashboardHome />;
  }

  return <CandidateDashboardHome />;
}
