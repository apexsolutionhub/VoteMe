"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Crown,
  Eye,
  Heart,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

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

/** Each ceremony scene stays visible for 2 minutes before transitioning. */
const PHASE_DURATION_MS = 120_000;

/** Exit / enter animation length between profile batches. */
const PROFILE_BATCH_TRANSITION_MS = 650;
const MIN_PROFILE_BATCH_HOLD_MS = 2_500;

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
  { top: "62%", left: "72%", delay: "2.1s", size: "text-xs" },
  { top: "68%", left: "28%", delay: "1.7s", size: "text-sm" },
  { top: "74%", left: "84%", delay: "2.4s", size: "text-[10px]" },
];

const PHASE_META: Record<
  CeremonyPhase,
  { label: string; next?: string; icon: typeof Users }
> = {
  profiles: { label: "The competitors", next: "Partners", icon: Users },
  branding: { label: "Presented by", next: "Winners reveal", icon: Sparkles },
  podium: { label: "Champions", icon: Trophy },
};

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function formatRemainingMs(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function shuffleCandidates(candidates: ShowcaseCandidate[]) {
  const copy = [...candidates];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const PROFILE_MARQUEE_ACCENT = {
  ring: "from-violet-400 via-fuchsia-500 to-indigo-500",
  card: "from-violet-500/18 via-fuchsia-500/8 to-transparent",
  glow: "shadow-[0_0_24px_-12px_oklch(0.62_0.18_300/35%)]",
};

function rankAccent(rank: number) {
  if (rank === 1) {
    return {
      ring: "from-amber-300 via-yellow-400 to-amber-600",
      badge: "border-amber-400/50 bg-amber-500/20 text-amber-100",
      glow: "shadow-[0_0_48px_-8px_oklch(0.82_0.14_75/55%)]",
      card: "from-amber-500/25 via-yellow-500/10 to-transparent",
    };
  }
  if (rank === 2) {
    return {
      ring: "from-slate-200 via-slate-300 to-slate-500",
      badge: "border-slate-300/40 bg-slate-400/15 text-slate-100",
      glow: "shadow-[0_0_40px_-10px_oklch(0.78_0.02_260/50%)]",
      card: "from-slate-400/20 via-slate-300/8 to-transparent",
    };
  }
  if (rank === 3) {
    return {
      ring: "from-orange-400 via-amber-600 to-orange-700",
      badge: "border-orange-400/40 bg-orange-500/15 text-orange-100",
      glow: "shadow-[0_0_40px_-10px_oklch(0.68_0.16_55/45%)]",
      card: "from-orange-500/20 via-amber-600/8 to-transparent",
    };
  }
  return {
    ring: "from-violet-400 via-fuchsia-500 to-indigo-500",
    badge: "border-violet-400/30 bg-violet-500/12 text-violet-100",
    glow: "shadow-[0_0_32px_-12px_oklch(0.62_0.18_300/40%)]",
    card: "from-violet-500/18 via-fuchsia-500/8 to-transparent",
  };
}

function usePhaseTimer(phase: CeremonyPhase, onAdvance: () => void) {
  const [progress, setProgress] = useState(0);
  const [remainingMs, setRemainingMs] = useState(PHASE_DURATION_MS);

  useEffect(() => {
    if (phase === "podium") {
      setProgress(1);
      setRemainingMs(0);
      return;
    }

    const startedAt = Date.now();
    setProgress(0);
    setRemainingMs(PHASE_DURATION_MS);

    const advanceTimer = window.setTimeout(onAdvance, PHASE_DURATION_MS);
    const tickTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(1, elapsed / PHASE_DURATION_MS));
      setRemainingMs(Math.max(0, PHASE_DURATION_MS - elapsed));
    }, 250);

    return () => {
      window.clearTimeout(advanceTimer);
      window.clearInterval(tickTimer);
    };
  }, [phase, onAdvance]);

  return { progress, remainingMs };
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

