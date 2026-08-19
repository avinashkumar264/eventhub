import { requireRole } from "@/lib/auth/authorize";
import { ProviderBookingsList } from "@/components/provider/provider-bookings-list";

export default async function VendorBookingsPage() {
  const session = await requireRole(["VENDOR"]);
  return <ProviderBookingsList session={session} />;
}
