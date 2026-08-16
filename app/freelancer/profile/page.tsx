import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { saveProviderProfile, createService } from "@/lib/actions/provider";
import { ProviderProfileForm } from "@/components/provider/provider-profile-form";
import { ServiceForm } from "@/components/provider/service-form";
import { ServiceList } from "@/components/provider/service-list";

export default async function FreelancerProfilePage() {
  const session = await requireRole(["FREELANCER"]);

  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
    include: { services: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/freelancer" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">
        Professional profile
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        This is what EventHub uses to match you with customer requests.
      </p>

      <div className="mt-8">
        <ProviderProfileForm
          action={saveProviderProfile}
          isFreelancer={true}
          defaults={
            provider
              ? {
                  businessName: provider.businessName,
                  bio: provider.bio ?? undefined,
                  city: provider.city ?? undefined,
                  experienceYears: provider.experienceYears,
                  freelancerSpecialty: provider.freelancerSpecialty,
                }
              : undefined
          }
        />
      </div>

      <div className="mt-12 border-t border-ink/10 pt-8">
        <h2 className="font-display text-lg font-medium">Services</h2>
        {provider ? (
          <>
            <ServiceList services={provider.services} />
            <div className="mt-6">
              <ServiceForm action={createService} />
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-ink/55">
            Save your profile above before adding services.
          </p>
        )}
      </div>
    </main>
  );
}
