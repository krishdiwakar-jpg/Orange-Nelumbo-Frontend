"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CreditCard, GraduationCap, ShieldCheck, Tag } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Plan } from "@/types/platform";

export interface CheckoutFormProps {
  plan: Plan;
}

type FieldName = "studentName" | "email" | "cardNumber" | "expiry" | "cvv" | "city";
type FormErrors = Partial<Record<FieldName | "terms", string>>;

const DEMO_COUPON = "MASTERY10";
const SUCCESS_CARD = "4242 4242 4242 4242";
const FAILURE_CARD = "4000 0000 0000 0002";

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function CheckoutForm({ plan }: CheckoutFormProps) {
  const router = useRouter();
  const { activatePlan, hydrated, isAuthenticated, isEducator } = useApp();
  const [fields, setFields] = useState<Record<FieldName, string>>({
    studentName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    city: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  const discount = useMemo(() => (couponApplied ? Math.round(plan.price * 0.1) : 0), [couponApplied, plan.price]);
  const total = plan.price - discount;

  if (!hydrated) {
    return <div aria-label="Loading checkout" className="min-h-72 animate-pulse border border-white/10 bg-[#161418]" />;
  }

  if (!isAuthenticated) {
    const returnTo = `/checkout?plan=${plan.id}`;
    return (
      <section className="border border-[#D8794A]/35 bg-[#161418] p-6 sm:p-8" aria-labelledby="checkout-account-heading">
        <div className="grid size-14 place-items-center border border-[#D8794A]/35 bg-[#D8794A]/7 text-[#D8794A]">
          <ShieldCheck aria-hidden="true" size={27} strokeWidth={1.6} />
        </div>
        <h2 className="mt-7 max-w-xl font-display text-3xl font-bold leading-tight" id="checkout-account-heading">Sign in before the demo payment.</h2>
        <p className="mt-5 max-w-2xl leading-7 text-[#C7C5CC]">The selected course is attached to a student account after an approved test payment. You will return to this exact checkout.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary justify-center" href={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in to continue <ArrowRight aria-hidden="true" size={17} /></Link>
          <Link className="button-outline justify-center" href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}>Create a student account</Link>
        </div>
      </section>
    );
  }

  if (isEducator) {
    return (
      <section className="border border-[#3DE08A]/35 bg-[#161418] p-6 sm:p-8" aria-labelledby="educator-access-heading">
        <div className="grid size-14 place-items-center border border-[#3DE08A]/35 bg-[#3DE08A]/7 text-[#3DE08A]">
          <GraduationCap aria-hidden="true" size={27} strokeWidth={1.6} />
        </div>
        <p className="mt-7 text-sm font-semibold text-[#3DE08A]">Educator access included</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight" id="educator-access-heading">
          No purchase is required for the educator demo.
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-[#C7C5CC]">
          Your verification is still under review, but this demo educator account can open every live simulation while the production verification service is being built.
        </p>
        <Link className="button-primary mt-8" href="/simulations">
          Open the simulation lab <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </section>
    );
  }

  function updateField(name: FieldName, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function applyCoupon() {
    const normalized = couponInput.trim().toUpperCase();
    if (normalized === DEMO_COUPON) {
      setCouponApplied(true);
      setCouponMessage({ tone: "success", text: "Demo coupon applied: 10% off this simulated total." });
      return;
    }

    setCouponApplied(false);
    setCouponMessage({ tone: "error", text: normalized ? `Demo code not recognised. Try ${DEMO_COUPON}.` : "Enter a demo coupon code." });
  }

  function validate() {
    const nextErrors: FormErrors = {};
    const cardDigits = fields.cardNumber.replace(/\D/g, "");

    if (fields.studentName.trim().length < 2) nextErrors.studentName = "Enter the student's name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (cardDigits.length !== 16) nextErrors.cardNumber = "Use any 16-digit demo card number.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry)) nextErrors.expiry = "Use MM/YY format.";
    if (!/^\d{3,4}$/.test(fields.cvv)) nextErrors.cvv = "Use 3 or 4 demo digits.";
    if (fields.city.trim().length < 2) nextErrors.city = "Enter a billing city for the demo.";
    if (!accepted) nextErrors.terms = "Confirm that this is a simulated checkout.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function fillTestCard(outcome: "success" | "failure") {
    setFields((current) => ({
      ...current,
      cardNumber: outcome === "success" ? SUCCESS_CARD : FAILURE_CARD,
      expiry: "12/30",
      cvv: "123",
    }));
    setErrors((current) => ({ ...current, cardNumber: undefined, expiry: undefined, cvv: undefined }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    const cardDigits = fields.cardNumber.replace(/\D/g, "");
    if (cardDigits === FAILURE_CARD.replace(/\D/g, "")) {
      const query = new URLSearchParams({ plan: plan.id, reason: "card-declined" });
      if (couponApplied) query.set("coupon", DEMO_COUPON);
      router.push(`/checkout/failed?${query.toString()}`);
      return;
    }

    activatePlan(plan.id);
    const receipt = `DEMO-${Date.now().toString(36).toUpperCase()}`;
    const query = new URLSearchParams({ plan: plan.id, receipt });
    if (couponApplied) query.set("coupon", DEMO_COUPON);
    router.push(`/checkout/success?${query.toString()}`);
  }

  return (
    <form className="grid gap-8" noValidate onSubmit={submit}>
      <section aria-labelledby="student-details-heading" className="border border-[#FF5A1F]/25 bg-[#161418] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5 border-b border-white/8 pb-6">
          <div>
            <p className="kicker">01 - Student details</p>
            <h2 className="mt-3 font-display text-2xl font-bold" id="student-details-heading">Who is this plan for?</h2>
          </div>
          <Badge tone="cyan">Demo</Badge>
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <Input
            autoComplete="off"
            error={errors.studentName}
            label="Student name"
            name="studentName"
            onChange={(event) => updateField("studentName", event.target.value)}
            placeholder="Aarav Sharma"
            value={fields.studentName}
          />
          <Input
            autoComplete="off"
            error={errors.email}
            label="Email address"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="student@example.com"
            type="email"
            value={fields.email}
          />
        </div>
      </section>

      <section aria-labelledby="payment-heading" className="border border-[#FF5A1F]/25 bg-[#161418] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5 border-b border-white/8 pb-6">
          <div>
            <p className="kicker">02 - Simulated payment</p>
            <h2 className="mt-3 font-display text-2xl font-bold" id="payment-heading">Use invented details only.</h2>
          </div>
          <CreditCard aria-hidden="true" className="text-[#FF8A3D]" size={27} strokeWidth={1.6} />
        </div>

        <div className="mt-6 border-l-2 border-[#F6C344] bg-[#F6C344]/7 p-4 text-sm leading-6 text-[#DAD8DE]">
          No values in this section are transmitted, charged, tokenised, or stored. Do not enter a real card number, CVV, or billing identity.
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            className="min-h-12 border border-[#3DE08A]/30 bg-[#3DE08A]/5 px-4 text-left text-sm font-semibold text-[#DAD8DE] transition-colors hover:border-[#3DE08A]/65 hover:text-white"
            onClick={() => fillTestCard("success")}
            type="button"
          >
            Use approval test card
            <span className="mt-1 block font-mono text-xs font-normal text-[#3DE08A]">4242 4242 4242 4242</span>
          </button>
          <button
            className="min-h-12 border border-[#E0483C]/30 bg-[#E0483C]/5 px-4 text-left text-sm font-semibold text-[#DAD8DE] transition-colors hover:border-[#E0483C]/65 hover:text-white"
            onClick={() => fillTestCard("failure")}
            type="button"
          >
            Use decline test card
            <span className="mt-1 block font-mono text-xs font-normal text-[#E88279]">4000 0000 0000 0002</span>
          </button>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <Input
            autoComplete="off"
            containerClassName="sm:col-span-2"
            error={errors.cardNumber}
            inputMode="numeric"
            label="Demo card number"
            maxLength={19}
            name="cardNumber"
            onChange={(event) => updateField("cardNumber", formatCardNumber(event.target.value))}
            placeholder="4242 4242 4242 4242"
            value={fields.cardNumber}
          />
          <Input
            autoComplete="off"
            error={errors.expiry}
            inputMode="numeric"
            label="Demo expiry"
            maxLength={5}
            name="expiry"
            onChange={(event) => updateField("expiry", formatExpiry(event.target.value))}
            placeholder="12/30"
            value={fields.expiry}
          />
          <Input
            autoComplete="off"
            error={errors.cvv}
            inputMode="numeric"
            label="Demo CVV"
            maxLength={4}
            name="cvv"
            onChange={(event) => updateField("cvv", event.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="123"
            value={fields.cvv}
          />
          <Input
            autoComplete="off"
            containerClassName="sm:col-span-2"
            error={errors.city}
            label="Demo billing city"
            name="city"
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Pune"
            value={fields.city}
          />
        </div>
      </section>

      <section aria-labelledby="coupon-heading" className="border border-[#FF5A1F]/25 bg-[#161418] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Tag aria-hidden="true" className="text-[#FF8A3D]" size={21} strokeWidth={1.6} />
          <h2 className="font-display text-xl font-bold" id="coupon-heading">Demo coupon</h2>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            containerClassName="flex-1"
            label="Coupon code"
            name="coupon"
            onChange={(event) => {
              setCouponInput(event.target.value.toUpperCase());
              setCouponApplied(false);
              setCouponMessage(null);
            }}
            placeholder={DEMO_COUPON}
            value={couponInput}
          />
          <Button onClick={applyCoupon} type="button" variant="secondary">Apply code</Button>
        </div>
        {couponMessage ? (
          <p aria-live="polite" className={`mt-4 text-sm ${couponMessage.tone === "success" ? "text-[#3DE08A]" : "text-[#E0483C]"}`}>
            {couponMessage.text}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="summary-heading" className="border border-[#FF5A1F]/40 bg-[#0E0D10] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-6">
          <div>
            <p className="kicker">03 - Order simulation</p>
            <h2 className="mt-3 font-display text-2xl font-bold" id="summary-heading">{plan.name} annual plan</h2>
          </div>
          <ShieldCheck aria-hidden="true" className="text-[#3DE08A]" size={28} strokeWidth={1.6} />
        </div>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between gap-6 text-[#C7C5CC]"><dt>Annual plan</dt><dd className="font-mono">{formatPrice.format(plan.price)}</dd></div>
          {couponApplied ? <div className="flex justify-between gap-6 text-[#3DE08A]"><dt>{DEMO_COUPON} discount</dt><dd className="font-mono">-{formatPrice.format(discount)}</dd></div> : null}
          <div className="flex justify-between gap-6 border-t border-white/8 pt-5 text-lg font-bold"><dt>Simulated total</dt><dd className="font-mono text-[#FF8A3D]">{formatPrice.format(total)}</dd></div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-[#C7C5CC]/70">Inclusive of all taxes. No money will move and no subscription will be created.</p>

        <label className="mt-7 flex min-h-11 items-start gap-3 text-sm leading-6 text-[#C7C5CC]">
          <input
            checked={accepted}
            className="mt-1 size-5 accent-[#FF5A1F]"
            onChange={(event) => {
              setAccepted(event.target.checked);
              setErrors((current) => ({ ...current, terms: undefined }));
            }}
            type="checkbox"
          />
          <span>I understand this is a front-end simulation, no real payment will be processed, and successful test payments only unlock demo access in this browser.</span>
        </label>
        {errors.terms ? <p className="mt-2 text-sm text-[#E0483C]">{errors.terms}</p> : null}

        <Button className="mt-7" fullWidth isLoading={processing} loadingLabel="Opening demo receipt..." type="submit">
          <Check aria-hidden="true" size={17} strokeWidth={1.8} /> Complete demo checkout
        </Button>
      </section>
    </form>
  );
}
