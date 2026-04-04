import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/core/auth/constants";
import { upsertAdminUser } from "@/core/auth/mock-users";
import { encodeSession } from "@/core/auth/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  if (!body.email || !body.password || !body.confirmPassword) {
    return NextResponse.json({ message: "Email and both password fields are required." }, { status: 400 });
  }

  if (body.password !== body.confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
  }

  const user = upsertAdminUser({
    email: body.email,
    password: body.password,
  });

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
