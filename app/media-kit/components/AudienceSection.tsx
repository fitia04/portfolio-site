"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { audience } from "../data";

function AnimatedBar({ percentage, delay, inView, color }: { percentage: number; delay: number; inView: boolean; color: string }) {
  return (
    <div className="w-full bg-[var(--color-accent)] rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${percentage}%` } : {}}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function GenderDonut({ female, male, inView }: { female: number; male: number; inView: boolean }) {
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const femaleArc = (female / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-accent)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference - femaleArc } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
          <span className="text-[var(--color-text)]">Femmes {female}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent)]" />
          <span className="text-[var(--color-text)]">Hommes {male}%</span>
        </div>
      </div>
    </div>
  );
}

export default function AudienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--color-primary)] text-sm tracking-widest uppercase font-semibold">
            Démographie
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Mon audience
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Age ranges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white rounded-3xl p-8"
          >
            <h3
              className="text-xl font-bold text-[var(--color-text)] mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Tranches d&apos;âge
            </h3>
            <div className="space-y-4">
              {audience.ageRanges.map((range, i) => (
                <div key={range.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--color-text)] font-medium">{range.label} ans</span>
                    <span className="text-[var(--color-text-light)]">{range.percentage}%</span>
                  </div>
                  <AnimatedBar
                    percentage={range.percentage}
                    delay={0.3 + i * 0.1}
                    inView={inView}
                    color="var(--color-primary)"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center"
          >
            <h3
              className="text-xl font-bold text-[var(--color-text)] mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Genre
            </h3>
            <GenderDonut female={audience.gender.female} male={audience.gender.male} inView={inView} />
          </motion.div>

          {/* Top countries */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white rounded-3xl p-8"
          >
            <h3
              className="text-xl font-bold text-[var(--color-text)] mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Top pays
            </h3>
            <div className="space-y-4">
              {audience.topCountries.map((country, i) => (
                <div key={country.country}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--color-text)] font-medium">
                      {country.flag} {country.country}
                    </span>
                    <span className="text-[var(--color-text-light)]">{country.percentage}%</span>
                  </div>
                  <AnimatedBar
                    percentage={country.percentage}
                    delay={0.3 + i * 0.1}
                    inView={inView}
                    color="var(--color-secondary)"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
