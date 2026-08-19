import { prisma } from "@/lib/prisma";
import { BookingStatusBadge } from "@/components/customer/booking-status-badge";
import type { SessionPayload } from "@/lib/auth/session";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function ProviderBookingsList({
  session,
}: {
  session: SessionPayload;
}) {
  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
    select: { id: true },
  });

  if (!provider) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-medium">Bookings</h1>
        <p className="mt-8 text-sm text-ink/60">
          Complete your profile first to start receiving bookings.
        </p>
      </main>
    );
  }

  // Explicit select — no customer.phone/email anywhere. Contact stays
  // hidden regardless of booking/payment status until a future dedicated
  // contact-unlock workflow.
  const bookings = await prisma.booking.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      advanceAmount: true,
      createdAt: true,
      event: { select: { title: true, eventType: true } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Bookings</h1>
      <p className="mt-1 text-sm text-ink/60">
        {bookings.length} booking{bookings.length === 1 ? "" : "s"}
      </p>

      {bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
          <p className="text-sm text-ink/60">
            No bookings yet. These appear once a customer accepts one of
            your quotations and creates a booking.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-xl border border-ink/10 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-medium">
                    {booking.event.title}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {booking.event.eventType} &middot; {formatDate(booking.createdAt)}
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