function PhaseProgressBar({
  phase,
  progress,
  remainingMs,
  onSkip,
}: {
  phase: CeremonyPhase;
  progress: number;
  remainingMs: number;
  onSkip?: () => void;
}) {
  const meta = PHASE_META[phase];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-[oklch(0.1_0.012_280/92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <meta.icon className="size-4 shrink-0 text-violet-300/90" strokeWidth={1.75} />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground/90">
              {meta.label}
            </p>
            {meta.next ? (
              <p className="truncate text-[10px] text-muted-foreground">
                Next: {meta.next}
                {remainingMs > 0 ? ` · ${formatRemainingMs(remainingMs)}` : ""}
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground">Final reveal</p>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {(["profiles", "branding", "podium"] as CeremonyPhase[]).map((step) => {
            const stepOrder = { profiles: 0, branding: 1, podium: 2 };
            const currentOrder = stepOrder[phase];
            const thisOrder = stepOrder[step];
            return (
              <span
                key={step}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-500",
                  step === phase
                    ? "scale-125 bg-violet-400 shadow-[0_0_8px_oklch(0.62_0.18_300/60%)]"
                    : thisOrder < currentOrder
                      ? "bg-emerald-400/80"
                      : "bg-white/20",
                )}
              />
            );
          })}
        </div>

        {onSkip ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={onSkip}
          >
            Skip →
          </Button>
        ) : null}
      </div>

      <div className="h-0.5 w-full bg-white/6">
        <div
          className={cn(
            "h-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 transition-[width] duration-300 ease-linear",
            phase === "podium" && "from-amber-400 via-yellow-300 to-amber-500",
          )}
          style={{ width: `${Math.max(progress * 100, phase === "podium" ? 100 : 2)}%` }}
        />
      </div>
    </div>
  );
}

