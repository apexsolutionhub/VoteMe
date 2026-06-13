"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Check,
  CircleHelp,
  Sparkles,
  User,
  UserRound,
} from "lucide-react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const sexOptions = [
  { label: "Male", value: "male", icon: User },
  { label: "Female", value: "female", icon: UserRound },
  { label: "Other", value: "other", icon: Sparkles },
  {
    label: "Prefer not to say",
    shortLabel: "Not specified",
    value: "prefer_not_to_say",
    icon: CircleHelp,
  },
] as const;

type SexFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  compact?: boolean;
};

export function SexField<T extends FieldValues>({
  control,
  name,
  compact = false,
}: SexFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="w-full" data-invalid={fieldState.error ? true : undefined}>
          <FieldLabel>Sex</FieldLabel>
          <FieldContent>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
              className={cn(
                "grid grid-cols-2",
                compact ? "gap-2" : "gap-2.5 sm:grid-cols-2",
              )}
            >
              {sexOptions.map((option) => {
                const selected = field.value === option.value;
                const itemId = `${String(name)}-${option.value}`;
                const Icon = option.icon;

                return (
                  <div key={option.value} className="relative min-w-0">
                    <RadioGroupItem
                      value={option.value}
                      id={itemId}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={itemId}
                      className={cn(
                        "flex cursor-pointer items-center rounded-lg border transition-all duration-150",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400/50 peer-focus-visible:outline-none",
                        compact
                          ? "h-9 gap-2 px-2"
                          : "h-12 gap-3 rounded-xl px-3.5",
                        selected
                          ? "border-violet-400/50 bg-violet-500/15 shadow-[inset_0_1px_0_0_oklch(1_0_0/8%)]"
                          : "border-white/10 bg-white/3 hover:border-white/16 hover:bg-white/5",
                        field.disabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex shrink-0 items-center justify-center rounded-md border transition-colors",
                          compact ? "size-6" : "size-8 rounded-lg",
                          selected
                            ? "border-violet-400/30 bg-violet-500/25 text-violet-100"
                            : "border-white/8 bg-white/4 text-violet-300/60",
                        )}
                      >
                        <Icon
                          className={compact ? "size-3.5" : "size-4"}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-left font-medium leading-tight",
                          compact ? "text-xs" : "text-sm",
                        )}
                      >
                        {compact && "shortLabel" in option
                          ? option.shortLabel
                          : option.label}
                      </span>
                      <span
                        className={cn(
                          "flex shrink-0 items-center justify-center rounded-full border transition-all",
                          compact ? "size-4" : "size-5",
                          selected
                            ? "border-violet-300/50 bg-violet-400 text-violet-950"
                            : "border-white/15 bg-transparent",
                        )}
                      >
                        {selected ? (
                          <Check
                            className={compact ? "size-2.5" : "size-3"}
                            strokeWidth={3}
                          />
                        ) : null}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            <FieldError
              errors={fieldState.error ? [fieldState.error] : undefined}
            />
          </FieldContent>
        </Field>
      )}
    />
  );
}
