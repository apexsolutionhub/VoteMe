"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type z from "zod";

import { LoginCard } from "@/components/auth/login-card";
import type { LoginIconName } from "@/components/auth/auth-icons";
import { getApiErrorMessage, login } from "@/lib/auth-api";
import { setAuth, type UserRole } from "@/lib/auth";
import type { loginValidation } from "@/lib/validations";

type PortalLoginProps = {
  role: UserRole;
  accent?: "violet" | "amber";
  icon: LoginIconName;
  title: string;
  description: string;
  footer: string;
  footerHighlight: string;
};

export function PortalLogin({
  role,
  accent,
  icon,
  title,
  description,
  footer,
  footerHighlight,
}: PortalLoginProps) {
  const router = useRouter();

  async function handleSubmit(values: z.infer<typeof loginValidation>) {
    try {
      const data = await login(values.username, values.password, role);
      setAuth(data);
      toast.success(`Welcome back, ${data.user.username}`);

      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <LoginCard
      accent={accent}
      icon={icon}
      title={title}
      description={description}
      footer={footer}
      footerHighlight={footerHighlight}
      onSubmit={handleSubmit}
    />
  );
}
