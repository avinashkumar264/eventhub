import { requireRole } from "@/lib/auth/authorize";
import { RoleAreaPlaceholder } from "@/components/shared/role-area-placeholder";

export default async function VendorPage() {
  const session = await requireRole(["VENDOR"]);
  return <RoleAreaPlaceholder session={session} />;
}
