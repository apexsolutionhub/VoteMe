"use client";

import { useEffect, useState } from "react";
import { Camera, ImageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

import {
  Field,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

type ProfilePhotoUploaderProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
};

export function ProfilePhotoUploader<T extends FieldValues>({
  control,
  name,
}: ProfilePhotoUploaderProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.error ? true : undefined}
          className="w-full"
        >
          <FieldContent>
            <ProfilePhotoUploadControl
              id={String(name)}
              value={field.value}
              disabled={field.disabled}
              onChange={field.onChange}
            />
            <FieldError
              errors={fieldState.error ? [fieldState.error] : undefined}
            />
          </FieldContent>
        </Field>
      )}
    />
  );
}

function ProfilePhotoUploadControl({
  id,
  value,
  disabled,
  onChange,
}: {
  id: string;
  value: unknown;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState(
    typeof value === "string" ? value : "",
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreviewUrl(typeof value === "string" ? value : "");
  }, [value]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      onChange(uploadedUrl);
      setPreviewUrl(uploadedUrl);
      toast.success("Profile photo uploaded");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed";
      toast.error(message);
      setPreviewUrl(typeof value === "string" ? value : "");
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-3 w-full text-center text-xs font-medium text-muted-foreground">
        Profile photo
      </p>

      <label
        htmlFor={id}
        className={cn(
          "group relative block size-28 cursor-pointer overflow-hidden rounded-full",
          "bg-violet-500/6 shadow-[inset_0_1px_0_0_oklch(1_0_0/6%)]",
          "ring-1 ring-violet-400/20 ring-offset-2 ring-offset-[oklch(0.16_0.02_280)]",
          "transition-all duration-200 hover:ring-violet-400/40",
          "focus-within:ring-2 focus-within:ring-violet-400/50",
          !previewUrl && "border-2 border-dashed border-violet-400/25",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Profile preview"
              fill
              className="object-cover"
              sizes="112px"
            />
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-1 text-white",
                uploading
                  ? "bg-black/60"
                  : "bg-black/50 opacity-0 transition-opacity group-hover:opacity-100",
              )}
            >
              {uploading ? (
                <Spinner className="size-5" />
              ) : (
                <HugeiconsIcon icon={Camera} className="size-4.5" strokeWidth={2} />
              )}
              <span className="text-[10px] font-medium">
                {uploading ? "Uploading…" : "Change"}
              </span>
            </div>
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 px-2 text-center">
            {uploading ? (
              <Spinner className="size-5 text-violet-300" />
            ) : (
              <HugeiconsIcon
                icon={ImageIcon}
                className="size-6 text-violet-300/80"
                strokeWidth={1.75}
              />
            )}
            <span className="text-[10px] font-medium leading-snug text-muted-foreground">
              {uploading ? "Uploading…" : "Upload"}
            </span>
          </div>
        )}
      </label>

      <p className="mt-3 text-center text-[10px] leading-relaxed text-muted-foreground/80">
        Square image
        <br />
        JPG, PNG, or WebP
      </p>

      <Input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleImageUpload}
      />
    </div>
  );
}
