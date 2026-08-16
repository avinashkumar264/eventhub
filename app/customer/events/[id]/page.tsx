import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/customer/status-badge";
import { EventRequestForm } from "@/components/customer/event-request-form";
import { createEventRequest } from "@/lib/actions/event-requests";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatBudget(min: unknown, max: unknown) {
  const toNum = (v: unknown) => (v == null ? null : Number(v));
  const lo = toNum(min);
  const hi = toNum(max);
  if (lo === null && hi === null) return "Not set";
  if (lo !== null && hi !== null) return `$${lo.toLocaleString()} – $${hi.toLocaleString()}`;
  return `$${(lo ?? hi)!.toLocaleString()}`;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["CUSTOMER"]);
  const { id } = await params;

  // Ownership enforced in the query itself: a valid id belonging to
  // another customer matches nothing here and falls through to notFound().
  const event = await prisma.event.findFirst({
    where: { id, customerId: session.sub },
  });

  if (!event) {
    notFound();
  }

  const requests = await prisma.eventRequest.findMany({
    where: { eventId: event.id },
    orderBy: { createdAt: "asc" },
  });

  const boundCreateRequest = createEventRequest.bind(null, event.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/customer/events"
        className="text-sm text-ink/50 hover:text-ink"
      >
        &larr; Back to events
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">{event.title}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {event.eventType} &middot; {formatDate(event.eventDate)}
          </p>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Time</dt>
          <dd className="mt-1 text-sm">
            {event.startTime || event.endTime
              ? `${event.startTime ?? "—"} – ${event.endTime ?? "—"}`
              : "Not set"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">City</dt>
          <dd className="mt-1 text-sm">{event.city ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Venue type
          </dt>
          <dd className="mt-1 text-sm">{event.venueType ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Guest count
          </dt>
          <dd className="mt-1 text-sm">{event.guestCount ?? "Not set"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Budget
          </dt>
          <dd className="mt-1 text-sm">
            {formatBudget(event.budgetMin, event.budgetMax)}
          </dd>
        </div>
      </dl>

      {event.description && (
        <div className="mt-8">
          <h2 className="text-xs uppercase tracking-wide text-ink/45">
            Description
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {event.description}
          </p>
        </div>
      )}

      {event.requirements && (
        <div className="mt-6">
          <h2 className="text-xs uppercase tracking-wide text-ink/45">
            Requirements
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {event.requirements}
          </p>
        </div>
      )}

      <div className="mt-10 border-t border-ink/10 pt-8">
        <h2 className="font-display text-lg font-medium">
          Requested services
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Add the categories you need for this event — vendors will be
          matched against these in a future step.
        </p>

        {requests.length > 0 && (
          <ul className="mt-5 space-y-2">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{request.category}</p>
                  {request.description && (
                    <p className="mt-0.5 text-sm text-ink/55">
                      {request.description}
                    </p>
                  )}
                </div>
                <span className="text-xs uppercase tracking-wide text-ink/45">
                  {request.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <EventRequestForm action={boundCreateRequest} />
        </div>
      </div>

      <Button variant="outline" className="mt-10" asChild>
        <Link href={`/customer/events/${event.id}/edit`}>Edit event</Link>
      </Button>
    </main>
  );
}
