import type { Metadata } from "next";
import { spots } from "../data/spots";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Découvertes — Fitia Travel",
  description:
    "Explorez tous les spots food & voyages visités par Fitia. Carte interactive des meilleures adresses et destinations à travers le monde.",
};

export default function DecouvertesPage() {
  return <MapPageClient spots={spots} />;
}