function CandidateAvatar({
  candidate,
  size = "lg",
  className,
  accentRing = false,
  accentClass = "from-violet-400 via-fuchsia-500 to-indigo-500",
}: {
  candidate: ShowcaseCandidate;
  size?: "md" | "lg" | "xl" | "hero";
  className?: string;
  accentRing?: boolean;
  accentClass?: string;
}) {
  const sizeClass =
    size === "hero"
      ? "size-32 sm:size-36"
      : size === "xl"
        ? "size-28 sm:size-32"
        : size === "lg"
          ? "size-24 sm:size-28"
          : "size-16 sm:size-20";

  const avatar = (
    <Avatar
      className={cn(
        sizeClass,
        "relative z-10 ring-2 ring-white/20",
        className,
      )}
    >
      {candidate.profileImageUrl ? (
        <AvatarImage src={candidate.profileImageUrl} alt={candidate.name} />
      ) : null}
      <AvatarFallback className="bg-violet-500/25 text-lg font-bold text-violet-100">
        {candidate.initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!accentRing) return avatar;

  return (
    <div className={cn("relative", sizeClass)}>
      <div
        aria-hidden
        className={cn(
          "absolute -inset-1.5 rounded-full bg-linear-to-br opacity-90 blur-[2px] lb-ring-spin",
          accentClass,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute -inset-1 rounded-full bg-linear-to-br p-[2px]",
          accentClass,
        )}
      >
        <div className="size-full rounded-full bg-[oklch(0.12_0.01_280)]" />
      </div>
      <div className="relative lb-avatar-float">{avatar}</div>
    </div>
  );
}

function profilesPerRowForWidth(width: number) {
  if (width >= 1280) return 7;
  if (width >= 1024) return 6;
  if (width >= 768) return 5;
  if (width >= 640) return 4;
  return 3;
}

function useProfilesPerRow() {
  const [perRow, setPerRow] = useState(6);

  useEffect(() => {
    const update = () => setPerRow(profilesPerRowForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perRow;
}

function chunkCandidates(list: ShowcaseCandidate[], size: number) {
  if (list.length === 0) {
    return [[]] as ShowcaseCandidate[][];
  }

  const batches: ShowcaseCandidate[][] = [];
  for (let i = 0; i < list.length; i += size) {
    batches.push(list.slice(i, i + size));
  }
  return batches;
}

/** Size batches so one full rotation fits inside the profiles phase duration. */
function planProfileBatchRotation(
  candidates: ShowcaseCandidate[],
  perRow: number,
  phaseDurationMs: number,
  transitionMs: number,
) {
  if (candidates.length === 0) {
    return { batches: [[]] as ShowcaseCandidate[][], holdMs: phaseDurationMs, transitionMs: 0 };
  }

  let batchSize = perRow * 2;

  while (true) {
    const effectiveSize = Math.min(batchSize, candidates.length);
    const batches = chunkCandidates(candidates, effectiveSize);
    const batchCount = batches.length;

    if (batchCount === 1) {
      return { batches, holdMs: phaseDurationMs, transitionMs: 0 };
    }

    const holdMs = Math.floor(
      (phaseDurationMs - (batchCount - 1) * transitionMs) / batchCount,
    );

    if (holdMs >= MIN_PROFILE_BATCH_HOLD_MS || effectiveSize >= candidates.length) {
      return { batches, holdMs, transitionMs };
    }

    batchSize += perRow;
    if (batchSize > candidates.length) {
      return { batches: [candidates], holdMs: phaseDurationMs, transitionMs: 0 };
    }
  }
}

function splitBatchIntoRows(batch: ShowcaseCandidate[]) {
  if (batch.length <= 1) {
    return { topRow: batch, bottomRow: [] as ShowcaseCandidate[] };
  }

  const half = Math.ceil(batch.length / 2);
  return {
    topRow: batch.slice(0, half),
    bottomRow: batch.slice(half),
  };
}

type ProfileBatchAnim = "enter" | "hold" | "exit";

function ProfileBatchCard({
  candidate,
  anim,
  staggerIndex,
}: {
  candidate: ShowcaseCandidate;
  anim: ProfileBatchAnim;
  staggerIndex: number;
}) {
  return (
    <article
      className={cn(
        "relative w-full max-w-[148px] justify-self-center",
        anim === "enter" && "lb-profile-batch-enter",
        anim === "exit" && "lb-profile-batch-exit",
      )}
      style={{ animationDelay: `${staggerIndex * 45}ms` }}
    >
      <div
        className={cn(
          "relative flex flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-white/4 px-3 py-4 backdrop-blur-2xl",
          PROFILE_MARQUEE_ACCENT.glow,
        )}
      >
        <CandidateAvatar
          candidate={candidate}
          size="md"
          accentRing
          accentClass={PROFILE_MARQUEE_ACCENT.ring}
        />
        <p className="w-full truncate text-center text-sm font-semibold tracking-tight">
          {candidate.name}
        </p>
      </div>
    </article>
  );
}

function ProfileBatchRow({
  candidates,
  perRow,
  anim,
  staggerOffset,
}: {
  candidates: ShowcaseCandidate[];
  perRow: number;
  anim: ProfileBatchAnim;
  staggerOffset: number;
}) {
  if (candidates.length === 0) {
    return null;
  }

  return (
    <div
      className="grid flex-1 content-center gap-3 px-2 sm:gap-4 sm:px-4"
      style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}
    >
      {candidates.map((candidate, index) => (
        <ProfileBatchCard
          key={candidate.id}
          candidate={candidate}
          anim={anim}
          staggerIndex={staggerOffset + index}
        />
      ))}
    </div>
  );
}

function ProfilesPhase({ candidates }: { candidates: ShowcaseCandidate[] }) {
  const perRow = useProfilesPerRow();
  const { batches, holdMs, transitionMs } = useMemo(
    () =>
      planProfileBatchRotation(
        candidates,
        perRow,
        PHASE_DURATION_MS,
        PROFILE_BATCH_TRANSITION_MS,
      ),
    [candidates, perRow],
  );

  const [batchIndex, setBatchIndex] = useState(0);
  const [anim, setAnim] = useState<ProfileBatchAnim>("enter");

  const batch = batches[Math.min(batchIndex, batches.length - 1)] ?? [];
  const { topRow, bottomRow } = splitBatchIntoRows(batch);

  useEffect(() => {
    setBatchIndex(0);
    setAnim("enter");
  }, [batches]);

  useEffect(() => {
    if (batches.length <= 1 || transitionMs === 0) {
      return undefined;
    }

    let holdTimer: ReturnType<typeof setTimeout>;
    let exitTimer: ReturnType<typeof setTimeout>;

    const scheduleBatch = (index: number) => {
      setAnim("enter");

      holdTimer = setTimeout(() => {
        if (index >= batches.length - 1) {
          setAnim("hold");
          return;
        }

        setAnim("exit");
        exitTimer = setTimeout(() => {
          const nextIndex = index + 1;
          setBatchIndex(nextIndex);
          scheduleBatch(nextIndex);
        }, transitionMs);
      }, holdMs);
    };

    scheduleBatch(0);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [batches, holdMs, transitionMs]);

  return (
    <div className="lb-phase-enter flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 py-2 sm:gap-4">
        <ProfileBatchRow
          candidates={topRow}
          perRow={perRow}
          anim={anim}
          staggerOffset={0}
        />
        {bottomRow.length > 0 ? (
          <ProfileBatchRow
            candidates={bottomRow}
            perRow={perRow}
            anim={anim}
            staggerOffset={topRow.length}
          />
        ) : null}
      </div>
    </div>
  );
}

function BrandingPhase({
  brandName,
  organizationLogoUrl,
  hasOrgLogo,
}: {
  brandName: string;
  organizationLogoUrl?: string;
  hasOrgLogo: boolean;
}) {
  return (
    <div className="lb-phase-enter flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden text-center">
      <div className="shrink-0 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200/80 sm:text-xs">
          Presented by
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Our partners in excellence
        </h2>
      </div>

      <div className="relative mt-6 flex w-full max-w-3xl min-h-0 flex-1 items-center justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.15_75/12%)_0%,transparent_70%)] lb-spotlight-pulse"
        />

        <div className="relative grid w-full gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-5">
          <div
            className="lb-brand-reveal flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-2xl sm:rounded-3xl sm:p-6"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-full bg-violet-500/20 blur-2xl lb-brand-glow"
              />
              {hasOrgLogo ? (
                <div className="relative size-24 overflow-hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/15 sm:size-28">
                  <Image
                    src={organizationLogoUrl!}
                    alt={`${brandName} logo`}
                    fill
                    className="object-contain p-2"
                    sizes="112px"
                  />
                </div>
              ) : (
                <div className="relative flex size-24 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white shadow-2xl shadow-violet-500/30 sm:size-28">
                  {brandName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-bold sm:text-xl">{brandName}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Competition host</p>
            </div>
          </div>

          <div
            aria-hidden
            className="hidden flex-col items-center gap-2 sm:flex lb-brand-reveal"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="h-px w-12 bg-linear-to-r from-transparent via-white/30 to-transparent" />
            <Sparkles className="size-4 text-amber-300/80" />
            <div className="h-px w-12 bg-linear-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <div
            aria-hidden
            className="mx-auto h-px w-20 bg-linear-to-r from-transparent via-white/25 to-transparent sm:hidden"
          />

          <div
            className="lb-brand-reveal flex flex-col items-center gap-3 rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-[#0f1a2e]/80 to-orange-500/5 p-5 backdrop-blur-2xl sm:rounded-3xl sm:p-6"
            style={{ animationDelay: "0.55s" }}
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-full bg-amber-400/20 blur-2xl lb-brand-glow"
              />
              <div className="relative size-24 overflow-hidden rounded-2xl bg-[#0f1a2e] p-4 ring-1 ring-amber-400/30 sm:size-28">
                <Image
                  src="/Apex/apex-logo-stacked.png"
                  alt="Apex Solution"
                  fill
                  className="object-contain p-2"
                  sizes="112px"
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-100 sm:text-xl">Apex Solution</p>
              <p className="mt-0.5 max-w-[200px] text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
                Powered by Apex · Building Ethiopia&apos;s digital future
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const accent = rankAccent(placement);
  const medalColors = {
    1: "from-amber-300 via-yellow-400 to-amber-500 text-amber-950",
    2: "from-slate-300 via-slate-200 to-slate-400 text-slate-900",
    3: "from-orange-400 via-amber-600 to-orange-700 text-orange-950",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center lb-podium-rise",
        isFirst ? "order-2 z-20 -mt-6 sm:-mt-8" : placement === 2 ? "order-1 z-10" : "order-3 z-10",
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {isFirst ? (
        <div
          className="relative mb-2 lb-crown-settle sm:mb-3"
          style={{ animationDelay: `${delayMs + 200}ms` }}
        >
          <Crown
            className="size-10 text-amber-300 drop-shadow-[0_0_20px_oklch(0.82_0.14_75/85%)] sm:size-11"
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
            className="absolute -inset-8 rounded-full bg-amber-400/30 blur-3xl lb-spotlight-pulse"
          />
        ) : null}
        <CandidateAvatar
          candidate={candidate}
          size={isFirst ? "xl" : "lg"}
          accentRing
          accentClass={accent.ring}
          className={cn(isFirst && "ring-amber-400/50")}
        />
        <span
          className={cn(
            "absolute -bottom-2.5 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold shadow-xl",
            medalColors[placement],
          )}
        >
          {placement}
        </span>
      </div>

      <div
        className="mt-4 w-full max-w-[180px] space-y-1.5 rounded-xl border border-white/10 bg-white/4 p-3 text-center backdrop-blur-xl lb-score-reveal sm:max-w-[200px] sm:rounded-2xl sm:p-4"
        style={{ animationDelay: `${delayMs + 350}ms` }}
      >
        <p className="text-base font-bold tracking-tight sm:text-lg">{candidate.name}</p>
        <p className="text-[10px] text-muted-foreground sm:text-xs">@{candidate.handle}</p>
        <p className="bg-linear-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-2xl font-black tabular-nums text-transparent sm:text-3xl">
          {formatCount(candidate.engagementScore)}
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Engagement score
        </p>
        <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-muted-foreground">
          <span className="inline-flex flex-col items-center gap-0.5">
            <Eye className="size-3.5 text-violet-300/80" />
            {formatCount(candidate.views)}
          </span>
          <span className="inline-flex flex-col items-center gap-0.5">
            <Heart className="size-3.5 text-fuchsia-300/80" />
            {formatCount(candidate.likes)}
          </span>
          <span className="inline-flex flex-col items-center gap-0.5">
            <MessageCircle className="size-3.5 text-sky-300/80" />
            {formatCount(candidate.comments)}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "relative mt-5 w-full overflow-hidden rounded-t-3xl border border-white/12 bg-linear-to-b backdrop-blur-sm",
          isFirst
            ? "mt-3 h-20 from-amber-500/25 via-amber-400/10 to-white/5 sm:h-24"
            : placement === 2
              ? "h-14 from-slate-400/20 via-slate-300/8 to-white/4 sm:h-16"
              : "h-12 from-orange-500/20 via-orange-400/8 to-white/4 sm:h-14",
        )}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
        />
      </div>
    </div>
  );
}

function PodiumPhase({
  topThree,
  onReplay,
}: {
  topThree: ShowcaseCandidate[];
  onReplay: () => void;
}) {
  return (
    <div className="lb-phase-enter flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-3 flex shrink-0 items-start justify-between gap-3 sm:mb-4">
        <div className="min-w-0 text-center sm:text-left">
          <Badge
            variant="outline"
            className="mb-2 border-amber-400/35 bg-amber-500/12 text-amber-100"
          >
            <Trophy className="mr-1 size-3" />
            Final standings
          </Badge>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Top three champions
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Rankings revealed
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 border-white/12 bg-white/4 backdrop-blur-sm"
          onClick={onReplay}
        >
          <RotateCcw className="size-3.5" />
          Replay
        </Button>
      </div>

      {topThree.length > 0 ? (
        <div className="relative grid min-h-0 flex-1 grid-cols-3 items-end gap-1 sm:gap-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.15_75/15%)_0%,transparent_70%)] lb-spotlight-pulse"
          />
          {topThree.map((candidate) => (
            <PodiumCard
              key={candidate.id}
              candidate={candidate}
              placement={candidate.rank as 1 | 2 | 3}
              delayMs={candidate.rank === 1 ? 0 : candidate.rank === 2 ? 180 : 360}
            />
          ))}
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center text-muted-foreground">
          No ranked candidates yet.
        </p>
      )}
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
  const [shuffleKey, setShuffleKey] = useState(0);

  const ranked = useMemo(
    () => [...candidates].sort((a, b) => a.rank - b.rank),
    [candidates],
  );
  const shuffledProfiles = useMemo(
    () => shuffleCandidates(candidates),
    [candidates, shuffleKey],
  );
  const topThree = ranked.filter((candidate) => candidate.rank <= 3);
  const brandName = organizationName?.trim() || "voteMe";
  const hasOrgLogo = Boolean(organizationLogoUrl?.trim());

  const advancePhase = useCallback(() => {
    setPhase((current) => {
      if (current === "profiles") return "branding";
      if (current === "branding") return "podium";
      return current;
    });
  }, []);

  const { progress, remainingMs } = usePhaseTimer(phase, advancePhase);

  function replayCeremony() {
    setShuffleKey((current) => current + 1);
    setPhase("profiles");
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[oklch(0.12_0.01_280)]">
      <StarField intense={phase === "podium"} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-32 top-1/4 size-[480px] rounded-full blur-[120px] transition-colors duration-2000",
          phase === "profiles" && "bg-violet-600/18",
          phase === "branding" && "bg-amber-500/12",
          phase === "podium" && "bg-amber-400/20",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full blur-[130px] transition-colors duration-2000",
          phase === "profiles" && "bg-fuchsia-500/12",
          phase === "branding" && "bg-violet-600/14",
          phase === "podium" && "bg-fuchsia-500/16",
        )}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl min-h-0 flex-1 flex-col px-4 pb-18 pt-4 sm:px-6 sm:pt-5">
        <header className="mb-2 shrink-0 text-center sm:mb-3">
          {phase !== "profiles" ? (
            <Badge
              variant="outline"
              className="mb-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            >
              Competition ended · Final results
            </Badge>
          ) : null}
          <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
            {competitionTitle}
          </h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {phase === "profiles" ? (
            <ProfilesPhase candidates={shuffledProfiles} />
          ) : null}
          {phase === "branding" ? (
            <BrandingPhase
              brandName={brandName}
              organizationLogoUrl={organizationLogoUrl}
              hasOrgLogo={hasOrgLogo}
            />
          ) : null}
          {phase === "podium" ? (
            <PodiumPhase topThree={topThree} onReplay={replayCeremony} />
          ) : null}
        </div>

        {phase === "profiles" ? (
          <div className="shrink-0 pt-2 [&_p]:mt-0">
            <ApexFooterCredit />
          </div>
        ) : null}
      </div>

      <PhaseProgressBar
        phase={phase}
        progress={progress}
        remainingMs={remainingMs}
        onSkip={phase !== "podium" ? advancePhase : undefined}
      />
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
