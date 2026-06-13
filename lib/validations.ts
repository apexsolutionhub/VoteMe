import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import { normalizeVideoUrl } from "@/lib/video-url";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const loginValidation = z.object({
  username: z.string().trim().min(2, "Please enter a valid username"),
  password: z.string().trim().min(8, "Please enter a valid password"),
});

export const signupValidation = z.object({
  organization_name: z.string().min(2, "Organization name is required"),
  slug: z
    .union([
      z.literal(""),
      z
        .string()
        .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only"),
    ])
    .optional(),
  logo_url: z.string().url("Upload a valid organization logo"),
  secret_code: z.string().min(1, "Secret code is required"),
  username: z.string().min(2, "Username is required"),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const changePasswordValidation = z
  .object({
    old_password: z.string().min(8, "Please enter your current password"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const profileUpdateValidation = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Enter a valid phone number",
    }),
});

export const adminProfileUpdateValidation = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  phone_number: z.string().optional(),
});

export const createCandidateValidation = z.object({
  username: z.string().min(2, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Enter a valid phone number",
    }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
});

export const candidateProfileValidation = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Enter a valid phone number",
    }),
  sex: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Please select sex",
  }),
  social_channel_url: z.string().url("Enter a valid channel URL"),
  follower_count: z.coerce.number().int().min(0, "Must be 0 or more"),
  profile_image_url: z.string().url("Profile image is required"),
});

export const competitionVideoValidation = z.object({
  url: z
    .string()
    .min(1, "Video URL is required")
    .transform((value) => normalizeVideoUrl(value))
    .pipe(z.string().url("Enter a valid video URL")),
});

export const competitionSettingsValidation = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  social_platform: z.literal("tiktok"),
  registration_criteria: z.string().min(10, "Describe registration requirements"),
  scoring_criteria: z.string().min(10, "Describe scoring rules"),
  final_award: z.string().min(3, "Describe the final award"),
  live_tracking_enabled: z.boolean(),
  tracking_interval_minutes: z.coerce.number().int().min(1).max(60),
  weight_views: z.coerce.number().min(0),
  weight_likes: z.coerce.number().min(0),
  weight_comments: z.coerce.number().min(0),
  weight_shares: z.coerce.number().min(0),
  weight_brand_mentions: z.coerce.number().min(0),
  comment_filter_enabled: z.boolean(),
  comment_match_terms: z.string().optional(),
});
