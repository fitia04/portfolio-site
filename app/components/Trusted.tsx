"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const logos = [
  { name: "La Friche Gourmande", src: "/images/logos/la-friche-gourmande.png" },
  { name: "Herea Boutique", src: "/images/logos/herea-boutique.jpeg" },
  { name: "NALA STUDIO", src: "/images/logos/nala-studio.svg" },
  { name: "La Grande Pizzeria", src: "/images/logos/la-grande-pizzeria.png" },
  { name: "Le Mékong", src: "/images/logos/le-mekong.png" },
  { name: "YASSA BAR", src: "/images/logos/yassa-bar.svg", invert: true },
  { name: "YUJO Ramen", src: "/images/logos/yujo-ramen.svg" },
  { name: "Nachos", src: "/images/logos/nachos.webp" },
];

export default function Trusted() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1E2D24]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ils m&apos;ont fait confiance
          </h2>
        </motion.div>

        {/* Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
        >
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center justify-center w-40 h-16">
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-full max-w-full object-contain"
                style={"invert" in logo && logo.invert ? { filter: "brightness(0)" } : undefined}
              />
            </div>
          ))}
        </motion.div>


      </div>
    </section>
  );
}
