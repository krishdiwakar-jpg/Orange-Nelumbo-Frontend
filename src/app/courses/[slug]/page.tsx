import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, GraduationCap, ShieldCheck } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { courseProducts, getCourseProduct } from "@/data/course-products";
import { plans } from "@/data/platform";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return courseProducts.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseProduct(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.name,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = getCourseProduct(slug);
  if (!course) notFound();
  const plan = plans.find((item) => item.id === course.planId);
  if (!plan) notFound();
  const otherCourses = courseProducts.filter((item) => item.slug !== course.slug);

  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
            <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC] hover:text-white" href="/courses">
              <ArrowLeft aria-hidden="true" size={16} /> All courses
            </Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold" style={{ color: course.accent }}>{plan.eyebrow}</p>
                <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[.98] tracking-[-.035em] sm:text-6xl">{course.name}</h1>
                <p className="mt-6 max-w-3xl text-xl leading-8 text-[#DAD8DE]">{course.promise}</p>
              </div>
              <div className="border-l border-white/12 pl-6 sm:pl-8">
                <p><span className="font-display text-5xl font-bold">{formatPrice.format(plan.price)}</span><span className="ml-2 text-sm text-[#C7C5CC]">/ year</span></p>
                <p className="mt-4 leading-7 text-[#C7C5CC]">{course.summary}</p>
                <Link className="button-primary mt-7 justify-center" href={`/checkout?plan=${plan.id}`}>Choose {course.name} <ArrowRight aria-hidden="true" size={17} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-4 px-5 py-10 sm:grid-cols-3 sm:px-8 lg:px-14">
          {course.stats.map((stat) => (
            <div className="border border-white/10 bg-[#161418] p-6" key={stat.label}>
              <p className="font-display text-3xl font-bold" style={{ color: course.accent }}>{stat.value}</p>
              <p className="mt-2 text-sm text-[#C7C5CC]">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:px-14 lg:py-24">
          <div>
            <h2 className="font-display text-4xl font-bold">What this course helps you do</h2>
            <p className="mt-6 text-lg leading-8 text-[#C7C5CC]">{course.idealFor}</p>
          </div>
          <div className="border-t border-white/10">
            {course.outcomes.map((outcome, index) => (
              <div className="flex gap-5 border-b border-white/10 py-6" key={outcome}>
                <span className="mt-1 font-mono text-xs" style={{ color: course.accent }}>0{index + 1}</span>
                <p className="text-lg leading-8 text-[#DAD8DE]">{outcome}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
            <h2 className="max-w-3xl font-display text-4xl font-bold">What is included</h2>
            <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
              {course.modules.map((module) => (
                <article className="min-h-52 bg-[#0E0D10] p-7 sm:p-8" key={module.title}>
                  <Check aria-hidden="true" size={20} style={{ color: course.accent }} />
                  <h3 className="mt-8 font-display text-2xl font-bold">{module.title}</h3>
                  <p className="mt-4 leading-7 text-[#C7C5CC]">{module.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.68fr_1.32fr]">
            <div>
              <h2 className="font-display text-4xl font-bold">Subject coverage</h2>
              <p className="mt-5 leading-7 text-[#C7C5CC]">Built for the shared JEE Main and Advanced foundation, with deeper links where the concept demands them.</p>
            </div>
            <div className="grid gap-4">
              {course.coverage.map((item) => (
                <article className="grid gap-3 border border-white/10 bg-[#161418] p-6 sm:grid-cols-[150px_1fr] sm:items-start" key={item.subject}>
                  <h3 className="font-display text-xl font-bold" style={{ color: course.accent }}>{item.subject}</h3>
                  <p className="leading-7 text-[#C7C5CC]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#5F8D83]/25 bg-[#5F8D83]/6">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-14">
            <div className="grid size-14 place-items-center border border-[#6FAF8B]/30 bg-[#6FAF8B]/7 text-[#6FAF8B]"><GraduationCap aria-hidden="true" size={27} /></div>
            <div><h2 className="font-display text-2xl font-bold">Educators do not need to purchase a student course.</h2><p className="mt-2 leading-7 text-[#C7C5CC]">Use the separate educator demo login while verification is under review. Verified educators receive full simulation access.</p></div>
            <Link className="button-outline justify-center" href="/login?role=educator&returnTo=%2Fsimulations">Educator login</Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-14 lg:py-24">
          <div>
            <ShieldCheck aria-hidden="true" className="text-[#6FAF8B]" size={28} />
            <h2 className="mt-7 font-display text-4xl font-bold">Ready to open the visual library?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">The demo gateway lets you preview both approved and declined payment states. It does not process real money.</p>
            <Link className="button-primary mt-8" href={`/checkout?plan=${plan.id}`}>Choose {course.name} <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {otherCourses.map((item) => <Link className="group flex min-h-20 items-center justify-between gap-5 border border-white/10 bg-[#161418] px-5 py-4 hover:border-[#D8794A]/45" href={`/courses/${item.slug}`} key={item.slug}><span><span className="block text-sm text-[#C7C5CC]">Also compare</span><span className="mt-1 block font-display text-lg font-bold">{item.name}</span></span><ArrowRight className="text-[#D8794A] transition group-hover:translate-x-1" size={17} /></Link>)}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
