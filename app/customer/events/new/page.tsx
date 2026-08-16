import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { createEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/customer/event-form";

export default async function NewEventPage() {
  await requireRole(["CUSTOMER"]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/customer/events"
        className="text-sm text-ink/50 hover:text-ink"
      >
        &larr; Back to events
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">
        Create an event
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Tell us the basics — you can add more detail later.
      </p>

      <div className="mt-8">
        <EventForm action={createEvent} submitLabel="Create event" />
      </div>
    </main>
  );
}
