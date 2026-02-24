"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const services = [
  { icon: "📸", label: "Modèle photo" },
  { icon: "🎬", label: "Reels / TikTok" },
  { icon: "📣", label: "Stories sponsorisées" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    establishment: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 md:py-32 px-6 bg-[#F7F4EF]"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#4A7C59] text-sm tracking-widest uppercase font-semibold">
            Collaborer
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1E2D24] mt-3 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Votre établissement mérite
            <span className="text-[#4A7C59]"> d&apos;être raconté</span>
          </h2>
          <p className="text-[#5C6B5C] leading-relaxed mb-8">
            Je travaille avec des restaurants, hôtels, épiceries fines, marques
            lifestyle et destinations touristiques. Chaque projet est conçu
            sur-mesure pour coller à votre ADN et parler à votre futur client.
          </p>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold text-[#1E2D24] mb-4 uppercase tracking-wide">
              Ce que je propose
            </p>
            <div className="flex flex-col gap-3">
              {services.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 bg-white border border-[#DDD5C0] rounded-2xl px-4 py-3 text-sm text-[#1E2D24] font-medium"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={64} className="text-[#4A7C59] mb-6" />
              </motion.div>
              <h3
                className="text-2xl font-bold text-[#1E2D24] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Message envoyé !
              </h3>
              <p className="text-[#5C6B5C]">
                Merci pour votre message. Je vous réponds sous 48h.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 shadow-xl border border-[#DDD5C0] space-y-5"
            >
              <h3
                className="text-2xl font-bold text-[#1E2D24] mb-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Prendre contact
              </h3>
              <p className="text-[#5C6B5C] text-sm mb-6">
                Décrivez votre projet et je vous reviens rapidement.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1E2D24] uppercase tracking-wide mb-1.5 block">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full border border-[#DDD5C0] rounded-xl px-4 py-3 text-sm text-[#1E2D24] focus:outline-none focus:border-[#4A7C59] transition-colors bg-[#F7F4EF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1E2D24] uppercase tracking-wide mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full border border-[#DDD5C0] rounded-xl px-4 py-3 text-sm text-[#1E2D24] focus:outline-none focus:border-[#4A7C59] transition-colors bg-[#F7F4EF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E2D24] uppercase tracking-wide mb-1.5 block">
                  Téléphone <span className="text-[#5C6B5C] normal-case font-normal">(optionnel)</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="FR"
                  value={form.phone}
                  onChange={(value) => setForm({ ...form, phone: value ?? "" })}
                  className="phone-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E2D24] uppercase tracking-wide mb-1.5 block">
                  Établissement / Marque
                </label>
                <input
                  type="text"
                  required
                  value={form.establishment}
                  onChange={(e) =>
                    setForm({ ...form, establishment: e.target.value })
                  }
                  placeholder="Nom de votre établissement"
                  className="w-full border border-[#DDD5C0] rounded-xl px-4 py-3 text-sm text-[#1E2D24] focus:outline-none focus:border-[#4A7C59] transition-colors bg-[#F7F4EF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E2D24] uppercase tracking-wide mb-1.5 block">
                  Votre projet
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Décrivez votre établissement, vos objectifs, le type de collaboration envisagé..."
                  className="w-full border border-[#DDD5C0] rounded-xl px-4 py-3 text-sm text-[#1E2D24] focus:outline-none focus:border-[#4A7C59] transition-colors bg-[#F7F4EF] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A7C59] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3A6147] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {loading ? "Envoi en cours..." : "Envoyer ma demande"}
              </button>

              <p className="text-xs text-[#5C6B5C] text-center">
                Réponse garantie sous 48h · Devis gratuit
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
