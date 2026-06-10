import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { type FeatureIconName, featureIcons } from "@/components/auth/auth-icons";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  badge: string;
  title: React.ReactNode;
  description: string;
  features: {
    label: string;
    icon: FeatureIconName;
  }[];
  accent?: "violet" | "amber";
};

const accentStyles = {
  violet: {
    orb1: "bg-violet-600/20",
    orb2: "bg-indigo-500/15",
    orb3: "bg-fuchsia-500/10",
    badge: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    ping: "bg-violet-400",
    logo: "from-violet-500 to-indigo-600 shadow-violet-500/25",
    featureIcon: "text-violet-400",
    featureHover: "hover:border-violet-500/20",
  },
  amber: {
    orb1: "bg-amber-600/20",
    orb2: "bg-orange-500/15",
    orb3: "bg-yellow-500/10",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    ping: "bg-amber-400",
    logo: "from-amber-500 to-orange-600 shadow-amber-500/25",
    featureIcon: "text-amber-400",
    featureHover: "hover:border-amber-500/20",
  },
};

export function AuthShell({
  children,
  badge,
  title,
  description,
  features,
  accent = "violet",
}: AuthShellProps) {
  const styles = accentStyles[accent];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-32 top-1/4 size-[480px] rounded-full blur-[120px] animate-pulse",
          styles.orb1,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full blur-[130px] animate-pulse [animation-delay:1.5s]",
          styles.orb2,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 size-[360px] -translate-x-1/2 rounded-full blur-[100px]",
          styles.orb3,
        )}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/3%)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-between px-8 py-10 lg:px-16 lg:py-14">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl bg-linear-to-br shadow-lg",
                  styles.logo,
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-5 text-white"
                  aria-hidden
                >
                  <path
                    d="M9 11l3 3L22 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                voteMe
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              All portals
            </Link>
          </div>

          <div className="mt-12 max-w-lg lg:mt-0">
            <p
              className={cn(
                "mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                styles.badge,
              )}
            >
              <span className="relative flex size-1.5">
                <span
                  className={cn(
                    "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                    styles.ping,
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-1.5 rounded-full",
                    styles.ping,
                  )}
                />
              </span>
              {badge}
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-3 lg:grid">
              {features.map((feature) => {
                const Icon = featureIcons[feature.icon];
                return (
                  <div
                    key={feature.label}
                    className={cn(
                      "rounded-xl border border-white/5 bg-white/2 p-4 backdrop-blur-sm transition-colors hover:bg-white/4",
                      styles.featureHover,
                    )}
                  >
                    <Icon
                      className={cn("size-4", styles.featureIcon)}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <p className="mt-2 text-xs leading-snug text-muted-foreground">
                      {feature.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-10 hidden text-xs text-muted-foreground/60 lg:block">
            © {new Date().getFullYear()} voteMe. All rights reserved.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          {children}
        </div>
      </div>
    </div>
  );
}
