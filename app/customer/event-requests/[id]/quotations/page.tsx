import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function CompareQuotationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["CUSTOMER"]);
  const { id } = await params;

  // Ownership enforced here: a request belonging to another customer
  // matches nothing and falls through to notFound().
  const eventRequest = await prisma.eventRequest.findFirst({
    where: { id, customerId: session.sub },
    select: { id: true, category: true },
  });
  if (!eventRequest) notFound();

  const quotations = await prisma.quotation.findMany({
    where: { eventRequestId: eventRequest.id },
    orderBy: { finalAmount: "asc" },
    select: {
      id: true,
      title: true,
      baseAmount: true,
      additionalCharges: true,
      discount: true,
      tax: true,
      finalAmount: true,
      validUntil: true,
      status: true,
      createdAt: true,
      provider: { select: { businessName: true, type: true } },
    },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/customer/quotations" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to quotations
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">
        Compare quotations — {eventRequest.category}
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Sorted by final amount. You decide — EventHub doesn&apos;t rank or
        recommend a provider for you.
      </p>

      {quotations.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
          <p className="text-sm text-ink/60">No quotations for this request yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-3 pr-4">Provider</th>
                <th className="py-3 pr-4">Base</th>
                <th className="py-3 pr-4">Extras</th>
                <th className="py-3 pr-4">Discount</th>
                <th className="py-3 pr-4">Tax</th>
                <th className="py-3 pr-4">Final</th>
                <th className="py-3 pr-4">Valid until</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="border-b border-ink/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{quotation.provider.businessName}</p>
                    <p className="text-xs text-ink/45">
                      {quotation.provider.type === "EVENT_COMPANY"
                        ? "Vendor"
                        : "Freelancer"}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    ${Number(quotation.baseAmount).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    ${Number(quotation.additionalCharges).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    ${Number(quotation.discount).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">${Number(quotation.tax).toLocaleString()}</td>
                  <td className="py-3 pr-4 font-medium">
                    ${Number(quotation.finalAmount).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    {quotation.validUntil ? formatDate(quotation.validUntil) : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <QuotationStatusBadge status={quotation.status} />
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/customer/quotations/${quotation.id}`}
                      className="text-plum underline underline-offset-4"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
