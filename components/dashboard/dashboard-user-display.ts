import type { AuthUser } from "@/lib/auth";

export function getUserInitials(user: AuthUser) {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  return user.username.slice(0, 2).toUpperCase();
}

export function getUserDisplayName(user: AuthUser) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.username;
}
