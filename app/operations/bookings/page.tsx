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

export default async function OperationsBookingsPage() {
  await requireRole(["OPERATIONS"]);

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      status: true,
      totalAmount: true,
      advanceAmount: true,
      createdAt: true,
      customer: { select: { firstName: true, lastName: true, email: true } },
      provider: { select: { businessName: true, type: true } },
      event: { select: { title: true, eventType: true } },
      payments: { select: { status: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/operations" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">Bookings</h1>
      <p className="mt-1 text-sm text-ink/60">{bookings.length} shown (most recent 100)</p>

      {bookings.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">No bookings yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Provider</th>
                <th className="py-3 pr-4">Event</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Advance</th>
                <th className="py-3 pr-4">Payment</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-ink/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium">
                      {b.customer.firstName} {b.customer.lastName}
                    </p>
                    <p className="text-xs text-ink/45">{b.customer.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p>{b.provider.businessName}</p>
                    <p className="text-xs text-ink/45">
                      {b.provider.type === "EVENT_COMPANY" ? "Vendor" : "Freelancer"}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{b.event.title}</td>
                  <td className="py-3 pr-4">${Number(b.totalAmount).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    {b.advanceAmount ? `$${Number(b.advanceAmount).toLocaleString()}` : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-wide text-ink/60">
                      {b.payments[0]?.status ?? "None"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-wide text-ink/60">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-ink/45">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
