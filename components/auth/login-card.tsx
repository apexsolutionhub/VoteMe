"use client";

import { ArrowRight, Lock, User } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginIconName, loginIcons } from "@/components/auth/auth-icons";
import { loginValidation } from "@/lib/validations";
import { cn } from "@/lib/utils";

type LoginCardProps = {
  title: string;
  description: string;
  footer: string;
  footerHighlight: string;
  icon: LoginIconName;
  accent?: "violet" | "amber";
  onSubmit?: (
    values: z.infer<typeof loginValidation>,
  ) => void | Promise<void>;
};

const accentStyles = {
  violet: {
    shadow: "shadow-violet-500/5",
    line: "via-violet-500/60",
    iconBg: "from-violet-500/20 to-indigo-500/20 ring-violet-500/30",
    icon: "text-violet-400",
    inputFocus: "focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20",
    button: "from-violet-600 to-indigo-600 shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500",
    highlight: "text-violet-400/80",
  },
  amber: {
    shadow: "shadow-amber-500/5",
    line: "via-amber-500/60",
    iconBg: "from-amber-500/20 to-orange-500/20 ring-amber-500/30",
    icon: "text-amber-400",
    inputFocus: "focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20",
    button: "from-amber-600 to-orange-600 shadow-amber-500/25 hover:from-amber-500 hover:to-orange-500",
    highlight: "text-amber-400/80",
  },
};

export function LoginCard({
  title,
  description,
  footer,
  footerHighlight,
  icon,
  accent = "violet",
  onSubmit,
}: LoginCardProps) {
  const styles = accentStyles[accent];
  const Icon = loginIcons[icon];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof z.infer<typeof loginValidation>, string>>
  >({});

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const form = event.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const parsed = loginValidation.safeParse({ username, password });
    if (!parsed.success) {
      const errors: Partial<
        Record<keyof z.infer<typeof loginValidation>, string>
      > = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof z.infer<typeof loginValidation>;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      const first = parsed.error.issues[0]?.message;
      if (first) toast.error(first);
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName = cn(
    "h-10 w-full border-white/10 bg-white/3 transition-colors",
    styles.inputFocus,
  );

  return (
    <Card
      className={cn(
        "relative w-full max-w-md overflow-hidden border-white/8 bg-card/60 py-8 backdrop-blur-xl",
        "shadow-2xl ring-1 ring-white/10",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-b before:from-white/5 before:to-transparent",
        styles.shadow,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent",
          styles.line,
        )}
      />

      <CardHeader className="space-y-3 px-8 pb-2 text-center">
        <div
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ring-1",
            styles.iconBg,
          )}
        >
          <Icon className={cn("size-7", styles.icon)} strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8">
        <form
          autoComplete="on"
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  aria-invalid={Boolean(fieldErrors.username)}
                  className={cn("pl-9", inputClassName)}
                />
              </div>
              {fieldErrors.username ? (
                <p className="text-xs text-destructive">{fieldErrors.username}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={cn("pl-9", inputClassName)}
                />
              </div>
              {fieldErrors.password ? (
                <p className="text-xs text-destructive">{fieldErrors.password}</p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "group mt-1 h-11 w-full cursor-pointer rounded-xl bg-linear-to-r text-sm font-medium text-white shadow-lg transition-all duration-300 disabled:opacity-70",
              styles.button,
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {footer}{" "}
          <span className={styles.highlight}>{footerHighlight}</span>
        </p>
      </CardContent>
    </Card>
  );
}
