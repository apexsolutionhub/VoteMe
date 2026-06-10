export type UserRole = "admin" | "candidate";

export type OrganizationContext = {
  id: string;
  name: string;
  slug: string;
  org_code: string;
  membership_role: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  must_change_password: boolean;
  organization?: OrganizationContext;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
  organization?: OrganizationContext;
};

const ACCESS_KEY = "voteme_access";
const REFRESH_KEY = "voteme_refresh";
const USER_KEY = "voteme_user";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

function normalizeUser(user: AuthUser): AuthUser {
  return {
    ...user,
    must_change_password: Boolean(user.must_change_password),
  };
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return normalizeUser(JSON.parse(raw) as AuthUser);
  } catch {
    return null;
  }
}

export function setAuth(data: AuthResponse) {
  localStorage.setItem(ACCESS_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(data.user)));
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function updateStoredUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
}
