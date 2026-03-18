"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, type ReactNode } from "react";
import { Instagram, Users, Heart, Handshake } from "lucide-react";
import { stats } from "../data";

const iconMap: Record<string, ReactNode> = {
  instagram: <Instagram size={24} />,
  users: <Users size={24} />,
  heart: <Heart size={24} />,
  handshake: <Handshake size={24} />,
};

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const isDecimal = value % 1 !== 0;
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => {
    const formatted = isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString("fr-FR");
    return formatted + suffix;
  });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  return <motion.span>{display}</motion.span>;
}

export default function StatsOverview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold">
            Audience & Impact
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Mes chiffres clés
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
              className="bg-[var(--color-bg)] rounded-3xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
                {iconMap[stat.icon]}
              </div>
              <div
                className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{stat.label}</p>
              <p className="text-xs text-[var(--color-text-light)]">{stat.description}</p>
              {stat.trend && (
                <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
