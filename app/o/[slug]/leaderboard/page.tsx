import type { Metadata } from "next";

import { PublicLeaderboardClient } from "@/components/candidates/public-leaderboard-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} — Leaderboard`,
    description: "Official competition results and winner reveal ceremony.",
  };
}

export default async function PublicLeaderboardPage({ params }: PageProps) {
  const { slug } = await params;
  return <PublicLeaderboardClient orgSlug={slug} />;
}
