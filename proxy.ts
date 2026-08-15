import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Route prefix -> the single role allowed to access it.
// This is the first line of defense; each protected page also re-checks
// server-side via requireRole() as defense in depth.
const ROLE_PREFIXES: Record<string, string> = {
  "/customer": "CUSTOMER",
  "/vendor": "VENDOR",
  "/freelancer": "FREELANCER",
  "/operations": "OPERATIONS",
  "/admin": "ADMIN",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!matchedPrefix) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role !== ROLE_PREFIXES[matchedPrefix]) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/vendor/:path*",
    "/freelancer/:path*",
    "/operations/:path*",
    "/admin/:path*",
  ],
};
