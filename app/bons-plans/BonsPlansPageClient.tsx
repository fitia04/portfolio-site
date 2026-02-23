"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { type BonPlan } from "../lib/bons-plans";
import BonPlanCard from "../components/BonPlanCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = ["Tous", "Vol + Hôtel", "Vol seul"];

export default function BonsPlansPageClient({ deals }: { deals: BonPlan[] }) {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const filteredDeals =
    activeCategory === "Tous"
      ? deals
      : deals.filter((d) => d.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6 bg-[var(--color-bg)] min-h-screen">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Back link */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors mb-10"
          >
            <ArrowLeft size={16} /> Retour à l&apos;accueil
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <span className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold">
              Toutes les destinations
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bons plans voyages
            </h1>
            <p className="text-[var(--color-text-light)] mt-4 max-w-2xl">
              Des destinations accessibles depuis la France, mises à jour
              automatiquement pour vous proposer les meilleurs rapports
              qualité-prix du moment.
            </p>
          </motion.div>

          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3 mb-10"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-[var(--color-accent)] text-[var(--color-text-light)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal, i) => (
              <BonPlanCard
                key={deal.destination}
                deal={deal}
                index={i}
                inView={inView}
              />
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <p className="text-center text-[var(--color-text-light)] py-12">
              Aucun bon plan dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
