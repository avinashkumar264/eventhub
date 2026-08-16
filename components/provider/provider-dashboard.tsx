import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/logout-button";
import type { SessionPayload } from "@/lib/auth/session";

const ACTIVE_LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED"] as const;
const PROFILE_FIELD_COUNT = 4; // businessName, bio, city, experienceYears

export async function ProviderDashboard({
  session,
  areaPath,
  areaLabel,
}: {
  session: SessionPayload;
  areaPath: "vendor" | "freelancer";
  areaLabel: string;
}) {
  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
  });

  const filledFields = provider
    ? [provider.businessName, provider.bio, provider.city, provider.experienceYears]
        .filter((v) => v !== null && v !== undefined && v !== "").length
    : 0;
  const profileCompletion = provider
    ? Math.round((filledFields / PROFILE_FIELD_COUNT) * 100)
    : 0;

  const [totalLeads, newLeads, activeLeads] = provider
    ? await Promise.all([
        prisma.lead.count({ where: { providerId: provider.id } }),
        prisma.lead.count({ where: { providerId: provider.id, status: "NEW" } }),
        prisma.lead.count({
          where: {
            providerId: provider.id,
            status: { in: [...ACTIVE_LEAD_STATUSES] },
          },
        }),
      ])
    : [0, 0, 0];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.25em] text-plum">
            {areaLabel} dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            Welcome, {session.firstName}
          </h1>
        </div>
        <Button variant="primary" asChild>
          <Link href={`/${areaPath}/profile`}>
            {provider ? "Edit profile" : "Complete your profile"}
          </Link>
        </Button>
      </div>

      {!provider && (
        <div className="mt-8 rounded-xl border border-dashed border-ink/15 bg-white px-6 py-5 text-sm text-ink/70">
          Your profile isn&apos;t set up yet, so you won&apos;t receive
          leads. Complete it to start showing up as an eligible provider.
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            Profile
          </p>
          <p className="mt-2 font-display text-3xl">{profileCompletion}%</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            Total leads
          </p>
          <p className="mt-2 font-display text-3xl">{totalLeads}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            New leads
          </p>
          <p className="mt-2 font-display text-3xl">{newLeads}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">
            Active leads
          </p>
          <p className="mt-2 font-display text-3xl">{activeLeads}</p>
        </div>
      </div>

      <div className="mt-10">
        <Button variant="outline" asChild>
          <Link href={`/${areaPath}/leads`}>View leads</Link>
        </Button>
      </div>

      <LogoutButton />
    </main>
  );
}
