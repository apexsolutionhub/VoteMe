"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type z from "zod";

import { SignupCard } from "@/components/auth/signup-card";
import { getApiErrorMessage, signup } from "@/lib/auth-api";
import { setAuth } from "@/lib/auth";
import type { signupValidation } from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();

  async function handleSubmit(values: z.infer<typeof signupValidation>) {
    try {
      const data = await signup({
        organization_name: values.organization_name,
        slug: values.slug || undefined,
        logo_url: values.logo_url,
        secret_code: values.secret_code,
        username: values.username,
        email: values.email || undefined,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      setAuth(data);
      toast.success(`Welcome to ${data.user.organization?.name ?? "voteMe"}`);
      router.replace("/dashboard/competition");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 size-[480px] rounded-full bg-amber-600/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-orange-500/10 blur-[130px]"
      />
      <div className="relative z-10 w-full max-w-xl">
        <SignupCard onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
