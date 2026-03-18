"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const MapPreviewMap = dynamic(() => import("./MapPreviewMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#EDE8E0] flex items-center justify-center">
      <div className="animate-pulse text-[#5C6B5C]">Chargement de la carte...</div>
    </div>
  ),
});

export default function MapPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 bg-[#EDE8E0]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-[#4A7C59] text-sm tracking-widest uppercase font-semibold">
            Carte des découvertes
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1E2D24] mt-3 mb-5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Explorer mes coups de cœur
          </h2>
          <p className="text-[#5C6B5C] max-w-xl mx-auto">
            De Toulouse au bout du monde, retrouvez les spots qui m&apos;ont fait vibrer.
          </p>
        </motion.div>

        {/* Map container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px] max-w-5xl mx-auto relative"
        >
          <MapPreviewMap />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/decouvertes"
            className="inline-flex items-center gap-2 bg-[#4A7C59] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#3A6147] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-8"
          >
            Explorer toutes mes découvertes
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
