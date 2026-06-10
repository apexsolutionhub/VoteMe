"use client";

import { ArrowRight, Building2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

import CustomFormField, { formFieldTypes } from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signupValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

type SignupCardProps = {
  onSubmit: (values: z.infer<typeof signupValidation>) => void | Promise<void>;
};

export function SignupCard({ onSubmit }: SignupCardProps) {
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      organization_name: "",
      slug: "",
      logo_url: "",
      secret_code: "",
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const inputClassName =
    "h-10 w-full border-white/10 bg-white/3 transition-colors focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20";

  return (
    <Card className="relative w-full max-w-xl overflow-hidden border-white/8 bg-card/60 py-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
      <CardHeader className="space-y-3 px-8 pb-2 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/30">
          <Building2 className="size-7 text-amber-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Start your competition
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Create your organization workspace and admin account in one step.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <CustomFormField
            name="organization_name"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Organization name"
            placeholder="Brand X Creator Cup"
            className={inputClassName}
          />
          <CustomFormField
            name="logo_url"
            control={form.control}
            fieldType={formFieldTypes.IMAGE_UPLOADER}
            label="Organization logo"
            placeholder="Upload your company logo"
            description="Shown in your organization branding."
          />
          <CustomFormField
            name="slug"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Organization URL (optional)"
            placeholder="brand-x"
            className={inputClassName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <CustomFormField
              name="first_name"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="First name"
              placeholder="Your first name"
              className={inputClassName}
            />
            <CustomFormField
              name="last_name"
              control={form.control}
              fieldType={formFieldTypes.INPUT}
              label="Last name"
              placeholder="Your last name"
              className={inputClassName}
            />
          </div>
          <CustomFormField
            name="username"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Admin username"
            placeholder="admin_username"
            className={inputClassName}
          />
          <CustomFormField
            name="email"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Email (optional)"
            placeholder="you@company.com"
            className={inputClassName}
          />
          <CustomFormField
            name="secret_code"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Secret code"
            placeholder="Enter your invitation code"
            type="password"
            icon={<KeyRound className="size-4 text-muted-foreground" />}
            className={inputClassName}
            description="Required to create a workspace. Contact voteMe if you don't have one."
          />
          <CustomFormField
            name="password"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Password"
            placeholder="Min. 8 characters"
            type="password"
            className={inputClassName}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "group mt-1 h-11 w-full rounded-xl bg-linear-to-r from-amber-600 to-orange-600 text-sm font-medium text-white shadow-lg shadow-amber-500/25 hover:from-amber-500 hover:to-orange-500",
            )}
          >
            {isSubmitting ? "Creating workspace…" : "Create organization"}
            {!isSubmitting ? (
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            ) : null}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have a workspace?{" "}
          <Link href="/Admin" className="text-amber-400/80 hover:text-amber-300">
            Admin sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
