"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import {
  getNavForRole,
  isNavItemActive,
} from "@/components/dashboard/dashboard-nav";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { cn } from "@/lib/utils";

export function DashboardTabs() {
  const user = useDashboardUser();
  const pathname = usePathname();
  const items = getNavForRole(user.role);
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);

  return (
    <nav
      aria-label="Dashboard sections"
      className="glass-panel rounded-xl p-1"
    >
      <div className="flex gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.description}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-300",
                active
                  ? accent.tabActive
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-300",
                  active ? "scale-105" : "opacity-70 group-hover:opacity-100",
                )}
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
