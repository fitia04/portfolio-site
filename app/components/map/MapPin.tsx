"use client";

import { motion } from "framer-motion";
import { Spot, SpotCategory } from "@/app/types/spot";

function getCategoryColor(category: SpotCategory): string {
  switch (category) {
    case "food": return "#4A7C59";
    case "voyage": return "#B5976B";
    case "food-voyage": return "#4A7C59";
  }
}

interface MapPinProps {
  spot: Spot;
  onClick: () => void;
  isActive: boolean;
  delay?: number;
}

export default function MapPin({ spot, onClick, isActive, delay = 0 }: MapPinProps) {
  const isGradient = spot.category === "food-voyage";
  const color = getCategoryColor(spot.category);

  const background = isGradient
    ? "linear-gradient(135deg, #4A7C59, #B5976B)"
    : color;

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 8, stiffness: 200, delay }}
      whileHover={{ scale: isActive ? 1.1 : 1.15 }}
      className={`
        flex items-center justify-center rounded-full cursor-pointer select-none
        ${isActive
          ? "w-10 h-10 ring-2 ring-white shadow-lg"
          : "w-8 h-8"
        }
      `}
      style={{ background }}
      aria-label={spot.name}
    >
      <span className="text-base leading-none">{spot.emoji}</span>
    </motion.button>
  );
}
