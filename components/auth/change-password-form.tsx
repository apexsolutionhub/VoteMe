"use client";

import { ArrowRight, KeyRound, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { changePassword, getApiErrorMessage } from "@/lib/auth-api";
import { updateStoredUser, type UserRole } from "@/lib/auth";
import { changePasswordValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

type ChangePasswordFormProps = {
  role: UserRole;
  /** True on first login when a password change is mandatory */
  required?: boolean;
  onSuccess?: (user: import("@/lib/auth").AuthUser) => void;
  className?: string;
};

const accentStyles = {
  violet: {
    iconBg: "from-violet-500/20 to-indigo-500/20 ring-violet-500/30",
    icon: "text-violet-400",
    inputFocus:
      "focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20",
    button:
      "from-violet-600 to-indigo-600 shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500",
  },
  amber: {
    iconBg: "from-amber-500/20 to-orange-500/20 ring-amber-500/30",
    icon: "text-amber-400",
    inputFocus:
      "focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20",
    button:
      "from-amber-600 to-orange-600 shadow-amber-500/25 hover:from-amber-500 hover:to-orange-500",
  },
};

export function ChangePasswordForm({
  role,
  required = false,
  onSuccess,
  className,
}: ChangePasswordFormProps) {
  const router = useRouter();
  const accent = role === "admin" ? "amber" : "violet";
  const styles = accentStyles[accent];

  const form = useForm<z.infer<typeof changePasswordValidation>>({
    resolver: zodResolver(changePasswordValidation),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const inputClassName = cn(
    "h-10 w-full border-white/10 bg-white/3 transition-colors",
    styles.inputFocus,
  );

  async function onSubmit(values: z.infer<typeof changePasswordValidation>) {
    try {
      const user = await changePassword(
        values.old_password,
        values.new_password,
        values.confirm_password,
      );
      updateStoredUser(user);
      onSuccess?.(user);
      toast.success("Password updated successfully");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden border-white/8 bg-card/60 py-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/10",
        className,
      )}
    >
      <CardHeader className="space-y-3 px-8 pb-2 text-center">
        <div
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ring-1",
            styles.iconBg,
          )}
        >
          <KeyRound className={cn("size-7", styles.icon)} strokeWidth={1.5} />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Change your password
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {required
            ? "You must set a new password before continuing."
            : "Update your password whenever you need to."}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <CustomFormField
            name="old_password"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Current password"
            placeholder="Enter current password"
            type="password"
            className={inputClassName}
            icon={<Lock className="size-4 text-muted-foreground" />}
          />
          <CustomFormField
            name="new_password"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="New password"
            placeholder="Enter new password"
            type="password"
            className={inputClassName}
            icon={<Lock className="size-4 text-muted-foreground" />}
          />
          <CustomFormField
            name="confirm_password"
            control={form.control}
            fieldType={formFieldTypes.INPUT}
            label="Confirm password"
            placeholder="Confirm new password"
            type="password"
            className={inputClassName}
            icon={<Lock className="size-4 text-muted-foreground" />}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "group mt-2 h-11 w-full rounded-xl bg-linear-to-r text-sm font-medium text-white shadow-lg",
              styles.button,
            )}
          >
            {isSubmitting ? "Updating…" : "Update password"}
            {!isSubmitting ? (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            ) : null}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
