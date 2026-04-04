"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { AdminAuthFrame } from "@/features/auth/presentation/components/admin-auth-frame";

const checks = [
  { label: "Password must be at least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "At least one uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "At least one lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "At least one number", test: (value: string) => /\d/.test(value) },
  { label: "At least one special character (!@#$%)", test: (value: string) => /[!@#$%]/.test(value) },
] as const;

export default function CreatePasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "admin@itestified.app";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rules = [...checks, { label: "Passwords match", test: () => password.length > 0 && password === confirmPassword }];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!rules.every((rule) => rule.test(password))) {
      setError("Please satisfy the password rules before continuing.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth/create-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(data.message ?? "Unable to create password.");
      setLoading(false);
      return;
    }

    router.push("/overview");
    router.refresh();
  }

  return (
    <AdminAuthFrame
      title="Create New Password"
      description="For Security reasons, kindly set a new password"
    >
      <form onSubmit={onSubmit} className="space-y-4" data-testid="create-password-form">
        <label className="block space-y-2">
          <span className="text-base font-medium text-white">New Password</span>
          <Input
            aria-label="New Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="rounded-lg border-white/5 bg-[#171717] px-4 py-3.5 text-[0.95rem] focus:border-[var(--color-primary)]"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-base font-medium text-white">Confirm New Password</span>
          <Input
            aria-label="Confirm New Password"
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="rounded-lg border-white/5 bg-[#171717] px-4 py-3.5 text-[0.95rem] focus:border-[var(--color-primary)]"
            required
          />
        </label>

        <ul className="space-y-2 pl-2 text-[13px] leading-6 text-[#d6d6d6]">
          {rules.map((rule) => (
            <li key={rule.label}>• {rule.label}</li>
          ))}
        </ul>

        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

        <Button className="mt-9 w-full rounded-lg py-3.5 text-base" type="submit" disabled={loading}>
          {loading ? "Creating Password..." : "Create Password"}
        </Button>
      </form>
    </AdminAuthFrame>
  );
}
