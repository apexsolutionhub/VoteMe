export const adminAccent = {
  orb1: "bg-amber-500/25",
  orb2: "bg-orange-500/20",
  orb3: "bg-yellow-400/10",
  mesh: "from-amber-500/8 via-transparent to-orange-500/6",
  line: "via-amber-400/50",
  gradient: "from-amber-300 via-orange-300 to-yellow-200",
  tabActive:
    "bg-linear-to-b from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-1 ring-amber-300/20",
  logo: "from-amber-400 to-orange-600 shadow-amber-500/30",
  badge: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  eyebrow: "text-amber-400/90",
  glow: "shadow-amber-500/10",
} as const;

export const candidateAccent = {
  orb1: "bg-violet-500/25",
  orb2: "bg-indigo-500/20",
  orb3: "bg-fuchsia-500/12",
  mesh: "from-violet-500/8 via-transparent to-indigo-500/6",
  line: "via-violet-400/50",
  gradient: "from-violet-300 via-fuchsia-300 to-indigo-200",
  tabActive:
    "bg-linear-to-b from-violet-400 to-indigo-500 text-white shadow-lg shadow-violet-500/30 ring-1 ring-violet-300/20",
  logo: "from-violet-400 to-indigo-600 shadow-violet-500/30",
  badge: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  eyebrow: "text-violet-400/90",
  glow: "shadow-violet-500/10",
} as const;

export function getDashboardAccent(isAdmin: boolean) {
  return isAdmin ? adminAccent : candidateAccent;
}
