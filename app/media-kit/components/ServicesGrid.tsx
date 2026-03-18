"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { services } from "../data";

export default function ServicesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold">
            Prestations
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Formats proposés
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-3xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-4xl mb-4 block">{service.emoji}</span>
              <h3
                className="text-lg font-bold text-[var(--color-text)] mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {service.title}
              </h3>
              <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
