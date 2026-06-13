/** Minimum 1 minute between client-side live-tracking polls. */
export function liveTrackingIntervalMs(minutes: number) {
  return Math.max(minutes * 60_000, 60_000);
}
