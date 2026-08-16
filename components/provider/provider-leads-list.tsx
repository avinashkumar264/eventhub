import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LeadStatusBadge } from "@/components/provider/lead-status-badge";
import type { SessionPayload } from "@/lib/auth/session";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function ProviderLeadsList({
  session,
  areaPath,
}: {
  session: SessionPayload;
  areaPath: "vendor" | "freelancer";
}) {
  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
    select: { id: true },
  });

  if (!provider) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-medium">Leads</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
          <p className="text-sm text-ink/60">
            Complete your profile first to start receiving leads.
          </p>
          <Link
            href={`/${areaPath}/profile`}
            className="mt-4 inline-block text-sm text-plum underline underline-offset-4"
          >
            Complete profile
          </Link>
        </div>
      </main>
    );
  }

  // Explicit select — deliberately excludes customer.phone/email. Contact
  // info stays hidden until a verified advance payment unlocks it.
  const leads = await prisma.lead.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
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
            },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Leads</h1>
      <p className="mt-1 text-sm text-ink/60">
        {leads.length} lead{leads.length === 1 ? "" : "s"}
      </p>

      {leads.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 px-8 py-14 text-center">
          <p className="text-sm text-ink/60">
            No leads yet. New customer requests matching your services will
            show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/${areaPath}/leads/${lead.id}`}
                className="block rounded-xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium">
                      {lead.eventRequest.category}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      {lead.eventRequest.event.eventType} &middot;{" "}
                      {formatDate(lead.eventRequest.event.eventDate)}
                      {lead.eventRequest.event.city
                        ? ` · ${lead.eventRequest.event.city}`
                        : ""}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-wide text-ink/40">
                  {lead.viewedAt ? "Viewed" : "Not viewed yet"} &middot; Received{" "}
                  {formatDate(lead.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
