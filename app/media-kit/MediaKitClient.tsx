"use client";

import { useState } from "react";
import MediaKitHero from "./components/MediaKitHero";
import StatsOverview from "./components/StatsOverview";

export default function MediaKitClient() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <MediaKitHero onDownloadClick={handleDownloadClick} />
      <StatsOverview />
    </main>
  );
}
