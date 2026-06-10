import api from "@/lib/api";

export type SocialPlatform = "tiktok" | "youtube" | "instagram" | "facebook";

export type CompetitionStatus = "draft" | "live" | "ended";

export type Competition = {
  id: number;
  title: string;
  description: string;
  social_platform: SocialPlatform;
  registration_criteria: string;
  scoring_criteria: string;
  final_award: string;
  scoring_weights: Record<string, number>;
  status: CompetitionStatus;
  live_tracking_enabled: boolean;
  tracking_interval_minutes: number;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateProfile = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  sex: string;
  social_channel_url: string;
  follower_count: number;
  profile_image_url: string;
  is_profile_complete: boolean;
  video_count: number;
  created_at: string;
  updated_at: string;
};

export type CompetitionVideo = {
  id: number;
  url: string;
  platform_video_id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  last_synced_at: string | null;
  is_active: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  candidate_id: number;
  name: string;
  username: string;
  initials: string;
  profile_image_url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement_score: number;
  video_count: number;
  last_synced_at: string | null;
};

export type CandidateStats = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  brand_mention_comments: number;
  last_synced_at: string | null;
  competition_status: CompetitionStatus;
  live_tracking_enabled: boolean;
  tracking_interval_minutes: number;
  tiktok_connected: boolean;
};

export type EngagementHistoryPoint = {
  captured_at: string | null;
  label: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

export type CandidateVideoAnalytics = {
  id: number;
  url: string;
  label: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  brand_mention_comments: number;
  last_synced_at: string | null;
};

export type CandidateAchievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  current?: number;
  target?: number;
  progress?: number;
};

export type CandidateAnalytics = {
  totals: CandidateStats;
  history: EngagementHistoryPoint[];
  videos: CandidateVideoAnalytics[];
  achievements: CandidateAchievement[];
  profile_complete: boolean;
  video_count: number;
  unlocked_achievements: number;
  total_achievements: number;
};

export type TikTokStatus = {
  connected: boolean;
  configured: boolean;
  open_id?: string;
  connected_at?: string;
};

export async function fetchOrganizationMe() {
  const { data } = await api.get<{
    organization: {
      id: string;
      name: string;
      slug: string;
      org_code: string;
    };
    competition: Competition | null;
  }>("/organizations/me/");
  return data;
}

export async function fetchCompetition(): Promise<Competition> {
  const { data } = await api.get<Competition>("/organizations/competition/");
  return data;
}

export async function updateCompetition(
  payload: Partial<Competition>,
): Promise<Competition> {
  const { data } = await api.patch<Competition>(
    "/organizations/competition/",
    payload,
  );
  return data;
}

export async function setCompetitionStatus(
  competitionId: number,
  status: CompetitionStatus,
): Promise<Competition> {
  const { data } = await api.post<Competition>(
    "/organizations/competition/status/",
    { competition_id: competitionId, status },
  );
  return data;
}

export async function syncCompetition() {
  const { data } = await api.post<{
    synced_count: number;
    leaderboard: LeaderboardEntry[];
    last_synced_at: string;
  }>("/organizations/competition/sync/");
  return data;
}

export async function fetchOrgCandidates(): Promise<CandidateProfile[]> {
  const { data } = await api.get<CandidateProfile[]>("/organizations/candidates/");
  return data;
}

export async function createOrgCandidate(payload: {
  username: string;
  password: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}): Promise<CandidateProfile> {
  const { data } = await api.post<CandidateProfile>(
    "/organizations/candidates/",
    payload,
  );
  return data;
}

export async function deleteOrgCandidate(id: number): Promise<void> {
  await api.delete(`/organizations/candidates/${id}/`);
}

export async function fetchCandidateProfile(): Promise<CandidateProfile> {
  const { data } = await api.get<CandidateProfile>("/candidate/me/profile/");
  return data;
}

export async function updateCandidateProfile(
  payload: Partial<CandidateProfile>,
): Promise<CandidateProfile> {
  const { data } = await api.patch<CandidateProfile>(
    "/candidate/me/profile/",
    payload,
  );
  return data;
}

export async function fetchCandidateStats(): Promise<CandidateStats> {
  const { data } = await api.get<CandidateStats>("/candidate/me/stats/");
  return data;
}

export async function fetchCandidateAnalytics(): Promise<CandidateAnalytics> {
  const { data } = await api.get<CandidateAnalytics>("/candidate/me/analytics/");
  return data;
}

export async function fetchCandidateVideos(): Promise<CompetitionVideo[]> {
  const { data } = await api.get<CompetitionVideo[]>("/candidate/me/videos/");
  return data;
}

export async function addCandidateVideo(url: string): Promise<CompetitionVideo> {
  const { data } = await api.post<CompetitionVideo>("/candidate/me/videos/", {
    url,
  });
  return data;
}

export async function removeCandidateVideo(id: number): Promise<void> {
  await api.delete(`/candidate/me/videos/${id}/`);
}

export async function fetchTikTokStatus(): Promise<TikTokStatus> {
  const { data } = await api.get<TikTokStatus>("/tiktok/status/");
  return data;
}

export type TikTokConnectInfo = {
  authorize_url: string;
  login_kit: "desktop" | "web";
  redirect_uri: string;
  setup_hints: string[];
};

export async function getTikTokConnectInfo(): Promise<TikTokConnectInfo> {
  const { data } = await api.get<TikTokConnectInfo>("/tiktok/connect/");
  return data;
}

export async function getTikTokConnectUrl(): Promise<string> {
  const { authorize_url } = await getTikTokConnectInfo();
  return authorize_url;
}

export async function completeTikTokCallback(
  code: string,
  state: string,
): Promise<void> {
  await api.post("/tiktok/callback/", { code, state });
}

export async function disconnectTikTok(): Promise<void> {
  await api.delete("/tiktok/disconnect/");
}

export async function fetchAdminLeaderboard() {
  const { data } = await api.get<{
    organization: {
      id: string;
      name: string;
      slug: string;
      logo_url: string;
    };
    competition: Competition & {
      organization_name: string;
      organization_slug: string;
    };
    leaderboard: LeaderboardEntry[];
    last_updated_at: string;
  }>("/organizations/leaderboard/");
  return data;
}

/** @deprecated Public leaderboard is disabled — use fetchAdminLeaderboard */
export async function fetchPublicLeaderboard(orgSlug: string) {
  const { data } = await api.get<{
    organization: {
      name: string;
      slug: string;
      logo_url: string;
    };
    competition: Competition & {
      organization_name: string;
      organization_slug: string;
    };
    leaderboard: LeaderboardEntry[];
    last_updated_at: string;
  }>(`/public/${orgSlug}/leaderboard/`);
  return data;
}
