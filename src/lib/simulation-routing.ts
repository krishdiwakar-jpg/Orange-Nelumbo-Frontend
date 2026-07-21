import { simulations } from "@/data/platform";

export function simulationPath(idOrSlug: string) {
  const simulation = simulations.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
  return `/simulations/${simulation?.slug ?? idOrSlug.replace(/^sim-/, "")}`;
}

export function simulationForId(id: string) {
  return simulations.find((item) => item.id === id);
}
