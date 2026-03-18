"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Instagram, ArrowRight } from "lucide-react";
import Image from "next/image";
import { creatorInfo } from "../data";

interface MediaKitHeroProps {
  onDownloadClick: () => void;
}

export default function MediaKitHero({ onDownloadClick }: MediaKitHeroProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[var(--color-accent)] shadow-xl flex-shrink-0"
        >
          <Image
            src={creatorInfo.photo}
            alt={creatorInfo.name}
            width={256}
            height={256}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>

        {/* Text */}
        <div className="text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold"
          >
            Media Kit
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mt-3 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {creatorInfo.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-[var(--color-text-light)] mb-3"
          >
            {creatorInfo.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-[var(--color-text-light)] max-w-lg mb-8"
          >
            {creatorInfo.bio}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <button
              onClick={onDownloadClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Download size={20} />
              Télécharger le Media Kit
            </button>
            <a
              href={creatorInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
            >
              <Instagram size={20} />
              Voir le profil
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
