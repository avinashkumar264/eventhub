"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/lib/validation/service";
import type { ProviderActionState } from "@/lib/actions/provider";

export function ServiceForm({
  action,
}: {
  action: (
    prevState: ProviderActionState,
    formData: FormData
  ) => Promise<ProviderActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  const inputClass =
    "mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none";

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={SERVICE_CATEGORIES[0]}
            className={inputClass}
          >
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Service title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Full-day wedding photography"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description (optional)
          </label>
          <input
            id="description"
            name="description"
            type="text"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="basePrice" className="text-sm font-medium">
            Starting price
          </label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-sm text-sage">Service added.</p>}

      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Adding…" : "Add service"}
      </Button>
    </form>
  );
}
