import type { SessionData, UserRole } from "@/core/auth/types";

const authPages = ["/signup", "/create-password", "/login", "/forgot-password"];
const protectedPaths = ["/overview", "/admin"];

export function isAuthPage(pathname: string) {
  return authPages.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function requiredRoleForPath(pathname: string): UserRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  return null;
}

export function defaultLandingForRole() {
  return "/overview";
}

export type AccessDecision =
  | { action: "allow" }
  | { action: "redirect"; destination: string };

export function resolveAccess(pathname: string, session: SessionData | null): AccessDecision {
  if (isAuthPage(pathname) && session) {
    return { action: "redirect", destination: defaultLandingForRole() };
  }

  if (!isProtectedPath(pathname)) {
    return { action: "allow" };
  }

  if (!session) {
    return { action: "redirect", destination: `/login?redirect=${encodeURIComponent(pathname)}` };
  }

  const required = requiredRoleForPath(pathname);
  if (!required || required === session.role) {
    return { action: "allow" };
  }

  return { action: "redirect", destination: "/overview" };
}
