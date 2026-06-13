import type { LucideIcon } from "lucide-react";
import {
  KeyRound,
  LayoutDashboard,
  Settings2,
  User,
  UserPlus,
  Users,
  Video,
} from "lucide-react";

import type { UserRole } from "@/lib/auth";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

/** Full-screen live display — not part of dashboard tab navigation. */
export const ADMIN_LEADERBOARD_PATH = "/dashboard/leaderboard";

export function getNavForRole(role: UserRole): DashboardNavItem[] {
  if (role === "admin") {
    return [
      {
        href: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        description: "Stats and quick actions",
      },
      {
        href: "/dashboard/competition",
        label: "Competition",
        icon: Settings2,
        description: "Rules, scoring & live tracking",
      },
      {
        href: "/dashboard/grant-credentials",
        label: "Grant access",
        icon: UserPlus,
        description: "Create candidate logins",
      },
      {
        href: "/dashboard/candidates",
        label: "Candidates",
        icon: Users,
        description: "Roster & credentials",
      },
      {
        href: "/dashboard/change-password",
        label: "Security",
        icon: KeyRound,
        description: "Update password",
      },
    ];
  }

  return [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Engagement & live metrics",
    },
    {
      href: "/dashboard/videos",
      label: "Videos",
      icon: Video,
      description: "TikTok & competition links",
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
      description: "Your candidate profile",
    },
    {
      href: "/dashboard/change-password",
      label: "Security",
      icon: KeyRound,
      description: "Update password",
    },
  ];
}

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}
