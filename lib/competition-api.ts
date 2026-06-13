import api from "@/lib/api";

export type SocialPlatform = "tiktok";

export type CompetitionStatus = "draft" | "live" | "ended";

export type CommentScoringMode = "all" | "matched";

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
  comment_scoring_mode: CommentScoringMode;
  comment_match_terms: string[];
  comment_scoring_approximate: boolean;
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

export type CompetitionVideoSyncStatus = "synced" | "pending";

export type VideoIneligibilityReason =
  | "published_before_start"
  | "published_after_end"
  | "competition_not_started"
  | "";

export type CompetitionVideo = {
  id: number;
  url: string;
  platform_video_id: string;
  title?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  last_synced_at: string | null;
  platform_published_at?: string | null;
  is_competition_eligible: boolean;
  ineligibility_reason?: VideoIneligibilityReason;
  sync_status: CompetitionVideoSyncStatus;
  is_active: boolean;
  /** Present on POST .../sync/ responses */
  metrics_updated?: boolean;
  sync_warning?: string;
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
  title?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  brand_mention_comments: number;
  last_synced_at: string | null;
  platform_published_at?: string | null;
  is_competition_eligible?: boolean;
  ineligibility_reason?: VideoIneligibilityReason;
};

export type CriterionKind = "milestone" | "metric";
export type CriterionEvaluationMode = "absolute" | "relative";
export type CriterionMetricKey =
  | "views"
  | "likes"
  | "comments"
  | "shares"
  | "brand_mentions"
  | "video_count"
  | "profile_complete"
  | "engagement_score"
  | "rank";
export type CriterionWeightInputType = "number" | "percentage" | "word";

export type CompetitionCriterion = {
  id: number;
  kind: CriterionKind;
  metric_key: CriterionMetricKey;
  evaluation_mode: CriterionEvaluationMode;
  title: string;
  description: string;
  target_value: number | null;
  weight_value: number;
  weight_input_type: CriterionWeightInputType;
  weight_display: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CandidateAchievement = {
  id: string;
  criterion_id?: number;
  title: string;
  description: string;
  unlocked: boolean;
  kind?: CriterionKind;
  evaluation_mode?: CriterionEvaluationMode;
  metric_key?: CriterionMetricKey;
  current?: number;
  target?: number;
  progress?: number;
  relative_label?: string;
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
  competition_result?: {
    rank: number;
    engagement_score: number;
    visible: boolean;
    on_podium?: boolean;
  } | null;
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
  return {
    ...data,
    comment_scoring_mode: data.comment_scoring_mode ?? "all",
    comment_match_terms: data.comment_match_terms ?? [],
    comment_scoring_approximate: data.comment_scoring_approximate ?? false,
  };
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
  options?: { start_at?: string },
): Promise<Competition> {
  const { data } = await api.post<Competition>(
    "/organizations/competition/status/",
    {
      competition_id: competitionId,
      status,
      ...(options?.start_at ? { start_at: options.start_at } : {}),
    },
  );
  return data;
}

export async function fetchCompetitionCriteria(): Promise<CompetitionCriterion[]> {
  const { data } = await api.get<CompetitionCriterion[]>(
    "/organizations/competition/criteria/",
  );
  return data;
}

export async function createCompetitionCriterion(
  payload: Omit<
    CompetitionCriterion,
    "id" | "created_at" | "updated_at"
  >,
): Promise<CompetitionCriterion> {
  const { data } = await api.post<CompetitionCriterion>(
    "/organizations/competition/criteria/",
    payload,
  );
  return data;
}

export async function updateCompetitionCriterion(
  id: number,
  payload: Partial<
    Omit<CompetitionCriterion, "id" | "created_at" | "updated_at">
  >,
): Promise<CompetitionCriterion> {
  const { data } = await api.patch<CompetitionCriterion>(
    `/organizations/competition/criteria/${id}/`,
    payload,
  );
  return data;
}

export async function deleteCompetitionCriterion(id: number): Promise<void> {
  await api.delete(`/organizations/competition/criteria/${id}/`);
}

export async function syncCompetition() {
  const { data } = await api.post<{
    synced_count: number;
    failed_count?: number;
    attempted_count?: number;
    leaderboard: LeaderboardEntry[];
    last_synced_at: string;
    detail?: string;
    sync_warning?: string;
  }>("/organizations/competition/sync/", {}, { timeout: 120_000 });
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

function normalizeCompetitionVideo(
  video: CompetitionVideo,
): CompetitionVideo {
  return {
    ...video,
    is_competition_eligible: video.is_competition_eligible ?? false,
    sync_status:
      video.sync_status ?? (video.last_synced_at ? "synced" : "pending"),
  };
}

export async function fetchCandidateVideos(): Promise<CompetitionVideo[]> {
  const { data } = await api.get<CompetitionVideo[]>("/candidate/me/videos/");
  return data.map(normalizeCompetitionVideo);
}

export async function addCandidateVideo(url: string): Promise<CompetitionVideo> {
  const { data } = await api.post<CompetitionVideo>("/candidate/me/videos/", {
    url,
  });
  return normalizeCompetitionVideo(data);
}

export async function syncCandidateVideo(id: number): Promise<CompetitionVideo> {
  const { data } = await api.post<CompetitionVideo>(
    `/candidate/me/videos/${id}/sync/`,
    {},
    { timeout: 45_000 },
  );
  return normalizeCompetitionVideo(data);
}

export async function removeCandidateVideo(id: number): Promise<void> {
  await api.delete(`/candidate/me/videos/${id}/`);
}

export type CriterionOutcomeHolder = {
  candidate_id: number;
  name: string;
  username: string;
  initials: string;
  profile_image_url: string;
  rank: number;
  current?: number | null;
  target?: number | null;
  unlocked: boolean;
};

export type CriterionOutcome = {
  criterion_id: number;
  title: string;
  description: string;
  evaluation_mode: CriterionEvaluationMode;
  metric_key: CriterionMetricKey;
  target_value?: number | null;
  status: "awarded" | "leading" | "open";
  holders: CriterionOutcomeHolder[];
};

export type CompetitionStandingsCandidate = LeaderboardEntry & {
  is_profile_complete: boolean;
  brand_mention_comments: number;
  milestones_unlocked: number;
  milestones_total: number;
  milestone_progress: number;
  achievements: CandidateAchievement[];
};

export type CompetitionStandings = {
  final_award: string;
  competition_status: CompetitionStatus;
  winner: CompetitionStandingsCandidate | null;
  criteria_outcomes: CriterionOutcome[];
  candidates: CompetitionStandingsCandidate[];
  total_candidates: number;
};

export async function fetchAdminCompetitionStandings() {
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
    standings: CompetitionStandings;
    last_updated_at: string;
  }>("/organizations/competition/standings/");
  return data;
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
    leaderboard_available: boolean;
  }>("/organizations/leaderboard/");
  return data;
}

/** Public results ceremony — available when competition has ended. */
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
    leaderboard_available: boolean;
  }>(`/public/${orgSlug}/leaderboard/`);
  return data;
}
