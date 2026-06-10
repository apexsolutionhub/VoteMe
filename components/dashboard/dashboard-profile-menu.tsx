"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { getDashboardAccent } from "@/components/dashboard/dashboard-accent";
import {
  getUserDisplayName,
  getUserInitials,
} from "@/components/dashboard/dashboard-user-display";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function DashboardProfileMenu() {
  const user = useDashboardUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user.role === "admin";
  const accent = getDashboardAccent(isAdmin);
  const isProfileActive = pathname.startsWith("/dashboard/profile");

  function handleSignOut() {
    clearAuth();
    router.replace("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2.5 rounded-xl border px-2 py-1.5 transition-all duration-300 outline-none",
            "focus-visible:ring-2 focus-visible:ring-white/20",
            isProfileActive
              ? cn("border-white/15 bg-white/8", accent.glow)
              : "border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/6",
          )}
          aria-label="Open profile menu"
        >
          <Avatar className="size-8 ring-1 ring-white/10">
            <AvatarFallback
              className={cn(
                "text-xs font-semibold",
                isAdmin
                  ? "bg-amber-500/20 text-amber-100"
                  : "bg-violet-500/20 text-violet-100",
              )}
            >
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-left text-xs font-medium sm:block">
            {getUserDisplayName(user)}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 border-white/10 bg-[oklch(0.18_0.01_280/95)] backdrop-blur-2xl"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName(user)}
            </p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
            <Badge
              variant="outline"
              className={cn("mt-0.5 w-fit rounded-full text-[10px]", accent.badge)}
            >
              {isAdmin ? "Admin" : "Candidate"}
            </Badge>
          </div>
        </DropdownMenuLabel>
        {!isAdmin ? (
          <>
            <DropdownMenuSeparator className="bg-white/8" />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/profile">
                <User />
                Profile
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator className="bg-white/8" />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
