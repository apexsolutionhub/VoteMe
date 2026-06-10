"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DeleteCandidateButton } from "@/components/admin/delete-candidate-button";
import { Badge } from "@/components/ui/badge";
import type { CandidateProfile } from "@/lib/competition-api";

type CreateCandidatesColumnsOptions = {
  onDeleted: () => void;
};

export function createCandidatesColumns({
  onDeleted,
}: CreateCandidatesColumnsOptions): ColumnDef<CandidateProfile>[] {
  return [
    {
      accessorKey: "username",
      meta: { label: "Username" },
      header: "Username",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("username")}</span>
      ),
    },
    {
      accessorKey: "phone_number",
      meta: { label: "Phone number" },
      header: "Phone number",
      cell: ({ row }) => {
        const phone = row.getValue("phone_number") as string;
        return phone ? (
          <span>{phone}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "first_name",
      meta: { label: "First name" },
      header: "First name",
      cell: ({ row }) => {
        const value = row.getValue("first_name") as string;
        return value || <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "last_name",
      meta: { label: "Last name" },
      header: "Last name",
      cell: ({ row }) => {
        const value = row.getValue("last_name") as string;
        return value || <span className="text-muted-foreground">—</span>;
      },
    },
    {
      id: "videos",
      accessorFn: (row) => row.video_count,
      meta: { label: "Videos" },
      header: "Videos",
      cell: ({ row }) => row.original.video_count,
    },
    {
      id: "status",
      accessorFn: (row) =>
        row.is_profile_complete ? "Profile complete" : "Incomplete",
      meta: { label: "Status" },
      header: "Status",
      cell: ({ row }) =>
        row.original.is_profile_complete ? (
          <Badge variant="secondary">Profile complete</Badge>
        ) : (
          <Badge variant="outline">Incomplete</Badge>
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DeleteCandidateButton
            candidateId={row.original.id}
            username={row.original.username}
            onDeleted={onDeleted}
          />
        </div>
      ),
    },
  ];
}
