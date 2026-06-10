"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { GlassCard } from "@/components/dashboard/glass-card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type {
  CandidateVideoAnalytics,
  EngagementHistoryPoint,
} from "@/lib/competition-api";
import { BarChart3, LineChart } from "lucide-react";

const viewsChartConfig = {
  views: {
    label: "Views",
    color: "hsl(270 91% 65%)",
  },
  likes: {
    label: "Likes",
    color: "hsl(330 81% 60%)",
  },
} satisfies ChartConfig;

const videoChartConfig = {
  views: {
    label: "Views",
    color: "hsl(270 91% 65%)",
  },
  likes: {
    label: "Likes",
    color: "hsl(330 81% 60%)",
  },
  comments: {
    label: "Comments",
    color: "hsl(160 84% 39%)",
  },
} satisfies ChartConfig;

type CandidatePerformanceChartsProps = {
  history: EngagementHistoryPoint[];
  videos: CandidateVideoAnalytics[];
};

export function CandidatePerformanceCharts({
  history,
  videos,
}: CandidatePerformanceChartsProps) {
  const hasHistory = history.length > 0;
  const hasVideos = videos.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard
        accent="violet"
        title="Views over time"
        description="Hourly snapshots from video syncs."
        icon={<LineChart className="size-5 text-violet-400" strokeWidth={1.75} />}
      >
        {hasHistory ? (
          <ChartContainer
            config={viewsChartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart
              data={history}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-views)"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-views)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                fill="url(#viewsFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-violet-500/20 bg-violet-500/5 px-6 text-center text-sm text-muted-foreground">
            <p>No sync history yet.</p>
            <p className="mt-1 text-xs">
              Add videos and connect TikTok — charts fill in after the first sync.
            </p>
          </div>
        )}
      </GlassCard>

      <GlassCard
        accent="violet"
        title="Per-video breakdown"
        description="Views, likes, and comments by submission."
        icon={<BarChart3 className="size-5 text-violet-400" strokeWidth={1.75} />}
      >
        {hasVideos ? (
          <ChartContainer
            config={videoChartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart
              data={videos}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                angle={videos.length > 3 ? -18 : 0}
                textAnchor={videos.length > 3 ? "end" : "middle"}
                height={videos.length > 3 ? 56 : 32}
              />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="views"
                fill="var(--color-views)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="likes"
                fill="var(--color-likes)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="comments"
                fill="var(--color-comments)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-violet-500/20 bg-violet-500/5 px-6 text-center text-sm text-muted-foreground">
            <p>No videos submitted yet.</p>
            <p className="mt-1 text-xs">
              Submit competition videos to compare performance here.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
