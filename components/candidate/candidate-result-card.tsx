import { Crown, Medal, Trophy } from "lucide-react";

import { GlassCard } from "@/components/dashboard/glass-card";
import { cn } from "@/lib/utils";

type CandidateResultCardProps = {
  rank: number;
  engagementScore: number;
  onPodium?: boolean;
  className?: string;
};

function formatScore(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function resultDescription(rank: number) {
  if (rank === 1) {
    return "You won the competition. Your champion result is shown here and on the leaderboard reveal.";
  }
  if (rank <= 3) {
    return "You made the top-three podium. Your result is shown here and on the leaderboard reveal.";
  }
  return "The top three were announced on the leaderboard reveal. Here is your personal result.";
}

export function CandidateResultCard({
  rank,
  engagementScore,
  onPodium = false,
  className,
}: CandidateResultCardProps) {
  const isChampion = rank === 1;

  return (
    <GlassCard
      accent={isChampion ? "amber" : "violet"}
      title={isChampion ? "Champion" : "Your final standing"}
      description={resultDescription(rank)}
      icon={
        isChampion ? (
          <Crown className="size-5 text-amber-400" strokeWidth={1.75} />
        ) : (
          <Trophy className="size-5 text-violet-400" strokeWidth={1.75} />
        )
      }
      className={cn(className)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className={cn(
            "rounded-xl border p-5",
            isChampion
              ? "border-amber-500/30 bg-amber-500/10"
              : onPodium
                ? "border-violet-500/20 bg-violet-500/10"
                : "border-violet-500/20 bg-violet-500/10",
          )}
        >
          <div
            className={cn(
              "mb-2 flex items-center gap-2 text-xs uppercase tracking-wider",
              isChampion ? "text-amber-200/80" : "text-violet-200/80",
            )}
          >
            {isChampion ? <Crown className="size-3.5" /> : <Medal className="size-3.5" />}
            Final rank
          </div>
          <p
            className={cn(
              "text-4xl font-bold tabular-nums",
              isChampion ? "text-amber-100" : "text-violet-100",
            )}
          >
            #{rank}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/3 p-5">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Engagement score
          </p>
          <p className="text-4xl font-bold tabular-nums text-foreground">
            {formatScore(engagementScore)}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
