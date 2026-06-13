"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Scale, Trophy } from "lucide-react";
import { toast } from "sonner";

import { CriteriaOverviewHeader } from "@/components/competition/criteria-overview-header";
import { MetricCriterionPanel } from "@/components/competition/metric-criterion-panel";
import { MilestoneCriterionPanel } from "@/components/competition/milestone-criterion-panel";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  createCompetitionCriterion,
  deleteCompetitionCriterion,
  fetchCompetitionCriteria,
  updateCompetitionCriterion,
  type CompetitionCriterion,
} from "@/lib/competition-api";
import {
  buildMetricPayload,
  buildMilestonePayload,
} from "@/lib/criterion-form-utils";

export function CompetitionCriteriaManager() {
  const [criteria, setCriteria] = useState<CompetitionCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMilestone, setSavingMilestone] = useState(false);
  const [savingMetric, setSavingMetric] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(
    null,
  );
  const [editingMetricId, setEditingMetricId] = useState<number | null>(null);

  const loadCriteria = useCallback(async () => {
    try {
      const data = await fetchCompetitionCriteria();
      setCriteria(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCriteria();
  }, [loadCriteria]);

  async function handleSaveMilestone(
    payload: ReturnType<typeof buildMilestonePayload>,
    id: number | null,
  ) {
    setSavingMilestone(true);
    try {
      if (id) {
        await updateCompetitionCriterion(id, payload);
        toast.success("Milestone updated");
      } else {
        await createCompetitionCriterion(payload);
        toast.success("Milestone created");
      }
      await loadCriteria();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSavingMilestone(false);
    }
  }

  async function handleSaveMetric(
    payload: ReturnType<typeof buildMetricPayload>,
    id: number | null,
  ) {
    setSavingMetric(true);
    try {
      if (id) {
        await updateCompetitionCriterion(id, payload);
        toast.success("Scoring metric updated");
      } else {
        await createCompetitionCriterion(payload);
        toast.success("Scoring metric created");
      }
      await loadCriteria();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSavingMetric(false);
    }
  }

  async function handleDelete(criterion: CompetitionCriterion) {
    const label =
      criterion.kind === "milestone" ? "milestone" : "scoring metric";
    if (!window.confirm(`Delete ${label} "${criterion.title}"?`)) return;
    try {
      await deleteCompetitionCriterion(criterion.id);
      toast.success(
        criterion.kind === "milestone"
          ? "Milestone deleted"
          : "Scoring metric deleted",
      );
      if (criterion.kind === "milestone" && editingMilestoneId === criterion.id) {
        setEditingMilestoneId(null);
      }
      if (criterion.kind === "metric" && editingMetricId === criterion.id) {
        setEditingMetricId(null);
      }
      await loadCriteria();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const milestones = useMemo(
    () => criteria.filter((item) => item.kind === "milestone"),
    [criteria],
  );
  const metrics = useMemo(
    () => criteria.filter((item) => item.kind === "metric"),
    [criteria],
  );
  const activeCount = criteria.filter((item) => item.is_active).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-[520px] rounded-3xl" />
        <Skeleton className="h-[520px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CriteriaOverviewHeader
        milestoneCount={milestones.length}
        metricCount={metrics.length}
        activeCount={activeCount}
      />

      <GlassCard
        accent="violet"
        title="Progress milestones"
        description="Fixed targets and relative leaders that drive candidate achievement progress."
        icon={<Trophy className="size-5 text-violet-400" strokeWidth={1.75} />}
        contentClassName="p-4 sm:p-5"
      >
        <MilestoneCriterionPanel
          items={milestones}
          saving={savingMilestone}
          editingId={editingMilestoneId}
          onEdit={setEditingMilestoneId}
          onSave={handleSaveMilestone}
          onDelete={handleDelete}
        />
      </GlassCard>

      <GlassCard
        accent="amber"
        title="Scoring metrics"
        description="Weights that combine views, likes, and comments into the leaderboard score."
        icon={<Scale className="size-5 text-amber-400" strokeWidth={1.75} />}
        contentClassName="p-4 sm:p-5"
      >
        <MetricCriterionPanel
          items={metrics}
          saving={savingMetric}
          editingId={editingMetricId}
          onEdit={setEditingMetricId}
          onSave={handleSaveMetric}
          onDelete={handleDelete}
        />
      </GlassCard>
    </div>
  );
}
