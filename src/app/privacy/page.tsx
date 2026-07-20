import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { platform } from "@/data/platform";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Orange Nelumbo front-end demonstration.",
};

const sections = [
  {
    title: "1. Scope of this preview",
    paragraphs: [
      "This page describes the current Orange Nelumbo front-end demonstration. The preview does not have an application backend, production account service, payment processor, support inbox, or server-side academic profile.",
      "Do not enter payment information, passwords used elsewhere, government identifiers, medical information, or other sensitive personal data into demo forms.",
    ],
  },
  {
    title: "2. Information shown or entered",
    paragraphs: [
      "The product includes a fictional student profile, sample progress, sample ranks, and illustrative study history. These records are demonstration data and are not linked to a real learner.",
      "Text entered into sign-in, onboarding, checkout, and contact screens is used only to drive the visible front-end interaction. No submission is sent to Orange Nelumbo by this demo.",
    ],
  },
  {
    title: "3. Browser-local storage",
    paragraphs: [
      "The preview may use browser storage to remember demonstration choices, progress, or interface preferences on the current device. Browser-local information can be cleared through the product controls where provided or through the browser's site-data settings.",
      "Clearing browser data, changing devices, or using a private-browsing session may reset the preview. There is no cross-device synchronisation in the current build.",
    ],
  },
  {
    title: "4. Cookies, analytics, and third parties",
    paragraphs: [
      "The current preview is not designed to set advertising cookies or send product analytics to a backend. Hosting infrastructure may still process routine technical request data such as an IP address, device information, timestamps, and error logs to deliver and protect the site.",
      "If a future release adds analytics, payments, account services, email delivery, or other processors, this notice should be updated before those services are enabled.",
    ],
  },
  {
    title: "5. Students and minors",
    paragraphs: [
      "JEE aspirants may be under 18. A production account and consent flow must be designed for applicable Indian data-protection, advertising, and parental-consent requirements. This preview does not request a child's real academic or identity data.",
      "Parents and guardians should review any future live account, subscription, and privacy terms with a minor before registration or purchase.",
    ],
  },
  {
    title: "6. Security and retention",
    paragraphs: [
      "Because the current product is front-end driven, no demo form data is intentionally retained by an Orange Nelumbo application server. Browser-local values remain on the device until the product or browser clears them.",
      "No internet service can promise absolute security. A production release should use access controls, encryption, least-privilege processing, retention limits, and a tested incident-response process.",
    ],
  },
  {
    title: "7. Your choices and questions",
    paragraphs: [
      `You can stop using the preview and clear its browser data at any time. Privacy questions can be directed to ${platform.supportEmail}; the address is reference copy in this front-end build and may not yet route to a live support team.`,
      "We may revise this notice as the product moves from demonstration to a live service. Material changes should be dated and shown before new data practices begin.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-24">
            <p className="kicker">Legal - Privacy</p>
            <h1 className="mt-7 font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">Privacy, stated precisely.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#C7C5CC]">Effective 18 July 2026. This notice is written for the current front-end demonstration, not a production data service.</p>
          </div>
        </section>

        <article className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="border-l-2 border-[#FF5A1F] bg-[#161418] p-6 sm:p-8">
            <p className="kicker">Important status</p>
            <p className="mt-4 leading-7 text-[#C7C5CC]">No backend is connected. Do not treat this preview as a secure channel for personal, payment, or academic information.</p>
          </div>
          <div className="mt-12 divide-y divide-[#FF5A1F]/20 border-y border-[#FF5A1F]/20">
            {sections.map((section) => (
              <section className="py-8 sm:py-10" key={section.title}>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">{section.title}</h2>
                <div className="mt-5 max-w-[75ch] space-y-4 text-[15px] leading-7 text-[#C7C5CC]">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3"><Link className="button-outline" href="/contact">Privacy question</Link><Link className="button-ghost" href="/terms">Read terms</Link></div>
        </article>

        <section className="mx-auto max-w-[1100px] space-y-3 border-t border-white/8 px-5 py-10 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8">
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
