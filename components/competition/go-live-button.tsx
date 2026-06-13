"use client";

import { useState } from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type GoLiveButtonProps = {
  disabled?: boolean;
  onConfirm: (startDate: Date) => void | Promise<void>;
};

export function GoLiveButton({ disabled, onConfirm }: GoLiveButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfDay(new Date()),
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm(selectedDate);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setSelectedDate(startOfDay(new Date()));
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500"
        >
          <Radio className="size-4" />
          Go live
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <PopoverHeader className="space-y-1 border-b border-border/60 px-4 py-3">
          <PopoverTitle className="text-base">Choose start date</PopoverTitle>
          <PopoverDescription>
            Set when the competition actually started. Pick a past date if you
            are onboarding after the competition is already running — only videos
            published on or after this day count toward scoring.
          </PopoverDescription>
        </PopoverHeader>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(startOfDay(date))}
          defaultMonth={selectedDate}
        />
        <div className="flex flex-col gap-2 border-t border-border/60 p-3">
          <p className="text-center text-xs text-muted-foreground">
            Starts{" "}
            <span className="font-medium text-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </p>
          <Button
            type="button"
            size="sm"
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500"
            disabled={submitting}
            onClick={() => void handleConfirm()}
          >
            <CalendarIcon className={cn("size-4", submitting && "opacity-70")} />
            {submitting ? "Starting…" : "Confirm & go live"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
