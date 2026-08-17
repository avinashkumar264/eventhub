import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { QuotationStatusBadge } from "@/components/customer/quotation-status-badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function CustomerQuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["CUSTOMER"]);
  const { id } = await params;

  // Ownership enforced in the query itself: a quotation tied to another
  // customer's event request matches nothing and falls through to notFound().
  const quotation = await prisma.quotation.findFirst({
    where: { id, eventRequest: { customerId: session.sub } },
    select: {
      id: true,
      title: true,
      description: true,
      baseAmount: true,
      additionalCharges: true,
      discount: true,
      tax: true,
      finalAmount: true,
      details: true,
      validUntil: true,
      status: true,
      createdAt: true,
      provider: { select: { businessName: true, type: true, city: true } },
      eventRequest: { select: { id: true, category: true } },
    },
  });

  if (!quotation) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/customer/quotations" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to quotations
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">{quotation.title}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {quotation.provider.businessName} (
            {quotation.provider.type === "EVENT_COMPANY" ? "Vendor" : "Freelancer"}
            ) &middot; {quotation.eventRequest.category}
          </p>
        </div>
        <QuotationStatusBadge status={quotation.status} />
      </div>

      {quotation.description && (
        <p className="mt-6 text-sm leading-relaxed text-ink/80">
          {quotation.description}
        </p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 rounded-xl border border-ink/10 bg-white p-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Base</dt>
          <dd className="mt-1 text-sm">${Number(quotation.baseAmount).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Additional charges
          </dt>
          <dd className="mt-1 text-sm">
            ${Number(quotation.additionalCharges).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Discount</dt>
          <dd className="mt-1 text-sm">${Number(quotation.discount).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Tax</dt>
          <dd className="mt-1 text-sm">${Number(quotation.tax).toLocaleString()}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-xs uppercase tracking-wide text-ink/45">Final total</dt>
          <dd className="mt-1 font-display text-xl">
            ${Number(quotation.finalAmount).toLocaleString()}
          </dd>
        </div>
      </dl>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Valid until</dt>
          <dd className="mt-1 text-sm">
            {quotation.validUntil ? formatDate(quotation.validUntil) : "Not set"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Submitted</dt>
          <dd className="mt-1 text-sm">{formatDate(quotation.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Provider city
          </dt>
          <dd className="mt-1 text-sm">{quotation.provider.city ?? "Not set"}</dd>
        </div>
      </dl>

      {quotation.details && (
        <div className="mt-6">
          <h2 className="text-xs uppercase tracking-wide text-ink/45">
            Additional terms / delivery details
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {quotation.details}
          </p>
        </div>
      )}

      <p className="mt-8 rounded-lg bg-ink/5 px-4 py-3 text-xs text-ink/55">
        Direct contact with the provider unlocks after a verified advance
        payment. EventHub handles communication until then.
      </p>

      <Link
        href={`/customer/event-requests/${quotation.eventRequest.id}/quotations`}
        className="mt-6 inline-block text-sm text-plum underline underline-offset-4"
      >
        Compare all quotations for this request
      </Link>
    </main>
  );
}
