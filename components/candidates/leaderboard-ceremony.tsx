"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Crown, Eye, Heart, MessageCircle, RotateCcw } from "lucide-react";

import { ApexFooterCredit } from "@/components/candidates/apex-promo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ShowcaseCandidate = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  profileImageUrl?: string;
  views: number;
  likes: number;
  comments: number;
  engagementScore: number;
  rank: number;
};

type CeremonyPhase = "profiles" | "branding" | "podium";

type LeaderboardCeremonyProps = {
  candidates: ShowcaseCandidate[];
  competitionTitle?: string;
  organizationName?: string;
  organizationLogoUrl?: string;
};

const PROFILE_PHASE_MS = 5_500;
const BRANDING_PHASE_MS = 4_500;

const STAR_POSITIONS = [
  { top: "8%", left: "12%", delay: "0s", size: "text-xs" },
  { top: "14%", left: "78%", delay: "0.4s", size: "text-sm" },
  { top: "22%", left: "44%", delay: "0.8s", size: "text-[10px]" },
  { top: "32%", left: "8%", delay: "1.2s", size: "text-xs" },
  { top: "18%", left: "58%", delay: "0.2s", size: "text-sm" },
  { top: "40%", left: "88%", delay: "1.6s", size: "text-xs" },
  { top: "6%", left: "34%", delay: "0.6s", size: "text-[10px]" },
  { top: "28%", left: "92%", delay: "1s", size: "text-xs" },
  { top: "48%", left: "18%", delay: "1.4s", size: "text-sm" },
  { top: "12%", left: "22%", delay: "1.8s", size: "text-xs" },
  { top: "36%", left: "68%", delay: "0.3s", size: "text-[10px]" },
  { top: "52%", left: "52%", delay: "0.9s", size: "text-xs" },
];

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function StarField({ intense = false }: { intense?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STAR_POSITIONS.map((star, index) => (
        <span
          key={index}
          className={cn(
            "absolute text-amber-200/90 lb-star-pulse",
            star.size,
            intense && "text-amber-100",
          )}
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
          }}
        >
          ✦
        </span>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.15_75/18%)_0%,transparent_65%)]" />
    </div>
  );
}

function CandidateAvatar({
  candidate,
  size = "lg",
  className,
}: {
  candidate: ShowcaseCandidate;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClass =
    size === "xl" ? "size-28 sm:size-32" : size === "lg" ? "size-20 sm:size-24" : "size-16";

  return (
    <Avatar className={cn(sizeClass, "ring-2 ring-white/15", className)}>
      {candidate.profileImageUrl ? (
        <AvatarImage src={candidate.profileImageUrl} alt={candidate.name} />
      ) : null}
      <AvatarFallback className="bg-violet-500/20 text-base font-semibold text-violet-200">
        {candidate.initials}
      </AvatarFallback>
    </Avatar>
  );
}

function PodiumCard({
  candidate,
  placement,
  delayMs,
}: {
  candidate: ShowcaseCandidate;
  placement: 1 | 2 | 3;
  delayMs: number;
}) {
  const isFirst = placement === 1;
  const medalColors = {
    1: "from-amber-300 via-yellow-400 to-amber-500 text-amber-950",
    2: "from-slate-300 via-slate-200 to-slate-400 text-slate-900",
    3: "from-orange-400 via-amber-600 to-orange-700 text-orange-950",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center lb-podium-rise",
        isFirst ? "order-2 z-20 -mt-8 sm:-mt-12" : placement === 2 ? "order-1 z-10" : "order-3 z-10",
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {isFirst ? (
        <div className="relative mb-3 lb-crown-settle" style={{ animationDelay: `${delayMs + 200}ms` }}>
          <Crown
            className="size-10 text-amber-300 drop-shadow-[0_0_16px_oklch(0.82_0.14_75/80%)] sm:size-12"
            strokeWidth={1.5}
            fill="currentColor"
          />
        </div>
      ) : (
        <div className="mb-3 h-10 sm:h-12" />
      )}

      <div className="relative">
        {isFirst ? (
          <div
            aria-hidden
            className="absolute -inset-6 rounded-full bg-amber-400/25 blur-2xl lb-brand-glow"
          />
        ) : null}
        <CandidateAvatar
          candidate={candidate}
          size={isFirst ? "xl" : "lg"}
          className={cn(
            isFirst && "ring-amber-400/50 shadow-[0_0_40px_-8px_oklch(0.82_0.14_75/70%)]",
            placement === 2 && "ring-slate-300/40",
            placement === 3 && "ring-orange-400/35",
          )}
        />
        <span
          className={cn(
            "absolute -bottom-2 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold shadow-lg",
            medalColors[placement],
          )}
        >
          {placement}
        </span>
      </div>

      <div
        className="mt-6 w-full max-w-[200px] space-y-2 text-center lb-score-reveal"
        style={{ animationDelay: `${delayMs + 350}ms` }}
      >
        <p className="text-base font-semibold tracking-tight sm:text-lg">{candidate.name}</p>
        <p className="text-xs text-muted-foreground">@{candidate.handle}</p>
        <p className="text-2xl font-bold text-violet-300 tabular-nums">
          {formatCount(candidate.engagementScore)}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Engagement score
        </p>
        <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center justify-center gap-0.5">
            <Eye className="size-3" />
            {formatCount(candidate.views)}
          </span>
          <span className="inline-flex items-center justify-center gap-0.5">
            <Heart className="size-3" />
            {formatCount(candidate.likes)}
          </span>
          <span className="inline-flex items-center justify-center gap-0.5">
            <MessageCircle className="size-3" />
            {formatCount(candidate.comments)}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 w-full rounded-t-2xl border border-white/10 bg-linear-to-b from-white/10 to-white/3 backdrop-blur-sm",
          isFirst ? "h-28 sm:h-36" : placement === 2 ? "h-20 sm:h-24" : "h-16 sm:h-20",
        )}
      />
    </div>
  );
}

