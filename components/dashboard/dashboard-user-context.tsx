"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { AuthUser } from "@/lib/auth";

type DashboardUserContextValue = {
  user: AuthUser;
  setUser: Dispatch<SetStateAction<AuthUser>>;
};

const DashboardUserContext = createContext<DashboardUserContextValue | null>(
  null,
);

export function DashboardUserProvider({
  user: initialUser,
  children,
}: {
  user: AuthUser;
  children: ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <DashboardUserContext.Provider value={value}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  const context = useContext(DashboardUserContext);
  if (!context) {
    throw new Error("useDashboardUser must be used within DashboardUserProvider");
  }
  return context.user;
}

export function useUpdateDashboardUser() {
  const context = useContext(DashboardUserContext);
  if (!context) {
    throw new Error(
      "useUpdateDashboardUser must be used within DashboardUserProvider",
    );
  }
  return context.setUser;
}
