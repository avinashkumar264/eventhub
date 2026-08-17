"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuotationActionState } from "@/lib/actions/quotations";

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none";

export function QuotationForm({
  action,
}: {
  action: (
    prevState: QuotationActionState,
    formData: FormData
  ) => Promise<QuotationActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [amounts, setAmounts] = useState({
    baseAmount: 0,
    additionalCharges: 0,
    discount: 0,
    tax: 0,
  });

  const previewTotal = Math.max(
    0,
    amounts.baseAmount +
      amounts.additionalCharges -
      amounts.discount +
      amounts.tax
  );

  function handleAmountChange(field: keyof typeof amounts, value: string) {
    setAmounts((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Quotation title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Full-day wedding photography package"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea id="description" name="description" rows={3} className={inputClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="baseAmount" className="text-sm font-medium">
            Base amount
          </label>
          <input
            id="baseAmount"
            name="baseAmount"
            type="number"
            min={0}
            step="0.01"
            required
            onChange={(e) => handleAmountChange("baseAmount", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="additionalCharges" className="text-sm font-medium">
            Additional charges
          </label>
          <input
            id="additionalCharges"
            name="additionalCharges"
            type="number"
            min={0}
            step="0.01"
            onChange={(e) => handleAmountChange("additionalCharges", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="discount" className="text-sm font-medium">
            Discount
          </label>
          <input
            id="discount"
            name="discount"
            type="number"
            min={0}
            step="0.01"
            onChange={(e) => handleAmountChange("discount", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="tax" className="text-sm font-medium">
            Tax
          </label>
          <input
            id="tax"
            name="tax"
            type="number"
            min={0}
            step="0.01"
            onChange={(e) => handleAmountChange("tax", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-lg bg-ink/5 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-ink/45">
          Estimated total
        </p>
        <p className="mt-1 font-display text-2xl">
          ${previewTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="mt-1 text-xs text-ink/45">
          The final amount is recalculated on the server — this is a preview.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="validUntil" className="text-sm font-medium">
            Valid until
          </label>
          <input id="validUntil" name="validUntil" type="date" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="details" className="text-sm font-medium">
          Additional terms / delivery details
        </label>
        <textarea id="details" name="details" rows={3} className={inputClass} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Submitting…" : "Submit quotation"}
      </Button>
    </form>
  );
}
