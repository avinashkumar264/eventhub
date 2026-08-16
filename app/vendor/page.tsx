import { requireRole } from "@/lib/auth/authorize";
import { ProviderDashboard } from "@/components/provider/provider-dashboard";

export default async function VendorDashboardPage() {
  const session = await requireRole(["VENDOR"]);
  return <ProviderDashboard session={session} areaPath="vendor" areaLabel="Vendor" />;
}
