import type { AuthUser } from "@/core/auth/types";

const users: AuthUser[] = [
  {
    id: "u_admin_001",
    email: "admin@itestified.app",
    password: "pass123",
    fullName: "Elvis Igiebor",
    role: "admin",
  },
];

export function listMockUsers() {
  return users;
}

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function upsertAdminUser(input: { email: string; password: string; fullName?: string }) {
  const existing = findUserByEmail(input.email);

  if (existing) {
    existing.password = input.password;
    existing.fullName = input.fullName ?? existing.fullName;
    existing.role = "admin";
    return existing;
  }

  const user: AuthUser = {
    id: `u_admin_${users.length + 1}`,
    email: input.email,
    password: input.password,
    fullName: input.fullName ?? "Admin User",
    role: "admin",
  };

  users.push(user);
  return user;
}
