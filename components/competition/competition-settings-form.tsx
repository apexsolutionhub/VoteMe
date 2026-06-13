"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDown, Save, Settings2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { CompetitionFormSection } from "@/components/competition/competition-form-section";
import {
  CompetitionOverviewBar,
  CompetitionSettingsSkeleton,
} from "@/components/competition/competition-overview-bar";
import {
  DashboardForm,
  DashboardFormRow,
} from "@/components/dashboard/dashboard-form";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchCompetition,
  fetchCompetitionCriteria,
  setCompetitionStatus,
  syncCompetition,
  updateCompetition,
  type Competition,
  type CompetitionStatus,
} from "@/lib/competition-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { competitionSettingsValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof competitionSettingsValidation>;

const inputClass =
  "h-10 w-full rounded-lg border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)]";
const textareaClass =
  "min-h-24 w-full rounded-lg border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)]";

export function CompetitionSettingsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(competitionSettingsValidation) as Resolver<FormValues>,
    defaultValues: {
      title: "",
      description: "",
      social_platform: "tiktok",
      registration_criteria: "",
      scoring_criteria: "",
      final_award: "",
      live_tracking_enabled: true,
      tracking_interval_minutes: 10,
      weight_views: 1,
      weight_likes: 3,
      weight_comments: 5,
      weight_shares: 2,
      weight_brand_mentions: 10,
      comment_filter_enabled: false,
      comment_match_terms: "",
    },
  });

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [milestoneCount, setMilestoneCount] = useState(0);
  const [metricCount, setMetricCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [legacyOpen, setLegacyOpen] = useState(false);
  const [commentScoringApproximate, setCommentScoringApproximate] = useState(false);

  const commentFilterEnabled = form.watch("comment_filter_enabled");
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    async function load() {
      try {
        const [data, criteria] = await Promise.all([
          fetchCompetition(),
          fetchCompetitionCriteria().catch(() => []),
        ]);
        setCompetition(data);
        setCommentScoringApproximate(data.comment_scoring_approximate ?? false);
        setMilestoneCount(criteria.filter((item) => item.kind === "milestone").length);
        setMetricCount(criteria.filter((item) => item.kind === "metric").length);
        form.reset({
          title: data.title,
          description: data.description,
          social_platform: data.social_platform,
          registration_criteria: data.registration_criteria,
          scoring_criteria: data.scoring_criteria,
          final_award: data.final_award,
          live_tracking_enabled: data.live_tracking_enabled,
          tracking_interval_minutes: data.tracking_interval_minutes,
          weight_views: data.scoring_weights?.views ?? 1,
          weight_likes: data.scoring_weights?.likes ?? 3,
          weight_comments: data.scoring_weights?.comments ?? 5,
          weight_shares: data.scoring_weights?.shares ?? 2,
          weight_brand_mentions: data.scoring_weights?.brand_mentions ?? 10,
          comment_filter_enabled: data.comment_scoring_mode === "matched",
          comment_match_terms: (data.comment_match_terms ?? []).join("\n"),
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [form]);

  async function onSubmit(values: FormValues) {
    try {
      const updated = await updateCompetition({
        title: values.title,
        description: values.description || "",
        social_platform: values.social_platform,
        registration_criteria: values.registration_criteria,
        scoring_criteria: values.scoring_criteria,
        final_award: values.final_award,
        live_tracking_enabled: values.live_tracking_enabled,
        tracking_interval_minutes: values.tracking_interval_minutes,
        scoring_weights: {
          views: values.weight_views,
          likes: values.weight_likes,
          comments: values.weight_comments,
          shares: values.weight_shares,
          brand_mentions: values.weight_brand_mentions,
        },
        comment_scoring_mode: values.comment_filter_enabled ? "matched" : "all",
        comment_match_terms: values.comment_filter_enabled
          ? values.comment_match_terms
              ?.split(/[\n,]+/)
              .map((term) => term.trim())
              .filter(Boolean) ?? []
          : [],
      });
      setCompetition(updated);
      setCommentScoringApproximate(updated.comment_scoring_approximate ?? false);
      form.reset(values);
      toast.success("Competition settings saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleGoLive(startDate: Date) {
    if (!competition) return;
    try {
      const updated = await setCompetitionStatus(competition.id, "live", {
        start_at: format(startDate, "yyyy-MM-dd"),
      });
      setCompetition(updated);
      setCommentScoringApproximate(updated.comment_scoring_approximate ?? false);
      toast.success(
        `Competition is live — scoring starts ${format(startDate, "MMM d, yyyy")}`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleStatusChange(status: CompetitionStatus) {
    if (!competition) return;
    try {
      const updated = await setCompetitionStatus(competition.id, status);
      setCompetition(updated);
      setCommentScoringApproximate(updated.comment_scoring_approximate ?? false);
      toast.success(`Competition is now ${status}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const result = await syncCompetition();
      if (result.sync_warning) {
        toast.warning(result.sync_warning);
      } else {
        toast.success(`Synced ${result.synced_count} videos`);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return <CompetitionSettingsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <CompetitionOverviewBar
        competition={competition}
        milestoneCount={milestoneCount}
        metricCount={metricCount}
        syncing={syncing}
        onSync={() => void handleSync()}
        onGoLive={handleGoLive}
        onEnd={() => void handleStatusChange("ended")}
      />

      <GlassCard
        accent="amber"
        title="Competition settings"
        description="Shape how candidates join, how engagement is scored, and what winners receive."
        icon={<Settings2 className="size-5 text-amber-400" strokeWidth={1.75} />}
        contentClassName="pb-0"
      >
        <DashboardForm onSubmit={form.handleSubmit(onSubmit)} className="gap-6">
          <CompetitionFormSection
            title="Basics"
            description="Name your competition. voteMe currently tracks TikTok engagement."
          >
            <div className="space-y-4">
              <CustomFormField
                name="title"
                control={form.control}
                fieldType={formFieldTypes.INPUT}
                label="Competition title"
                placeholder="TikTok Creator Cup 2026"
                className={inputClass}
              />
              <CustomFormField
                name="description"
                control={form.control}
                fieldType={formFieldTypes.TEXTAREA}
                label="Description"
                placeholder="Brief overview shown to candidates and admins"
                className={textareaClass}
              />

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Platform</span>
                <Badge
                  variant="outline"
                  className="border-violet-400/30 bg-violet-500/10 text-violet-200"
                >
                  TikTok
                </Badge>
              </div>
            </div>
          </CompetitionFormSection>

          <CompetitionFormSection
            title="Rules & awards"
            description="Tell candidates what to expect and what they are competing for."
          >
            <div className="space-y-4">
              <CustomFormField
                name="registration_criteria"
                control={form.control}
                fieldType={formFieldTypes.TEXTAREA}
                label="Registration criteria"
                placeholder="Who can join and what they must submit"
                className={textareaClass}
              />
              <CustomFormField
                name="scoring_criteria"
                control={form.control}
                fieldType={formFieldTypes.TEXTAREA}
                label="Scoring criteria (public copy)"
                placeholder="Explain how engagement is measured for candidates"
                className={textareaClass}
              />
              <CustomFormField
                name="final_award"
                control={form.control}
                fieldType={formFieldTypes.TEXTAREA}
                label="Final award"
                placeholder="Prize or recognition for winners"
                className="min-h-20 w-full rounded-lg border-white/10 bg-white/4 shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)]"
              />
            </div>
          </CompetitionFormSection>

          <CompetitionFormSection
            title="Comment scoring"
            description="Control which comments count toward the Comments metric."
          >
            <div className="space-y-4">
              <CustomFormField
                name="comment_filter_enabled"
                control={form.control}
                fieldType={formFieldTypes.SWITCH}
                label="Count only matching comments"
                description="When enabled, only comments containing your triggers are scored."
              />
              {commentFilterEnabled ? (
                <>
                  <CustomFormField
                    name="comment_match_terms"
                    control={form.control}
                    fieldType={formFieldTypes.TEXTAREA}
                    label="Match any of these triggers"
                    placeholder={"@ellaresort\n#ellaresort\nellaresort"}
                    className={textareaClass}
                    description="One per line or comma-separated."
                  />
                  {commentScoringApproximate ? (
                    <Alert className="border-amber-500/25 bg-amber-500/8">
                      <AlertTitle className="text-amber-100">
                        Approximate scoring active
                      </AlertTitle>
                      <AlertDescription className="text-amber-100/80">
                        Matched comment mode is on, but individual comment text has not
                        been synced yet. Scoring temporarily uses the platform comment
                        total until comment text is available.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </>
              ) : null}
            </div>
          </CompetitionFormSection>

          <CompetitionFormSection
            title="Live tracking"
            description="Automatically refresh engagement metrics on leaderboard polls."
          >
            <DashboardFormRow>
              <CustomFormField
                name="live_tracking_enabled"
                control={form.control}
                fieldType={formFieldTypes.SWITCH}
                label="Live tracking enabled"
                description="Poll engagement while the tab is open"
              />
              <CustomFormField
                name="tracking_interval_minutes"
                control={form.control}
                fieldType={formFieldTypes.INPUT}
                label="Tracking interval (minutes)"
                type="number"
                className={inputClass}
              />
            </DashboardFormRow>
          </CompetitionFormSection>

          <div className="overflow-hidden rounded-2xl border border-amber-500/15 bg-amber-500/5">
            <button
              type="button"
              onClick={() => setLegacyOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-amber-500/8"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-500/10">
                  <Sparkles className="size-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-50/95">
                    Legacy scoring weights
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-amber-100/70">
                    Used only when no metric criteria exist. Prefer the criteria
                    section below for full control.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-amber-200/80 transition-transform duration-200",
                  legacyOpen && "rotate-180",
                )}
              />
            </button>
            {legacyOpen ? (
              <div className="border-t border-amber-500/15 px-5 py-5">
                <DashboardFormRow columns={4}>
                  <CustomFormField
                    name="weight_views"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Views"
                    type="number"
                    className={inputClass}
                  />
                  <CustomFormField
                    name="weight_likes"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Likes"
                    type="number"
                    className={inputClass}
                  />
                  <CustomFormField
                    name="weight_comments"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Comments"
                    type="number"
                    className={inputClass}
                  />
                  <CustomFormField
                    name="weight_shares"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Shares"
                    type="number"
                    className={inputClass}
                  />
                  <CustomFormField
                    name="weight_brand_mentions"
                    control={form.control}
                    fieldType={formFieldTypes.INPUT}
                    label="Brand mentions"
                    type="number"
                    className={inputClass}
                  />
                </DashboardFormRow>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {isDirty ? (
                <span className="text-amber-200/90">
                  You have unsaved changes
                </span>
              ) : (
                "Settings are synced with your workspace"
              )}
            </p>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className={cn(
                "h-10 w-full gap-2 bg-linear-to-r from-amber-600 to-orange-600 text-white sm:w-auto sm:min-w-44 sm:px-8",
                "shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-orange-500",
              )}
            >
              <Save className="size-4" />
              {form.formState.isSubmitting ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </DashboardForm>
      </GlassCard>
    </div>
  );
}
