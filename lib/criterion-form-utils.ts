import type {
  CompetitionCriterion,
  CriterionEvaluationMode,
  CriterionMetricKey,
  CriterionWeightInputType,
} from "@/lib/competition-api";

export const inputClass =
  "h-10 w-full rounded-lg border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)]";

export const textareaClass =
  "min-h-20 w-full rounded-lg border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)]";

export const milestoneMetricOptions: {
  value: CriterionMetricKey;
  label: string;
  hint: string;
}[] = [
  { value: "likes", label: "Likes", hint: "Total likes across videos" },
  { value: "views", label: "Views", hint: "Total views across videos" },
  { value: "comments", label: "Comments", hint: "Comment count" },
  { value: "shares", label: "Shares", hint: "Share count" },
  { value: "brand_mentions", label: "Brand mentions", hint: "Comments mentioning the brand" },
  { value: "video_count", label: "Videos submitted", hint: "Number of competition videos" },
  { value: "profile_complete", label: "Profile complete", hint: "Candidate finished their profile" },
  { value: "engagement_score", label: "Engagement score", hint: "Weighted competition score" },
  { value: "rank", label: "Leaderboard rank", hint: "Position on the leaderboard" },
];

export const scoringMetricOptions: {
  value: CriterionMetricKey;
  label: string;
  hint: string;
}[] = [
  { value: "views", label: "Views", hint: "How much views contribute" },
  { value: "likes", label: "Likes", hint: "How much likes contribute" },
  { value: "comments", label: "Comments", hint: "How much comments contribute" },
  { value: "shares", label: "Shares", hint: "How much shares contribute" },
  { value: "brand_mentions", label: "Brand mentions", hint: "Brand mention weight" },
];

export type MilestoneFormState = {
  metric_key: CriterionMetricKey;
  evaluation_mode: CriterionEvaluationMode;
  title: string;
  description: string;
  target_value: string;
  sort_order: string;
  is_active: boolean;
};

export type MetricFormState = {
  metric_key: CriterionMetricKey;
  title: string;
  description: string;
  weight_input_type: CriterionWeightInputType;
  weight_value: string;
  weight_display: string;
  sort_order: string;
  is_active: boolean;
};

export const emptyMilestoneForm = (): MilestoneFormState => ({
  metric_key: "likes",
  evaluation_mode: "absolute",
  title: "",
  description: "",
  target_value: "",
  sort_order: "0",
  is_active: true,
});

export const emptyMetricForm = (): MetricFormState => ({
  metric_key: "likes",
  title: "",
  description: "",
  weight_input_type: "number",
  weight_value: "1",
  weight_display: "",
  sort_order: "0",
  is_active: true,
});

export function milestoneToForm(criterion: CompetitionCriterion): MilestoneFormState {
  return {
    metric_key: criterion.metric_key,
    evaluation_mode: criterion.evaluation_mode,
    title: criterion.title,
    description: criterion.description,
    target_value: criterion.target_value?.toString() ?? "",
    sort_order: criterion.sort_order.toString(),
    is_active: criterion.is_active,
  };
}

export function metricToForm(criterion: CompetitionCriterion): MetricFormState {
  return {
    metric_key: criterion.metric_key,
    title: criterion.title,
    description: criterion.description,
    weight_input_type: criterion.weight_input_type,
    weight_value: criterion.weight_value.toString(),
    weight_display: criterion.weight_display,
    sort_order: criterion.sort_order.toString(),
    is_active: criterion.is_active,
  };
}

export function buildMilestonePayload(form: MilestoneFormState) {
  return {
    kind: "milestone" as const,
    metric_key: form.metric_key,
    evaluation_mode: form.evaluation_mode,
    title: form.title.trim(),
    description: form.description.trim(),
    target_value:
      form.evaluation_mode === "absolute" &&
      form.metric_key !== "profile_complete" &&
      form.target_value
        ? Number(form.target_value)
        : form.metric_key === "profile_complete"
          ? 1
          : null,
    weight_input_type: "number" as const,
    weight_value: 0,
    weight_display: "",
    sort_order: Number(form.sort_order || 0),
    is_active: form.is_active,
  };
}

export function buildMetricPayload(form: MetricFormState) {
  return {
    kind: "metric" as const,
    metric_key: form.metric_key,
    evaluation_mode: "absolute" as const,
    title: form.title.trim(),
    description: form.description.trim(),
    target_value: null,
    weight_input_type: form.weight_input_type,
    weight_value:
      form.weight_input_type === "number"
        ? Number(form.weight_value || 0)
        : form.weight_input_type === "percentage"
          ? Number(form.weight_display.replace("%", "") || form.weight_value || 0)
          : 0,
    weight_display:
      form.weight_input_type === "word"
        ? form.weight_display.trim()
        : form.weight_input_type === "percentage"
          ? `${form.weight_display.replace("%", "").trim() || form.weight_value}%`
          : form.weight_value,
    sort_order: Number(form.sort_order || 0),
    is_active: form.is_active,
  };
}

export function formatMetricKey(key: string) {
  return key.replace(/_/g, " ");
}

export function isFormDirty<T>(current: T, baseline: T) {
  return JSON.stringify(current) !== JSON.stringify(baseline);
}
