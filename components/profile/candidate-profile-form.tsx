"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Save, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import {
  DashboardForm,
  DashboardFormRow,
} from "@/components/dashboard/dashboard-form";
import { GlassCard } from "@/components/dashboard/glass-card";
import { useDashboardUser } from "@/components/dashboard/dashboard-user-context";
import { CandidateProfileHeader } from "@/components/profile/candidate-profile-header";
import { CandidateProfilePreview } from "@/components/profile/candidate-profile-preview";
import { ProfilePhotoUploader } from "@/components/profile/profile-photo-uploader";
import { SexField } from "@/components/profile/sex-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  fetchCandidateProfile,
  updateCandidateProfile,
} from "@/lib/competition-api";
import { candidateProfileValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

type ProfileFormValues = z.infer<typeof candidateProfileValidation>;

function ProfileSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5 sm:p-6">
      <header className="mb-5 space-y-1 border-b border-white/6 pb-4">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function ProfileFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
        <Skeleton className="h-[560px] rounded-3xl" />
        <Skeleton className="h-[500px] rounded-3xl" />
      </div>
    </div>
  );
}

export function CandidateProfileForm() {
  const dashboardUser = useDashboardUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(dashboardUser.username);
  const [isComplete, setIsComplete] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const loadedRef = useRef(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(candidateProfileValidation) as Resolver<ProfileFormValues>,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      sex: "prefer_not_to_say",
      social_channel_url: "",
      follower_count: 0,
      profile_image_url: "",
    },
  });

  const watched = form.watch();
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    async function load() {
      try {
        const profile = await fetchCandidateProfile();
        setUsername(profile.username || dashboardUser.username);
        setIsComplete(profile.is_profile_complete);
        setHasExistingProfile(
          Boolean(
            profile.first_name ||
              profile.profile_image_url ||
              profile.social_channel_url,
          ),
        );
        form.reset({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          sex: (profile.sex as ProfileFormValues["sex"]) || "prefer_not_to_say",
          social_channel_url: profile.social_channel_url || "",
          follower_count: profile.follower_count || 0,
          profile_image_url: profile.profile_image_url || "",
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [dashboardUser.username, form]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      const updated = await updateCandidateProfile(values);
      setIsComplete(updated.is_profile_complete);
      setHasExistingProfile(true);
      form.reset(values);
      toast.success(
        hasExistingProfile ? "Profile updated" : "Profile created successfully",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const inputClass =
    "h-10 w-full rounded-lg border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)]";
  const phoneClass =
    "h-10 w-full rounded-lg border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)] [&_input]:h-10 [&_input]:border-0 [&_input]:bg-transparent [&_button]:h-10 [&_button]:border-white/10 [&_button]:bg-white/[0.04]";
  const submitLabel = form.formState.isSubmitting
    ? "Saving…"
    : hasExistingProfile
      ? "Save changes"
      : "Create profile";
  const SubmitIcon = hasExistingProfile ? Save : UserPlus;

  if (loading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <CandidateProfileHeader
        username={username}
        values={watched}
        isComplete={isComplete}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <GlassCard
          accent="violet"
          title={hasExistingProfile ? "Edit profile" : "Create profile"}
          description={
            hasExistingProfile
              ? "Keep your details up to date for the competition."
              : "Tell us about yourself to appear on the leaderboard."
          }
          icon={<User className="size-5 text-violet-400" strokeWidth={1.75} />}
          contentClassName="pb-0"
        >
          <DashboardForm onSubmit={form.handleSubmit(onSubmit)} className="gap-5">
            <ProfileSection
              title="Identity"
              description="Your photo and name appear on the leaderboard."
            >
              <div className="grid gap-6 md:grid-cols-[9.5rem_minmax(0,1fr)] md:items-start">
                <div className="flex justify-center md:justify-start">
                  <div className="w-full max-w-38 rounded-xl border border-white/8 bg-white/3 px-4 py-5">
                    <ProfilePhotoUploader
                      control={form.control}
                      name="profile_image_url"
                    />
                  </div>
                </div>

                <div className="min-w-0 space-y-4">
                  <DashboardFormRow>
                    <CustomFormField
                      name="first_name"
                      control={form.control}
                      fieldType={formFieldTypes.INPUT}
                      label="First name"
                      className={inputClass}
                    />
                    <CustomFormField
                      name="last_name"
                      control={form.control}
                      fieldType={formFieldTypes.INPUT}
                      label="Last name"
                      className={inputClass}
                    />
                  </DashboardFormRow>
                  <SexField control={form.control} name="sex" compact />
                </div>
              </div>
            </ProfileSection>

            <ProfileSection
              title="Contact"
              description="How organizers can reach you if needed."
            >
              <DashboardFormRow>
                <CustomFormField
                  name="email"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  label="Email"
                  placeholder="email@example.com"
                  className={inputClass}
                />
                <CustomFormField
                  name="phone_number"
                  control={form.control}
                  fieldType={formFieldTypes.PHONE_INPUT}
                  label="Phone number"
                  className={phoneClass}
                />
              </DashboardFormRow>
            </ProfileSection>

            <ProfileSection
              title="Social presence"
              description="Your competition channel and audience size."
            >
              <DashboardFormRow>
                <CustomFormField
                  name="social_channel_url"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  label="Channel link"
                  placeholder="https://www.tiktok.com/@yourhandle"
                  icon={<Link2 className="size-4 text-violet-300/70" />}
                  className={inputClass}
                />
                <CustomFormField
                  name="follower_count"
                  control={form.control}
                  fieldType={formFieldTypes.INPUT}
                  label="Followers"
                  type="number"
                  className={inputClass}
                />
              </DashboardFormRow>
            </ProfileSection>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {isDirty ? (
                  <span className="text-amber-200/90">
                    You have unsaved changes
                  </span>
                ) : (
                  "All changes are saved to your account"
                )}
              </p>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={cn(
                  "h-10 w-full gap-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white sm:w-auto sm:min-w-40 sm:px-8",
                  "shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500",
                )}
              >
                <SubmitIcon className="size-4" />
                {submitLabel}
              </Button>
            </div>
          </DashboardForm>
        </GlassCard>

        <CandidateProfilePreview
          username={username}
          values={watched}
          isComplete={isComplete}
        />
      </div>
    </div>
  );
}
