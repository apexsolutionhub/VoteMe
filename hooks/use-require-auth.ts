"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchMe } from "@/lib/auth-api";
import {
  clearAuth,
  getAccessToken,
  updateStoredUser,
  type AuthUser,
} from "@/lib/auth";

type UseRequireAuthOptions = {
  /** When true (default), sends users who must change password to /change-password */
  requirePasswordChanged?: boolean;
};

async function loadCurrentUser(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const user = await fetchMe();
    updateStoredUser(user);
    return user;
  } catch {
    clearAuth();
    return null;
  }
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { requirePasswordChanged = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const currentUser = await loadCurrentUser();

      if (!active) return;

      if (!currentUser) {
        router.replace("/");
        return;
      }

      if (requirePasswordChanged && currentUser.must_change_password) {
        router.replace("/change-password");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router, requirePasswordChanged]);

  return { user, loading };
}
