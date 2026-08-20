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

export default async function OperationsQuotationsPage() {
  await requireRole(["OPERATIONS"]);

  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      finalAmount: true,
      status: true,
      validUntil: true,
      createdAt: true,
      provider: { select: { businessName: true, type: true } },
      eventRequest: {
        select: {
          category: true,
          customer: { select: { firstName: true, lastName: true, email: true } },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/operations" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">Quotations</h1>
      <p className="mt-1 text-sm text-ink/60">{quotations.length} shown (most recent 100)</p>

      {quotations.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">No quotations yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Provider</th>
                <th className="py-3 pr-4">Request</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Valid until</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-ink/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium">
                      {q.eventRequest.customer.firstName} {q.eventRequest.customer.lastName}
                    </p>
                    <p className="text-xs text-ink/45">{q.eventRequest.customer.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p>{q.provider.businessName}</p>
                    <p className="text-xs text-ink/45">
                      {q.provider.type === "EVENT_COMPANY" ? "Vendor" : "Freelancer"}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{q.eventRequest.category}</td>
                  <td className="py-3 pr-4">${Number(q.finalAmount).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    {q.validUntil ? formatDate(q.validUntil) : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-wide text-ink/60">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-ink/45">{formatDate(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
