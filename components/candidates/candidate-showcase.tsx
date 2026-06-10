import Image from "next/image";
import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";

import {
  ApexFooterCredit,
  ApexHeaderPromo,
} from "@/components/candidates/apex-promo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Candidate = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  views: number;
  likes: number;
  comments: number;
  engagementScore: number;
};

type CandidateShowcaseProps = {
  candidates: Candidate[];
  competitionTitle?: string;
  organizationName?: string;
  organizationLogoUrl?: string;
  showEngagementScore?: boolean;
};

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function CandidateShowcase({
  candidates,
  competitionTitle = "Social Media Engagement Competition",
  organizationName,
  organizationLogoUrl,
  showEngagementScore = false,
}: CandidateShowcaseProps) {
  const ranked = [...candidates].sort(
    (a, b) => b.engagementScore - a.engagementScore,
  );
  const brandName = organizationName?.trim() || "voteMe";
  const hasOrgLogo = Boolean(organizationLogoUrl?.trim());

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 size-[480px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-fuchsia-500/10 blur-[130px] animate-pulse [animation-delay:1s]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/3%)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {hasOrgLogo ? (
              <div className="relative size-11 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                <Image
                  src={organizationLogoUrl!}
                  alt={`${brandName} logo`}
                  fill
                  className="object-contain p-1.5"
                  sizes="44px"
                />
              </div>
            ) : (
              <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                <TrendingUp className="size-5 text-white" strokeWidth={1.75} />
              </div>
            )}
            <span className="text-lg font-semibold tracking-tight">{brandName}</span>
          </div>
          <ApexHeaderPromo />
        </header>

        <div className="mb-10 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-violet-500/20 bg-violet-500/10 text-violet-300"
          >
            <span className="relative mr-1.5 flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-violet-400" />
            </span>
            Live competition
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {competitionTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Track competitor engagement across views, likes, and comments.
            Rankings update in real time.
          </p>
        </div>

        <div className="space-y-3">
          {ranked.map((candidate, index) => (
            <Card
              key={candidate.id}
              className={cn(
                "border-white/8 bg-card/40 backdrop-blur-xl transition-colors hover:bg-card/60",
                index === 0 && "border-violet-500/30 ring-1 ring-violet-500/20",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar size="lg" className="size-12">
                      <AvatarFallback className="bg-violet-500/15 text-sm font-semibold text-violet-300">
                        {candidate.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                        index === 0
                          ? "bg-violet-500 text-white"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base">{candidate.name}</CardTitle>
                    <CardDescription>@{candidate.handle}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {showEngagementScore ? "Score" : "Activity"}
                    </p>
                    <p className="text-lg font-bold text-violet-400">
                      {showEngagementScore
                        ? formatCount(candidate.engagementScore)
                        : formatCount(
                            candidate.views +
                              candidate.likes +
                              candidate.comments,
                          )}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Views", value: candidate.views, icon: Eye },
                    { label: "Likes", value: candidate.likes, icon: Heart },
                    {
                      label: "Comments",
                      value: candidate.comments,
                      icon: MessageCircle,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/2 px-3 py-2"
                    >
                      <stat.icon className="size-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatCount(stat.value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ApexFooterCredit />
      </div>
    </div>
  );
}
