import type { Metadata } from "next";
import { SimulationGallery } from "@/components/platform/simulation-gallery";
export const metadata: Metadata = { title: "Simulation lab" };
export default function SimulationsPage(){return <SimulationGallery/>;}
