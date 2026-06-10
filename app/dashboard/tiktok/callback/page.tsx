"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { completeTikTokCallback } from "@/lib/competition-api";
import { getApiErrorMessage } from "@/lib/auth-api";

export default function TikTokCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setError("Missing TikTok authorization response.");
      return;
    }

    async function finish() {
      try {
        await completeTikTokCallback(code!, state!);
        router.replace("/dashboard/videos");
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    }

    finish();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          className="text-sm text-violet-300 hover:underline"
          onClick={() => router.replace("/dashboard/videos")}
        >
          Back to videos
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Spinner className="size-8" />
      <p className="text-sm text-muted-foreground">Connecting TikTok…</p>
    </div>
  );
}
