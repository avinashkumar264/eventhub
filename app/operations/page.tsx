import { requireRole } from "@/lib/auth/authorize";
import { RoleAreaPlaceholder } from "@/components/shared/role-area-placeholder";

export default async function OperationsPage() {
  const session = await requireRole(["OPERATIONS"]);
  return <RoleAreaPlaceholder session={session} />;
}
