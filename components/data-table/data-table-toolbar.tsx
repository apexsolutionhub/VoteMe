"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search…",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().globalFilter;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 max-w-sm border-white/10 bg-white/3"
        />
        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => table.setGlobalFilter("")}
          >
            Reset
            <X className="size-3.5" />
          </Button>
        ) : null}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
