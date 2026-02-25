"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { MapPin, Utensils, Star, Camera } from "lucide-react";

const badges = [
  { icon: <Utensils size={16} />, label: "Gastronomie" },
  { icon: <MapPin size={16} />, label: "Voyages" },
  { icon: <Camera size={16} />, label: "Photo & Vidéo" },
  { icon: <Star size={16} />, label: "Lifestyle" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-24 md:py-32 px-6 bg-[#F7F4EF]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl">
            <Image
              src="/images/BF06CF7C-08E1-4AE3-A4B6-B08FF6538926_1_105_c.jpeg"
              alt="Fitia Travel"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm font-light opacity-80">Basée à</p>
              <p className="font-semibold flex items-center gap-1">
                <MapPin size={14} /> Toulouse, France
              </p>
            </div>
          </div>

        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-[#4A7C59] text-sm tracking-widest uppercase font-semibold">
            À propos
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1E2D24] mt-3 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Passionnée par les saveurs
            <span className="text-[#B5976B]"> & les horizons</span>
          </h2>

          <div className="space-y-4 text-[#5C6B5C] leading-relaxed">
            <p>
              Hello&nbsp;! Moi c&apos;est Fitia — créatrice de contenu depuis 2 ans,
              originaire de Madagascar et basée à Toulouse.
            </p>
            <p>
              Je parcours la France et le monde entier pour dénicher les adresses
              qui font vibrer les papilles et les yeux. Food, voyages, lifestyle —
              mon univers se raconte en images et en émotions authentiques.
            </p>
            <p>
              Ma communauté engagée me suit pour des recommandations sincères et
              des découvertes insolites. J&apos;ai collaboré avec plusieurs
              établissements&nbsp;: restaurants, instituts de beauté, boutiques de
              créateurs, hôtels…
            </p>
            <p>
              Chaque collaboration est pensée sur-mesure pour mettre en valeur
              votre identité et toucher une audience qualifiée et curieuse.
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mt-8">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 bg-[#DDD5C0] text-[#1E2D24] px-4 py-2 rounded-full text-sm font-medium"
              >
                <span className="text-[#4A7C59]">{badge.icon}</span>
                {badge.label}
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
