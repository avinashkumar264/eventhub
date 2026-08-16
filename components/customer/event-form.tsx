"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { EVENT_TYPES } from "@/lib/validation/event";
import type { EventActionState } from "@/lib/actions/events";

export interface EventFormDefaults {
  title?: string;
  eventType?: string;
  eventDate?: string; // yyyy-mm-dd
  startTime?: string;
  endTime?: string;
  guestCount?: number | null;
  city?: string;
  venueType?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  description?: string;
  requirements?: string;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none";

export function EventForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (
    prevState: EventActionState,
    formData: FormData
  ) => Promise<EventActionState>;
  defaults?: EventFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="space-y-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Event title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaults?.title}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="eventType" className="text-sm font-medium">
            Event type
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue={defaults?.eventType ?? EVENT_TYPES[0]}
            className={inputClass}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="guestCount" className="text-sm font-medium">
            Guest count
          </label>
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            min={1}
            defaultValue={defaults?.guestCount ?? undefined}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="eventDate" className="text-sm font-medium">
            Event date
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            defaultValue={defaults?.eventDate}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="startTime" className="text-sm font-medium">
            Start time
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue={defaults?.startTime}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="text-sm font-medium">
            End time
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue={defaults?.endTime}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={defaults?.city}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="venueType" className="text-sm font-medium">
            Venue type
          </label>
          <input
            id="venueType"
            name="venueType"
            type="text"
            placeholder="e.g. Banquet hall, Outdoor, Home"
            defaultValue={defaults?.venueType}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budgetMin" className="text-sm font-medium">
            Budget — minimum
          </label>
          <input
            id="budgetMin"
            name="budgetMin"
            type="number"
            min={0}
            step="0.01"
            defaultValue={defaults?.budgetMin ?? undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="budgetMax" className="text-sm font-medium">
            Budget — maximum
          </label>
          <input
            id="budgetMax"
            name="budgetMax"
            type="number"
            min={0}
            step="0.01"
            defaultValue={defaults?.budgetMax ?? undefined}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaults?.description}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="requirements" className="text-sm font-medium">
          Requirements
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={3}
          placeholder="Anything vendors should know up front"
          defaultValue={defaults?.requirements}
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
