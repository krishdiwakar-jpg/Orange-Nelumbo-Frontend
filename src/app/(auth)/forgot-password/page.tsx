"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const { hydrated, requestPasswordReset } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.success) setSuccess(result.message);
      else setError(result.message);
    } catch {
      setError("The dummy reset flow could not be prepared. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="mono-kicker text-ignition">Account recovery</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-[-.02em] text-paper sm:text-5xl">
        Reset your password.
      </h1>
      <p className="mt-4 max-w-md leading-7 text-titanium">
        This prototype demonstrates the reset flow without sending an email or changing a real credential.
      </p>

      <Card className="mt-8 border-steel bg-carbon p-5 sm:p-7">
        {success ? (
          <div aria-live="polite">
            <div className="flex size-12 items-center justify-center bg-cyan/10 text-cyan">
              <MailCheck aria-hidden="true" className="size-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold text-paper">Dummy link prepared</h2>
            <p className="mt-3 text-sm leading-6 text-titanium">{success}</p>
            <Link
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 border border-steel bg-graphite px-5 text-sm font-bold text-paper transition hover:border-titanium hover:bg-steel"
              href="/login"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Return to sign in
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              error={error || undefined}
              hint="Use the email from your local dummy account."
            />
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting} disabled={!hydrated}>
              Prepare reset link
            </Button>
          </form>
        )}
      </Card>

      {!success ? (
        <Link className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-paper hover:text-ember" href="/login">
          <ArrowLeft aria-hidden="true" className="size-4 text-ignition" />
          Back to sign in
        </Link>
      ) : null}
    </div>
  );
}
