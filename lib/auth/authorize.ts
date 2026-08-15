import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { getSession, type SessionPayload } from "./session";

/** Requires a valid session. Redirects to /login (with a return path) if absent. */
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/** Requires a valid session AND one of the allowed roles. Redirects to /403 otherwise. */
export async function requireRole(
  allowed: UserRole[]
): Promise<SessionPayload> {
  const session = await requireUser();
  if (!allowed.includes(session.role)) {
    redirect("/403");
  }
  return session;
}
