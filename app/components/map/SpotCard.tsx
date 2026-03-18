"use client";

import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
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

interface SpotCardProps {
  spot: Spot;
  onClick: () => void;
  isActive: boolean;
}

export default function SpotCard({ spot, onClick, isActive }: SpotCardProps) {
  const isGradient = spot.category === "food-voyage";
  const color = getCategoryColor(spot.category);

  const imageBackground = isGradient
    ? "linear-gradient(135deg, #4A7C59, #B5976B)"
    : color;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`
        w-full text-left bg-white rounded-2xl overflow-hidden cursor-pointer
        transition-shadow duration-200
        hover:shadow-lg
        ${isActive ? "ring-2 ring-[#4A7C59] bg-[#4A7C59]/5" : ""}
      `}
    >
      {/* Image area */}
      <div
        className="h-32 relative flex items-center justify-center"
        style={{ background: imageBackground }}
      >
        <span className="text-4xl">{spot.emoji}</span>

        {/* Category badge */}
        <span
          className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {CATEGORY_LABELS[spot.category]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3
          className="text-lg font-bold text-[#1E2D24] leading-tight mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {spot.name}
        </h3>

        {/* City / Country */}
        <p className="flex items-center gap-1 text-xs text-[#B5976B] mb-2">
          <MapPin size={11} />
          {spot.city}, {spot.country}
        </p>

        {/* Short description */}
        <p className="text-sm text-[#5C6B5C] leading-snug mb-2">
          {spot.shortDescription}
        </p>

        {/* Rating stars */}
        {spot.rating !== undefined && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.round(spot.rating!) ? "fill-[#B5976B] text-[#B5976B]" : "text-[#DDD5C0]"}
              />
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}
