import { requireRole } from "@/lib/auth/authorize";
import { ProviderLeadDetail } from "@/components/provider/lead-detail";

export default async function FreelancerLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["FREELANCER"]);
  const { id } = await params;
  return (
    <ProviderLeadDetail session={session} areaPath="freelancer" leadId={id} />
  );
}
