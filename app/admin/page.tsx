import { requireRole } from "@/lib/auth/authorize";
import { RoleAreaPlaceholder } from "@/components/shared/role-area-placeholder";

export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]);
  return <RoleAreaPlaceholder session={session} />;
}
