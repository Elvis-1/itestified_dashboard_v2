"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { AdminAuthFrame } from "@/features/auth/presentation/components/admin-auth-frame";

const VALID_ENTRY_CODE = "ITESTIFIED-ADMIN";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@itestified.app");
  const [entryCode, setEntryCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !entryCode.trim()) {
      setError("Email address and entry code are required.");
      return;
    }

    if (entryCode !== VALID_ENTRY_CODE) {
      setError("The entry code is invalid.");
      return;
    }

    router.push(`/create-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <AdminAuthFrame title="Welcome!">
      <form onSubmit={onSubmit} className="space-y-5" data-testid="signup-form">
        <label className="block space-y-2">
          <span className="text-base font-medium text-white">Email Address</span>
          <Input
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            className="rounded-lg border-white/5 bg-[#171717] px-4 py-3.5 text-[0.95rem] focus:border-[var(--color-primary)]"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-base font-medium text-white">Entry Code</span>
          <Input
            aria-label="Entry Code"
            type="text"
            value={entryCode}
            onChange={(e) => setEntryCode(e.target.value)}
            placeholder="Enter entry code"
            className="rounded-lg border-white/5 bg-[#171717] px-4 py-3.5 text-[0.95rem] focus:border-[var(--color-primary)]"
            required
          />
        </label>

        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

        <Button className="mt-7 w-full rounded-lg py-3.5 text-base" type="submit">
          Continue
        </Button>
      </form>

      <div className="mt-4 text-left">
        <Link href="/login" className="text-sm font-medium text-[var(--color-primary)]">
          I have an account
        </Link>
      </div>

      <p className="mt-4 text-xs text-[#7e7e7e]">Demo entry code: `ITESTIFIED-ADMIN`</p>
    </AdminAuthFrame>
  );
}
