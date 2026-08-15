import { requireRole } from "@/lib/auth/authorize";
import { RoleAreaPlaceholder } from "@/components/shared/role-area-placeholder";

export default async function CustomerPage() {
  const session = await requireRole(["CUSTOMER"]);
  return <RoleAreaPlaceholder session={session} />;
}
