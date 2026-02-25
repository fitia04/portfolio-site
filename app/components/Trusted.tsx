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

const track = [...logos, ...logos];

export default function Trusted() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-28 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
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
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            {track.map((logo, i) => (
              <div key={i} className="flex-none flex items-center justify-center w-40 h-16">
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
      </motion.div>
    </section>
  );
}
