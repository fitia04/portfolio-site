"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { type BonPlan, FALLBACK_DEALS } from "../lib/bons-plans";
import BonPlanCard from "./BonPlanCard";

export default function BonsPlansPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [deals, setDeals] = useState<BonPlan[]>(FALLBACK_DEALS.slice(0, 3));

  useEffect(() => {
    fetch("/api/bons-plans")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDeals(data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} id="bons-plans" className="py-24 md:py-28 px-6 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold">
            Sélection du moment
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bons plans voyages
          </h2>
          <p className="text-[var(--color-text-light)] mt-4 max-w-xl">
            Mes coups de cœur du moment — des destinations accessibles depuis la France, sélectionnées pour leur rapport qualité-prix.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <BonPlanCard key={deal.destination} deal={deal} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="/bons-plans"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:gap-3 transition-all duration-200"
          >
            Découvrir toutes les destinations <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
