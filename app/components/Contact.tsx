"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import emailjs from "@emailjs/browser";

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

  const isValid = form.name.trim() !== "" && form.email.trim() !== "" && form.establishment.trim() !== "" && form.message.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send(
        "service_ohu5dcp",
        "template_69ol5f4",
        {
          name: form.name,
          email: form.email,
          phone: form.phone || "Non renseigné",
          establishment: form.establishment,
          message: form.message,
        },
        "bk11PX1nTbAdA8gXB"
      );
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 md:py-32 px-6 bg-bg"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary text-sm tracking-widest uppercase font-semibold">
            Collaborer
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-text mt-3 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Votre établissement mérite
            <span className="text-primary"> d&apos;être raconté</span>
          </h2>
          <p className="text-text-light leading-relaxed mb-4 text-justify">
            Je crée du <strong>contenu authentique</strong> pour des <strong>restaurants, hôtels, épiceries fines</strong>, marques lifestyle, boutiques de créateurs et <strong>destinations touristiques</strong>. Voyager, découvrir, capturer : c&apos;est ce qui me fait vibrer au quotidien, et je mets cette passion au service de votre marque.
          </p>
          <p className="text-text-light leading-relaxed mb-4 text-justify">
            Chaque projet est pour moi une occasion d&apos;explorer des <strong>adresses d&apos;exception</strong> et de laisser toute ma créativité parler de ce qui vous rend unique. Ma mission : refléter votre <strong>identité de marque</strong>, séduire de nouveaux clients et booster votre <strong>visibilité sur les réseaux sociaux</strong>.
          </p>
          <p className="text-text-light leading-relaxed mb-8 text-justify">
            Vous avez un projet ? Parlons-en.
          </p>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold text-text mb-4 uppercase tracking-wide">
              Ce que je propose
            </p>
            <div className="flex flex-col gap-3">
              {services.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 text-sm text-text font-medium"
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
                <CheckCircle size={64} className="text-primary mb-6" />
              </motion.div>
              <h3
                className="text-2xl font-bold text-text mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Message envoyé !
              </h3>
              <p className="text-text-light">
                Merci pour votre message. Je vous réponds sous 48h.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-surface rounded-3xl p-8 shadow-xl border border-accent space-y-5"
            >
              <h3
                className="text-2xl font-bold text-text mb-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Prendre contact
              </h3>
              <p className="text-text-light text-sm mb-6">
                Décrivez votre projet et je vous reviens rapidement.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text uppercase tracking-wide mb-1.5 block">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full border border-accent rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors bg-bg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text uppercase tracking-wide mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full border border-accent rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors bg-bg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text uppercase tracking-wide mb-1.5 block">
                  Téléphone <span className="text-text-light normal-case font-normal">(optionnel)</span>
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
                <label className="text-xs font-semibold text-text uppercase tracking-wide mb-1.5 block">
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
                  className="w-full border border-accent rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors bg-bg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text uppercase tracking-wide mb-1.5 block">
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
                  className="w-full border border-accent rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors bg-bg resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:translate-y-0 disabled:shadow-none"
              >
                <Send size={18} />
                {loading ? "Envoi en cours..." : "Envoyer ma demande"}
              </button>

              <p className="text-xs text-text-light text-center">
                Réponse garantie sous 48h · Devis gratuit
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
