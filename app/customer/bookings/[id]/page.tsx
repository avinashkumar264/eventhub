import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { BookingStatusBadge } from "@/components/customer/booking-status-badge";
import { PaymentCheckout } from "@/components/customer/payment-checkout";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["CUSTOMER"]);
  const { id } = await params;

  // Ownership enforced in the query itself: a booking belonging to
  // another customer matches nothing and falls through to notFound().
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      advanceAmount: true,
      createdAt: true,
      provider: { select: { businessName: true, type: true, city: true } },
      event: { select: { title: true, eventType: true } },
      payments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          status: true,
          amount: true,
          verifiedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!booking) notFound();

  const hasVerifiedAdvance = booking.payments.some(
    (p) => p.type === "ADVANCE" && p.status === "VERIFIED"
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/customer/bookings" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to bookings
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">{booking.event.title}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {booking.provider.businessName} (
            {booking.provider.type === "EVENT_COMPANY" ? "Vendor" : "Freelancer"}) &middot;{" "}
            {booking.event.eventType}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <p className="mt-6 rounded-lg bg-ink/5 px-4 py-3 text-xs text-ink/55">
        Direct contact with your provider unlocks after your advance payment
        is verified. EventHub handles communication until then.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 rounded-xl border border-ink/10 bg-white p-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Total amount</dt>
          <dd className="mt-1 text-sm">${Number(booking.totalAmount).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Advance paid
          </dt>
          <dd className="mt-1 text-sm">
            {booking.advanceAmount
              ? `$${Number(booking.advanceAmount).toLocaleString()}`
              : "Not yet paid"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Booked</dt>
          <dd className="mt-1 text-sm">{formatDate(booking.createdAt)}</dd>
        </div>
      </dl>

      {!hasVerifiedAdvance && booking.status !== "CANCELLED" && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-medium">Pay advance</h2>
          <div className="mt-3">
            <PaymentCheckout
              bookingId={booking.id}
              maxAmount={Number(booking.totalAmount)}
              customerName={session.firstName}
            />
          </div>
        </div>
      )}

      {booking.payments.length > 0 && (
        <div className="mt-10 border-t border-ink/10 pt-6">
          <h2 className="font-display text-lg font-medium">Payment history</h2>
          <ul className="mt-4 space-y-2">
            {booking.payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm"
              >
                <span>
                  {payment.type} &middot; ${Number(payment.amount).toLocaleString()}
                </span>
                <span className="text-xs uppercase tracking-wide text-ink/45">
                  {payment.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
