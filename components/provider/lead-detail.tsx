import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadStatusBadge } from "@/components/provider/lead-status-badge";
import { LeadStatusForm } from "@/components/provider/lead-status-form";
import { markLeadViewed, updateLeadStatus } from "@/lib/actions/leads";
import type { SessionPayload } from "@/lib/auth/session";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatBudget(min: unknown, max: unknown) {
  const toNum = (v: unknown) => (v == null ? null : Number(v));
  const lo = toNum(min);
  const hi = toNum(max);
  if (lo === null && hi === null) return "Not set";
  if (lo !== null && hi !== null)
    return `$${lo.toLocaleString()} – $${hi.toLocaleString()}`;
  return `$${(lo ?? hi)!.toLocaleString()}`;
}

export async function ProviderLeadDetail({
  session,
  areaPath,
  leadId,
}: {
  session: SessionPayload;
  areaPath: "vendor" | "freelancer";
  leadId: string;
}) {
  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
    select: { id: true },
  });
  if (!provider) notFound();

  // Ownership enforced here: a lead belonging to another provider matches
  // nothing and falls through to notFound() — never a 403 that would
  // confirm the id is valid.
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, providerId: provider.id },
    select: {
      id: true,
      status: true,
      viewedAt: true,
      createdAt: true,
      eventRequest: {
        select: {
          category: true,
          description: true,
          event: {
            select: {
              eventType: true,
              eventDate: true,
              city: true,
              guestCount: true,
              budgetMin: true,
              budgetMax: true,
              requirements: true,
            },
          },
        },
      },
    },
  });

  if (!lead) notFound();

  if (!lead.viewedAt) {
    await markLeadViewed(lead.id);
  }

  const boundUpdateStatus = updateLeadStatus.bind(null, lead.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href={`/${areaPath}/leads`} className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">
            {lead.eventRequest.category}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {lead.eventRequest.event.eventType} &middot;{" "}
            {formatDate(lead.eventRequest.event.eventDate)}
          </p>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      <p className="mt-6 rounded-lg bg-ink/5 px-4 py-3 text-xs text-ink/55">
        Customer contact details stay hidden until a verified advance
        payment unlocks direct communication.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">City</dt>
          <dd className="mt-1 text-sm">
            {lead.eventRequest.event.city ?? "Not set"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Guest count
          </dt>
          <dd className="mt-1 text-sm">
            {lead.eventRequest.event.guestCount ?? "Not set"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">
            Budget
          </dt>
          <dd className="mt-1 text-sm">
            {formatBudget(
              lead.eventRequest.event.budgetMin,
              lead.eventRequest.event.budgetMax
            )}
          </dd>
        </div>
      </dl>

      {lead.eventRequest.description && (
        <div className="mt-8">
          <h2 className="text-xs uppercase tracking-wide text-ink/45">
            Request details
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {lead.eventRequest.description}
          </p>
        </div>
      )}

      {lead.eventRequest.event.requirements && (
        <div className="mt-6">
          <h2 className="text-xs uppercase tracking-wide text-ink/45">
            Event requirements
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {lead.eventRequest.event.requirements}
          </p>
        </div>
      )}

      <div className="mt-10 border-t border-ink/10 pt-6">
        <LeadStatusForm action={boundUpdateStatus} currentStatus={lead.status} />
      </div>
    </main>
  );
}
