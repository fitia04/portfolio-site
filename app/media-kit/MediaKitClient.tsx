"use client";

import { useState } from "react";
import MediaKitHero from "./components/MediaKitHero";

export default function MediaKitClient() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <MediaKitHero onDownloadClick={handleDownloadClick} />
    </main>
  );
}
