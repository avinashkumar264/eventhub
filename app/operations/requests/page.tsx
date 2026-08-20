import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function OperationsRequestsPage() {
  await requireRole(["OPERATIONS"]);

  const requests = await prisma.eventRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      category: true,
      status: true,
      createdAt: true,
      customer: { select: { firstName: true, lastName: true, email: true } },
      event: {
        select: {
          title: true,
          eventType: true,
          eventDate: true,
          city: true,
          guestCount: true,
        },
      },
      _count: { select: { leads: true, quotations: true } },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/operations" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">Event requests</h1>
      <p className="mt-1 text-sm text-ink/60">{requests.length} shown (most recent 100)</p>

      {requests.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">No event requests yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Event</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Date / City</th>
                <th className="py-3 pr-4">Leads</th>
                <th className="py-3 pr-4">Quotes</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-ink/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium">
                      {r.customer.firstName} {r.customer.lastName}
                    </p>
                    <p className="text-xs text-ink/45">{r.customer.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p>{r.event.title}</p>
                    <p className="text-xs text-ink/45">{r.event.eventType}</p>
                  </td>
                  <td className="py-3 pr-4">{r.category}</td>
                  <td className="py-3 pr-4">
                    {formatDate(r.event.eventDate)}
                    {r.event.city ? ` · ${r.event.city}` : ""}
                  </td>
                  <td className="py-3 pr-4">{r._count.leads}</td>
                  <td className="py-3 pr-4">{r._count.quotations}</td>
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-wide text-ink/60">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-ink/45">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
