"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Heart } from "lucide-react";

const discoveries = [
  {
    name: "Izakaya Hanami",
    type: "food",
    category: "Restaurant Japonais",
    location: "Paris, 2e",
    description:
      "Un izakaya authentique caché dans le Sentier. Gyozas maison et saké naturel dans une ambiance tamisée.",
    emoji: "🍜",
    gradient: "linear-gradient(135deg, #1E2D24, #4A7C59)",
  },
  {
    name: "Milos, île méconnue",
    type: "voyage",
    category: "Destination",
    location: "Grèce",
    description:
      "Les plages de Sarakiniko, les poulpes séchant sur les cordes et les restaurants de pécheurs. Une île hors du temps.",
    emoji: "🏛️",
    gradient: "linear-gradient(135deg, #B5976B, #8F7450)",
  },
  {
    name: "La Fromagerie du Marché",
    type: "food",
    category: "Épicerie Fine",
    location: "Bordeaux",
    description:
      "Un plateau de fromages d'exception et des vins natures choisis à la perfection. Le paradis pour les amoureux du terroir.",
    emoji: "🧀",
    gradient: "linear-gradient(135deg, #6BA882, #3A6147)",
  },
  {
    name: "Tbilissi, Géorgie",
    type: "voyage",
    category: "City Break",
    location: "Géorgie",
    description:
      "Khinkali, vins en amphore, bains sulfureux et architecture baroque-soviétique. La surprise de l'année.",
    emoji: "🍷",
    gradient: "linear-gradient(135deg, #8F7450, #1E2D24)",
  },
  {
    name: "Brûlerie Nomade",
    type: "food",
    category: "Coffee Shop",
    location: "Marseille",
    description:
      "Torréfaction locale, filtre de compétition et pâtisseries levant naturel. Le meilleur café du Vieux-Port.",
    emoji: "☕",
    gradient: "linear-gradient(135deg, #4A7C59, #B5976B)",
  },
  {
    name: "Oaxaca, Mexique",
    type: "voyage",
    category: "Destination Food",
    location: "Mexique",
    description:
      "Berceau de la cuisine mexicaine. Mole negro, mezcal artisanal et marchés explosifs de couleurs et de saveurs.",
    emoji: "🌮",
    gradient: "linear-gradient(135deg, #3A6147, #DDD5C0)",
  },
];

const filters = ["Tout", "Food", "Voyage"];

export default function Discoveries() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("Tout");

  const filtered =
    active === "Tout"
      ? discoveries
      : discoveries.filter(
          (d) => d.type === active.toLowerCase()
        );

  return (
    <section
      id="decouvertes"
      ref={ref}
      className="py-24 md:py-32 px-6 bg-[#F7F4EF]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-[#4A7C59] text-sm tracking-widest uppercase font-semibold">
            Adresses & Destinations
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1E2D24] mt-3 mb-5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Mon guide toulousain
          </h2>
          <p className="text-[#5C6B5C] max-w-xl mx-auto">
            Les adresses et destinations qui m&apos;ont fait vibrer récemment. Non
            sponsorisées, juste sincères.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 mb-10"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === f
                  ? "bg-[#4A7C59] text-white shadow-md"
                  : "bg-[#DDD5C0] text-[#5C6B5C] hover:bg-[#4A7C59]/20"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Gradient header */}
              <div
                className="h-36 relative flex items-center justify-center"
                style={{ background: item.gradient }}
              >
                <span className="text-5xl filter drop-shadow-lg">{item.emoji}</span>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium capitalize">
                  {item.type === "food" ? "🍽 Food" : "✈️ Voyage"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs text-[#4A7C59] font-semibold tracking-wide uppercase mb-1">
                  {item.category}
                </p>
                <h3
                  className="text-xl font-bold text-[#1E2D24] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.name}
                </h3>
                <p className="flex items-center gap-1 text-xs text-[#B5976B] mb-3 font-medium">
                  <MapPin size={12} />
                  {item.location}
                </p>
                <p className="text-sm text-[#5C6B5C] leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-[#4A7C59] text-sm font-medium group-hover:gap-3 transition-all">
                  <Heart size={14} className="fill-[#4A7C59]" />
                  Coup de cœur
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
