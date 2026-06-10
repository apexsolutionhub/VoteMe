"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2, Radio, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { DashboardForm } from "@/components/dashboard/dashboard-form";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchCompetition,
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

const platformOptions = [
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
];

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
    },
  });

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCompetition();
        setCompetition(data);
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
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    }
    load();
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
      });
      setCompetition(updated);
      toast.success("Competition settings saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleStatusChange(status: CompetitionStatus) {
    if (!competition) return;
    try {
      const updated = await setCompetitionStatus(competition.id, status);
      setCompetition(updated);
      toast.success(`Competition is now ${status}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const result = await syncCompetition();
      toast.success(`Synced ${result.synced_count} videos`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSyncing(false);
    }
  }

  const inputClass = "h-10 w-full border-white/10 bg-white/3";

  return (
    <div className="space-y-6">
      <GlassCard
        accent="amber"
        title="Competition settings"
        description="Configure registration rules, scoring, awards, and live tracking for your organization."
        icon={<Settings2 className="size-5 text-amber-400" strokeWidth={1.75} />}
      >
        {competition ? (
          <div className="mb-4">
            <Badge
              variant="outline"
              className={cn(
                competition.status === "live"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-300",
              )}
            >
              {competition.status}
            </Badge>
          </div>
        ) : null}
        <DashboardForm onSubmit={form.handleSubmit(onSubmit)}>
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
            placeholder="Brief overview of the competition"
            className="min-h-20 w-full border-white/10 bg-white/3"
          />
          <CustomFormField
            name="social_platform"
            control={form.control}
            fieldType={formFieldTypes.SELECT}
            label="Competition social platform"
            placeholder="Select platform"
            options={platformOptions}
            className={inputClass}
          />
          <CustomFormField
            name="registration_criteria"
            control={form.control}
            fieldType={formFieldTypes.TEXTAREA}
            label="Registration criteria"
            placeholder="Who can join and what they must submit"
            className="min-h-24 w-full border-white/10 bg-white/3"
          />
          <CustomFormField
            name="scoring_criteria"
            control={form.control}
            fieldType={formFieldTypes.TEXTAREA}
            label="Scoring criteria"
            placeholder="How views, likes, comments, and shares are weighted"
            className="min-h-24 w-full border-white/10 bg-white/3"
          />
          <CustomFormField
            name="final_award"
            control={form.control}
            fieldType={formFieldTypes.TEXTAREA}
            label="Final award"
            placeholder="Prize or recognition for winners"
            className="min-h-20 w-full border-white/10 bg-white/3"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CustomFormField
              name="weight_views"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Views weight"
              type="number"
              className={inputClass}
            />
            <CustomFormField
              name="weight_likes"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Likes weight"
              type="number"
              className={inputClass}
            />
            <CustomFormField
              name="weight_comments"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Comments weight"
              type="number"
              className={inputClass}
            />
            <CustomFormField
              name="weight_shares"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Shares weight"
              type="number"
              className={inputClass}
            />
            <CustomFormField
              name="weight_brand_mentions"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Ella Resort mention weight"
              type="number"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomFormField
              name="live_tracking_enabled"
              control={form.control}
              fieldType={formFieldTypes.SWITCH}
              label="Live tracking enabled"
              description="Automatically refresh engagement on leaderboard polls"
            />
            <CustomFormField
              name="tracking_interval_minutes"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Tracking interval (minutes)"
              type="number"
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
            >
              {form.formState.isSubmitting ? "Saving…" : "Save settings"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStatusChange("live")}
              disabled={!competition || competition.status === "live"}
            >
              <Radio className="size-4" />
              Go live
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStatusChange("ended")}
              disabled={!competition || competition.status === "ended"}
            >
              End competition
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw className={cn("size-4", syncing && "animate-spin")} />
              Sync engagement now
            </Button>
          </div>
        </DashboardForm>
      </GlassCard>
    </div>
  );
}
