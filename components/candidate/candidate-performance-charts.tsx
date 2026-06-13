"use client";

import { format } from "date-fns";
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

type ChartPoint = EngagementHistoryPoint & { ts: number };

function toChartPoints(points: EngagementHistoryPoint[]): ChartPoint[] {
  return points.map((point) => ({
    ...point,
    ts: point.captured_at ? new Date(point.captured_at).getTime() : 0,
  }));
}

function formatAxisTick(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
}

function formatTimeTick(value: number) {
  if (!value) return "";
  return format(new Date(value), "MMM d, HH:mm");
}

type CandidatePerformanceChartsProps = {
  history: EngagementHistoryPoint[];
  videos: CandidateVideoAnalytics[];
};

export function CandidatePerformanceCharts({
  history,
  videos,
}: CandidatePerformanceChartsProps) {
  const totalHistory = toChartPoints(history);
  const hasHistory = totalHistory.length > 1;
  const hasVideos = videos.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard
          accent="violet"
          title="Total views over time"
          description="Combined views across all videos at each sync point."
          icon={<LineChart className="size-5 text-violet-400" strokeWidth={1.75} />}
        >
          {hasHistory ? (
            <ChartContainer
              config={viewsChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart
                data={totalHistory}
                margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
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
                  dataKey="ts"
                  type="number"
                  scale="time"
                  domain={["dataMin", "dataMax"]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={formatTimeTick}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  allowDecimals={false}
                  tickFormatter={formatAxisTick}
                  domain={[0, (max: number) => Math.max(Math.ceil(max * 1.15), 1)]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const point = payload?.[0]?.payload as ChartPoint | undefined;
                        return point?.label ?? "";
                      }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  fill="url(#viewsFill)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-views)" }}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-violet-500/20 bg-violet-500/5 px-6 text-center text-sm text-muted-foreground">
              <p>
                {totalHistory.length === 1
                  ? "Only one sync snapshot so far."
                  : "No sync history yet."}
              </p>
              <p className="mt-1 text-xs">
                Charts need at least two successful syncs with changed metrics.
                Use Refresh metrics on your videos page.
              </p>
            </div>
          )}
        </GlassCard>

        <GlassCard
          accent="violet"
          title="Current totals by video"
          description="Latest views, likes, and comments per eligible submission."
          icon={<BarChart3 className="size-5 text-violet-400" strokeWidth={1.75} />}
        >
          {hasVideos ? (
            <ChartContainer
              config={videoChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <BarChart
                data={videos}
                margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
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
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  allowDecimals={false}
                  tickFormatter={formatAxisTick}
                  domain={[0, (max: number) => Math.max(Math.ceil(max * 1.15), 1)]}
                />
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
              <p>No eligible competition videos yet.</p>
              <p className="mt-1 text-xs">
                Only videos published while the competition is live appear here.
              </p>
            </div>
          )}
        </GlassCard>
    </div>
  );
}
