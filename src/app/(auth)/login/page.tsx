"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, FlaskConical } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { safeReturnTo } from "@/lib/navigation";

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const demoRequested = searchParams.get("demo") === "1";
  const { hydrated, isAuthenticated, onboardingComplete, login, loginAsDemo } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpeningDemo, setIsOpeningDemo] = useState(false);
  const demoStartedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    router.replace(onboardingComplete ? returnTo : `/onboarding?returnTo=${encodeURIComponent(returnTo)}`);
  }, [hydrated, isAuthenticated, onboardingComplete, returnTo, router]);

  useEffect(() => {
    if (!hydrated || isAuthenticated || !demoRequested || demoStartedRef.current) return;
    demoStartedRef.current = true;
    setIsOpeningDemo(true);
    void loginAsDemo()
      .then((result) => {
        if (result.success) router.replace(returnTo);
        else setMessage(result.message);
      })
      .catch(() => setMessage("The demo could not be opened. Try the button below."))
      .finally(() => setIsOpeningDemo(false));
  }, [demoRequested, hydrated, isAuthenticated, loginAsDemo, returnTo, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const result = await login({ email, password });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      router.replace(result.user?.onboardingComplete ? returnTo : `/onboarding?returnTo=${encodeURIComponent(returnTo)}`);
    } catch {
      setMessage("Sign in could not be completed. Your connection is not required; please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoLogin() {
    setMessage("");
    setIsOpeningDemo(true);
    try {
      const result = await loginAsDemo();
      if (result.success) router.replace(returnTo);
      else setMessage(result.message);
    } catch {
      setMessage("The demo could not be opened. Please try again.");
    } finally {
      setIsOpeningDemo(false);
    }
  }

  return (
    <div>
      <p className="mono-kicker text-ignition">Student workspace</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-[-.02em] text-paper sm:text-5xl">
        Welcome back.
      </h1>
      <p className="mt-4 max-w-md leading-7 text-titanium">
        Continue your visual notes and simulations from exactly where you stopped.
      </p>

      <Card className="mt-8 border-steel bg-carbon p-5 sm:p-7">
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
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            error={errors.email}
          />
          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              error={errors.password}
            />
            <div className="mt-2 text-right">
              <Link className="text-sm font-semibold text-ignition hover:text-ember" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>

          {message ? (
            <p className="border border-error/35 bg-error/10 px-3 py-2.5 text-sm leading-6 text-[#C7C5CC]" role="alert">
              {message}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={!hydrated || isOpeningDemo}
          >
            Sign in
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-steel" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-titanium">or explore first</span>
          <span className="h-px flex-1 bg-steel" />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          isLoading={isOpeningDemo}
          disabled={!hydrated || isSubmitting}
          onClick={handleDemoLogin}
        >
          <FlaskConical aria-hidden="true" className="size-4 text-cyan" />
          Open the student demo
        </Button>
        <p className="mt-3 text-center text-xs leading-5 text-titanium">
          Demo access loads a sample JEE 2027 profile. Nothing is submitted.
        </p>
        <div className="mt-4 border border-steel bg-graphite/60 px-4 py-3 text-xs leading-5 text-titanium">
          <p className="font-bold text-paper">Dummy login</p>
          <p className="mt-1 font-mono">aarav@orangenelumbo.com</p>
          <p className="font-mono">orange2027</p>
        </div>
      </Card>

      <p className="mt-7 text-center text-sm text-titanium">
        New to Orange Nelumbo?{" "}
        <Link className="font-bold text-paper underline decoration-ignition decoration-2 underline-offset-4" href="/signup">
          Create a dummy account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-titanium">Preparing sign in…</p>}>
      <LoginContent />
    </Suspense>
  );
}
