"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { CriterionModeBadge } from "@/components/competition/competition-form-section";
import {
  CriterionDataRow,
  CriterionEmptyState,
  CriterionRowHeader,
  CriterionTableContainer,
} from "@/components/competition/criterion-data-table";
import { CriterionFormFooter } from "@/components/competition/criterion-form-footer";
import {
  CriterionActiveToggle,
  CriterionField,
  CriterionPillGroup,
} from "@/components/competition/criterion-form-fields";
import {
  CriterionFormShell,
  CriterionTableShell,
  CriterionWorkspaceLayout,
} from "@/components/competition/criterion-workspace-layout";
import { DashboardForm, DashboardFormRow } from "@/components/dashboard/dashboard-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CompetitionCriterion } from "@/lib/competition-api";
import {
  buildMilestonePayload,
  emptyMilestoneForm,
  inputClass,
  isFormDirty,
  milestoneMetricOptions,
  milestoneToForm,
  textareaClass,
  type MilestoneFormState,
} from "@/lib/criterion-form-utils";

type MilestoneCriterionPanelProps = {
  items: CompetitionCriterion[];
  saving: boolean;
  editingId: number | null;
  onEdit: (id: number | null) => void;
  onSave: (payload: ReturnType<typeof buildMilestonePayload>, id: number | null) => Promise<void>;
  onDelete: (criterion: CompetitionCriterion) => void;
};

export function MilestoneCriterionPanel({
  items,
  saving,
  editingId,
  onEdit,
  onSave,
  onDelete,
}: MilestoneCriterionPanelProps) {
  const [form, setForm] = useState<MilestoneFormState>(emptyMilestoneForm());
  const [baseline, setBaseline] = useState<MilestoneFormState>(emptyMilestoneForm());
  const prevEditingIdRef = useRef<number | null>(editingId);
  const criterionSignatureRef = useRef("");

  useEffect(() => {
    const prev = prevEditingIdRef.current;
    prevEditingIdRef.current = editingId;

    if (editingId === null) {
      if (prev !== null) {
        const empty = emptyMilestoneForm();
        setForm(empty);
        setBaseline(empty);
        criterionSignatureRef.current = "";
      }
      return;
    }

    const criterion = items.find((item) => item.id === editingId);
    if (!criterion) return;

    const signature = JSON.stringify(criterion);
    if (prev === editingId && signature === criterionSignatureRef.current) return;

    criterionSignatureRef.current = signature;
    const values = milestoneToForm(criterion);
    setForm(values);
    setBaseline(values);
  }, [editingId, items]);

  const isDirty = isFormDirty(form, baseline);
  const showTarget =
    form.evaluation_mode === "absolute" && form.metric_key !== "profile_complete";
  const selectedMetric = milestoneMetricOptions.find(
    (option) => option.value === form.metric_key,
  );

  function resetCreate() {
    const empty = emptyMilestoneForm();
    setForm(empty);
    setBaseline(empty);
    onEdit(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error("Milestone title is required");
      return;
    }
    await onSave(buildMilestonePayload(form), editingId);
    setBaseline({ ...form });
    if (!editingId) resetCreate();
  }

  const formColumn = (
    <DashboardForm onSubmit={(event) => void handleSubmit(event)} className="gap-0">
      <CriterionFormShell
        accent="violet"
        title={editingId ? "Edit milestone" : "New milestone"}
        badge={
          <CriterionModeBadge mode={editingId ? "edit" : "create"} accent="violet" />
        }
        footer={
          <CriterionFormFooter
            isDirty={isDirty}
            isSubmitting={saving}
            isEditing={editingId !== null}
            createLabel="Add milestone"
            updateLabel="Save"
            accent="violet"
            showCancel={editingId !== null}
            onCancel={resetCreate}
          />
        }
      >
        <CriterionField label="Title">
          <Input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Reach 50 likes"
            className={inputClass}
          />
        </CriterionField>

        <CriterionField label="Description">
          <Textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Shown on candidate achievement cards"
            className={textareaClass}
          />
        </CriterionField>

        <CriterionField label="Metric" hint={selectedMetric?.hint}>
          <Select
            value={form.metric_key}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                metric_key: value as MilestoneFormState["metric_key"],
              }))
            }
          >
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {milestoneMetricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CriterionField>

        <CriterionField label="How to win">
          <CriterionPillGroup
            accent="violet"
            value={form.evaluation_mode}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, evaluation_mode: value }))
            }
            options={[
              {
                value: "absolute",
                label: "Fixed target",
                description: "e.g. reach 50 likes",
              },
              {
                value: "relative",
                label: "Beat the field",
                description: "whoever leads wins",
              },
            ]}
          />
        </CriterionField>

        <DashboardFormRow columns={showTarget ? 2 : 1}>
          {showTarget ? (
            <CriterionField label="Target">
              <Input
                type="number"
                min={0}
                value={form.target_value}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    target_value: event.target.value,
                  }))
                }
                placeholder="50"
                className={inputClass}
              />
            </CriterionField>
          ) : null}
          <CriterionField label="Order">
            <Input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sort_order: event.target.value }))
              }
              className={inputClass}
            />
          </CriterionField>
        </DashboardFormRow>

        {form.metric_key === "profile_complete" ? (
          <p className="rounded-lg border border-violet-500/15 bg-violet-500/8 px-3 py-2 text-[11px] leading-relaxed text-violet-100/90">
            Unlocks when a candidate completes their profile.
          </p>
        ) : null}

        <CriterionActiveToggle
          checked={form.is_active}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, is_active: checked }))
          }
          activeLabel="Visible to candidates"
          inactiveLabel="Hidden from candidates"
        />
      </CriterionFormShell>
    </DashboardForm>
  );

  const tableColumn = (
    <CriterionTableShell count={items.length} empty={items.length === 0}>
      {items.length === 0 ? (
        <CriterionEmptyState
          accent="violet"
          message="Create a milestone in the editor — it will appear here."
        />
      ) : (
        <CriterionTableContainer>
          <CriterionRowHeader
            columns={["Title", "Metric", "Target", "Ord", "Status", ""]}
          />
          <div className="divide-y divide-white/6">
            {items.map((item) => (
              <CriterionDataRow
                key={item.id}
                item={item}
                isSelected={editingId === item.id}
                accent="violet"
                detail={
                  item.evaluation_mode === "relative"
                    ? "Leader"
                    : item.metric_key === "profile_complete"
                      ? "Profile"
                      : item.target_value != null
                        ? item.target_value.toLocaleString()
                        : "—"
                }
                onEdit={() => onEdit(item.id)}
                onDelete={() => onDelete(item)}
              />
            ))}
          </div>
        </CriterionTableContainer>
      )}
    </CriterionTableShell>
  );

  return (
    <CriterionWorkspaceLayout
      accent="violet"
      form={formColumn}
      table={tableColumn}
    />
  );
}
