import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

const INVALID_CREDENTIALS = NextResponse.json(
  { error: "Invalid email or password." },
  { status: 401 }
);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and password." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Same generic message whether the email doesn't exist or the password
    // is wrong — never reveal which one it was.
    if (!user || !user.passwordHash) {
      return INVALID_CREDENTIALS.clone();
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return INVALID_CREDENTIALS.clone();
    }

    const token = await createSessionToken({
      sub: user.id,
      role: user.role,
      firstName: user.firstName,
    });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, role: user.role }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
