"use client";

import { useState } from "react";
import MediaKitHero from "./components/MediaKitHero";
import StatsOverview from "./components/StatsOverview";
import AudienceSection from "./components/AudienceSection";
import CollabHistory from "./components/CollabHistory";
import ServicesGrid from "./components/ServicesGrid";
import DownloadCTA from "./components/DownloadCTA";

export default function MediaKitClient() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <MediaKitHero onDownloadClick={() => setShowDownloadModal(true)} />
      <StatsOverview />
      <AudienceSection />
      <CollabHistory />
      <ServicesGrid />
      <DownloadCTA
        showModal={showDownloadModal}
        onOpenModal={() => setShowDownloadModal(true)}
        onCloseModal={() => setShowDownloadModal(false)}
      />
    </main>
  );
}
