"use client";

import { useState } from "react";
import { startOfDay } from "date-fns";
import { Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

type GoLiveButtonProps = {
  disabled?: boolean;
  onConfirm: (startDate: Date) => void | Promise<void>;
};

export function GoLiveButton({ disabled, onConfirm }: GoLiveButtonProps) {
  const [open, setOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() =>
    startOfDay(new Date()),
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSelect(date: Date | undefined) {
    if (!date || submitting) return;

    setSubmitting(true);
    try {
      await onConfirm(startOfDay(date));
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setCalendarMonth(startOfDay(new Date()));
        }
        if (!submitting) {
          setOpen(next);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          disabled={disabled || submitting}
          className="gap-1.5 bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/30"
        >
          {submitting ? (
            <Spinner className="size-4" />
          ) : (
            <Radio className="size-4" />
          )}
          Go live
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-auto p-0">
        <Calendar
          mode="single"
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          onSelect={(date) => void handleSelect(date)}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(new Date().getFullYear() + 1, 11)}
          disabled={submitting}
          classNames={{
            today: "rounded-md bg-accent text-accent-foreground font-semibold",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
