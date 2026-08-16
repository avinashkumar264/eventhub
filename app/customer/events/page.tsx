import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/customer/status-badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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

export default async function EventsListPage() {
  const session = await requireRole(["CUSTOMER"]);

  const events = await prisma.event.findMany({
    where: { customerId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { eventRequests: true } } },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Your events</h1>
          <p className="mt-1 text-sm text-ink/60">
            {events.length} event{events.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/customer/events/new">Create event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/15 px-8 py-16 text-center">
          <p className="font-display text-lg">No events yet</p>
          <p className="mt-2 text-sm text-ink/60">
            Create your first event to start planning.
          </p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/customer/events/new">Create your first event</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/customer/events/${event.id}`}
                className="block rounded-xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium">
                      {event.title}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      {event.eventType} &middot; {formatDate(event.eventDate)}
                      {event.city ? ` · ${event.city}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-6 text-sm text-ink/60">
                  <span>
                    Guests: {event.guestCount ?? "Not set"}
                  </span>
                  <span>
                    Budget: {formatBudget(event.budgetMin, event.budgetMax)}
                  </span>
                  <span>
                    Requests: {event._count.eventRequests}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
