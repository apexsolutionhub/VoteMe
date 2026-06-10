import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const APEX_URL = "https://www.apexsolutionhub.com";

function ApexSparkles({ className }: { className?: string }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute text-amber-300/80 apex-twinkle",
          className,
        )}
      >
        ✦
      </span>
    </>
  );
}

export function ApexHeaderPromo() {
  return (
    <a
      href={APEX_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-amber-500/25 bg-linear-to-r from-[#0f1a2e]/90 via-amber-500/10 to-orange-500/5 px-4 py-2.5 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-amber-500/20"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 apex-shimmer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <ApexSparkles className="left-2 top-1 text-[10px] [animation-delay:0s]" />
      <ApexSparkles className="right-8 bottom-1 text-[8px] [animation-delay:1.2s]" />

      <div className="relative size-10 shrink-0">
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md apex-glow"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative size-full apex-orbit">
            <Image
              src="/Apex/apex-favicon-32.png"
              alt=""
              width={14}
              height={14}
              className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full ring-1 ring-amber-400/40"
            />
          </div>
        </div>
        <div className="relative flex size-full items-center justify-center apex-float">
          <Image
            src="/Apex/apex-icon-amber.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-lg shadow-md ring-1 ring-amber-400/30"
          />
        </div>
      </div>

      <div className="relative min-w-0">
        <Image
          src="/Apex/apex-logo-dark-bg.png"
          alt="Apex Solution"
          width={140}
          height={40}
          className="h-7 w-auto max-w-[140px] object-contain object-left"
        />
        <p className="mt-0.5 hidden text-[10px] leading-tight text-amber-200/70 sm:block">
          <span className="font-medium text-amber-100/90">Powered by Apex</span>
          {" · "}
          Building Ethiopia&apos;s digital future
        </p>
      </div>

      <ArrowUpRight className="relative size-4 shrink-0 text-amber-400/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-300" />
    </a>
  );
}

export function ApexFooterCredit() {
  return (
    <p className="mt-8 text-center text-xs text-muted-foreground/60">
      © {new Date().getFullYear()} voteMe · Competition powered by{" "}
      <a
        href={APEX_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 text-amber-400/80 transition-colors hover:text-amber-300"
      >
        <Image
          src="/Apex/apex-favicon-32.png"
          alt=""
          width={14}
          height={14}
          className="size-3.5 rounded-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        />
        Apex Solution
      </a>
    </p>
  );
}
