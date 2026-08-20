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

export default async function OperationsPaymentsPage() {
  await requireRole(["OPERATIONS"]);

  // Explicit select — never touches razorpaySignature or any server
  // secret. razorpayOrderId/razorpayPaymentId are Razorpay's own public
  // identifiers, not secrets, so they're safe to show here.
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      type: true,
      status: true,
      amount: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      createdAt: true,
      payer: { select: { firstName: true, lastName: true, email: true } },
      booking: { select: { id: true, event: { select: { title: true } } } },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/operations" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">Payments</h1>
      <p className="mt-1 text-sm text-ink/60">{payments.length} shown (most recent 100)</p>

      {payments.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">No payment records yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Booking</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Razorpay order</th>
                <th className="py-3 pr-4">Razorpay payment</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-ink/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium">
                      {p.payer.firstName} {p.payer.lastName}
                    </p>
                    <p className="text-xs text-ink/45">{p.payer.email}</p>
                  </td>
                  <td className="py-3 pr-4">{p.booking.event.title}</td>
                  <td className="py-3 pr-4">{p.type}</td>
                  <td className="py-3 pr-4">${Number(p.amount).toLocaleString()}</td>
                  <td className="py-3 pr-4 text-xs text-ink/50">
                    {p.razorpayOrderId ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-xs text-ink/50">
                    {p.razorpayPaymentId ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-wide text-ink/60">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-ink/45">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
