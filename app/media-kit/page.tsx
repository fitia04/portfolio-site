import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MediaKitClient from "./MediaKitClient";

export const metadata: Metadata = {
  title: "Media Kit — Fitia | Food & Voyages Creator",
  description:
    "Découvrez les statistiques, l'audience et les services de Fitia. Téléchargez le media kit PDF pour collaborer ensemble.",
  openGraph: {
    title: "Media Kit — Fitia",
    description: "Statistiques, audience et services de Fitia — Food & Voyages Creator basée à Toulouse.",
    type: "website",
  },
};

export default function MediaKitPage() {
  return (
    <>
      <Navbar />
      <MediaKitClient />
      <Footer />
    </>
  );
}
