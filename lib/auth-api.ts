import api from "@/lib/api";
import type { AuthResponse, AuthUser, UserRole } from "@/lib/auth";

export async function fetchSignupStatus(): Promise<{ enabled: boolean }> {
  const { data } = await api.get<{ enabled: boolean }>("/auth/signup/status/");
  return data;
}

export async function signup(payload: {
  organization_name: string;
  slug?: string;
  logo_url?: string;
  secret_code: string;
  username: string;
  email?: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signup/", payload);
  return data;
}

export async function login(
  username: string,
  password: string,
  role: UserRole,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login/", {
    username,
    password,
    role,
  });
  return data;
}

export async function refreshAccessToken(
  refresh: string,
): Promise<{ access: string }> {
  const { data } = await api.post<{ access: string }>("/auth/refresh/", {
    refresh,
  });
  return data;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<AuthUser> {
  const { data } = await api.post<{ detail: string; user: AuthUser }>(
    "/auth/change-password/",
    {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
  );
  return data.user;
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me/");
  return data;
}

export async function updateProfile(payload: {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
}): Promise<AuthUser> {
  const { data } = await api.patch<AuthUser>("/auth/me/", payload);
  return data;
}

export type CandidateAccount = AuthUser;

export async function fetchCandidates(): Promise<CandidateAccount[]> {
  const { data } = await api.get<CandidateAccount[]>("/admin/candidates/");
  return data;
}

export async function deleteCandidate(id: number): Promise<void> {
  await api.delete(`/admin/candidates/${id}/`);
}

export async function createCandidate(payload: {
  username: string;
  password: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
}): Promise<CandidateAccount> {
  const { data } = await api.post<CandidateAccount>(
    "/admin/candidates/",
    payload,
  );
  return data;
}

function parseHtmlErrorMessage(html: string): string | null {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch?.[1]) return null;

  const title = titleMatch[1].trim();
  const atIndex = title.indexOf(" at /");
  return atIndex === -1 ? title : title.slice(0, atIndex).trim();
}

export function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    const data = response?.data;

    if (typeof data === "string") {
      if (data.includes("<html") || data.includes("<!DOCTYPE")) {
        return (
          parseHtmlErrorMessage(data) ??
          "Something went wrong. Please try again."
        );
      }
      return data;
    }

    if (data && typeof data === "object") {
      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }

      const messages = Object.values(data).flatMap((value) => {
        if (Array.isArray(value)) return value.map(String);
        if (typeof value === "string") return [value];
        return [];
      });

      if (messages.length > 0) return messages.join(" ");
    }
  }

  return "Something went wrong. Please try again.";
}
