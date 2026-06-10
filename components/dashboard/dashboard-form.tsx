import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Full-width dashboard form — use when there is no sibling aside panel. */
export function DashboardForm({ className, ...props }: ComponentProps<"form">) {
  return (
    <form className={cn("flex w-full flex-col gap-4", className)} {...props} />
  );
}

type DashboardFormRowProps = {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
};

const columnClasses: Record<NonNullable<DashboardFormRowProps["columns"]>, string> =
  {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

/** Responsive grid row inside a dashboard form. */
export function DashboardFormRow({
  children,
  className,
  columns = 2,
}: DashboardFormRowProps) {
  return (
    <div
      className={cn("grid w-full gap-4", columnClasses[columns], className)}
    >
      {children}
    </div>
  );
}
