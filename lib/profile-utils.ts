export const sexLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export type ProfileFieldValues = {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number: string;
  sex: string;
  social_channel_url: string;
  follower_count: number;
  profile_image_url: string;
};

export function getDisplayName(
  values: Pick<ProfileFieldValues, "first_name" | "last_name">,
  username: string,
) {
  const name = [values.first_name, values.last_name].filter(Boolean).join(" ");
  return name || username;
}

export function getInitials(
  values: Pick<ProfileFieldValues, "first_name" | "last_name">,
  username: string,
) {
  const fromName = [values.first_name, values.last_name]
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  if (fromName) return fromName.slice(0, 2);
  return username.charAt(0).toUpperCase() || "?";
}

export function formatFollowers(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

const completionChecks: Array<{
  key: keyof ProfileFieldValues;
  label: string;
}> = [
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "phone_number", label: "Phone number" },
  { key: "sex", label: "Sex" },
  { key: "social_channel_url", label: "Channel link" },
  { key: "profile_image_url", label: "Profile photo" },
];

export function getProfileCompletion(values: ProfileFieldValues) {
  const items = completionChecks.map((item) => ({
    ...item,
    done: Boolean(values[item.key]),
  }));
  const doneCount = items.filter((item) => item.done).length;
  const percent = Math.round((doneCount / items.length) * 100);
  return { items, doneCount, total: items.length, percent };
}
