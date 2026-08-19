import { requireRole } from "@/lib/auth/authorize";
import { ProviderBookingsList } from "@/components/provider/provider-bookings-list";

export default async function FreelancerBookingsPage() {
  const session = await requireRole(["FREELANCER"]);
  return <ProviderBookingsList session={session} />;
}
