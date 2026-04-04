"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { AdminAuthFrame } from "@/features/auth/presentation/components/admin-auth-frame";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("admin@itestified.app");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(data.message ?? "Unable to process request.");
      setLoading(false);
      return;
    }

    setMessage(data.message ?? "Reset instructions sent.");
    setLoading(false);
  }

  return (
    <AdminAuthFrame
      title="Forgot Password?"
      description="Enter your admin email address and we will send reset instructions to restore access."
    >
      <form onSubmit={onSubmit} className="space-y-5" data-testid="forgot-password-form">
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
        {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
        <Button className="mt-4 w-full rounded-lg py-3.5 text-base" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Send Reset Link"}
        </Button>
      </form>
      <div className="mt-6 text-left">
        <Link href="/login" className="text-sm font-medium text-[var(--color-primary)]">
          Back to Log In
        </Link>
      </div>
    </AdminAuthFrame>
  );
}
