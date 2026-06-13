"use client";

import { useEffect, useRef, useState } from "react";
import { Percent } from "lucide-react";
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
import type {
  CompetitionCriterion,
  CriterionWeightInputType,
} from "@/lib/competition-api";
import {
  buildMetricPayload,
  emptyMetricForm,
  inputClass,
  isFormDirty,
  metricToForm,
  scoringMetricOptions,
  textareaClass,
  type MetricFormState,
} from "@/lib/criterion-form-utils";
import { cn } from "@/lib/utils";

const wordWeightHints = "low · medium · high · critical";

type MetricCriterionPanelProps = {
  items: CompetitionCriterion[];
  saving: boolean;
  editingId: number | null;
  onEdit: (id: number | null) => void;
  onSave: (payload: ReturnType<typeof buildMetricPayload>, id: number | null) => Promise<void>;
  onDelete: (criterion: CompetitionCriterion) => void;
};

export function MetricCriterionPanel({
  items,
  saving,
  editingId,
  onEdit,
  onSave,
  onDelete,
}: MetricCriterionPanelProps) {
  const [form, setForm] = useState<MetricFormState>(emptyMetricForm());
  const [baseline, setBaseline] = useState<MetricFormState>(emptyMetricForm());
  const prevEditingIdRef = useRef<number | null>(editingId);
  const criterionSignatureRef = useRef("");

  useEffect(() => {
    const prev = prevEditingIdRef.current;
    prevEditingIdRef.current = editingId;

    if (editingId === null) {
      if (prev !== null) {
        const empty = emptyMetricForm();
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
    const values = metricToForm(criterion);
    setForm(values);
    setBaseline(values);
  }, [editingId, items]);

  const isDirty = isFormDirty(form, baseline);
  const selectedMetric = scoringMetricOptions.find(
    (option) => option.value === form.metric_key,
  );

  function resetCreate() {
    const empty = emptyMetricForm();
    setForm(empty);
    setBaseline(empty);
    onEdit(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error("Metric title is required");
      return;
    }
    await onSave(buildMetricPayload(form), editingId);
    setBaseline({ ...form });
    if (!editingId) resetCreate();
  }

  const formColumn = (
    <DashboardForm onSubmit={(event) => void handleSubmit(event)} className="gap-0">
      <CriterionFormShell
        accent="amber"
        title={editingId ? "Edit metric" : "New metric"}
        badge={
          <CriterionModeBadge mode={editingId ? "edit" : "create"} accent="amber" />
        }
        footer={
          <CriterionFormFooter
            isDirty={isDirty}
            isSubmitting={saving}
            isEditing={editingId !== null}
            createLabel="Add metric"
            updateLabel="Save"
            accent="amber"
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
            placeholder="Likes weight"
            className={inputClass}
          />
        </CriterionField>

        <CriterionField label="Description">
          <Textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Optional admin note"
            className={textareaClass}
          />
        </CriterionField>

        <CriterionField label="Metric" hint={selectedMetric?.hint}>
          <Select
            value={form.metric_key}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                metric_key: value as MetricFormState["metric_key"],
              }))
            }
          >
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scoringMetricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CriterionField>

        <CriterionField label="Weight format">
          <CriterionPillGroup
            accent="amber"
            columns={3}
            value={form.weight_input_type}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                weight_input_type: value as CriterionWeightInputType,
              }))
            }
            options={[
              { value: "number", label: "Number", description: "e.g. 3 or 10" },
              { value: "percentage", label: "Percent", description: "e.g. 30%" },
              { value: "word", label: "Word", description: "e.g. high" },
            ]}
          />
        </CriterionField>

        <DashboardFormRow columns={2}>
          {form.weight_input_type === "number" ? (
            <CriterionField label="Weight">
              <Input
                type="number"
                min={0}
                step="0.1"
                value={form.weight_value}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    weight_value: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </CriterionField>
          ) : null}

          {form.weight_input_type === "percentage" ? (
            <CriterionField label="Share of score">
              <div className="relative">
                <Input
                  value={form.weight_display}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      weight_display: event.target.value,
                    }))
                  }
                  placeholder="30"
                  className={cn(inputClass, "pr-9")}
                />
                <Percent className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </CriterionField>
          ) : null}

          {form.weight_input_type === "word" ? (
            <CriterionField label="Weight word" hint={wordWeightHints}>
              <Input
                value={form.weight_display}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    weight_display: event.target.value,
                  }))
                }
                placeholder="high"
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

        <CriterionActiveToggle
          checked={form.is_active}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, is_active: checked }))
          }
          activeLabel="Used in scoring"
          inactiveLabel="Excluded from scoring"
        />
      </CriterionFormShell>
    </DashboardForm>
  );

  const tableColumn = (
    <CriterionTableShell count={items.length} empty={items.length === 0}>
      {items.length === 0 ? (
        <CriterionEmptyState
          accent="amber"
          message="Add a scoring metric in the editor — it will appear here."
        />
      ) : (
        <CriterionTableContainer>
          <CriterionRowHeader
            columns={["Title", "Metric", "Weight", "Ord", "Status", ""]}
          />
          <div className="divide-y divide-white/6">
            {items.map((item) => (
              <CriterionDataRow
                key={item.id}
                item={item}
                isSelected={editingId === item.id}
                accent="amber"
                detail={item.weight_display || String(item.weight_value)}
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
      accent="amber"
      form={formColumn}
      table={tableColumn}
    />
  );
}
