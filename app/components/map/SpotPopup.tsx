"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Spot, SpotCategory } from "@/app/types/spot";

function getCategoryColor(category: SpotCategory): string {
  switch (category) {
    case "food": return "#4A7C59";
    case "voyage": return "#B5976B";
    case "food-voyage": return "#4A7C59";
  }
}

const CATEGORY_LABELS: Record<SpotCategory, string> = {
  food: "Food",
  voyage: "Voyage",
  "food-voyage": "Food & Voyage",
};

interface SpotPopupProps {
  spot: Spot;
  onClose: () => void;
}

export default function SpotPopup({ spot, onClose }: SpotPopupProps) {
  const isGradient = spot.category === "food-voyage";
  const color = getCategoryColor(spot.category);

  const imageBackground = isGradient
    ? "linear-gradient(135deg, #4A7C59, #B5976B)"
    : color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white rounded-2xl shadow-lg max-w-xs w-full overflow-hidden"
    >
      {/* Image area */}
      <div
        className="h-32 relative flex items-center justify-center"
        style={{ background: imageBackground }}
      >
        <span className="text-4xl">{spot.emoji}</span>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X size={14} className="text-[#1E2D24]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <span
          className="inline-block text-xs font-medium px-2 py-0.5 rounded-full text-white mb-2"
          style={{ backgroundColor: color }}
        >
          {CATEGORY_LABELS[spot.category]}
        </span>

        {/* Name */}
        <h3
          className="text-base font-bold text-[#1E2D24] leading-tight mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {spot.name}
        </h3>

        {/* City / Country */}
        <p className="text-xs text-[#B5976B] mb-2">
          {spot.city}, {spot.country}
        </p>

        {/* Short description */}
        <p className="text-sm text-[#5C6B5C] leading-snug">
          {spot.shortDescription}
        </p>
      </div>
    </motion.div>
  );
}
