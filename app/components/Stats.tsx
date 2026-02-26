"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Instagram, Users, Heart } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay: number;
  inView: boolean;
}

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("fr-FR") + suffix);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  return <motion.span>{display}</motion.span>;
}

function StatCard({ icon, value, suffix, label, description, delay, inView }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-white text-center hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-5 text-white">
        {icon}
      </div>
      <div className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        <AnimatedNumber value={value} suffix={suffix} inView={inView} />
      </div>
      <p className="text-lg font-semibold mb-2">{label}</p>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}

const stats = [
  {
    icon: <Instagram size={24} />,
    value: 3400,
    suffix: "",
    label: "Abonnés Instagram",
    description: "Communauté engagée, taux d'engagement moyen de 1,6%",
  },
  {
    icon: <Users size={24} />,
    value: 3067,
    suffix: "",
    label: "Followers TikTok",
    description: "47,4K likes cumulés sur l'ensemble des publications",
  },
  {
    icon: <Heart size={24} />,
    value: 30,
    suffix: "+",
    label: "Collaborations",
    description: "Restaurants, hôtels, marques food & lifestyle",
  },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="stats"
      ref={ref}
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E2D24 0%, #2A4035 40%, #3A6147 70%, #B5976B 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A7C59]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B5976B]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[#6BA882] text-sm tracking-widest uppercase font-semibold">
            Audience & Impact
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Des chiffres qui parlent
          </h2>
          <p className="text-white/60 max-w-lg mx-auto">
            Une audience qualifiée, passionnée par la gastronomie et les voyages,
            prête à découvrir votre adresse.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={0.2 + i * 0.15} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}
