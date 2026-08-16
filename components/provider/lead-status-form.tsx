"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { MANAGEABLE_LEAD_STATUSES } from "@/lib/validation/lead";
import type { LeadActionState } from "@/lib/actions/leads";

const STATUS_LABEL: Record<(typeof MANAGEABLE_LEAD_STATUSES)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  LOST: "Lost",
};

export function LeadStatusForm({
  action,
  currentStatus,
}: {
  action: (
    prevState: LeadActionState,
    formData: FormData
  ) => Promise<LeadActionState>;
  currentStatus: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="status" className="text-sm font-medium">
          Update status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={
            MANAGEABLE_LEAD_STATUSES.includes(
              currentStatus as (typeof MANAGEABLE_LEAD_STATUSES)[number]
            )
              ? currentStatus
              : MANAGEABLE_LEAD_STATUSES[0]
          }
          className="mt-1 rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
        >
          {MANAGEABLE_LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Updating…" : "Update"}
      </Button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
