import { requireRole } from "@/lib/auth/authorize";
import { ProviderDashboard } from "@/components/provider/provider-dashboard";

export default async function FreelancerDashboardPage() {
  const session = await requireRole(["FREELANCER"]);
  return (
    <ProviderDashboard session={session} areaPath="freelancer" areaLabel="Freelancer" />
  );
}
