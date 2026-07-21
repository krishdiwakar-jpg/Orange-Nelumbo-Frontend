import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Check, FlaskConical, Network } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { courseProducts } from "@/data/course-products";
import { plans } from "@/data/platform";

export const metadata: Metadata = {
  title: "JEE visual learning courses",
  description: "Compare Orange Nelumbo's three visual JEE learning options and open a complete product description for each course.",
};

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const icons = { notes: BookOpenCheck, simulations: FlaskConical, complete: Network } as const;

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.12fr_.88fr] lg:items-end lg:px-14 lg:py-24">
            <div>
              <h1 className="max-w-4xl font-display text-5xl font-bold leading-[.98] tracking-[-.035em] sm:text-6xl">
                Choose how deeply you want to see the idea.
              </h1>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#C7C5CC]">
              Three annual options, built around the same focused promise: visual notes first, simulations where interaction matters, and no unnecessary adaptive-engine claims.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {courseProducts.map((course) => {
              const plan = plans.find((item) => item.id === course.planId);
              const Icon = icons[course.planId];
              if (!plan) return null;

              return (
                <article className={`relative flex min-h-[640px] flex-col overflow-hidden border bg-[#161418] p-7 sm:p-9 ${plan.highlighted ? "border-[#D8794A]/80" : "border-white/10"}`} key={course.slug}>
                  <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: course.accent }} />
                  {plan.highlighted ? <span className="absolute right-0 top-0 bg-[#D8794A] px-4 py-2 text-xs font-bold text-[#0E0D10]">Most visual</span> : null}
                  <Icon aria-hidden="true" className="mt-2" size={29} strokeWidth={1.5} style={{ color: course.accent }} />
                  <h2 className="mt-8 font-display text-3xl font-bold">{course.name}</h2>
                  <p className="mt-4 min-h-20 text-lg leading-7 text-[#DAD8DE]">{course.promise}</p>
                  <p className="mt-6"><span className="font-display text-4xl font-bold">{formatPrice.format(plan.price)}</span><span className="ml-2 text-sm text-[#C7C5CC]">/ year</span></p>
                  <ul className="mt-8 space-y-4 border-t border-white/8 pt-7">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li className="flex gap-3 text-sm leading-6 text-[#C7C5CC]" key={feature}><Check className="mt-1 shrink-0 text-[#6FAF8B]" size={16} />{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-auto grid gap-3 pt-10">
                    <Link className={plan.highlighted ? "button-primary justify-center" : "button-outline justify-center"} href={`/courses/${course.slug}`}>
                      View course details <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                    <Link className="button-ghost justify-center" href={`/checkout?plan=${plan.id}`}>Choose this course</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:px-14">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Not sure which course fits?</h2>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl leading-7 text-[#C7C5CC]">Start with the free simulations and sample notes. You can decide after seeing how the visual learning format feels.</p>
              <Link className="button-outline shrink-0 justify-center" href="/free-simulations">Try the free lab <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
