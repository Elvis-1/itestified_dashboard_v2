import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string };

  if (!body.email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  return NextResponse.json({ message: "If the email exists, a reset code has been sent." });
}
