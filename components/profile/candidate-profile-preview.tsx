"use client";

import Image from "next/image";
import {
  Check,
  Circle,
  ExternalLink,
  Mail,
  Phone,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { GlassCard } from "@/components/dashboard/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  formatFollowers,
  getDisplayName,
  getInitials,
  getProfileCompletion,
  sexLabels,
  type ProfileFieldValues,
} from "@/lib/profile-utils";
import { cn } from "@/lib/utils";

type CandidateProfilePreviewProps = {
  username: string;
  values: ProfileFieldValues;
  isComplete?: boolean;
};

const ringOffset = "oklch(0.16 0.02 280)";

export function CandidateProfilePreview({
  username,
  values,
  isComplete,
}: CandidateProfilePreviewProps) {
  const displayName = getDisplayName(values, username);
  const initials = getInitials(values, username);
  const hasPhoto = Boolean(values.profile_image_url);
  const { items } = getProfileCompletion(values);

  return (
    <GlassCard
      accent="violet"
      title="Live preview"
      description="See how your profile appears to organizers."
      icon={<UserRound className="size-5 text-violet-400" strokeWidth={1.75} />}
      className="h-fit lg:sticky lg:top-6"
      contentClassName="p-0"
    >
      <div className="overflow-hidden">
        {/* Cover + avatar */}
        <div className="relative px-5 pb-5 pt-1 sm:px-6">
          <div className="relative h-18 overflow-hidden rounded-xl bg-linear-to-r from-violet-600/35 via-fuchsia-500/25 to-indigo-600/30">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,oklch(1_0_0/14%),transparent_60%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,oklch(0.7_0.15_300/20%),transparent_50%)]"
            />
          </div>

          <div className="-mt-10 flex flex-col items-center text-center">
            {hasPhoto ? (
              <div
                className="relative mb-3 size-18 overflow-hidden rounded-full shadow-lg shadow-violet-900/40"
                style={{
                  boxShadow: `0 0 0 3px ${ringOffset}, 0 0 0 4px oklch(0.65 0.15 300 / 25%)`,
                }}
              >
                <Image
                  src={values.profile_image_url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
            ) : (
              <Avatar
                className="mb-3 size-18 text-lg shadow-lg shadow-violet-900/30"
                style={{
                  boxShadow: `0 0 0 3px ${ringOffset}, 0 0 0 4px oklch(0.65 0.15 300 / 20%)`,
                }}
              >
                <AvatarImage src={values.profile_image_url} alt={displayName} />
                <AvatarFallback className="bg-violet-500/20 font-semibold text-violet-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}

            <h4 className="text-base font-semibold tracking-tight">
              {displayName}
            </h4>
            <p className="mt-0.5 font-mono text-[11px] text-violet-200/75">
              @{username}
            </p>

            <Badge
              variant="outline"
              className={cn(
                "mt-2.5 px-2.5 py-0.5 text-[10px] font-medium",
                isComplete
                  ? "border-emerald-500/35 bg-emerald-500/12 text-emerald-300"
                  : "border-amber-500/35 bg-amber-500/12 text-amber-200",
              )}
            >
              {isComplete ? "Competition ready" : "Incomplete profile"}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <dl className="divide-y divide-white/6 border-t border-white/6">
          <PreviewRow icon={Phone} label="Phone">
            {values.phone_number || <EmptyValue>Not set</EmptyValue>}
          </PreviewRow>
          <PreviewRow icon={Mail} label="Email">
            {values.email || <EmptyValue>Not set</EmptyValue>}
          </PreviewRow>
          <PreviewRow icon={Users} label="Sex">
            {sexLabels[values.sex] ?? <EmptyValue>Not selected</EmptyValue>}
          </PreviewRow>
          <PreviewRow icon={UsersRound} label="Followers">
            {values.follower_count > 0 ? (
              formatFollowers(values.follower_count)
            ) : (
              <EmptyValue>0</EmptyValue>
            )}
          </PreviewRow>
          <PreviewRow icon={ExternalLink} label="Channel" isLast>
            {values.social_channel_url ? (
              <a
                href={values.social_channel_url}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-violet-300 transition-colors hover:text-violet-200 hover:underline"
              >
                {values.social_channel_url.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <EmptyValue>Not set</EmptyValue>
            )}
          </PreviewRow>
        </dl>

        {!isComplete ? (
          <div className="border-t border-white/6 bg-white/2 px-5 py-4 sm:px-6">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
              To complete
            </p>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {items.map((item) => (
                <li
                  key={item.key}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
                    item.done ? "text-foreground/75" : "text-muted-foreground",
                  )}
                >
                  {item.done ? (
                    <Check className="size-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="size-3 shrink-0 text-white/25" />
                  )}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}

function EmptyValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-normal italic text-muted-foreground/60">
      {children}
    </span>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  children,
  isLast,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-3.5 sm:px-6",
        !isLast && "border-b border-white/4",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/4">
        <Icon className="size-3.5 text-violet-300/70" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
        </dt>
        <dd className="mt-0.5 truncate text-sm font-medium text-foreground/95">
          {children}
        </dd>
      </div>
    </div>
  );
}
