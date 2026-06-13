import type { CompetitionVideo } from "@/lib/competition-api";
import { syncCandidateVideo } from "@/lib/competition-api";

export type VideoSyncOutcome = {
  video: CompetitionVideo;
  metricsUpdated: boolean;
  warning?: string;
};

export type SyncAllVideosResult = {
  outcomes: VideoSyncOutcome[];
  updatedCount: number;
  failedCount: number;
};

const SYNC_GAP_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function isMetricsUpdated(
  video: CompetitionVideo & { metrics_updated?: boolean },
) {
  return video.metrics_updated !== false;
}

export function getSyncWarning(
  video: CompetitionVideo & { sync_warning?: string },
) {
  return video.sync_warning;
}

/** Sync videos one at a time to reduce TikTok rate limiting. */
export async function syncAllCandidateVideos(
  videos: Array<Pick<CompetitionVideo, "id">>,
): Promise<SyncAllVideosResult> {
  const outcomes: VideoSyncOutcome[] = [];
  let updatedCount = 0;
  let failedCount = 0;

  for (const [index, video] of videos.entries()) {
    try {
      const synced = await syncCandidateVideo(video.id);
      const metricsUpdated = isMetricsUpdated(synced);
      const warning = getSyncWarning(synced);

      if (metricsUpdated) {
        updatedCount += 1;
      } else {
        failedCount += 1;
      }

      outcomes.push({
        video: synced,
        metricsUpdated,
        warning,
      });
    } catch {
      failedCount += 1;
      outcomes.push({
        video: { id: video.id } as CompetitionVideo,
        metricsUpdated: false,
        warning: "Sync request failed. Try again shortly.",
      });
    }

    if (index < videos.length - 1) {
      await delay(SYNC_GAP_MS);
    }
  }

  return { outcomes, updatedCount, failedCount };
}
