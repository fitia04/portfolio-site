"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { partnerLogos } from "../data";

export default function CollabHistory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold">
            Références
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ils m&apos;ont fait confiance
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {partnerLogos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="flex items-center justify-center h-20 px-4 bg-[var(--color-bg)] rounded-2xl"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-full max-w-full object-contain"
                style={"invert" in logo && logo.invert ? { filter: "brightness(0)" } : undefined}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
