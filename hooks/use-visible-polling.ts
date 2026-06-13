"use client";

import { useEffect, useRef } from "react";

type UseVisiblePollingOptions = {
  enabled?: boolean;
  /** Poll immediately when the tab becomes visible again. */
  refreshOnVisible?: boolean;
};

/**
 * Run a callback on mount and on an interval, but only while the tab is visible.
 */
export function useVisiblePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  { enabled = true, refreshOnVisible = true }: UseVisiblePollingOptions = {},
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || intervalMs <= 0) {
      return;
    }

    let active = true;

    const run = () => {
      if (!active || document.visibilityState !== "visible") {
        return;
      }
      void callbackRef.current();
    };

    run();

    const intervalId = window.setInterval(run, intervalMs);

    const onVisibilityChange = () => {
      if (refreshOnVisible && document.visibilityState === "visible") {
        run();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, intervalMs, refreshOnVisible]);
}
