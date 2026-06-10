"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";

import { CandidatesDataTable } from "@/components/admin/candidates-data-table";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Spinner } from "@/components/ui/spinner";
import { fetchOrgCandidates, type CandidateProfile } from "@/lib/competition-api";
import { getApiErrorMessage } from "@/lib/auth-api";

export function CandidatesRoster() {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadCandidates() {
    setLoadError(null);
    try {
      const data = await fetchOrgCandidates();
      setCandidates(data);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  return (
    <GlassCard
      accent="amber"
      title="Candidate roster"
      description="Search, filter columns, and remove candidate credentials when needed."
      icon={<Users className="size-5 text-amber-400" strokeWidth={1.75} />}
      contentClassName="min-w-0"
    >
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6" />
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <p className="max-w-md text-sm text-muted-foreground">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadCandidates();
            }}
            className="text-sm text-amber-400 underline-offset-2 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <CandidatesDataTable data={candidates} onDeleted={loadCandidates} />
      )}
    </GlassCard>
  );
}
