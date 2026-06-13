"use client";

import {
  Award,
  Heart,
  MessageCircle,
  Medal,
  Sparkles,
  Target,
  Trophy,
  UserCheck,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { Progress } from "@/components/ui/progress";
import type { CandidateAchievement } from "@/lib/competition-api";
import { cn } from "@/lib/utils";

const achievementIcons: Record<string, LucideIcon> = {
  profile_complete: UserCheck,
  first_video: Video,
  views_100: Target,
  views_1k: Target,
  likes_50: Heart,
  brand_mention: MessageCircle,
  score_100: Sparkles,
  top_10: Medal,
  podium: Trophy,
};

const metricIcons: Record<string, LucideIcon> = {
  views: Target,
  likes: Heart,
  comments: MessageCircle,
  shares: Sparkles,
  brand_mentions: MessageCircle,
  video_count: Video,
  profile_complete: UserCheck,
  engagement_score: Trophy,
  rank: Medal,
};

function getAchievementIcon(achievement: CandidateAchievement): LucideIcon {
  if (achievementIcons[achievement.id]) {
    return achievementIcons[achievement.id];
  }
  if (achievement.metric_key && metricIcons[achievement.metric_key]) {
    return metricIcons[achievement.metric_key];
  }
  return Award;
}

type CandidateAchievementsProps = {
  achievements: CandidateAchievement[];
  unlockedCount: number;
  totalCount: number;
};

export function CandidateAchievements({
  achievements,
  unlockedCount,
  totalCount,
}: CandidateAchievementsProps) {
  const completion =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <DashboardSection
      title="Achievements"
      description={`${unlockedCount} of ${totalCount} milestones unlocked`}
    >
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-medium tabular-nums text-violet-300">
            {completion}%
          </span>
        </div>
        <Progress value={completion} className="h-2 bg-white/5" />
      </div>

      {achievements.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No milestones configured yet. Your organizer will add competition
          criteria soon.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = getAchievementIcon(achievement);
            const isRelative = achievement.evaluation_mode === "relative";
            const showNumericProgress =
              !achievement.unlocked &&
              !isRelative &&
              achievement.progress !== undefined &&
              achievement.target !== undefined &&
              achievement.target > 1;

            return (
              <div
                key={achievement.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-4 transition-colors",
                  achievement.unlocked
                    ? "border-violet-500/30 bg-linear-to-br from-violet-500/15 via-fuchsia-500/5 to-transparent"
                    : "border-white/8 bg-white/2",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                      achievement.unlocked
                        ? "border-violet-400/25 bg-violet-500/15 text-violet-300"
                        : "border-white/10 bg-white/5 text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        achievement.unlocked
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {achievement.title}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {achievement.description}
                    </p>
                    {showNumericProgress ? (
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>
                            {achievement.current?.toLocaleString()} /{" "}
                            {achievement.target?.toLocaleString()}
                          </span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress
                          value={achievement.progress}
                          className="h-1.5 bg-white/5"
                        />
                      </div>
                    ) : isRelative && !achievement.unlocked ? (
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>
                            {achievement.relative_label ?? "Compete for the top spot"}
                          </span>
                          <span>{achievement.progress ?? 0}%</span>
                        </div>
                        <Progress
                          value={achievement.progress ?? 0}
                          className="h-1.5 bg-white/5"
                        />
                      </div>
                    ) : achievement.unlocked ? (
                      <p className="pt-1 text-[10px] font-medium uppercase tracking-wider text-violet-400">
                        {isRelative ? "Leading" : "Unlocked"}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardSection>
  );
}
