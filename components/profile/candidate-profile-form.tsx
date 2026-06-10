"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import {
  DashboardForm,
  DashboardFormRow,
} from "@/components/dashboard/dashboard-form";
import { GlassCard } from "@/components/dashboard/glass-card";
import { SexField } from "@/components/profile/sex-field";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  fetchCandidateProfile,
  updateCandidateProfile,
} from "@/lib/competition-api";
import { candidateProfileValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function CandidateProfileForm() {
  const form = useForm<z.infer<typeof candidateProfileValidation>>({
    resolver: zodResolver(candidateProfileValidation) as Resolver<
      z.infer<typeof candidateProfileValidation>
    >,
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

  useEffect(() => {
    async function load() {
      try {
        const profile = await fetchCandidateProfile();
        form.reset({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          sex:
            (profile.sex as z.infer<
              typeof candidateProfileValidation
            >["sex"]) || "prefer_not_to_say",
          social_channel_url: profile.social_channel_url || "",
          follower_count: profile.follower_count || 0,
          profile_image_url: profile.profile_image_url || "",
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    }
    load();
  }, [form]);

  async function onSubmit(values: z.infer<typeof candidateProfileValidation>) {
    try {
      await updateCandidateProfile(values);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const inputClass = "h-10 w-full border-white/10 bg-white/3";

  return (
    <GlassCard
      accent="violet"
      title="Candidate profile"
      description="Complete your profile with contact details, channel link, and profile image."
      icon={<User className="size-5 text-violet-400" strokeWidth={1.75} />}
    >
      <DashboardForm onSubmit={form.handleSubmit(onSubmit)}>
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
            className="w-full"
          />
        </DashboardFormRow>

        <SexField control={form.control} name="sex" />

        <DashboardFormRow>
          <CustomFormField
            name="social_channel_url"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Social media channel link"
            placeholder="https://www.tiktok.com/@yourhandle"
            className={inputClass}
          />
          <CustomFormField
            name="follower_count"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Follower / subscriber count"
            type="number"
            className={inputClass}
          />
        </DashboardFormRow>

        <CustomFormField
          name="profile_image_url"
          control={form.control}
          fieldType={formFieldTypes.IMAGE_UPLOADER}
          label="Profile image"
          className="w-full"
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn(
            "h-10 w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white sm:w-auto sm:px-8",
            "shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500",
          )}
        >
          {form.formState.isSubmitting ? "Saving…" : "Save profile"}
        </Button>
      </DashboardForm>
    </GlassCard>
  );
}
