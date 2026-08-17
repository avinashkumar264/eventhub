import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { QuotationStatusBadge } from "@/components/customer/quotation-status-badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function CustomerQuotationsPage() {
  const session = await requireRole(["CUSTOMER"]);

  // Scoped via eventRequest.customerId — never a quotation's own id/fields
  // alone. A quotation tied to another customer's request is never reached.
  const quotations = await prisma.quotation.findMany({
    where: { eventRequest: { customerId: session.sub } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      finalAmount: true,
      status: true,
      createdAt: true,
      provider: { select: { businessName: true, type: true } },
      eventRequest: { select: { category: true } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Your quotations</h1>
      <p className="mt-1 text-sm text-ink/60">
        {quotations.length} quotation{quotations.length === 1 ? "" : "s"}
      </p>

      {quotations.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
          <p className="text-sm text-ink/60">
            No quotations yet. Once vendors and freelancers respond to your
            requests, they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {quotations.map((quotation) => (
            <li key={quotation.id}>
              <Link
                href={`/customer/quotations/${quotation.id}`}
                className="block rounded-xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium">
                      {quotation.title}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      {quotation.provider.businessName} &middot;{" "}
                      {quotation.eventRequest.category}
                    </p>
                  </div>
                  <QuotationStatusBadge status={quotation.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-6 text-sm text-ink/60">
                  <span>
                    ${Number(quotation.finalAmount).toLocaleString()}
                  </span>
                  <span>Submitted {formatDate(quotation.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
