import {
  BarChart3,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";

export const loginIcons = {
  megaphone: Megaphone,
  "layout-dashboard": LayoutDashboard,
} as const;

export const featureIcons = {
  megaphone: Megaphone,
  users: Users,
  "bar-chart": BarChart3,
  "layout-dashboard": LayoutDashboard,
  settings: Settings,
} as const;

export type LoginIconName = keyof typeof loginIcons;
export type FeatureIconName = keyof typeof featureIcons;
