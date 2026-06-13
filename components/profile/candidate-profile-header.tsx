"use client";

import Image from "next/image";
import { BadgeCheck, Sparkles, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getDisplayName,
  getProfileCompletion,
  type ProfileFieldValues,
} from "@/lib/profile-utils";
import { cn } from "@/lib/utils";

type CandidateProfileHeaderProps = {
  username: string;
  values: ProfileFieldValues;
  isComplete?: boolean;
};

export function CandidateProfileHeader({
  username,
  values,
  isComplete,
}: CandidateProfileHeaderProps) {
  const displayName = getDisplayName(values, username);
  const hasPhoto = Boolean(values.profile_image_url);
  const { percent } = getProfileCompletion(values);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-violet-500/20",
        "bg-linear-to-br from-violet-500/12 via-fuchsia-500/6 to-indigo-500/10 backdrop-blur-xl",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-violet-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-fuchsia-500/15 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          {hasPhoto ? (
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-violet-400/50 to-fuchsia-400/30 blur-sm" />
              <div className="relative size-[4.5rem] overflow-hidden rounded-full ring-2 ring-violet-300/30 ring-offset-2 ring-offset-background sm:size-20">
                <Image
                  src={values.profile_image_url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              </div>
            </div>
          ) : (
            <div className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-full border border-dashed border-violet-400/25 bg-violet-500/8 sm:size-20">
              <UserRound className="size-7 text-violet-300/60 sm:size-8" />
            </div>
          )}

          <div className="min-w-0 space-y-2">
            <div className="space-y-1">
              <h2 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {displayName}
              </h2>
              <Badge
                variant="outline"
                className="border-violet-400/25 bg-violet-500/10 font-mono text-[11px] text-violet-100"
              >
                @{username}
              </Badge>
            </div>

            {isComplete ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                <BadgeCheck className="size-3.5" />
                Profile complete
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
                <Sparkles className="size-3.5" />
                {percent}% complete
              </span>
            )}
          </div>
        </div>

        {!isComplete ? (
          <div className="w-full shrink-0 sm:max-w-[200px]">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums text-violet-200">{percent}%</span>
            </div>
            <Progress
              value={percent}
              className="h-1.5 bg-white/8 [&>[data-slot=progress-indicator]]:bg-linear-to-r [&>[data-slot=progress-indicator]]:from-violet-500 [&>[data-slot=progress-indicator]]:to-fuchsia-400"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
