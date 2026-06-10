"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import type z from "zod";

import {
  DashboardForm,
  DashboardFormRow,
} from "@/components/dashboard/dashboard-form";
import { GlassCard } from "@/components/dashboard/glass-card";
import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/auth-api";
import { createOrgCandidate } from "@/lib/competition-api";
import { createCandidateValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

type GrantCredentialsFormProps = {
  onCreated: () => Promise<void>;
};

export function GrantCredentialsForm({ onCreated }: GrantCredentialsFormProps) {
  const form = useForm<z.infer<typeof createCandidateValidation>>({
    resolver: zodResolver(createCandidateValidation),
    defaultValues: {
      username: "",
      password: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createCandidateValidation>) {
    try {
      await createOrgCandidate({
        username: values.username,
        password: values.password,
        phone_number: values.phone_number,
        first_name: values.first_name || undefined,
        last_name: values.last_name || undefined,
        email: values.email || undefined,
      });
      toast.success(`Credentials granted to ${values.username}`);
      form.reset();
      await onCreated();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <GlassCard
      accent="amber"
      title="Grant credentials"
      description="Create login access for a new candidate. They must change their password on first sign-in."
      icon={<UserPlus className="size-5 text-amber-400" strokeWidth={1.75} />}
    >
      <DashboardForm onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormRow>
          <CustomFormField
            name="username"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Username"
            placeholder="candidate_username"
            className="h-10 w-full border-white/10 bg-white/3"
          />
          <CustomFormField
            name="password"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Temporary password"
            placeholder="Min. 8 characters"
            type="password"
            className="h-10 w-full border-white/10 bg-white/3"
          />
        </DashboardFormRow>

        <DashboardFormRow>
          <CustomFormField
            name="phone_number"
            control={form.control}
            fieldType={formFieldTypes.PHONE_INPUT}
            label="Phone number"
            placeholder="Enter phone number"
            className="w-full"
          />
          <CustomFormField
            name="email"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Email"
            placeholder="Optional"
            className="h-10 w-full border-white/10 bg-white/3"
          />
        </DashboardFormRow>

        <DashboardFormRow>
          <CustomFormField
            name="first_name"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="First name"
            placeholder="Optional"
            className="h-10 w-full border-white/10 bg-white/3"
          />
          <CustomFormField
            name="last_name"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Last name"
            placeholder="Optional"
            className="h-10 w-full border-white/10 bg-white/3"
          />
        </DashboardFormRow>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn(
            "mt-1 h-10 w-full bg-linear-to-r from-amber-600 to-orange-600 text-white sm:w-auto sm:px-8",
            "shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-orange-500",
          )}
        >
          {form.formState.isSubmitting ? "Creating…" : "Grant credentials"}
        </Button>
      </DashboardForm>
    </GlassCard>
  );
}
