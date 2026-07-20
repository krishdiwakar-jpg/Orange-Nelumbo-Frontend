import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { platform } from "@/data/platform";

export const metadata: Metadata = {
  title: "Terms",
  description: "Demonstration terms for the Orange Nelumbo JEE preparation preview.",
};

const sections = [
  {
    title: "1. Demonstration status",
    paragraphs: [
      "Orange Nelumbo currently provides a front-end demonstration of a JEE preparation platform. Features, availability, plans, prices, policies, dates, ranks, and results shown in the preview are sample product content unless a live service explicitly states otherwise.",
      "The demo sign-in flow does not create a production account. Demo checkout does not charge a card, create a subscription, or reserve access.",
    ],
  },
  {
    title: "2. Educational purpose and no guarantees",
    paragraphs: [
      "Lessons, simulations, practice, mocks, planners, and analytics are educational tools. They do not replace official examination notices, school instruction, professional counselling, or a student's own judgement.",
      "Projected AIR is always a model estimate, not a prediction. Orange Nelumbo does not promise or guarantee a rank, score, percentile, admission, selection, or other examination outcome. Student stories and displayed results are illustrative, not typical or guaranteed.",
    ],
  },
  {
    title: "3. Official exam information",
    paragraphs: [
      "Students must verify dates, eligibility, syllabi, application rules, admit-card instructions, marking schemes, and other requirements through the official examination authorities. If product content conflicts with an official notice, the official notice controls.",
      "Do not use NTA, JEE, IIT, or institutional names, logos, or marks in a way that implies endorsement, partnership, or sponsorship.",
    ],
  },
  {
    title: "4. Acceptable use",
    paragraphs: [
      "Use the preview for personal evaluation and lawful educational purposes. Do not attempt to disrupt the service, bypass access controls, scrape at harmful scale, introduce malicious code, impersonate another person, or use the product to cheat in a live examination.",
      "Do not copy, republish, sell, or systematically extract lessons, questions, simulations, visual assets, or software except where written permission or applicable law allows it.",
    ],
  },
  {
    title: "5. Plans, prices, refunds, and payments",
    paragraphs: [
      "Prices shown in this preview are annual and described as inclusive of taxes, but no live purchase occurs. A future paid service must show the final price, included features, tax treatment, renewal terms, cancellation process, and applicable refund policy before payment.",
      "The demonstration policy references a seven-day refund window. That sample statement is not a live purchase entitlement until incorporated into final checkout terms for a production service.",
    ],
  },
  {
    title: "6. Availability and changes",
    paragraphs: [
      "Preview features may change, reset, or become unavailable without notice. Browser-local progress can disappear when site data is cleared, a different device is used, or the implementation changes.",
      "We may update these terms as the product develops. A production launch should present the applicable version and effective date before account creation or payment.",
    ],
  },
  {
    title: "7. Responsibility and limitation",
    paragraphs: [
      "Use of the preview is at your discretion. To the extent permitted by applicable law, Orange Nelumbo is not responsible for decisions made solely from demo analytics, projected ranks, sample schedules, or incomplete preview content.",
      "Nothing in these terms excludes a right or responsibility that cannot legally be excluded. Final production terms should be reviewed for the locations, users, payments, and services actually offered.",
    ],
  },
  {
    title: "8. Contact",
    paragraphs: [
      `Questions about these demonstration terms can be directed to ${platform.supportEmail}. The address is reference copy in this front-end build and may not yet route to a live support team.`,
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-24">
            <p className="kicker">Legal - Terms</p>
            <h1 className="mt-7 font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">Terms for the preview.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#C7C5CC]">Effective 18 July 2026. These terms explain the current front-end demonstration and do not describe a live paid service.</p>
          </div>
        </section>

        <article className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="border-l-2 border-[#E0483C] bg-[#161418] p-6 sm:p-8">
            <p className="kicker">No outcome guarantee</p>
            <p className="mt-4 leading-7 text-[#C7C5CC]">No rank, score, selection, or admission is promised. Projected AIR is a model estimate, not a prediction.</p>
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

          <div className="mt-12 border border-[#FF5A1F]/30 bg-[#161418] p-6 sm:p-8">
            <p className="kicker">Required marks disclaimer</p>
            <p className="mt-4 max-w-[78ch] leading-7 text-[#C7C5CC]">{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3"><Link className="button-outline" href="/contact">Terms question</Link><Link className="button-ghost" href="/privacy">Read privacy notice</Link></div>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
