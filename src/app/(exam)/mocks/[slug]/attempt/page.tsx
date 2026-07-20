import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MockAttempt } from "@/components/platform/mock-attempt";
import { mockTests } from "@/data/platform";

export const metadata: Metadata = { title: "Mock attempt" };
type Props = { params: Promise<{ slug: string }> };

export default async function MockAttemptPage({ params }: Props) { const { slug } = await params; const mock = mockTests.find((item)=>item.slug===slug); if (!mock || mock.status === "upcoming") notFound(); return <MockAttempt mock={mock}/>; }
