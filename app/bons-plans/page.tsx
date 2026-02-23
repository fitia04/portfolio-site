import { fetchBonsPlans } from "../lib/amadeus";
import BonsPlansPageClient from "./BonsPlansPageClient";

export const revalidate = 21600; // 6h

export const metadata = {
  title: "Bons Plans Voyages — Fitia Travel",
  description:
    "Les meilleures offres vol + hôtel depuis la France, sélectionnées pour leur rapport qualité-prix.",
};

export default async function BonsPlansPage() {
  const deals = await fetchBonsPlans("CDG");

  return <BonsPlansPageClient deals={deals} />;
}
