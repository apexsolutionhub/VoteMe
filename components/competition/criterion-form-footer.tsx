import { Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CriterionFormFooterProps = {
  isDirty: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  createLabel: string;
  updateLabel: string;
  accent: "violet" | "amber";
  onCancel?: () => void;
  showCancel?: boolean;
};

export function CriterionFormFooter({
  isDirty,
  isSubmitting,
  isEditing,
  createLabel,
  updateLabel,
  accent,
  onCancel,
  showCancel,
}: CriterionFormFooterProps) {
  const SubmitIcon = isEditing ? Save : Plus;
  const gradient =
    accent === "violet"
      ? "from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25"
      : "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
        {isDirty ? (
          <>
            <span
              className={cn(
                "size-1.5 animate-pulse rounded-full",
                accent === "violet" ? "bg-violet-400" : "bg-amber-400",
              )}
            />
            <span className={accent === "violet" ? "text-violet-200" : "text-amber-200"}>
              Unsaved changes
            </span>
          </>
        ) : isEditing ? (
          "Editing selected row"
        ) : (
          "Fill in the form to add a new item"
        )}
      </p>
      <div className="flex gap-2">
        {showCancel && onCancel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-9 border-white/12 px-4"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !isDirty}
          className={cn(
            "h-9 gap-1.5 bg-linear-to-r px-5 text-white shadow-md",
            gradient,
          )}
        >
          <SubmitIcon className="size-3.5" />
          {isSubmitting ? "Saving…" : isEditing ? updateLabel : createLabel}
        </Button>
      </div>
    </div>
  );
}
