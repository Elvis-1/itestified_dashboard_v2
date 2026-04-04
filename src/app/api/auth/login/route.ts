import { NextResponse } from "next/server";
import { findUserByEmail } from "@/core/auth/mock-users";
import { SESSION_COOKIE } from "@/core/auth/constants";
import { encodeSession } from "@/core/auth/session";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const user = findUserByEmail(body.email);
  if (!user || user.password !== body.password) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const token = encodeSession({ userId: user.id, email: user.email, role: user.role });
  const res = NextResponse.json({ role: user.role, email: user.email });

  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return res;
}
