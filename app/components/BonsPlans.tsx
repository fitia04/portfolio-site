"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

type Deal = {
  destination: string;
  country: string;
  title: string;
  description: string;
  category: string;
  href: string;
  image: string;
};

const FALLBACK_DEALS: Deal[] = [
  {
    destination: "Marrakech",
    country: "🇲🇦 Maroc",
    title: "Week-end à Marrakech",
    description: "Riads, souks et cuisine berbère — une destination magique accessible depuis Toulouse.",
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/tls/rak/",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=320&fit=crop",
  },
  {
    destination: "Lisbonne",
    country: "🇵🇹 Portugal",
    title: "Escapade à Lisbonne",
    description: "Vol direct depuis Toulouse, pastéis de nata et fado — une ville qui ne déçoit jamais.",
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/tls/lis/",
    image: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=600&h=320&fit=crop",
  },
  {
    destination: "Séville",
    country: "🇪🇸 Espagne",
    title: "Long week-end à Séville",
    description: "Tapas, flamenco et architecture andalouse — à seulement quelques heures de Toulouse.",
    category: "Train + Logement",
    href: "https://www.skyscanner.fr/transport/vols/tls/svq/",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=320&fit=crop",
  },
  {
    destination: "Barcelone",
    country: "🇪🇸 Espagne",
    title: "3 jours à Barcelone",
    description: "Gaudi, marché de la Boqueria et cuisine catalane — une escapade incontournable.",
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/tls/bcn/",
    image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&h=320&fit=crop",
  },
  {
    destination: "Naples",
    country: "🇮🇹 Italie",
    title: "Escapade napolitaine",
    description: "La vraie pizza napolitaine, le Vésuve et Pompéi — l'Italie authentique et populaire.",
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/tls/nap/",
    image: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=600&h=320&fit=crop",
  },
  {
    destination: "Istanbul",
    country: "🇹🇷 Turquie",
    title: "Istanbul la magnifique",
    description: "Entre Europe et Asie, bazars, hammams et gastronomie — une ville qui fascine.",
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/tls/ist/",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=320&fit=crop",
  },
];

export default function BonsPlans() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [deals, setDeals] = useState<Deal[]>(FALLBACK_DEALS);

  useEffect(() => {
    fetch("/api/bons-plans")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setDeals(data); })
      .catch(() => {}); // garde les données fallback en cas d'erreur
  }, []);

  return (
    <section ref={ref} id="bons-plans" className="py-24 md:py-28 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="text-primary text-sm tracking-widest uppercase font-semibold">
            Sélection du moment
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-text mt-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bons plans voyages
          </h2>
          <p className="text-text-light mt-4 max-w-xl">
            Des destinations accessibles depuis Toulouse, sélectionnées pour leur rapport qualité-prix.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <motion.a
              key={deal.destination + i}
              href={deal.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group bg-surface rounded-3xl overflow-hidden border border-accent hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  {deal.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-text-light mb-1">{deal.country}</p>
                <h3
                  className="text-lg font-bold text-text mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {deal.title}
                </h3>
                <p className="text-sm text-text-light leading-relaxed flex-1">
                  {deal.description}
                </p>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-bg-dark">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
                    Rechercher les vols <ExternalLink size={13} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
