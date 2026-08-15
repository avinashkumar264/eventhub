import { requireRole } from "@/lib/auth/authorize";
import { RoleAreaPlaceholder } from "@/components/shared/role-area-placeholder";

export default async function FreelancerPage() {
  const session = await requireRole(["FREELANCER"]);
  return <RoleAreaPlaceholder session={session} />;
}
