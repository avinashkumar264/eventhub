import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { updateEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/customer/event-form";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["CUSTOMER"]);
  const { id } = await params;

  const event = await prisma.event.findFirst({
    where: { id, customerId: session.sub },
  });

  if (!event) {
    notFound();
  }

  const boundUpdate = updateEvent.bind(null, event.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href={`/customer/events/${event.id}`}
        className="text-sm text-ink/50 hover:text-ink"
      >
        &larr; Back to event
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">Edit event</h1>

      <div className="mt-8">
        <EventForm
          action={boundUpdate}
          submitLabel="Save changes"
          defaults={{
            title: event.title,
            eventType: event.eventType,
            eventDate: event.eventDate.toISOString().slice(0, 10),
            startTime: event.startTime ?? undefined,
            endTime: event.endTime ?? undefined,
            guestCount: event.guestCount,
            city: event.city ?? undefined,
            venueType: event.venueType ?? undefined,
            budgetMin: event.budgetMin ? Number(event.budgetMin) : null,
            budgetMax: event.budgetMax ? Number(event.budgetMax) : null,
            description: event.description ?? undefined,
            requirements: event.requirements ?? undefined,
          }}
        />
      </div>
    </main>
  );
}
