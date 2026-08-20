import Link from "next/link";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/shared/logout-button";

export default async function OperationsDashboardPage() {
  const session = await requireRole(["OPERATIONS"]);

  const [
    totalCustomers,
    totalVendors,
    totalFreelancers,
    totalEvents,
    pendingRequests,
    activeLeads,
    quotationsSubmitted,
    activeBookings,
    paymentsNeedingAttention,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "FREELANCER" } }),
    prisma.event.count(),
    prisma.eventRequest.count({ where: { status: "OPEN" } }),
    prisma.lead.count({ where: { status: { in: ["NEW", "CONTACTED", "QUALIFIED"] } } }),
    prisma.quotation.count({ where: { status: "SUBMITTED" } }),
    prisma.booking.count({ where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
  ]);

  const metrics = [
    { label: "Customers", value: totalCustomers },
    { label: "Vendors", value: totalVendors },
    { label: "Freelancers", value: totalFreelancers },
    { label: "Events", value: totalEvents },
    { label: "Pending requests", value: pendingRequests, href: "/operations/requests" },
    { label: "Active leads", value: activeLeads },
    { label: "Quotations submitted", value: quotationsSubmitted, href: "/operations/quotations" },
    { label: "Active bookings", value: activeBookings, href: "/operations/bookings" },
    { label: "Payments pending", value: paymentsNeedingAttention, href: "/operations/payments" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-display text-sm uppercase tracking-[0.25em] text-plum">
        Operations dashboard
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium">
        Welcome, {session.firstName}
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => {
          const card = (
            <div className="rounded-xl border border-ink/10 bg-white p-6">
              <p className="text-xs uppercase tracking-wide text-ink/45">
                {metric.label}
              </p>
              <p className="mt-2 font-display text-3xl">{metric.value}</p>
            </div>
          );
          return metric.href ? (
            <Link key={metric.label} href={metric.href} className="transition-shadow hover:shadow-md">
              {card}
            </Link>
          ) : (
            <div key={metric.label}>{card}</div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/operations/requests" className="text-sm text-plum underline underline-offset-4">
          Event requests
        </Link>
        <Link href="/operations/quotations" className="text-sm text-plum underline underline-offset-4">
          Quotations
        </Link>
        <Link href="/operations/bookings" className="text-sm text-plum underline underline-offset-4">
          Bookings
        </Link>
        <Link href="/operations/payments" className="text-sm text-plum underline underline-offset-4">
          Payments
        </Link>
      </div>

      <LogoutButton />
    </main>
  );
}
