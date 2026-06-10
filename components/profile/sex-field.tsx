"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Users } from "lucide-react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

const sexOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
] as const;

type SexFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
};

export function SexField<T extends FieldValues>({
  control,
  name,
}: SexFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="w-full" data-invalid={fieldState.error ? true : undefined}>
          <FieldLabel htmlFor={String(name)}>Sex</FieldLabel>
          <FieldContent>
            <div
              id={String(name)}
              role="radiogroup"
              aria-invalid={fieldState.error ? true : undefined}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {sexOptions.map((option) => {
                const selected = field.value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={field.disabled}
                    onClick={() => field.onChange(option.value)}
                    onBlur={field.onBlur}
                    className={cn(
                      "group relative flex min-h-10 items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm transition-all",
                      selected
                        ? "border-violet-400/35 bg-linear-to-b from-violet-500/20 to-violet-500/5 text-violet-100 shadow-sm shadow-violet-500/15 ring-1 ring-violet-400/20"
                        : "border-white/10 bg-white/3 text-muted-foreground hover:border-white/15 hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    {selected ? (
                      <Users
                        aria-hidden
                        className="absolute top-1.5 right-1.5 size-3 text-violet-300/80"
                        strokeWidth={2}
                      />
                    ) : null}
                    <span className="leading-snug">{option.label}</span>
                  </button>
                );
              })}
            </div>
            <FieldError
              errors={fieldState.error ? [fieldState.error] : undefined}
            />
          </FieldContent>
        </Field>
      )}
    />
  );
}
