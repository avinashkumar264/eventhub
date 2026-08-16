import { requireRole } from "@/lib/auth/authorize";
import { ProviderLeadDetail } from "@/components/provider/lead-detail";

export default async function VendorLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["VENDOR"]);
  const { id } = await params;
  return <ProviderLeadDetail session={session} areaPath="vendor" leadId={id} />;
}
