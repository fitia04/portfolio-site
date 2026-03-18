"use client";

import { useState } from "react";
import MediaKitHero from "./components/MediaKitHero";
import StatsOverview from "./components/StatsOverview";
import AudienceSection from "./components/AudienceSection";
import CollabHistory from "./components/CollabHistory";
import ServicesGrid from "./components/ServicesGrid";

export default function MediaKitClient() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <MediaKitHero onDownloadClick={handleDownloadClick} />
      <StatsOverview />
      <AudienceSection />
      <CollabHistory />
      <ServicesGrid />
    </main>
  );
}
