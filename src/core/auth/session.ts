import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/core/auth/constants";
import type { SessionData } from "@/core/auth/types";

function toBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeToken(token: string): SessionData | null {
  try {
    const json = fromBase64Url(token);
    const value = JSON.parse(json) as SessionData;

    if (!value?.userId || !value?.email || !value?.role) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

export function encodeSession(data: SessionData) {
  return toBase64Url(JSON.stringify(data));
}

export function parseSessionToken(token?: string | null) {
  if (!token) return null;
  return decodeToken(token);
}

export async function getServerSession() {
  const store = await cookies();
  return parseSessionToken(store.get(SESSION_COOKIE)?.value ?? null);
}

export function getRequestSession(req: NextRequest) {
  return parseSessionToken(req.cookies.get(SESSION_COOKIE)?.value ?? null);
}