export function LeaderboardCeremony({
  candidates,
  competitionTitle = "Social Media Engagement Competition",
  organizationName,
  organizationLogoUrl,
}: LeaderboardCeremonyProps) {
  const [phase, setPhase] = useState<CeremonyPhase>("profiles");

  const ranked = useMemo(
    () => [...candidates].sort((a, b) => a.rank - b.rank),
    [candidates],
  );
  const topThree = ranked.filter((candidate) => candidate.rank <= 3);
  const brandName = organizationName?.trim() || "voteMe";
  const hasOrgLogo = Boolean(organizationLogoUrl?.trim());

  useEffect(() => {
    if (phase === "profiles") {
      const timer = window.setTimeout(() => setPhase("branding"), PROFILE_PHASE_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === "branding") {
      const timer = window.setTimeout(() => setPhase("podium"), BRANDING_PHASE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  function replayCeremony() {
    setPhase("profiles");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.12_0.01_280)]">
      <StarField intense={phase === "podium"} />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 size-[480px] rounded-full bg-violet-600/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-fuchsia-500/10 blur-[130px]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="mb-8 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          >
            Competition ended · Final results
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {competitionTitle}
          </h1>
        </header>

        {phase === "profiles" ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="mb-8 text-sm text-muted-foreground">
              Meet the competitors
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
              {ranked.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="flex flex-col items-center gap-2 lb-profile-pop"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CandidateAvatar candidate={candidate} size="lg" />
                  <p className="max-w-[100px] truncate text-center text-sm font-medium">
                    {candidate.name}
                  </p>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-10 text-muted-foreground"
              onClick={() => setPhase("branding")}
            >
              Continue →
            </Button>
          </div>
        ) : null}

        {phase === "branding" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Presented by
            </p>
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-14">
              <div className="lb-brand-glow flex flex-col items-center gap-3">
                {hasOrgLogo ? (
                  <div className="relative size-28 overflow-hidden rounded-3xl bg-white/5 p-4 ring-1 ring-white/15 sm:size-32">
                    <Image
                      src={organizationLogoUrl!}
                      alt={`${brandName} logo`}
                      fill
                      className="object-contain p-2"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div className="flex size-28 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white sm:size-32">
                    {brandName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <p className="text-lg font-semibold">{brandName}</p>
              </div>

              <div aria-hidden className="hidden h-24 w-px bg-white/15 sm:block" />
              <div aria-hidden className="h-px w-24 bg-white/15 sm:hidden" />

              <div className="lb-brand-glow flex flex-col items-center gap-3 [animation-delay:0.5s]">
                <div className="relative size-28 overflow-hidden rounded-3xl bg-[#0f1a2e] p-4 ring-1 ring-amber-400/25 sm:size-32">
                  <Image
                    src="/Apex/apex-logo-stacked.png"
                    alt="Apex Solution"
                    fill
                    className="object-contain p-2"
                    sizes="128px"
                  />
                </div>
                <p className="text-lg font-semibold text-amber-100">Apex Solution</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Powered by Apex · Building Ethiopia&apos;s digital future
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setPhase("podium")}
            >
              Reveal winners →
            </Button>
          </div>
        ) : null}

        {phase === "podium" ? (
          <div className="flex flex-1 flex-col">
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Top three champions
            </p>
            {topThree.length > 0 ? (
              <div className="grid flex-1 grid-cols-3 items-end gap-3 sm:gap-6">
                {topThree.map((candidate) => (
                  <PodiumCard
                    key={candidate.id}
                    candidate={candidate}
                    placement={candidate.rank as 1 | 2 | 3}
                    delayMs={candidate.rank === 1 ? 0 : candidate.rank === 2 ? 150 : 300}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No ranked candidates yet.
              </p>
            )}
            <div className="mt-10 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-white/12"
                onClick={replayCeremony}
              >
                <RotateCcw className="size-3.5" />
                Replay ceremony
              </Button>
            </div>
          </div>
        ) : null}

        <ApexFooterCredit />
      </div>
    </div>
  );
}

export function LeaderboardUnavailable({
  competitionStatus,
  competitionTitle,
}: {
  competitionStatus: string;
  competitionTitle?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.12_0.01_280)] px-6 text-center">
      <Card className="max-w-md border-white/10 bg-white/4 py-8 backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center">
          <Badge variant="outline" className="mx-auto border-amber-500/30 bg-amber-500/10 text-amber-200">
            Leaderboard locked
          </Badge>
          <CardTitle className="text-2xl">
            {competitionTitle ?? "Competition leaderboard"}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            The winner reveal opens after the competition ends. Current status:{" "}
            <span className="capitalize text-foreground">{competitionStatus}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            End the competition from admin settings when you are ready to announce results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
