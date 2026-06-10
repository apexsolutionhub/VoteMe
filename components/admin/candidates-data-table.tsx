"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table";

import { createCandidatesColumns } from "@/components/admin/candidates-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type { CandidateProfile } from "@/lib/competition-api";

const globalCandidateFilter: FilterFn<CandidateProfile> = (
  row,
  _columnId,
  filterValue,
) => {
  const search = String(filterValue).toLowerCase().trim();
  if (!search) return true;

  const candidate = row.original;
  const status = candidate.is_profile_complete ? "complete" : "incomplete";

  return [
    candidate.username,
    candidate.phone_number,
    candidate.first_name,
    candidate.last_name,
    status,
  ].some((value) => value?.toLowerCase().includes(search));
};

type CandidatesDataTableProps = {
  data: CandidateProfile[];
  onDeleted: () => void;
};

export function CandidatesDataTable({
  data,
  onDeleted,
}: CandidatesDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => createCandidatesColumns({ onDeleted }),
    [onDeleted],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      globalFilter,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalCandidateFilter,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchPlaceholder="Search candidates…"
      />
      <DataTable
        table={table}
        emptyMessage={
          globalFilter
            ? "No candidates match your search."
            : "No candidates yet."
        }
      />
    </div>
  );
}
