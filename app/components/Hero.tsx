"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Instagram } from "lucide-react";

const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex overflow-hidden bg-[#F7F4EF]">

      {/* Decorative blob */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] bg-[#B5976B]" />

      {/* Mobile: photo en fond avec overlay */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/images/AE09339E-CD09-421C-BEEF-CBDFFE387B1B_1_105_c.jpeg"
          alt="Fitia Travel"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-[#F7F4EF]/80" />
      </div>

      {/* Left: text */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-8 md:pl-36 md:pr-4 py-32 w-full lg:w-1/2">

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 mb-12 mx-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5976B]" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#5C6B5C] font-light">
            Food & Voyages Creator
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="mb-10">
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block text-3xl md:text-5xl lg:text-6xl font-light text-[#1E2D24]/40 tracking-tight leading-snug"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Découvrons le monde
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block text-6xl md:text-9xl lg:text-[10rem] font-bold text-[#B5976B] leading-none tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              ensemble.
            </motion.span>
          </div>
        </h1>

        {/* Divider + subtitle + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-sm flex flex-col items-center"
        >
          <div className="w-10 h-px bg-[#B5976B] mb-6" />
          <p className="text-sm text-[#5C6B5C] leading-relaxed mb-8 font-light">
            Créatrice de contenu passionnée, je mets en lumière les adresses
            d&apos;exception et les expériences culinaires qui méritent d&apos;être racontées.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a
              href="#collaborations"
              className="bg-[#4A7C59] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#3A6147] transition-all duration-300 hover:-translate-y-0.5"
            >
              Mes collaborations
            </a>
            <a
              href="#contact"
              className="border border-[#1E2D24]/20 text-[#1E2D24]/70 px-6 py-3 rounded-full text-sm font-semibold hover:border-[#1E2D24]/40 hover:text-[#1E2D24] transition-all duration-300"
            >
              Me contacter
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-5 md:gap-10 mt-14 justify-center w-full"
        >
          {[
            { icon: <Instagram size={14} />, label: "Instagram", value: "3 400" },
            { icon: <TikTokIcon />, label: "TikTok", value: "3 067" },
            { label: "📍", value: "France & Monde" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-lg md:text-2xl font-bold text-[#1E2D24]">{item.value}</span>
              <div className="flex items-center gap-1.5 text-[#5C6B5C]/60">
                {item.icon}
                <span className="text-xs tracking-wide">{item.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Desktop: photo à droite */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex items-center justify-center w-2/5 pt-20 pb-10 pl-28 pr-4"
      >
        <div className="relative w-[420px] h-[580px] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/images/AE09339E-CD09-421C-BEEF-CBDFFE387B1B_1_105_c.jpeg"
            alt="Fitia Travel"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ duration: 2, delay: 1.4, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#1E2D24]/30 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase">Découvrir</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
