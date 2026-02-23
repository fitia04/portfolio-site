"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { type BonPlan, countryFlag } from "../lib/bons-plans";

interface BonPlanCardProps {
  deal: BonPlan;
  index: number;
  inView: boolean;
}

export default function BonPlanCard({ deal, index, inView }: BonPlanCardProps) {
  return (
    <motion.a
      href={deal.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-accent)] hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={deal.image}
          alt={deal.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {deal.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-[var(--color-text-light)] mb-1">
          {countryFlag(deal.countryCode)} {deal.country}
        </p>
        <h3
          className="text-lg font-bold text-[var(--color-text)] mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {deal.title}
        </h3>
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed flex-1">
          {deal.description}
        </p>

        {/* Prix + CTA */}
        <div className="mt-5 pt-4 border-t border-[var(--color-bg-dark)] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[var(--color-text)]">
              {deal.price} €
            </span>
            <span className="text-sm text-[var(--color-text-light)] line-through">
              {deal.originalPrice} €
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] group-hover:gap-2.5 transition-all duration-200">
            Voir <ExternalLink size={13} />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
