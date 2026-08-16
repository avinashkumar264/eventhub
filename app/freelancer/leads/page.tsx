import { requireRole } from "@/lib/auth/authorize";
import { ProviderLeadsList } from "@/components/provider/provider-leads-list";

export default async function FreelancerLeadsPage() {
  const session = await requireRole(["FREELANCER"]);
  return <ProviderLeadsList session={session} areaPath="freelancer" />;
}
