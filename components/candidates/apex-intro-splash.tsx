"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const APEX_URL = "https://www.apexsolutionhub.com";
const SPLASH_DURATION_MS = 15_000;

const SERVICES = [
  { label: "Software Dev", className: "border-orange-400/30 bg-orange-500/15 text-orange-200" },
  { label: "AI Systems", className: "border-violet-400/30 bg-violet-500/15 text-violet-200" },
  { label: "Hotel Tech", className: "border-sky-400/30 bg-sky-500/15 text-sky-200" },
  { label: "Network", className: "border-teal-400/30 bg-teal-500/15 text-teal-200" },
  { label: "CCTV", className: "border-amber-400/30 bg-amber-500/15 text-amber-200" },
  { label: "Consulting", className: "border-blue-400/30 bg-blue-500/15 text-blue-200" },
] as const;

type ApexIntroSplashProps = {
  onComplete: () => void;
};

function ApexSparkle({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute text-amber-300/80 apex-twinkle",
        className,
      )}
    >
      ✦
    </span>
  );
}

export function ApexIntroSplash({ onComplete }: ApexIntroSplashProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const finish = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(onComplete, 600);
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(finish);
  }, [onComplete]);

  function dismiss() {
    setExiting(true);
    window.setTimeout(onComplete, 400);
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#060b14]/95 p-4 backdrop-blur-md transition-all duration-500",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 size-[480px] rounded-full bg-amber-500/15 blur-[120px] apex-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-1/4 size-[420px] rounded-full bg-orange-500/10 blur-[100px] apex-glow [animation-delay:1.5s]"
      />

      <div
        className={cn(
          "relative w-full max-w-2xl transition-all duration-700",
          exiting ? "scale-[0.98] opacity-0" : "scale-100 opacity-100",
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-amber-500/25 bg-linear-to-br from-[#0a1220] via-[#111d33]/98 to-amber-950/30 p-1 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-400/10">
          <div className="relative overflow-hidden rounded-[1.35rem] border border-white/5 bg-black/25 backdrop-blur-sm">
            <div className="relative aspect-[2.2/1] w-full overflow-hidden sm:aspect-[2.6/1]">
              <Image
                src="/Apex/apex-hero-poster.png"
                alt="Apex Solution"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0a1220] via-[#0a1220]/50 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-r from-[#0a1220]/70 via-transparent to-[#0a1220]/40" />

              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -inset-2 rounded-2xl bg-amber-400/30 blur-lg apex-glow"
                  />
                  <div className="relative apex-float-slow rounded-2xl bg-[#0f1a2e]/85 p-2 ring-1 ring-amber-400/30 backdrop-blur-sm">
                    <Image
                      src="/Apex/apex-logo-stacked.png"
                      alt="Apex Solution"
                      width={64}
                      height={64}
                      className="size-14 sm:size-16"
                      priority
                    />
                  </div>
                  <Image
                    src="/Apex/apex-icon-amber.png"
                    alt=""
                    width={28}
                    height={28}
                    className="absolute -right-2 -top-2 size-7 rounded-lg shadow-lg ring-2 ring-[#0a1220] apex-wiggle"
                    priority
                  />
                </div>
              </div>

              <ApexSparkle className="right-[16%] top-[10%] text-sm [animation-delay:0.3s]" />
              <ApexSparkle className="right-[6%] top-[32%] text-xs [animation-delay:1.4s]" />
              <ApexSparkle className="left-[40%] top-[6%] text-[11px] [animation-delay:0.9s]" />
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                  <Sparkles className="size-3 apex-twinkle" />
                  Partner spotlight
                </span>
                {SERVICES.map((service, index) => (
                  <span
                    key={service.label}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm apex-pop-in",
                      service.className,
                    )}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    {service.label}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-base font-semibold text-amber-50 sm:text-lg">
                    Grow with Apex Solution
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Software, AI, networking, and digital strategy — from idea
                    to launch. Building Ethiopia&apos;s digital future.
                  </p>
                </div>

                <a
                  href={APEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/15 px-4 py-2.5 text-sm font-semibold text-amber-200 transition-colors hover:border-amber-300/50 hover:bg-amber-500/25 hover:text-amber-100"
                >
                  Visit apexsolutionhub.com
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mx-auto mt-5 block text-xs font-medium text-muted-foreground/60 transition-colors hover:text-amber-300/90"
        >
          Skip to leaderboard →
        </button>
      </div>
    </div>
  );
}
