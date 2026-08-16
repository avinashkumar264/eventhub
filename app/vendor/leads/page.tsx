import { requireRole } from "@/lib/auth/authorize";
import { ProviderLeadsList } from "@/components/provider/provider-leads-list";

export default async function VendorLeadsPage() {
  const session = await requireRole(["VENDOR"]);
  return <ProviderLeadsList session={session} areaPath="vendor" />;
}
