"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { safeReturnTo } from "@/lib/navigation";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmation?: string;
  accepted?: string;
}

const benefits = ["Visual notes", "Interactive simulations", "Saved progress on this device"];

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const { hydrated, isAuthenticated, onboardingComplete, signUp } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    router.replace(onboardingComplete ? returnTo : `/onboarding?returnTo=${encodeURIComponent(returnTo)}`);
  }, [hydrated, isAuthenticated, onboardingComplete, returnTo, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) nextErrors.name = "Enter the name you would like to use.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (confirmation !== password) nextErrors.confirmation = "The passwords do not match.";
    if (!accepted) nextErrors.accepted = "Confirm that you understand this is a front-end demo.";
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const result = await signUp({ name, email, password });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      router.replace(`/onboarding?returnTo=${encodeURIComponent(returnTo)}`);
    } catch {
      setMessage("The dummy account could not be created. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="mono-kicker text-ignition">Start with a clear plan</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-[-.02em] text-paper sm:text-5xl">
        Create your learning account.
      </h1>
      <p className="mt-4 leading-7 text-titanium">
        Save your notes, simulations, and reading progress on this device.
      </p>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {benefits.map((benefit) => (
          <span key={benefit} className="flex items-center gap-2 text-sm text-titanium">
            <Check aria-hidden="true" className="size-4 text-cyan" />
            {benefit}
          </span>
        ))}
      </div>

      <Card className="mt-7 border-steel bg-carbon p-5 sm:p-7">
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Aarav Sharma"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            error={errors.name}
          />
          <Input
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            error={errors.email}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="8+ characters"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              error={errors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              name="confirmation"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
                setErrors((current) => ({ ...current, confirmation: undefined }));
              }}
              error={errors.confirmation}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-titanium">
            <input
              className="mt-1 size-4 shrink-0 accent-[var(--ignition)]"
              type="checkbox"
              checked={accepted}
              onChange={(event) => {
                setAccepted(event.target.checked);
                setErrors((current) => ({ ...current, accepted: undefined }));
              }}
            />
            <span>I understand this prototype stores dummy account data only in this browser.</span>
          </label>
          {errors.accepted ? <p className="text-sm text-[#C7C5CC]">{errors.accepted}</p> : null}

          {message ? (
            <p className="border border-error/35 bg-error/10 px-3 py-2.5 text-sm leading-6 text-[#C7C5CC]" role="alert">
              {message}
            </p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting} disabled={!hydrated}>
            Create my workspace
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </form>
      </Card>

      <p className="mt-7 text-center text-sm text-titanium">
        Already have a dummy account?{" "}
        <Link className="font-bold text-paper underline decoration-ignition decoration-2 underline-offset-4" href={`/login?returnTo=${encodeURIComponent(returnTo)}`}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-titanium">Preparing your account…</p>}>
      <SignUpContent />
    </Suspense>
  );
}
