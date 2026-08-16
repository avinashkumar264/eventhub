"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { EVENT_REQUEST_CATEGORIES } from "@/lib/validation/event-request";
import type { EventRequestActionState } from "@/lib/actions/event-requests";

export function EventRequestForm({
  action,
}: {
  action: (
    prevState: EventRequestActionState,
    formData: FormData
  ) => Promise<EventRequestActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Service category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={EVENT_REQUEST_CATEGORIES[0]}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          >
            {EVENT_REQUEST_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description (optional)
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Need wedding photography and cinematic video"
            className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-sage">Request added.</p>
      )}

      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Adding…" : "Add request"}
      </Button>
    </form>
  );
}
