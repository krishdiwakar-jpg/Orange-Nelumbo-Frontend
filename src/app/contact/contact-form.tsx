"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div aria-live="polite" className="border border-[#3DE08A]/45 bg-[#3DE08A]/6 p-7 sm:p-9" role="status">
        <CheckCircle2 aria-hidden="true" className="text-[#3DE08A]" size={32} strokeWidth={1.6} />
        <h2 className="mt-7 font-display text-3xl font-bold">Demo request captured.</h2>
        <p className="mt-4 max-w-xl leading-7 text-[#C7C5CC]">The form worked, but no message was sent and nothing was stored on a server. This is a front-end-only success state.</p>
        <Button className="mt-7" onClick={() => setSubmitted(false)} variant="secondary">
          <RotateCcw aria-hidden="true" size={16} strokeWidth={1.7} /> Send another demo request
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-6 border border-[#FF5A1F]/28 bg-[#161418] p-6 sm:p-8" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input autoComplete="name" label="Your name" name="name" placeholder="Aarav Sharma" required />
        <Input autoComplete="email" label="Email address" name="email" placeholder="you@example.com" required type="email" />
      </div>
      <label className="ui-field">
        <span className="ui-field__label">What can we help with?</span>
        <select className="ui-input" defaultValue="" name="topic" required>
          <option disabled value="">Choose a topic</option>
          <option value="notes">Visual notes</option>
          <option value="simulations">Simulations</option>
          <option value="videos">Future video lectures</option>
          <option value="access">Sign-in, profile, or settings</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label className="ui-field">
        <span className="ui-field__label">Message</span>
        <textarea className="ui-input min-h-40 resize-y" maxLength={1200} name="message" placeholder="Describe the exact screen, action, or question." required />
        <span className="ui-field__message">Do not enter payment information, passwords, or sensitive academic data.</span>
      </label>
      <label className="flex min-h-11 items-start gap-3 text-sm leading-6 text-[#C7C5CC]">
        <input className="mt-1 size-5 accent-[#FF5A1F]" name="demoAcknowledgement" required type="checkbox" />
        <span>I understand this is a front-end demonstration and no support ticket or email will be created.</span>
      </label>
      <Button className="w-full sm:w-fit" type="submit">Show success state</Button>
    </form>
  );
}
