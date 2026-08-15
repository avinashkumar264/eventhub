import type { UserRole } from "@prisma/client";
import type { SessionPayload } from "@/lib/auth/session";
import { LogoutButton } from "@/components/shared/logout-button";

const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  VENDOR: "Vendor",
  FREELANCER: "Freelancer",
  OPERATIONS: "Operations",
  ADMIN: "Admin",
};

export function RoleAreaPlaceholder({ session }: { session: SessionPayload }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <p className="font-display text-sm uppercase tracking-[0.25em] text-plum">
        {ROLE_LABEL[session.role]} area
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium">
        Welcome, {session.firstName}
      </h1>
      <p className="mt-4 text-ink/60">
        You&apos;re signed in and authorized for this section. The full{" "}
        {ROLE_LABEL[session.role].toLowerCase()} dashboard is coming in a
        future day &mdash; this page only confirms role-based access is
        working end to end.
      </p>
      <LogoutButton />
    </main>
  );
}
