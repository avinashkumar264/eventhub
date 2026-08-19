import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { BookingStatusBadge } from "@/components/customer/booking-status-badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function CustomerBookingsPage() {
  const session = await requireRole(["CUSTOMER"]);

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.sub },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      advanceAmount: true,
      createdAt: true,
      provider: { select: { businessName: true } },
      event: { select: { title: true, eventType: true } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Your bookings</h1>
      <p className="mt-1 text-sm text-ink/60">
        {bookings.length} booking{bookings.length === 1 ? "" : "s"}
      </p>

      {bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
          <p className="text-sm text-ink/60">
            No bookings yet. Accept a quotation to create one.
          </p>
          <Link
            href="/customer/quotations"
            className="mt-4 inline-block text-sm text-plum underline underline-offset-4"
          >
            View quotations
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <Link
                href={`/customer/bookings/${booking.id}`}
                className="block rounded-xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium">
                      {booking.event.title}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      {booking.provider.businessName} &middot;{" "}
                      {booking.event.eventType}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-6 text-sm text-ink/60">
                  <span>Total: ${Number(booking.totalAmount).toLocaleString()}</span>
                  <span>
                    Advance:{" "}
                    {booking.advanceAmount
                      ? `$${Number(booking.advanceAmount).toLocaleString()}`
                      : "Not paid"}
                  </span>
                  <span>{formatDate(booking.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
