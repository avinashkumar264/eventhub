import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { createQuotation } from "@/lib/actions/quotations";
import { QuotationForm } from "@/components/provider/quotation-form";

export default async function FreelancerQuoteLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["FREELANCER"]);
  const { id } = await params;

  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
    select: { id: true },
  });
  if (!provider) notFound();

  const lead = await prisma.lead.findFirst({
    where: { id, providerId: provider.id },
    select: { id: true, eventRequest: { select: { category: true } } },
  });
  if (!lead) notFound();

  const boundCreate = createQuotation.bind(null, lead.id, "freelancer");

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href={`/freelancer/leads/${lead.id}`}
        className="text-sm text-ink/50 hover:text-ink"
      >
        &larr; Back to lead
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">
        Quote — {lead.eventRequest.category}
      </h1>
      <div className="mt-8">
        <QuotationForm action={boundCreate} />
      </div>
    </main>
  );
}
