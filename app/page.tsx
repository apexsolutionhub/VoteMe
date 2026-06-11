import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  Megaphone,
  TrendingUp,
} from "lucide-react";

const portals = [
  {
    href: "/Candidates",
    title: "Candidates",
    description:
      "Manage your profile, track views and likes, and climb the engagement leaderboard.",
    icon: Megaphone,
    gradient: "from-violet-500/25 via-fuchsia-500/10 to-indigo-500/15",
    border: "border-violet-400/15 hover:border-violet-400/40",
    iconColor: "text-violet-200",
    glow: "hover:shadow-violet-500/15",
    cta: "text-violet-200",
  },
  {
    href: "/Admin",
    title: "Admin",
    description:
      "Run the competition, oversee candidates, and configure live engagement tracking.",
    icon: LayoutDashboard,
    gradient: "from-amber-500/25 via-orange-500/10 to-yellow-500/15",
    border: "border-amber-400/15 hover:border-amber-400/40",
    iconColor: "text-amber-200",
    glow: "hover:shadow-amber-500/15",
    cta: "text-amber-200",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.12_0.01_280)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 size-[480px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-amber-500/15 blur-[130px] animate-pulse [animation-delay:1.5s]"
      />
      <div className="dashboard-grid-bg pointer-events-none absolute inset-0" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.1_0.01_280/90)_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/30 ring-1 ring-white/10">
            <TrendingUp className="size-7 text-white" strokeWidth={1.75} />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-violet-300/80 uppercase">
            Social engagement competitions
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Welcome to{" "}
            <span className="text-gradient-candidate">voteMe</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground/90">
            Run TikTok engagement competitions with live leaderboards, candidate
            portals, and brand mention scoring.
          </p>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-2">
          {portals.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white/4 p-7 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-2xl ${portal.border} ${portal.glow}`}
            >
              <div
                aria-hidden
                className={`absolute inset-0 bg-linear-to-br opacity-80 ${portal.gradient}`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
              />
              <div className="relative mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 ring-1 ring-white/10">
                <portal.icon
                  className={`size-7 ${portal.iconColor}`}
                  strokeWidth={1.75}
                />
              </div>
              <h2 className="relative text-xl font-semibold tracking-tight">
                {portal.title}
              </h2>
              <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground/90">
                {portal.description}
              </p>
              <span
                className={`relative mt-6 inline-flex items-center gap-2 text-sm font-medium ${portal.cta}`}
              >
                Sign in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} voteMe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
