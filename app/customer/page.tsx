import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/logout-button";
import { StatusBadge } from "@/components/customer/status-badge";

const ACTIVE_STATUSES = ["DRAFT", "OPEN", "QUOTATIONS_RECEIVED", "BOOKED"] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function CustomerDashboardPage() {
  const session = await requireRole(["CUSTOMER"]);

  const [total, active, completed, recentEvents] = await Promise.all([
    prisma.event.count({ where: { customerId: session.sub } }),
    prisma.event.count({
      where: { customerId: session.sub, status: { in: [...ACTIVE_STATUSES] } },
    }),
    prisma.event.count({
      where: { customerId: session.sub, status: "COMPLETED" },
    }),
    prisma.event.findMany({
      where: { customerId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.25em] text-plum">
            Customer dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            Welcome, {session.firstName}
          </h1>
        </div>
        <Button variant="primary" asChild>
          <Link href="/customer/events/new">Create event</Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            Total events
          </p>
          <p className="mt-2 font-display text-3xl">{total}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            Active events
          </p>
          <p className="mt-2 font-display text-3xl">{active}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            Completed events
          </p>
          <p className="mt-2 font-display text-3xl">{completed}</p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium">Recent events</h2>
          {total > 0 && (
            <Link
              href="/customer/events"
              className="text-sm text-plum underline underline-offset-4"
            >
              View all
            </Link>
          )}
        </div>

        {recentEvents.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
            <p className="font-display text-lg">No events yet</p>
            <p className="mt-2 text-sm text-ink/60">
              Create your first event to get started.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/customer/events/new">Create your first event</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {recentEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/customer/events/${event.id}`}
                  className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-5 py-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-ink/55">
                      {event.eventType} &middot; {formatDate(event.eventDate)}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LogoutButton />
    </main>
  );
}
